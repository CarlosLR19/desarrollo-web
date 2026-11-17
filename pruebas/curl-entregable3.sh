#!/usr/bin/env bash
# ============================================================
#  ChordLab - Pruebas CURL del Entregable 3 (API REST completa)
#  Cubre: PUT, DELETE, filtros, códigos HTTP, permisos y cascada.
#  Uso (con el backend corriendo):   bash pruebas/curl-entregable3.sh
#  Requiere: curl. Opcional: jq para ver el JSON formateado.
# ============================================================

API="${API:-http://localhost:8080/api}"
SUFIJO="$(date +%s)"
JSON="Content-Type: application/json"

if command -v jq >/dev/null 2>&1; then FORMATO="jq ."; else FORMATO="cat"; fi
OK=0; FALLO=0

paso() { echo; echo "=================== $1"; }

pedir() {
  local respuesta
  respuesta=$(curl -s -w '\n%{http_code}' "$@")
  CODIGO=$(echo "$respuesta" | tail -n1)
  CUERPO=$(echo "$respuesta" | sed '$d')
  echo "HTTP $CODIGO"
  [ -n "$CUERPO" ] && echo "$CUERPO" | $FORMATO
}

extraer() { echo "$CUERPO" | grep -o "\"$1\":[0-9]*" | head -1 | cut -d: -f2; }
contar()  { echo "$CUERPO" | grep -o "\"$1\"" | wc -l | tr -d ' '; }

esperar() {   # esperar <código HTTP esperado>
  if [ "$CODIGO" = "$1" ]; then OK=$((OK+1)); echo "   OK  (esperado $1)"
  else FALLO=$((FALLO+1)); echo "   FALLO  (esperado $1, llegó $CODIGO)"; fi
}
esperar_cuantos() {   # esperar_cuantos <campo> <cantidad>
  local n; n=$(contar "$1")
  if [ "$n" = "$2" ]; then OK=$((OK+1)); echo "   OK  ($n resultado(s), esperado $2)"
  else FALLO=$((FALLO+1)); echo "   FALLO  ($n resultado(s), esperado $2)"; fi
}

# ------------------------------------------------------------ preparación
paso "0. Preparación: dos usuarios (A y B) y datos de prueba"
pedir -X POST "$API/usuarios/registro" -H "$JSON" \
  -d "{\"nombre\":\"Usuario A\",\"correo\":\"a$SUFIJO@chordlab.com\",\"contrasena\":\"ejemplo123\"}"
A=$(extraer idUsuario)
pedir -X POST "$API/usuarios/registro" -H "$JSON" \
  -d "{\"nombre\":\"Usuario B\",\"correo\":\"b$SUFIJO@chordlab.com\",\"contrasena\":\"ejemplo123\"}"
B=$(extraer idUsuario)
echo "Usuario A = $A, Usuario B = $B"

pedir -X POST "$API/proyectos" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"nombre":"Mi primera canción","descripcion":"Primera composición","tonalidad":"C","escala":"mayor","tempo":90,"compasNum":4,"compasDen":4}'
P1=$(extraer idProyecto)
pedir -X POST "$API/proyectos" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"nombre":"Balada triste","tonalidad":"A","escala":"menor","tempo":70,"compasNum":3,"compasDen":4}'
P2=$(extraer idProyecto)
pedir -X POST "$API/proyectos/$P1/secciones" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":"Verso","orden":1}'
S1=$(extraer idSeccion)
pedir -X POST "$API/proyectos/$P1/secciones" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":"Coro","orden":2}'
S2=$(extraer idSeccion)
pedir -X POST "$API/secciones/$S1/progresiones" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":"Principal","orden":1}'
PR1=$(extraer idProgresion)
pedir -X POST "$API/secciones/$S2/progresiones" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":"Estribillo","orden":1}'
PR2=$(extraer idProgresion)
pedir -X POST "$API/progresiones/$PR1/acordes" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"fundamental":"C","tipo":"mayor","inversion":0,"duracionPulsos":4,"orden":1}'
AC1=$(extraer idAcorde)
pedir -X POST "$API/progresiones/$PR1/acordes" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"fundamental":"A","tipo":"menor","inversion":0,"duracionPulsos":4,"orden":2}'
AC2=$(extraer idAcorde)
echo "Proyectos $P1 y $P2 | Secciones $S1, $S2 | Progresiones $PR1, $PR2 | Acordes $AC1, $AC2"

# ------------------------------------------------------------ filtros
paso "1. Filtro por nombre: busqueda=balada (esperado 200 y 1 proyecto)"
pedir "$API/proyectos?busqueda=balada" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idProyecto 1

paso "2. Filtro por escala: escala=menor (esperado 200 y 1 proyecto)"
pedir "$API/proyectos?escala=menor" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idProyecto 1

paso "3. Filtro por tonalidad: tonalidad=C (esperado 200 y 1 proyecto)"
pedir "$API/proyectos?tonalidad=C" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idProyecto 1

paso "4. Filtros combinados: busqueda=primera&escala=mayor&tonalidad=C (esperado 1 proyecto)"
pedir "$API/proyectos?busqueda=primera&escala=mayor&tonalidad=C" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idProyecto 1

paso "5. Sin filtros (esperado 200 y 2 proyectos)"
pedir "$API/proyectos" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idProyecto 2

paso "6. Búsqueda sin coincidencias (esperado 200 y lista vacía)"
pedir "$API/proyectos?busqueda=zzzz" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idProyecto 0

paso "7. El usuario B no ve proyectos de A (esperado 200 y lista vacía)"
pedir "$API/proyectos" -H "X-Usuario-Id: $B"; esperar 200; esperar_cuantos idProyecto 0

paso "8. Escala inválida (esperado 400)"
pedir "$API/proyectos?escala=dorica" -H "X-Usuario-Id: $A"; esperar 400

paso "9. Límite inválido: limite=0 (esperado 400)"
pedir "$API/proyectos?limite=0" -H "X-Usuario-Id: $A"; esperar 400

paso "10. Paginación: limite=1 devuelve 1 proyecto y X-Total-Count=2"
pedir "$API/proyectos?pagina=0&limite=1" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idProyecto 1
curl -s -D - -o /dev/null "$API/proyectos?pagina=0&limite=1" -H "X-Usuario-Id: $A" | grep -i "x-total-count"

paso "11. Filtro de acordes por tipo: ?tipo=menor (esperado 200 y 1 acorde)"
pedir "$API/progresiones/$PR1/acordes?tipo=menor" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idAcorde 1

paso "12. Filtro de acordes con tipo inválido (esperado 400)"
pedir "$API/progresiones/$PR1/acordes?tipo=xyz" -H "X-Usuario-Id: $A"; esperar 400

# ------------------------------------------------------------ permisos en GET y POST anidados (RNF05)

paso "12a. Usuario B lista las secciones del proyecto de A (esperado 403)"
pedir "$API/proyectos/$P1/secciones" -H "X-Usuario-Id: $B"; esperar 403

paso "12b. Listar secciones sin cabecera (esperado 401)"
pedir "$API/proyectos/$P1/secciones"; esperar 401

paso "12c. Usuario B agrega una sección al proyecto de A (esperado 403)"
pedir -X POST "$API/proyectos/$P1/secciones" -H "$JSON" -H "X-Usuario-Id: $B" -d '{"nombre":"Intruso","orden":9}'; esperar 403

paso "12d. Usuario B lista las progresiones de una sección de A (esperado 403)"
pedir "$API/secciones/$S1/progresiones" -H "X-Usuario-Id: $B"; esperar 403

paso "12e. Usuario B consulta una progresión de A (esperado 403)"
pedir "$API/progresiones/$PR1" -H "X-Usuario-Id: $B"; esperar 403

paso "12f. Usuario B agrega un acorde a la progresión de A (esperado 403)"
pedir -X POST "$API/progresiones/$PR1/acordes" -H "$JSON" -H "X-Usuario-Id: $B" \
  -d '{"fundamental":"C","tipo":"mayor","inversion":0,"duracionPulsos":4,"orden":9}'; esperar 403

paso "12g. Usuario A sigue viendo sus secciones (esperado 200 y 2 secciones)"
pedir "$API/proyectos/$P1/secciones" -H "X-Usuario-Id: $A"; esperar 200; esperar_cuantos idSeccion 2

# ------------------------------------------------------------ PUT
paso "13. PUT proyecto (esperado 200)"
pedir -X PUT "$API/proyectos/$P1" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"nombre":"Canción editada","descripcion":"Cambiada con PUT","tonalidad":"G","escala":"mayor","tempo":120,"compasNum":4,"compasDen":4}'
esperar 200

paso "14. GET del proyecto confirma los cambios guardados (esperado 200 y 'Canción editada')"
pedir "$API/proyectos/$P1" -H "X-Usuario-Id: $A"; esperar 200
echo "$CUERPO" | grep -q "Canción editada" && { OK=$((OK+1)); echo "   OK  (el cambio persiste)"; } || { FALLO=$((FALLO+1)); echo "   FALLO  (no se guardó el cambio)"; }

paso "15. PUT proyecto con datos inválidos: tempo 5 (esperado 400)"
pedir -X PUT "$API/proyectos/$P1" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"nombre":"X","tonalidad":"C","escala":"mayor","tempo":5,"compasNum":4,"compasDen":4}'; esperar 400

paso "16. PUT proyecto con JSON mal formado (esperado 400)"
pedir -X PUT "$API/proyectos/$P1" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":'; esperar 400

paso "17. PUT proyecto de otro usuario (esperado 403)"
pedir -X PUT "$API/proyectos/$P1" -H "$JSON" -H "X-Usuario-Id: $B" \
  -d '{"nombre":"Intruso","tonalidad":"C","escala":"mayor","tempo":90,"compasNum":4,"compasDen":4}'; esperar 403

paso "18. PUT proyecto que no existe (esperado 404)"
pedir -X PUT "$API/proyectos/999999" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"nombre":"X","tonalidad":"C","escala":"mayor","tempo":90,"compasNum":4,"compasDen":4}'; esperar 404

paso "19. PUT proyecto sin cabecera X-Usuario-Id (esperado 401)"
pedir -X PUT "$API/proyectos/$P1" -H "$JSON" \
  -d '{"nombre":"X","tonalidad":"C","escala":"mayor","tempo":90,"compasNum":4,"compasDen":4}'; esperar 401

paso "20. PUT con Content-Type que no es JSON (esperado 415)"
pedir -X PUT "$API/proyectos/$P1" -H "Content-Type: text/plain" -H "X-Usuario-Id: $A" -d 'hola'; esperar 415

paso "21. PUT sección (esperado 200)"
pedir -X PUT "$API/secciones/$S1" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":"Verso 1","orden":1}'; esperar 200

paso "22. PUT sección de otro usuario (esperado 403)"
pedir -X PUT "$API/secciones/$S1" -H "$JSON" -H "X-Usuario-Id: $B" -d '{"nombre":"Intruso","orden":1}'; esperar 403

paso "23. PUT progresión (esperado 200)"
pedir -X PUT "$API/progresiones/$PR1" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":"Principal editada","orden":1}'; esperar 200

paso "24. PUT acorde: C mayor -> D menor (esperado 200)"
pedir -X PUT "$API/acordes/$AC1" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"fundamental":"D","tipo":"menor","inversion":1,"duracionPulsos":2,"orden":1}'; esperar 200

paso "25. PUT acorde con tipo inválido (esperado 400)"
pedir -X PUT "$API/acordes/$AC1" -H "$JSON" -H "X-Usuario-Id: $A" \
  -d '{"fundamental":"D","tipo":"inventado","inversion":0,"duracionPulsos":2,"orden":1}'; esperar 400

paso "26. PUT acorde de otro usuario (esperado 403)"
pedir -X PUT "$API/acordes/$AC1" -H "$JSON" -H "X-Usuario-Id: $B" \
  -d '{"fundamental":"D","tipo":"menor","inversion":0,"duracionPulsos":2,"orden":1}'; esperar 403

paso "27. PUT perfil (esperado 200)"
pedir -X PUT "$API/usuarios/perfil" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":"Usuario A Editado"}'; esperar 200

paso "28. PUT perfil con nombre vacío (esperado 400)"
pedir -X PUT "$API/usuarios/perfil" -H "$JSON" -H "X-Usuario-Id: $A" -d '{"nombre":""}'; esperar 400

# ------------------------------------------------------------ otros códigos
paso "29. Método no permitido: PATCH /proyectos/{id} (esperado 405)"
pedir -X PATCH "$API/proyectos/$P1" -H "X-Usuario-Id: $A"; esperar 405

paso "30. Ruta que no existe (esperado 404)"
pedir "$API/noexiste"; esperar 404

# ------------------------------------------------------------ DELETE
paso "31. DELETE acorde de otro usuario (esperado 403)"
pedir -X DELETE "$API/acordes/$AC2" -H "X-Usuario-Id: $B"; esperar 403

paso "32. DELETE acorde (esperado 204)"
pedir -X DELETE "$API/acordes/$AC1" -H "X-Usuario-Id: $A"; esperar 204

paso "33. DELETE del mismo acorde otra vez (esperado 404)"
pedir -X DELETE "$API/acordes/$AC1" -H "X-Usuario-Id: $A"; esperar 404

paso "34. DELETE progresión (esperado 204) y su GET posterior (esperado 404)"
pedir -X DELETE "$API/progresiones/$PR2" -H "X-Usuario-Id: $A"; esperar 204
pedir "$API/progresiones/$PR2" -H "X-Usuario-Id: $A"; esperar 404

paso "35. DELETE sección (esperado 204)"
pedir -X DELETE "$API/secciones/$S2" -H "X-Usuario-Id: $A"; esperar 204

paso "36. DELETE proyecto de otro usuario (esperado 403)"
pedir -X DELETE "$API/proyectos/$P1" -H "X-Usuario-Id: $B"; esperar 403

paso "37. DELETE proyecto sin cabecera (esperado 401)"
pedir -X DELETE "$API/proyectos/$P1"; esperar 401

paso "38. DELETE proyecto con secciones, progresiones y acordes dentro (esperado 204)"
pedir -X DELETE "$API/proyectos/$P1" -H "X-Usuario-Id: $A"; esperar 204

paso "39. Cascada: el proyecto, su progresión y su acorde ya no existen (esperado 404 x3)"
pedir "$API/proyectos/$P1" -H "X-Usuario-Id: $A"; esperar 404
pedir "$API/progresiones/$PR1" -H "X-Usuario-Id: $A"; esperar 404
pedir "$API/progresiones/$PR1/acordes" -H "X-Usuario-Id: $A"; esperar 404

# ------------------------------------------------------------ resumen

echo "  RESULTADO: $OK correctas, $FALLO con fallo"

[ "$FALLO" -eq 0 ]
