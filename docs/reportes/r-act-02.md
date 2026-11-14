# Reporte de Avance del Proyecto
**Equipo:** ChordLab

**Fecha:** 13 de noviembre de 2026

**Número de reporte:** R2 — Backend inicial y pruebas CURL

**Repositorio GitHub:** https://github.com/CarlosLR19/desarrollo-web

---

# 1. Actividades realizadas
Durante este periodo se comenzó la implementación de ChordLab, una plataforma web para crear acordes y progresiones armónicas, reproducirlas y guardarlas en proyectos. Se realizaron las siguientes actividades:

- Desarrollo del frontend base en HTML, CSS y JavaScript: página de inicio, inicio de sesión y registro, panel de proyectos y generador de acordes y progresiones.
- Desarrollo del editor de proyecto, con secciones, progresiones y acordes, y su reproducción con selector de sonido y tempo.
- Implementación del cliente de la API con Fetch (`frontend/js/app.js`), con un modo `MOCK` que simula el backend para poder avanzar de forma independiente.
- Implementación de la teoría musical en el cliente: notas de cada acorde, inversiones, visualización en piano y reproductor con Web Audio.
- Reescritura del README con el formato acordado y las instrucciones para ejecutar el proyecto desde WSL.
- Creación de la estructura de documentación de IA generativa (`docs/IAG/`) y de la declaración de uso de IA.
- Análisis del calendario y distribución de las tareas del backend básico entre los tres integrantes.
- `<Nino: creación del proyecto Spring Boot y conexión a MySQL>`
- `<Carlos: esquema de la base de datos, entidades y repositorios>`

# 2. Evidencias de trabajo
Las contribuciones individuales se respaldan mediante el historial de commits del repositorio de GitHub.

## 2.1. Historial de contribuciones
| Actividad | Integrante responsable | Commit |
|---|---|---|
| Frontend base (inicio, login, proyectos, generador) | César Rodrigo Díaz Hernández | `<hash>` |
| Editor de proyecto | César Rodrigo Díaz Hernández | `<hash>` |
| README y estructura de documentación de IA | César Rodrigo Díaz Hernández | `<hash>` |
| Proyecto Spring Boot y conexión a MySQL | Nino Alessandro Navarro Lam | `<hash>` |
| Esquema de base de datos, entidades y repositorios | Carlos Vicente López Rosales | `<hash>` |
| `<POST y GET de usuarios>` | `<integrante>` | `<hash>` |
| `<POST y GET de proyectos, secciones, progresiones y acordes>` | `<integrante>` | `<hash>` |
| `<Pruebas con curl>` | `<integrante>` | `<hash>` |

## 2.2. Evidencias visuales
| Archivo | Descripción |
|---|---|
| E2_01_Frontend_Login.png | Pantalla de inicio de sesión y registro. |
| E2_02_Frontend_Proyectos.png | Panel de proyectos. |
| E2_03_Frontend_Generador.png | Generador de acordes y progresiones con piano. |
| E2_04_Frontend_Editor.png | Editor de proyecto con secciones y progresiones. |
| E2_05_Backend_Arranque.png | Backend Spring Boot ejecutándose en WSL. |
| E2_06_MySQL_Tablas.png | Tablas creadas en MySQL. |
| E2_07_Curl_POST_GET.png | Pruebas de POST y GET con curl. |

*(Capturas por tomar; se guardarán en `docs/reportes/evidencias/`.)*

# 3. Problemas encontrados
- **Dependencia entre módulos.** El frontend no podía esperar a que el backend estuviera listo. Se resolvió con un modo `MOCK` que simula las mismas rutas de la API en el navegador; para integrar solo hay que cambiar `CFG.MOCK` a `false`.
- **Rutas de la API.** Algunas rutas del editor (secciones, progresiones y acordes) se definieron en el frontend y deben contrastarse con `04-api.md` y con el backend. Se acordará la versión definitiva entre los integrantes.
- **Nombres de los tipos de acorde.** Frontend y backend deben usar los mismos valores (`mayor`, `menor`, `disminuido`, `aumentado`, `7`, `maj7`, `m7`, `sus2`, `sus4`). Pendiente de confirmar.
- `<Problemas del backend y su solución>`

# 4. Avance funcional
Operativo (con backend simulado):
- Registro e inicio de sesión con validación de formularios.
- Creación, búsqueda y eliminación de proyectos.
- Generador de acordes con inversiones y visualización en piano.
- Generación de progresiones por tonalidad, escala y estilo.
- Editor con secciones, progresiones y acordes, y reproducción de la progresión.

Pendiente:
- Integración del frontend con el backend real.
- Endpoints REST con persistencia en MySQL.
- Autenticación con JWT.
- Diagrama de guitarra, edición y reordenamiento de acordes, compartir proyectos y perfil de usuario.
- Pruebas unitarias y de integración.

# 5. Uso de IA generativa
- **Herramienta utilizada:** Claude (Anthropic), modelo Claude Sonnet 5.5, desde la interfaz web.
- **Actividad para la que se utilizó:** generación del frontend base y del editor de proyecto, y apoyo para organizar la documentación (README y reporte). La consulta fue realizada por César Rodrigo Díaz Hernández.
- **Código o contenido generado:** carpeta `frontend/` (HTML, CSS y JavaScript) y borradores de documentación en formato Markdown.
- **Modificaciones realizadas por el equipo:** `<describir qué se ajustó, corrigió o cambió>`
- **Forma en que se verificó el resultado:** `<describir: pruebas en el navegador, comparación con 04-api.md, capturas>`

La sesión se documenta en `docs/IAG/integrante_03_cesar/Uso_01/` (formato `r-ia-dev-s01.md`). El editor de proyecto se registrará como `Uso_02`. `<Indicar si Nino o Carlos usaron IA y dónde quedó documentado.>`

# 6. Participación individual
**César Rodrigo Díaz Hernández**
- Desarrollo del frontend: inicio, login, proyectos, generador y editor.
- Cliente de la API con Fetch y modo de simulación.
- README y documentación de uso de IA.
- `<endpoints de música y pruebas curl, si se asignan>`

**Nino Alessandro Navarro Lam**
- `<Tareas del backend: proyecto Spring Boot, conexión a MySQL, usuarios>`

**Carlos Vicente López Rosales**
- `<Tareas del backend: esquema de base de datos, entidades y repositorios>`

# 7. Próximas actividades
- Completar el backend básico: POST y GET de todas las entidades y pruebas con curl.
- Integrar el frontend con la API real y habilitar CORS.
- Implementar PUT y DELETE, filtros y validaciones de respuestas HTTP para el siguiente hito.
- Completar el diagrama de guitarra y la edición de acordes en el frontend.
- Escribir pruebas con apoyo de IA y documentar cada sesión.
- Verificar la ejecución completa desde WSL y actualizar el README.

## Observaciones adicionales
Los campos entre `< >` se completarán cuando estén disponibles los commits y los avances del backend. Las tareas del backend básico se repartieron entre los tres integrantes para que cada uno tenga contribuciones identificables.