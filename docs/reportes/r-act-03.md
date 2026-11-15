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
- **Filtros** con Query String en `GET /proyectos`: `busqueda` (nombre), `tonalidad`, `escala`, `pagina` y `limite`. El total de resultados se devuelve en la cabecera `X-Total-Count`.
- Filtro por tipo de acorde en `GET /progresiones/{id}/acordes?tipo=`.
- **Validación de respuestas HTTP:** manejo centralizado de errores en JSON para los códigos 400, 401, 403, 404, 405, 409, 415 y 500. Los errores internos se registran en el servidor sin exponer detalles al cliente.
- Configuración de CORS para exponer la cabecera `X-Total-Count` al navegador.
- Actualización de algunos GET y POST existentes.
- **Pruebas de persistencia:** reinicio del backend y consulta de los datos en MySQL.
- Script `pruebas/curl-entregable3.sh` con 39 pasos y 52 verificaciones automáticas (éxito y error).

**Documentación**
- `<Actualización de 04-api.md con los filtros, X-Total-Count y los códigos 405 y 415>`
- Documentación del uso de IA de este periodo en `docs/IAG/Integrante1-César/reporte2/` y registro de consultas de dudas en `r-ia-doc.md`.
- `<Actividades de Nino y Carlos>`

# 2. Evidencias de trabajo
Las contribuciones individuales se respaldan mediante el historial de commits del repositorio de GitHub.

## 2.1. Historial de contribuciones

| Actividad | Integrante responsable | Commit |
|---|---|---|
| Actualización de algunos GET y POST, implementación de PUT y DELETE, filtros y manejo de códigos HTTP | César Rodrigo Díaz Hernández | [`9601f3e`](https://github.com/CarlosLR19/desarrollo-web/commit/9601f3e) |
| Reporte inicial y documentación de uso de IA (`docs/IAG/Integrante1-César/`) | César Rodrigo Díaz Hernández | [`1df78d3`](https://github.com/CarlosLR19/desarrollo-web/commit/1df78d3) |
| `<Actividad de Nino>` | Nino Alessandro Navarro Lam | `<hash>` |
| `<Actividad de Carlos>` | Carlos Vicente López Rosales | `<hash>` |

## 2.2. Evidencias visuales
| Archivo | Descripción |
|---|---|
| E3_01_Curl_Filtros.png | Pasos 1 a 12 del script: filtros, paginación y errores de filtro. |
| E3_02_Curl_PUT.png | Pasos 13 a 28: PUT correctos y casos de error (400, 401, 403, 404, 415). |
| E3_03_Curl_DELETE.png | Pasos 31 a 39: DELETE, permisos y verificación de la cascada. |
| E3_04_Curl_Resultado.png | Resumen final: 52 verificaciones correctas, 0 con fallo. |
| E3_05_Persistencia_MySQL.png | Consulta a la tabla `proyecto` en MySQL con los datos guardados. |
| E3_06_Persistencia_Reinicio.png | Consulta de proyectos después de reiniciar el backend. |

Las capturas se encuentran en `docs/evidencias/Entregable3/`.

# 3. Problemas encontrados
- **Todas las pruebas fallaban con `HTTP 000`.** curl no podía conectarse porque el backend no estaba corriendo en el puerto que usaba el script. En el equipo de César el puerto 8080 lo ocupa eXist-db (otra materia), así que el servidor se ejecuta en 8090. Se resolvió ejecutando el script con `API=http://localhost:8090/api` e iniciando el backend con `SERVER_PORT=8090`, sin modificar `application.properties` para no afectar al resto del equipo.
- **Conflicto de Git en `r-act-02.md`.** Dos integrantes editaron el mismo reporte y `git pull --rebase` produjo un conflicto. Se resolvió conservando la versión más completa y agregando los datos faltantes; después se continuó el rebase con `git rebase --continue`.
- **Finales de línea en Windows.** Git avisó que reemplazaría LF por CRLF en un script de bash, lo que puede provocar errores al ejecutarlo en WSL. Se agregó la regla `*.sh text eol=lf` en `.gitattributes`.
- **Fecha de actualización en la respuesta del PUT.** La respuesta de `PUT /proyectos/{id}` mostraba la fecha de actualización anterior, aunque el dato sí se guardaba (el GET siguiente la devolvía correcta). Se corrige forzando la escritura con `saveAndFlush`.
- **Permisos en consultas anidadas.** Los GET y POST de secciones, progresiones y acordes aún no verifican al propietario del proyecto (RNF05). Los PUT y DELETE sí lo hacen. Se programará la corrección junto con la integración de JWT. `<El commit 9601f3e actualiza algunos GET y POST: si ya verifican al propietario, indicarlo y quitar este punto.>`
- `<Otros problemas del equipo y su solución>`

# 4. Avance funcional
**Operativo en el backend:**
- Registro, inicio de sesión, consulta y modificación de perfil.
- Proyectos, secciones, progresiones y acordes: crear, consultar, modificar y eliminar.
- Eliminación en cascada de los datos dependientes.
- Búsqueda y filtros de proyectos con paginación, y filtro de acordes por tipo.
- Generador de acordes y progresiones.
- Respuestas HTTP correctas y mensajes de error en JSON.
- Persistencia en MySQL, verificada reiniciando el backend.
- 52 verificaciones automáticas con curl sin fallos.

**Pendiente:**
- Observaciones: por confirmar su alcance con el profesor.
- Autenticación con JWT y Spring Security (hoy se usa la cabecera temporal `X-Usuario-Id`).
- Verificación de propietario en los GET y POST anidados.
- Endpoints para compartir proyectos con permisos de lectura y edición.
- Página con plantillas Thymeleaf.
- Integración del frontend con la API real.
- Actualización de `04-api.md`.

# 5. Uso de IA generativa

**César Rodrigo Díaz Hernández**
- **Herramienta utilizada:** ChatGPT (OpenAI), modelo GPT-6, desde la interfaz web, Claude (Anthropic), modelo Claude Sonnet 5.5, desde la interfaz web.
- **Actividad para la que se utilizó:** apoyo en la revisión y comprensión del backend existente, configuración de Spring Boot y conexión con MySQL, solución de problemas de autenticación, configuración del puerto 8090 sin modificar `application.properties` e identificación y prueba de endpoints REST y con Claude armó el script de pruebas CURL.
- **Código o contenido generado:** comandos para ejecutar Spring Boot y administrar la conexión con MySQL, instrucciones para verificar controladores y rutas del backend, así como orientación para probar los endpoints de generación musical y pruebas/curl-entregable3.sh.

**Nino Alessandro Navarro Lam**
- `<Herramienta, actividad y verificación, o indicar que no se utilizó IA>`

**Carlos Vicente López Rosales**
- `<Herramienta, actividad y verificación, o indicar que no se utilizó IA>`

- **Modificaciones realizadas por el equipo:** ajustes en las credenciales del usuario de MySQL, configuración del puerto de ejecución y verificación de la estructura y funcionamiento de los controladores existentes.
- **Forma en que se verificó el resultado:** ejecución del backend desde WSL, conexión exitosa con MySQL, creación de tablas y relaciones mediante Hibernate, comprobación del inicio de Spring Boot en el puerto 8090 y consulta del endpoint `/api/musica/catalogo`, que devolvió correctamente una respuesta JSON. Ejecución de pruebas/curl-entregable3.sh contra el backend con MySQL (39 pasos, 52 verificaciones correctas) y consulta de los datos en MySQL antes y después de reiniciar el servidor


Las sesiones se documentan en `docs/IAG/` con el formato `r-ia-dev-sxx.md` (`docs/IAG/Integrante1-César/reporte2/`).

# 6. Participación individual
**César Rodrigo Díaz Hernández**
- Implementación de PUT y DELETE con control de propietario.
- Incorporación de filtros y paginación.
- Validación de respuestas HTTP y manejo de errores.
- Script de pruebas CURL y pruebas de persistencia.

**Nino Alessandro Navarro Lam**
- `<Tareas realizadas en este periodo>`

**Carlos Vicente López Rosales**
- `<Tareas realizadas en este periodo>`

# 7. Próximas actividades
- Confirmar con el profesor el alcance de "observaciones" e implementarlas.
- Integrar Spring Security con JWT y cerrar la verificación de propietario en los GET y POST anidados.
- Implementar los endpoints para compartir proyectos.
- Agregar la página con plantillas Thymeleaf.
- Integrar el frontend con la API real y probar el sistema completo desde WSL.
- Actualizar `04-api.md` y el README con las instrucciones finales.
- Preparar documentación final, video y releases de los hitos.
