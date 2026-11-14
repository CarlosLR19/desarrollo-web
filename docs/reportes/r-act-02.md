# Reporte de Avance del Proyecto
**Equipo:** ChordLab

**Fecha:** 13 de noviembre de 2026

**Número de reporte:** R2 — Backend inicial y pruebas CURL

**Repositorio GitHub:** https://github.com/CarlosLR19/desarrollo-web

---

# 1. Actividades realizadas
Durante este periodo se comenzó la implementación de ChordLab, una plataforma web para crear acordes y progresiones armónicas, reproducirlas y guardarlas en proyectos. Se realizaron las siguientes actividades:

**Frontend**
- Desarrollo del frontend base en HTML, CSS y JavaScript: página de inicio, inicio de sesión y registro, panel de proyectos y generador de acordes y progresiones.
- Desarrollo del editor de proyecto con secciones, progresiones y acordes, y reproducción con selector de sonido y tempo.
- Implementación del cliente de la API con Fetch (`frontend/js/app.js`), con un modo `MOCK` que simula el backend para poder avanzar de forma independiente.
- Implementación de la teoría musical en el cliente: notas de cada acorde, inversiones, visualización en piano y reproductor con Web Audio.

**Backend y base de datos**
- Creación del proyecto Spring Boot 4.1.2 con Spring Initializr (`backend/`) y configuración de la conexión a MySQL. La contraseña se lee de la variable de entorno `DB_PASSWORD`.
- Instalación de MySQL en WSL y script `database/esquema.sql` con la base `chordlab` y las seis tablas del modelo entidad-relación. Las llaves foráneas usan `ON DELETE CASCADE`.
- Entidades JPA y repositorios (Spring Data JPA) para `Usuario`, `Proyecto`, `Seccion`, `Progresion`, `Acorde` y `CompartirProyecto`.
- Endpoints **POST y GET** de usuarios, proyectos, secciones, progresiones y acordes, con las rutas definidas en `04-api.md` bajo `http://localhost:8080/api`.
- Registro con contraseñas cifradas mediante BCrypt (RNF04) e inicio de sesión.
- Validación de datos con Bean Validation y manejo centralizado de errores en JSON con los códigos 400, 401, 403, 404 y 409 (RNF06, RNF10).
- Configuración de CORS para que el frontend pueda consumir la API desde otro puerto.
- Lógica musical en el backend (`TeoriaMusicalService`): generación de 11 tipos de acorde con inversiones, escalas mayor y menor, y progresiones en los estilos pop, clásico, jazz, blues y aleatorio.
- Endpoints del generador musical: `/musica/acordes/generar`, `/musica/progresiones/generar`, `/musica/catalogo` y `/musica/escalas` (con Query String).
- Pruebas: 10 pruebas unitarias JUnit de la lógica musical y el script `pruebas/curl-entregable2.sh` con 24 casos de éxito y de error.

**Documentación**
- Reescritura del README con el formato acordado y las instrucciones para ejecutar el proyecto desde WSL.
- Creación de la estructura de documentación de IA generativa (`docs/IAG/`) y de la declaración de uso de IA.
- Análisis del calendario y distribución de las tareas del backend básico entre los tres integrantes.

# 2. Evidencias de trabajo
Las contribuciones individuales se respaldan mediante el historial de commits del repositorio de GitHub.

## 2.1. Historial de contribuciones
| Actividad | Integrante responsable | Commit |
|---|---|---|
| Frontend base (inicio, login, proyectos, generador) | César Rodrigo Díaz Hernández | `<hash>` |
| Editor de proyecto | César Rodrigo Díaz Hernández | `<hash>` |
| README y estructura de documentación de IA | César Rodrigo Díaz Hernández | `3c78e67` |
| Proyecto Spring Boot y conexión a MySQL | César Rodrigo Díaz Hernández | `039f573`, `0cd0c55` |
| Script de la base de datos MySQL | Carlos Vicente López Rosales | `c82ff83` |
| Entidades JPA y repositorios | Carlos Vicente López Rosales | `<hash>` |
| Configuración de la API (puerto 8080, ruta `/api`, CORS, BCrypt) y manejo de errores | Nino Alessandro Navarro Lam | `<hash>` |
| POST y GET de usuarios y proyectos | Nino Alessandro Navarro Lam | `<hash>` |
| POST y GET de secciones, progresiones y acordes | Nino Alessandro Navarro Lam | `<hash>` |
| Generador de acordes y progresiones, y pruebas unitarias | Nino Alessandro Navarro Lam | `<hash>` |
| Script de pruebas CURL y evidencias del backend en WSL | Nino Alessandro Navarro Lam | `<hash>` |

## 2.2. Evidencias visuales
| Archivo | Descripción |
|---|---|
| E2_01_Frontend_Login.png | Pantalla de inicio de sesión y registro. |
| E2_02_Frontend_Proyectos.png | Panel de proyectos. |
| E2_03_Frontend_Generador.png | Generador de acordes y progresiones con piano. |
| E2_04_Frontend_Editor.png | Editor de proyecto con secciones y progresiones. |
| E2_05_Backend_Arranque.png | Backend Spring Boot ejecutándose en WSL (`mvn spring-boot:run`, puerto 8080, ruta `/api`). |
| E2_06_MySQL_Tablas.png | Tablas creadas en MySQL y usuarios guardados con contraseña cifrada. |
| E2_07_Curl_POST_GET.png | Pruebas de POST y GET con curl (`pruebas/curl-entregable2.sh`). |
| E2_08_Mvn_Test.png | Pruebas unitarias de la lógica musical (`Tests run: 10, Failures: 0`). |

Las capturas se encuentran en `docs/evidencias/`.

# 3. Problemas encontrados
- **Dependencia entre módulos.** El frontend no podía esperar a que el backend estuviera listo. Se resolvió con un modo `MOCK` que simula en el navegador las mismas rutas de la API. Para integrar solo hay que cambiar `CFG.MOCK` a `false`.
- **Rutas de la API.** Algunas rutas del editor (secciones, progresiones y acordes) se definieron en el frontend. El backend implementa las rutas de `04-api.md`, que serán la referencia para la integración.
- **Nombres de los tipos de acorde.** Se confirmó que el backend usa los mismos valores que el frontend (`mayor`, `menor`, `disminuido`, `aumentado`, `7`, `maj7`, `m7`, `sus2`, `sus4`) y además `m7b5` y `dim7`. El endpoint `GET /api/musica/catalogo` devuelve la lista oficial.
- **Versión de Java.** Spring Initializr generó el proyecto para Java 21, pero el entorno WSL tiene JDK 17. Se configuró `java.version` en 17, que Spring Boot 4 soporta.
- **Puerto y ruta base.** El proyecto se creó con el puerto 8090. Se cambió a 8080 y se agregó `server.servlet.context-path=/api` para cumplir con `04-api.md` y con lo que espera el frontend.
- **Comentarios en `esquema.sql`.** En MySQL un comentario `--` debe ir seguido de un espacio. Las líneas como `---- Creacion de la BD ---` provocan un error de sintaxis. Mientras se corrige, el script se ejecuta con `sed 's/^-\{3,\}/-- /' database/esquema.sql | sudo mysql`.
- **Usuario de MySQL.** `application.properties` usa el usuario `chordlab`, pero el script no lo crea. Se creó manualmente con `CREATE USER` y `GRANT ALL PRIVILEGES ON chordlab.*`, y su contraseña se pasa por la variable de entorno `DB_PASSWORD`.
- **Escritura de las notas.** Calcular los acordes solo con semitonos producía notas mal escritas (F7 daba `D#` en lugar de `Eb`). Se resolvió representando cada intervalo con semitonos y pasos de letra.
- **Dominante en tonalidades menores.** En la escala menor natural el quinto grado es menor y no resuelve bien a la tónica. En los estilos clásico y jazz se usa el V mayor de la escala menor armónica (por ejemplo, Am – Dm – E – Am).
- **Prueba generada por Spring Initializr.** `ChordlabApplicationTests` arranca toda la aplicación y falla si MySQL no está encendido. La lógica musical se prueba de forma independiente con `mvn test -Dtest=TeoriaMusicalServiceTest`.

# 4. Avance funcional
**Operativo en el backend (Spring Boot + MySQL en WSL):**
- Registro, inicio de sesión y consulta de perfil.
- Creación y consulta de proyectos con su configuración musical: tonalidad, escala, tempo y compás (RF04, RF06).
- Creación y consulta de secciones, progresiones y acordes. Cada acorde incluye sus notas (RF08, RF14, RF15).
- Generador de acordes (RF07) y de progresiones armónicas (RF10).
- Persistencia en MySQL mediante JPA/Hibernate.
- Validaciones y respuestas de error en JSON.

**Operativo en el frontend (con backend simulado):**
- Registro e inicio de sesión con validación de formularios.
- Creación, búsqueda y eliminación de proyectos.
- Generador de acordes con inversiones y visualización en piano.
- Generación de progresiones por tonalidad, escala y estilo.
- Editor con secciones, progresiones y acordes, y reproducción de la progresión.

**Pendiente:**
- PUT y DELETE de proyectos, secciones, progresiones y acordes (RF05, RF11).
- Búsqueda y paginación con Query String en `GET /proyectos`.
- Autenticación con JWT y Spring Security. Mientras tanto, el usuario se identifica con la cabecera temporal `X-Usuario-Id`.
- Endpoints para compartir proyectos (RF16, RF17).
- Integración del frontend con el backend real.
- Diagrama de guitarra, edición y reordenamiento de acordes, y perfil de usuario en el frontend.

# 5. Uso de IA generativa
**César Rodrigo Díaz Hernández**
- **Herramienta utilizada:** Claude (Anthropic), modelo Claude Sonnet 5.5, desde la interfaz web. ChatGPT (OpenAI), modelo GPT-6, para consultas de dudas.
- **Actividad para la que se utilizó:** con Claude, generación del frontend base y del editor de proyecto, y apoyo para organizar la documentación (README y reporte). Con ChatGPT, instalación de MySQL en WSL e incorporación del proyecto de Spring Initializr.
- **Código o contenido generado:** carpeta `frontend/` (HTML, CSS y JavaScript) y borradores de documentación en Markdown.
- **Modificaciones realizadas por el equipo:** `<describir qué se ajustó, corrigió o cambió>`
- **Forma en que se verificó el resultado:** `<describir: pruebas en el navegador, comparación con 04-api.md, capturas>`

**Nino Alessandro Navarro Lam**
- **Herramienta utilizada:** Claude Code (Anthropic), modelo Claude Opus 5.5.
- **Actividad para la que se utilizó:** consulta de las capas del backend (entidades, repositorios, DTOs, servicios, controladores y manejo de errores), de la lógica musical, de las pruebas unitarias y del script de pruebas CURL. También se usó para revisar el proyecto y el script SQL ya subidos, detectar los problemas descritos en la sección 3 y explicar el funcionamiento del código.
- **Código o contenido generado:** paquetes `config`, `controller`, `dto`, `entity`, `exception`, `repository` y `service` de `backend/src/main/java/mx/uv/chordlab/`, la prueba `TeoriaMusicalServiceTest` y `pruebas/curl-entregable2.sh`.
- **Modificaciones realizadas por el equipo:** el código se adaptó al proyecto Spring Boot 4 creado por César. Se ajustaron la versión de Java, el puerto y la ruta base en `pom.xml` y `application.properties`.
- **Forma en que se verificó el resultado:** compilación en WSL, `mvn test -Dtest=TeoriaMusicalServiceTest` (10 pruebas sin fallos), ejecución de `pruebas/curl-entregable2.sh` comparando el código HTTP esperado con el obtenido en los 24 casos, y consulta de los registros guardados en MySQL.

Las sesiones se documentan en `docs/IAG/` (César en `Integrante1-César/` y Nino en `Integrante2-Nino/Uso_01/`, con el formato `r-ia-dev-s01.md`).

# 6. Participación individual
**César Rodrigo Díaz Hernández**
- Desarrollo del frontend: inicio, login, proyectos, generador y editor.
- Cliente de la API con Fetch y modo de simulación.
- Creación del proyecto Spring Boot y configuración de la conexión a MySQL.
- README y documentación de uso de IA.

**Nino Alessandro Navarro Lam**
- Configuración de la API: puerto 8080, ruta `/api`, CORS, BCrypt y manejo de errores.
- Endpoints POST y GET de usuarios, proyectos, secciones, progresiones y acordes, con sus DTOs, servicios y validaciones.
- Lógica musical: generación de acordes, escalas y progresiones armónicas.
- Pruebas unitarias, script de pruebas CURL y evidencias del backend funcionando en WSL con MySQL.

**Carlos Vicente López Rosales**
- Diseño del script `database/esquema.sql` con las seis tablas, llaves foráneas y restricciones.
- Entidades JPA y repositorios que relacionan las clases Java con las tablas de MySQL.

# 7. Próximas actividades
- Implementar PUT y DELETE en todos los recursos y la búsqueda con Query String en proyectos.
- Integrar Spring Security con JWT y control de acceso por usuario.
- Implementar los endpoints para compartir proyectos con permisos de lectura y edición.
- Integrar el frontend con la API real (`CFG.MOCK=false`) y contrastar las rutas con `04-api.md`.
- Corregir los comentarios de `esquema.sql` y agregar la creación del usuario `chordlab`.
- Completar el diagrama de guitarra y la edición de acordes en el frontend.
- Ampliar las pruebas unitarias y CURL, y documentar cada sesión con IA.

## Observaciones adicionales
- **Decisión técnica:** `spring.jpa.hibernate.ddl-auto=update` se usa solo en desarrollo. El esquema de referencia es `database/esquema.sql`.
- **Decisión técnica:** el generador musical no guarda información. Solo calcula y devuelve JSON, y el usuario decide qué acordes guardar en su progresión.
- La respuesta de cada acorde incluye `notasConOctava` (por ejemplo, `C4`, `E4`, `G4`) para que el frontend lo reproduzca directamente con Tone.js o Web Audio.
- Los campos `<hash>` se completarán al subir los commits correspondientes.
