#!/usr/bin/env bash
# ============================================================
#  ChordLab - Pruebas CURL del Entregable 2 (API funcional inicial)
#  Uso (con el backend corriendo):   bash pruebas/curl-entregable2.sh
#  Requiere: curl. Opcional: jq para ver el JSON formateado.
# ============================================================

API="${API:-http://localhost:8080/api}"
CORREO="prueba$(date +%s)@chordlab.com"   # correo distinto en cada ejecución

if command -v jq >/dev/null 2>&1; then FORMATO="jq ."; else FORMATO="cat"; fi

paso() { echo; echo "=================== $1"; }

# Ejecuta curl, muestra el código HTTP y el cuerpo de la respuesta
pedir() {
  local respuesta
  respuesta=$(curl -s -w '\n%{http_code}' "$@")
  CODIGO=$(echo "$respuesta" | tail -n1)
  CUERPO=$(echo "$respuesta" | sed '$d')
  echo "HTTP $CODIGO"
  echo "$CUERPO" | $FORMATO
}

# Extrae un número de un JSON sin necesitar jq:  extraer idUsuario
extraer() { echo "$CUERPO" | grep -o "\"$1\":[0-9]*" | head -1 | cut -d: -f2; }

# ------------------------------------------------------------ usuarios
paso "1. Registrar usuario (esperado 201)"
pedir -X POST "$API/usuarios/registro" -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Usuario de Prueba\",\"correo\":\"$CORREO\",\"contrasena\":\"ejemplo123\"}"
ID_USUARIO=$(extraer idUsuario)

paso "2. Registrar el mismo correo otra vez (esperado 409)"
pedir -X POST "$API/usuarios/registro" -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Otro\",\"correo\":\"$CORREO\",\"contrasena\":\"ejemplo123\"}"

paso "3. Registro con datos inválidos (esperado 400)"
pedir -X POST "$API/usuarios/registro" -H "Content-Type: application/json" \
  -d '{"nombre":"","correo":"no-es-correo","contrasena":"123"}'

paso "4. Login correcto (esperado 200)"
pedir -X POST "$API/usuarios/login" -H "Content-Type: application/json" \
  -d "{\"correo\":\"$CORREO\",\"contrasena\":\"ejemplo123\"}"

paso "5. Login con contraseña incorrecta (esperado 401)"
pedir -X POST "$API/usuarios/login" -H "Content-Type: application/json" \
  -d "{\"correo\":\"$CORREO\",\"contrasena\":\"incorrecta\"}"

paso "6. Consultar perfil (esperado 200)"
pedir "$API/usuarios/perfil" -H "X-Usuario-Id: $ID_USUARIO"

# ------------------------------------------------------------ proyectos
paso "7. Crear proyecto (esperado 201)"
pedir -X POST "$API/proyectos" -H "Content-Type: application/json" -H "X-Usuario-Id: $ID_USUARIO" \
  -d '{"nombre":"Mi primera canción","descripcion":"Primera composición en ChordLab","tonalidad":"C","escala":"mayor","tempo":90,"compasNum":4,"compasDen":4}'
ID_PROYECTO=$(extraer idProyecto)

paso "8. Crear proyecto con tonalidad inválida (esperado 400)"
pedir -X POST "$API/proyectos" -H "Content-Type: application/json" -H "X-Usuario-Id: $ID_USUARIO" \
  -d '{"nombre":"Error","tonalidad":"H","escala":"mayor","tempo":90,"compasNum":4,"compasDen":4}'

paso "9. Listar proyectos del usuario (esperado 200)"
pedir "$API/proyectos" -H "X-Usuario-Id: $ID_USUARIO"

paso "10. Consultar proyecto por id (esperado 200)"
pedir "$API/proyectos/$ID_PROYECTO" -H "X-Usuario-Id: $ID_USUARIO"

paso "11. Proyecto que no existe (esperado 404)"
pedir "$API/proyectos/999999" -H "X-Usuario-Id: $ID_USUARIO"

paso "12. Listar proyectos sin cabecera X-Usuario-Id (esperado 401)"
pedir "$API/proyectos"

# ------------------------------------------------------------ secciones, progresiones y acordes
paso "13. Crear sección Verso (esperado 201)"
pedir -X POST "$API/proyectos/$ID_PROYECTO/secciones" -H "Content-Type: application/json" \
  -d '{"nombre":"Verso","orden":1}'
ID_SECCION=$(extraer idSeccion)

paso "14. Listar secciones del proyecto (esperado 200)"
pedir "$API/proyectos/$ID_PROYECTO/secciones"

paso "15. Crear progresión (esperado 201)"
pedir -X POST "$API/secciones/$ID_SECCION/progresiones" -H "Content-Type: application/json" \
  -d '{"nombre":"Progresión principal","orden":1}'
ID_PROGRESION=$(extraer idProgresion)

paso "16. Agregar acordes C - G - Am - F (esperado 201)"
ORDEN=1
for ACORDE in 'C mayor' 'G mayor' 'A menor' 'F mayor'; do
  set -- $ACORDE
  pedir -X POST "$API/progresiones/$ID_PROGRESION/acordes" -H "Content-Type: application/json" \
    -d "{\"fundamental\":\"$1\",\"tipo\":\"$2\",\"inversion\":0,\"duracionPulsos\":4,\"orden\":$ORDEN}"
  ORDEN=$((ORDEN + 1))
done

paso "17. Acorde con tipo inválido (esperado 400)"
pedir -X POST "$API/progresiones/$ID_PROGRESION/acordes" -H "Content-Type: application/json" \
  -d '{"fundamental":"C","tipo":"raro","inversion":0,"duracionPulsos":4,"orden":5}'

paso "18. Consultar la progresión con sus acordes (esperado 200)"
pedir "$API/progresiones/$ID_PROGRESION"

paso "19. Listar acordes de la progresión (esperado 200)"
pedir "$API/progresiones/$ID_PROGRESION/acordes"

# ------------------------------------------------------------ generador musical
paso "20. Generar acorde Cmaj7 (esperado 200)"
pedir -X POST "$API/musica/acordes/generar" -H "Content-Type: application/json" \
  -d '{"fundamental":"C","tipo":"maj7","inversion":0}'

paso "21. Generar progresión pop en C mayor (esperado 200)"
pedir -X POST "$API/musica/progresiones/generar" -H "Content-Type: application/json" \
  -d '{"tonalidad":"C","escala":"mayor","cantidadAcordes":4,"estilo":"pop"}'

paso "22. Generar progresión jazz en Bb mayor (esperado 200)"
pedir -X POST "$API/musica/progresiones/generar" -H "Content-Type: application/json" \
  -d '{"tonalidad":"Bb","escala":"mayor","cantidadAcordes":4,"estilo":"jazz"}'

paso "23. Catálogo de opciones (esperado 200)"
pedir "$API/musica/catalogo"

paso "24. Notas de la escala de F mayor con Query String (esperado 200)"
pedir "$API/musica/escalas?tonalidad=F&escala=mayor"

echo
echo "Pruebas terminadas."
