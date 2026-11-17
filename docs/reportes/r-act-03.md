# Reporte de Avance del Proyecto
**Equipo:** ChordLab

**Fecha:** 15 de noviembre de 2026

**Número de reporte:** R3 — API completa y persistencia

**Repositorio GitHub:** https://github.com/CarlosLR19/desarrollo-web

---

# 1. Actividades realizadas
Durante este periodo se completó la API REST del backend de ChordLab. Se realizaron las siguientes actividades:

**Backend**
- Implementación de **PUT** en proyectos, secciones, progresiones, acordes y perfil de usuario. En los acordes, los datos nuevos se validan con la lógica musical antes de guardarse.
- Implementación de **DELETE** en proyectos, secciones, progresiones y acordes, con respuesta 204. Los registros hijos se eliminan en cascada.
- Control de propiedad en todos los PUT y DELETE: un usuario solo puede modificar o eliminar sus propios recursos (403 en caso contrario).
- **Verificación de propietario en los GET y POST anidados** (RNF05): listar y crear secciones, listar y crear progresiones, consultar una progresión, y listar y agregar acordes ahora exigen la cabecera `X-Usuario-Id` (401 si falta) y comprueban que el proyecto pertenezca al usuario (403 si no). Con esto, todos los endpoints de proyectos y su contenido verifican al propietario.
- **Filtros** con Query String en `GET /proyectos`: `busqueda` (nombre), `tonalidad`, `escala`, `pagina` y `limite`. El total de resultados se devuelve en la cabecera `X-Total-Count`.
- Filtro por tipo de acorde en `GET /progresiones/{id}/acordes?tipo=`.
- **Validación de respuestas HTTP:** manejo centralizado de errores en JSON para los códigos 400, 401, 403, 404, 405, 409, 415 y 500. Los errores internos se registran en el servidor sin exponer detalles al cliente.
- Configuración de CORS para exponer la cabecera `X-Total-Count` al navegador.
- Actualización de algunos GET y POST existentes.
- **Pruebas de persistencia:** reinicio del backend y consulta de los datos en MySQL.
- Script `pruebas/curl-entregable3.sh` con 46 pasos y 60 verificaciones automáticas (éxito y error), incluidos los pasos 12a a 12g que comprueban los permisos de los GET y POST anidados.

**Documentación**
- Documentación del uso de IA de este periodo en `docs/IAG/Integrante1-César/reporte2/` (`r-ia-dev-2.md` y `r-ia-doc-2.md`).
- Registros de IA de Nino organizados por entregable en `docs/IAG/Integrante2-Nino/reporte1/` y `reporte2/`, con el formato de las plantillas del profesor (`r-ia-dev-zz.md` y `r-ia-doc-yy.md`). El registro de consultas de Carlos también se pasó a ese formato.
- Validación de estructura de base de datos (`database/esquema.sql`), ejecución de pruebas de validación HTTP y verificación de persistencia en MySQL por Carlos Vicente López Rosales.

# 2. Evidencias de trabajo
Las contribuciones individuales se respaldan mediante el historial de commits del repositorio de GitHub.

## 2.1. Historial de contribuciones

| Actividad | Integrante responsable | Enlace a commit |
|---|---|---|
| Actualización de algunos GET y POST, implementación de PUT y DELETE, filtros y manejo de códigos HTTP | César Rodrigo Díaz Hernández | [`9601f3e`](https://github.com/CarlosLR19/desarrollo-web/commit/9601f3e) |
| Reporte inicial y documentación de uso de IA (`docs/IAG/Integrante1-César/`) | César Rodrigo Díaz Hernández | [`1df78d3`](https://github.com/CarlosLR19/desarrollo-web/commit/1df78d3) |
| Validación de esquema SQL, pruebas de persistencia en MySQL y documentación de uso de IA (`docs/IAG/Integrante3-Carlos/`) | Carlos Vicente López Rosales | [`601d383`](https://github.com/CarlosLR19/desarrollo-web/commit/601d383) |
| Registros de IA (`r-ia-dev` y `r-ia-doc`)  y enlaces a commits en `r-act-02` | Nino Alessandro Navarro Lam | [`e475549`](https://github.com/CarlosLR19/desarrollo-web/commit/e475549) |
| Verificación de propietario en los GET y POST anidados (RNF05) y pruebas de permisos en los scripts CURL | Nino Alessandro Navarro Lam | [`c0eb130`](https://github.com/CarlosLR19/desarrollo-web/commit/c0eb130) |

## 2.2. Evidencias visuales
| Archivo | Descripción |
|---|---|
| [curlPostAndDelete.png](../evidencias/entregable3/curlPostAndDelete.png) | Pruebas CURL de POST y DELETE. |
| [E3_Carlos_Persistencia_MySQL.png](../evidencias/entregable3/E3_Carlos_Persistencia_MySQL.png) | Verificación de persistencia de usuarios y proyectos en MySQL desde WSL. |
| [E3_Nino_Permisos.jpeg](../evidencias/entregable3/E3_Nino_Permisos.jpeg) | Pasos 12a a 12g del script (403 y 401 en los GET y POST anidados) y resumen final: 60 verificaciones correctas, 0 con fallo. |

Las capturas se encuentran en `docs/evidencias/entregable3/`.

# 3. Problemas encontrados
- **Todas las pruebas fallaban con `HTTP 000`.** curl no podía conectarse porque el backend no estaba corriendo en el puerto que usaba el script. En el equipo de César el puerto 8080 lo ocupa eXist-db (otra materia), así que el servidor se ejecuta en 8090. Se resolvió ejecutando el script con `API=http://localhost:8090/api` e iniciando el backend con `SERVER_PORT=8090`.
- **Conflicto de Git en `r-act-02.md`.** Dos integrantes editaron el mismo reporte y `git pull --rebase` produjo un conflicto. Se resolvió conservando la versión más completa y agregando los datos faltantes; después se continuó el rebase con `git rebase --continue`.
- **Finales de línea en Windows.** En las copias del repositorio clonadas desde Windows, Git convierte los scripts de bash a CRLF y al ejecutarlos en WSL aparece el error `$'\r': command not found`. Se agregó la regla `*.sh text eol=lf` en `.gitattributes` para que los scripts siempre tengan finales LF.
- **Fecha de actualización en la respuesta del PUT.** La respuesta de `PUT /proyectos/{id}` mostraba la fecha de actualización anterior, aunque el dato sí se guardaba (el GET siguiente la devolvía correcta). Se corrige forzando la escritura con `saveAndFlush`.
- **Permisos en consultas anidadas.** Los GET y POST de secciones, progresiones y acordes no verificaban al propietario del proyecto (RNF05): ni siquiera pedían la cabecera `X-Usuario-Id`, así que cualquier persona podía consultar o agregar datos en el proyecto de otro usuario. Se resolvió reutilizando los métodos `buscarDelUsuario(...)` que ya usaban los PUT y DELETE, y se agregaron al script los pasos 12a a 12g para comprobarlo.
- **Dependencia circular entre servicios.** Para verificar al propietario al listar o agregar acordes, `AcordeService` necesitaba buscar la progresión, pero no podía inyectar `ProgresionService` porque este ya depende de `AcordeService` y Spring no habría podido arrancar. Se resolvió comprobando la propiedad directamente con `ProyectoService`.
- **Scripts de pruebas desactualizados.** Al exigir la cabecera en los GET y POST anidados, las llamadas de `curl-entregable2.sh` y `curl-entregable3.sh` que no la enviaban empezaron a recibir 401. Se agregó `X-Usuario-Id` en esas llamadas.

# 4. Avance funcional
**Operativo en el backend:**
- Registro, inicio de sesión, consulta y modificación de perfil.
- Proyectos, secciones, progresiones y acordes: crear, consultar, modificar y eliminar.
- Verificación de propietario en todos los endpoints de proyectos, secciones, progresiones y acordes.
- Eliminación en cascada de los datos dependientes.
- Búsqueda y filtros de proyectos con paginación, y filtro de acordes por tipo.
- Generador de acordes y progresiones.
- Respuestas HTTP correctas y mensajes de error en JSON.
- Persistencia en MySQL, verificada reiniciando el backend.
- 60 verificaciones automáticas con curl sin fallos.

**Pendiente:**
- Observaciones: por confirmar su alcance con el profesor.
- Autenticación con JWT y Spring Security (hoy se usa la cabecera temporal `X-Usuario-Id`).
- Endpoints para compartir proyectos con permisos de lectura y edición.
- Página con plantillas Thymeleaf.
- Integración del frontend con la API real.
- Actualización de `04-api.md` con los filtros, `X-Total-Count` y los códigos 405 y 415.
- Unificar el puerto 8090 en el README y en los scripts de pruebas (todavía usan 8080 por defecto).

# 5. Uso de IA generativa

**César Rodrigo Díaz Hernández**
- **Herramienta utilizada:** ChatGPT (OpenAI), modelo GPT-6, desde la interfaz web, Claude (Anthropic), modelo Claude Sonnet 5.5, desde la interfaz web.
- **Actividad para la que se utilizó:** apoyo en la revisión y comprensión del backend existente, configuración de Spring Boot y conexión con MySQL, solución de problemas de autenticación, configuración del puerto 8090 sin modificar `application.properties` e identificación y prueba de endpoints REST y con Claude armó el script de pruebas CURL.
- **Código o contenido generado:** comandos para ejecutar Spring Boot y administrar la conexión con MySQL, instrucciones para verificar controladores y rutas del backend, así como orientación para probar los endpoints de generación musical y pruebas/curl-entregable3.sh.

**Nino Alessandro Navarro Lam**
- **Herramienta utilizada:** Claude Code (Anthropic), modelo Claude Opus 5.5, desde la aplicación de escritorio.
- **Actividad para la que se utilizó:** revisión de los commits del Entregable 3 contra el calendario del proyecto, detección de los GET y POST anidados sin verificación de propietario, corrección del problema y actualización de las pruebas CURL. 
- **Código o contenido generado:** cambios en `SeccionService`, `ProgresionService`, `AcordeService` y sus controladores; pasos 12a a 12g de `pruebas/curl-entregable3.sh` y la cabecera `X-Usuario-Id` en las llamadas de ambos scripts; borradores de los registros de IA en el formato del profesor.
- **Modificaciones realizadas por el equipo:** se revisó que la verificación reutilizara los métodos `buscarDelUsuario(...)` que ya usaban los PUT y DELETE, y se organizaron los registros de IA por entregable (`reporte1/` y `reporte2/`), igual que los de César.
- **Forma en que se verificó el resultado:** compilación del backend, pruebas unitarias `TeoriaMusicalServiceTest` (10 pruebas sin fallos) y ejecución de `pruebas/curl-entregable3.sh` en WSL: 60 verificaciones correctas y 0 con fallo, incluidos los 403 y 401 de los pasos 12a a 12g. `curl-entregable2.sh` solo devuelve error en los casos que esperan error.

**Carlos Vicente López Rosales**
- **Herramienta utilizada:** Gemini (Google).
- **Actividad para la que se utilizó:** resolución de problemas de configuración de MySQL en WSL, creación de usuario y base de datos chordlab, configuración de variables de entorno para Spring Boot (DB_PASSWORD, SERVER_PORT), diseño de pruebas CURL para validación de códigos HTTP y comprobación de persistencia en MySQL.
- **Código o contenido generado:** comandos de administración de MySQL en Linux, comandos curl -i para validar respuestas HTTP (200, 201, 401, 409) y consultas SQL de verificación.
- **Modificaciones realizadas por el equipo:** ajustes en las credenciales del usuario de MySQL, configuración del puerto de ejecución y verificación de la estructura y funcionamiento de los controladores existentes. Configuración del entorno local en WSL, ejecución del esquema SQL y pruebas de persistencia contra la instancia local de MySQL.
- **Forma en que se verificó el resultado:** ejecución del backend desde WSL, conexión exitosa con MySQL, creación de tablas y relaciones mediante Hibernate, comprobación del inicio de Spring Boot en el puerto 8090 y consulta del endpoint `/api/musica/catalogo`, que devolvió correctamente una respuesta JSON. Ejecución de pruebas/curl-entregable3.sh contra el backend con MySQL (39 pasos, 52 verificaciones correctas) y consulta de los datos en MySQL antes y después de reiniciar el servidor. Arranque del servidor Spring Boot en el puerto 8090 sin errores, ejecución de peticiones CURL comprobando encabezados HTTP y consulta directa a las tablas de MySQL verificando los registros persistidos.

Las sesiones se documentan en `docs/IAG/`:
- César: `Integrante1-César/reporte2/`.
- Nino: `Integrante2-Nino/reporte2/r-ia-dev-02.md`.
- Carlos: `Integrante3-Carlos/r-ia-doc-01.md`.

# 6. Participación individual
**César Rodrigo Díaz Hernández**
- Implementación de PUT y DELETE con control de propietario.
- Incorporación de filtros y paginación.
- Validación de respuestas HTTP y manejo de errores.
- Script de pruebas CURL y pruebas de persistencia.

**Nino Alessandro Navarro Lam**
- Verificación de propietario en los GET y POST anidados de secciones, progresiones y acordes (RNF05).
- Pruebas de permisos en `curl-entregable3.sh` (pasos 12a a 12g) y actualización de ambos scripts CURL.
- Registros de IA en el formato del profesor, organizados por entregable, y enlaces a commits en el `r-act-02`.
- Revisión del avance del Entregable 3 contra el calendario del proyecto.

**Carlos Vicente López Rosales**
- Revisión y despliegue del esquema relacional (`database/esquema.sql`) en entorno WSL.
- Validación de códigos de respuesta HTTP (200, 201, 401, 409) mediante pruebas CURL.
- Pruebas de persistencia y verificación de integridad referencial en MySQL.
- Documentación individual de uso de IA en `docs/IAG/Integrante3-Carlos/r-ia-doc-01.md`.

# 7. Próximas actividades
- Confirmar con el profesor el alcance de "observaciones" e implementarlas.
- Integrar Spring Security con JWT, obteniendo el usuario del token en lugar de la cabecera `X-Usuario-Id`.
- Implementar los endpoints para compartir proyectos.
- Agregar la página con plantillas Thymeleaf.
- Integrar el frontend con la API real y probar el sistema completo desde WSL.
- Actualizar `04-api.md` y el README con las instrucciones finales, y unificar el puerto 8090.
- Preparar documentación final, video y releases de los hitos.
