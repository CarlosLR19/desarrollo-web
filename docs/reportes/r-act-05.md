# Reporte de Avance del Proyecto
**Equipo:** ChordLab

**Fecha:** 22 de noviembre de 2026

**Número de reporte:** R5 — Pruebas, documentación y cierre del proyecto

**Repositorio GitHub:** https://github.com/CarlosLR19/desarrollo-web

---

# 1. Actividades realizadas
Durante este periodo se probó el sistema completo, se agregó la página generada en el servidor con Thymeleaf y se completó la documentación para que el proyecto pueda reproducirse desde WSL. Se realizaron las siguientes actividades:

**Pruebas**
- **Pruebas funcionales:** 22 casos manuales en `docs/evidencias/pruebas/pruebas.md`, organizados en 4 módulos:
  - registro e inicio de sesión;
  - gestión de proyectos;
  - generación musical, secciones y progresiones;
  - compartir proyectos.

  Cada caso incluye la entrada, el resultado esperado, el código HTTP, el estado y su captura con la pestaña Network del navegador.
- **Pruebas de errores:** se verificó el comportamiento del sistema ante datos incompletos, credenciales incorrectas, correos duplicados, búsquedas sin resultados y enlaces compartidos inexistentes.
- **Persistencia en MySQL:** capturas de las tablas después de crear usuarios, proyectos, secciones y progresiones; de modificar y eliminar proyectos; y de generar enlaces para compartir.
- **Revisión del plan de pruebas contra sus capturas:**
  - los casos con campos vacíos (P-03, P-06 y P-09) se reclasificaron como validación del navegador;
  - el código de eliminación se corrigió a 204;
  - las búsquedas se nombraron como tales;
  - las evidencias se enlazaron a sus archivos.
- **Pruebas de la API:** ejecución de `pruebas/curl-entregable3.sh` (60 verificaciones de éxito y error: filtros, PUT, DELETE, permisos 401 y 403, 404 y cascada) y de `curl-entregable2.sh`.

**Resultados de las pruebas**

| Tipo de prueba | Resultado |
|---|---|
| Pruebas manuales desde el frontend | 22 de 22 correctas |
| Pruebas de la API con CURL | 60 de 60 correctas |
| Ejecución desde un clon limpio en WSL | 8 de 8 pasos correctos |

**Verificación de la ejecución en WSL**

Se clonó el repositorio en una carpeta nueva de WSL (`~/verificacion`) y se ejecutó siguiendo únicamente el README, como lo haría el profesor:

1. **Clonación.** `git clone` del repositorio público, sin credenciales. El último commit fue `40332c5`.
2. **Requisitos.** OpenJDK 21.0.13, Maven 3.9.12 y MySQL 8.4.13.
3. **Base de datos.** Inicio de MySQL y comprobación de las 6 tablas de `chordlab` con el usuario `chordlab`.
4. **Backend.** `export DB_PASSWORD` y `mvn spring-boot:run`: el backend arrancó en el puerto 8090, conectado a MySQL.
5. **API y Thymeleaf.** `/api/musica/catalogo` devolvió el JSON del catálogo y `/api/pagina` mostró la tabla de acordes generada en el servidor.
6. **Frontend.** `python3 -m http.server 5500`. Se registró un usuario nuevo, se creó un proyecto y se generó y reprodujo una progresión con su teclado y su diagrama de guitarra.
7. **Pruebas automáticas.** `bash pruebas/curl-entregable3.sh` dio **60 correctas, 0 con fallo**, sin indicar el puerto.
8. **Persistencia.** Se detuvo y se volvió a iniciar el backend; el proyecto creado seguía en la lista.

**Backend**
- **Página con plantilla Thymeleaf** (`GET /api/pagina`): `PlantillaController` genera en el servidor el catálogo de los 11 tipos de acorde sobre C, y `templates/pagina.html` lo muestra con `th:each`.

**Documentación**
- **README completo:**
  - requisitos e instalación en WSL;
  - creación de la base de datos y del usuario de MySQL;
  - variable `DB_PASSWORD`;
  - ejecución en tres terminales y URLs del sistema;
  - pruebas, problemas frecuentes y tabla de entregables.
- **`docs/04-api.md` actualizado con las respuestas reales de la API:**
  - identificación con la cabecera `X-Usuario-Id`;
  - filtros y `X-Total-Count`;
  - catálogo y escalas;
  - endpoints para compartir proyectos;
  - página Thymeleaf;
  - formato de errores y códigos 405 y 415.
- **Puerto 8090 unificado** en los scripts de pruebas y en `docs/05-arquitectura.md`.
- Registros de uso de IA del Entregable 4 de Carlos (`docs/IAG/Integrante3-Carlos/reporte3/`).

# 2. Evidencias de trabajo
Las contribuciones individuales se respaldan mediante el historial de commits del repositorio de GitHub.

## 2.1. Historial de contribuciones

| Actividad | Integrante responsable | Enlace a commit |
|---|---|---|
| Página con plantilla Thymeleaf (`PlantillaController` y `templates/pagina.html`) | César Rodrigo Díaz Hernández | [`25c9808`](https://github.com/CarlosLR19/desarrollo-web/commit/25c9808) |
| Plan de pruebas con casos de éxito y error, capturas del frontend y de MySQL | César Rodrigo Díaz Hernández | [`cf04441`](https://github.com/CarlosLR19/desarrollo-web/commit/cf04441) |
| Primera versión del reporte R5 y reorganización de las tablas de `pruebas.md` | César Rodrigo Díaz Hernández | [`0ef2139`](https://github.com/CarlosLR19/desarrollo-web/commit/0ef2139) |
| Registros de uso de IA del Entregable 4 (`docs/IAG/Integrante3-Carlos/reporte3/`) | Carlos Vicente López Rosales | [`ac14d8a`](https://github.com/CarlosLR19/desarrollo-web/commit/ac14d8a) |
| README completo, `04-api.md` actualizado, puerto 8090 en scripts y corrección de `pruebas.md` | Nino Alessandro Navarro Lam | [`40332c5`](https://github.com/CarlosLR19/desarrollo-web/commit/40332c5) |

## 2.2. Evidencias visuales
**Pruebas manuales y persistencia** (`docs/evidencias/pruebas/`):

| Archivo | Descripción |
|---|---|
| [pruebas.md](../evidencias/pruebas/pruebas.md) | Plan de pruebas con los 22 casos, su código HTTP y el enlace a cada captura. |
| [E5-01.png](../evidencias/pruebas/E5-01.png) a [E5-22.png](../evidencias/pruebas/E5-22.png) | Capturas de cada caso de prueba con la pestaña Network del navegador. |
| [creacionUsuarioDB.png](../evidencias/pruebas/creacionUsuarioDB.png), [creacionProyectoDB.png](../evidencias/pruebas/creacionProyectoDB.png), [creacionSeccionDB.png](../evidencias/pruebas/creacionSeccionDB.png), [creacionProgresionDB.png](../evidencias/pruebas/creacionProgresionDB.png) | Registros guardados en MySQL después de crearlos desde el frontend. |
| [modificacionProyectoDB.png](../evidencias/pruebas/modificacionProyectoDB.png), [eliminacionProyectoDB.png](../evidencias/pruebas/eliminacionProyectoDB.png) | Tabla `proyecto` después de editar y de eliminar un proyecto. |
| [compartirProyectoDB.png](../evidencias/pruebas/compartirProyectoDB.png) | Enlace para compartir guardado en la tabla `compartir_proyecto`. |

**Verificación de la ejecución en WSL** (`docs/evidencias/entregable5/`):

| Archivo | Descripción |
|---|---|
| [E5_WSL_01_clon.png](../evidencias/entregable5/E5_WSL_01_clon.png) | Clonación del repositorio en una carpeta nueva y último commit. |
| [E5_WSL_02_requisitos.png](../evidencias/entregable5/E5_WSL_02_requisitos.png) | Versiones de Java 21, Maven y MySQL en WSL. |
| [E5_WSL_03_tablas_mysql.png](../evidencias/entregable5/E5_WSL_03_tablas_mysql.png) | Las 6 tablas de la base de datos `chordlab`. |
| [E5_WSL_04_backend.png](../evidencias/entregable5/E5_WSL_04_backend.png) | Backend iniciado en el puerto 8090 y conectado a MySQL. |
| [E5_WSL_05_catalogo_api.png](../evidencias/entregable5/E5_WSL_05_catalogo_api.png) | Respuesta JSON de `/api/musica/catalogo`. |
| [E5_WSL_06_pagina_thymeleaf.png](../evidencias/entregable5/E5_WSL_06_pagina_thymeleaf.png) | Página `/api/pagina` generada con Thymeleaf. |
| [E5_WSL_07_frontend_proyectos.png](../evidencias/entregable5/E5_WSL_07_frontend_proyectos.png) | Frontend con un usuario nuevo y su proyecto. |
| [E5_WSL_08_reproductor_piano_guitarra.png](../evidencias/entregable5/E5_WSL_08_reproductor_piano_guitarra.png) | Progresión generada con su reproductor, teclado y diagrama de guitarra. |
| [E5_WSL_09_pruebas_curl.png](../evidencias/entregable5/E5_WSL_09_pruebas_curl.png) | Resultado del script CURL: 60 correctas, 0 con fallo. |
| [E5_WSL_10_persistencia.png](../evidencias/entregable5/E5_WSL_10_persistencia.png) | El proyecto sigue en la lista después de reiniciar el backend. |

# 3. Problemas encontrados
**Comportamiento del sistema comprobado en las pruebas de error**
- **Datos incompletos en formularios:** los campos obligatorios y las restricciones del navegador impiden enviar formularios incompletos. El backend también valida los datos y responde 400 si recibe datos incorrectos.
- **Registro con correo duplicado:** el sistema rechaza el registro con 409 y muestra un mensaje de error.
- **Credenciales incorrectas:** el inicio de sesión rechaza los datos con 401.
- **Búsquedas sin resultados:** la búsqueda devuelve una lista vacía y muestra el mensaje "No se encontraron proyectos."
- **Enlaces compartidos inexistentes:** el sistema responde 404 y muestra "El enlace no existe".

**Problemas encontrados y cómo se solucionaron**
- **Resultados mal clasificados en el plan de pruebas.**
  - **Problema:** los casos con campos vacíos se registraron como "Excepción", pero las capturas mostraban que el navegador bloquea el envío por los atributos `required` y la petición nunca llega a la API. Además, la eliminación se registró con 200 aunque la captura mostraba 204, y "Consultar proyecto inexistente" se había probado con el buscador.
  - **Solución:** se revisó cada caso contra su captura, se corrigieron los códigos y los nombres de los casos, y se separaron las columnas del código HTTP y del estado.
- **README desactualizado.**
  - **Problema:** seguía con el estado del Entregable 1, indicaba el puerto 8080 y mencionaba `frontend/js/app.js`, que ya no existe. Tampoco explicaba cómo crear el usuario de MySQL ni la variable `DB_PASSWORD`, que es la causa del error `Access denied for user 'chordlab'`.
  - **Solución:** se reescribió con la instalación, la ejecución y una tabla de problemas frecuentes.
- **Documentación de la API distinta de la implementación.**
  - **Problema:** `04-api.md` indicaba que el inicio de sesión devolvía un token JWT y listaba estilos que no existen ("rock" y "triste"). Tampoco incluía los endpoints de compartir, el catálogo ni los filtros.
  - **Solución:** se actualizó a partir de respuestas reales de la API.
- **Puerto 8080 por defecto en los scripts.** Los scripts de pruebas fallaban si no se indicaba `API=http://localhost:8090/api`. Se cambió el valor por defecto a 8090.
- **Contraseña de MySQL en la verificación.** Durante la verificación en WSL, la conexión al usuario `chordlab` falló hasta escribir la contraseña correcta. El README explica cómo reasignarla con `ALTER USER` si se olvida.
- **Búsqueda sensible a acentos.** Al obtener los ejemplos de la API se detectó que buscar "cancion" no encuentra "Mi primera canción". Queda como mejora pendiente: normalizar los acentos en la consulta de búsqueda.

# 4. Avance funcional
**Operativo y verificado:**

| Módulo | Funcionalidades verificadas |
|---|---|
| Usuarios | Registro, inicio de sesión, validación de credenciales y perfil. |
| Proyectos | Consulta, creación, búsqueda, filtros, modificación y eliminación. |
| Secciones | Creación y consulta de secciones dentro de los proyectos. |
| Generador musical | Generación de acordes y progresiones con distintas tonalidades y estilos. |
| Editor musical | Almacenamiento y edición de progresiones y acordes dentro de los proyectos. |
| Visualización | Teclado de piano y diagrama de guitarra de cada acorde. |
| Reproductor | Reproducción con Tone.js con piano, guitarra y sintetizador. |
| Compartir proyectos | Generación de enlaces, permisos de lectura y edición, y acceso mediante enlace. |
| Página Thymeleaf | Catálogo de acordes generado en el servidor en `/api/pagina`. |
| Base de datos | Persistencia en MySQL, verificada reiniciando el backend. |
| Ejecución | README verificado con un clon limpio en WSL. |

**Pendiente:**
- Declaración firmada por los integrantes sobre el uso de IA generativa.
- Documento PDF final y video en YouTube.
- Búsqueda de proyectos sin distinguir acentos.

# 5. Uso de IA generativa

**César Rodrigo Díaz Hernández**
- `<Completar: herramienta, actividad, contenido generado, modificaciones y verificación de la página Thymeleaf, del plan de pruebas y de la primera versión de este reporte. Si no se utilizó IA, indicarlo expresamente.>`

**Nino Alessandro Navarro Lam**
- **Herramienta utilizada:** Claude Code (Anthropic), modelo Claude Opus 5.5, desde la aplicación de escritorio.
- **Actividad para la que se utilizó:** revisión del avance del Entregable 5, redacción del README, actualización de `04-api.md`, cambio del puerto en los scripts, revisión del plan de pruebas contra sus capturas, una guía paso a paso para verificar la ejecución en WSL desde un clon limpio y combinación de las dos versiones de este reporte. La verificación la hizo el estudiante en su propio entorno.
- **Código o contenido generado:**
  - `README.md`;
  - las secciones nuevas y corregidas de `docs/04-api.md`;
  - la corrección de `docs/evidencias/pruebas/pruebas.md`;
  - el puerto por defecto de los scripts de pruebas;
  - este reporte.
- **Modificaciones realizadas por el equipo:** se revisaron los cambios antes de subirlos. El plan de pruebas conserva los casos y las capturas originales de César, y él reorganizó sus tablas. Este reporte integra la versión que preparó César.
- **Forma en que se verificó el resultado:**
  - los ejemplos de `04-api.md` se copiaron de respuestas reales de la API;
  - se revisaron las 22 capturas del plan de pruebas;
  - se comprobó que los enlaces de los documentos llevan a archivos existentes;
  - se ejecutaron los scripts sin indicar el puerto: `curl-entregable3.sh` dio 60 correctas y 0 con fallo.

**Carlos Vicente López Rosales**
- `<Completar: herramienta, actividad, contenido generado, modificaciones y verificación. Si no se utilizó IA, indicarlo expresamente.>`

Las sesiones se documentan en `docs/IAG/`:
- César: `Integrante1-César/`.
- Nino: `Integrante2-Nino/reporte4/`.
- Carlos: `Integrante3-Carlos/`.

# 6. Participación individual
**César Rodrigo Díaz Hernández**
- Página con plantilla Thymeleaf (`templates/pagina.html` y `PlantillaController`).
- Elaboración y ejecución de los 22 casos de prueba manuales.
- Recopilación de evidencias de funcionamiento y de persistencia en MySQL.
- Primera versión del reporte R5.

**Nino Alessandro Navarro Lam**
- README con las instrucciones completas para WSL.
- Actualización de `docs/04-api.md` con las respuestas reales de la API.
- Puerto 8090 por defecto en los scripts de pruebas.
- Revisión y corrección del plan de pruebas contra sus capturas.
- Verificación de la ejecución en WSL a partir de un clon limpio del repositorio, con sus capturas.
- Integración de las dos versiones del reporte R5.

**Carlos Vicente López Rosales**
- Registros de uso de IA del Entregable 4.

# 7. Próximas actividades
- Firmar la declaración sobre el uso de IA generativa.
- Elaborar el PDF final con portada, introducción, problemática, enlaces al video y al repositorio, y arquitectura.
- Grabar y publicar el video en YouTube (15 a 20 minutos, con los tres integrantes).
- Publicar el release V5.

---

## Observaciones adicionales
Con esta etapa concluye el desarrollo de ChordLab. Las pruebas manuales, las comprobaciones con CURL y la ejecución desde un clon limpio permitieron revisar las operaciones correctas, las respuestas ante errores y la reproducción del proyecto en otro entorno WSL. También se completó la documentación técnica y se organizaron las evidencias, incluidas las capturas del frontend y los registros de persistencia en MySQL.

El resultado es una aplicación que permite gestionar proyectos musicales, crear acordes y progresiones armónicas, verlos en piano y guitarra, reproducirlos y compartir proyectos mediante enlaces.
