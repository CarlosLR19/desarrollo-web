# Reporte de Avance del Proyecto
**Equipo:** ChordLab

**Fecha:** 20 de noviembre de 2026

**Número de reporte:** R4 — Frontend e integración con la API

**Repositorio GitHub:** https://github.com/CarlosLR19/desarrollo-web

---

# 1. Actividades realizadas
Durante este periodo se desarrolló el frontend de ChordLab y se integró con la API REST del backend. Se cubrieron las actividades del calendario: formularios, tablas, consumo de la API con Fetch, mensajes de error y confirmaciones, e integración. Se realizaron las siguientes actividades:

**Frontend: pantallas base**
- **Inicio de sesión y registro** (RF01, RF02): formularios con pestañas, validación HTML y mensajes de éxito o error. La sesión se guarda en `sessionStorage` y se cierra desde el encabezado.
- **Administración de proyectos** (RF04, RF05, RF06):
  - tabla de proyectos con formulario para crear y editar;
  - eliminación con confirmación;
  - búsqueda por nombre y filtro por escala, usando los Query String de la API.
- **Secciones** (RF15): tabla, formulario de creación y edición, y eliminación con confirmación.
- **Generador de acordes** (RF07, RF08, RF09): selección de nota fundamental, tipo e inversión; muestra las notas y un teclado de piano.
- **Generador de progresiones** (RF10): selección de tonalidad, escala, estilo y cantidad de acordes; muestra una tarjeta por acorde.
- Hoja de estilos del generador y diseño visual de las pantallas.

**Frontend: pantallas restantes**
- **Editor de progresiones** (RF11, RF14, RF15):
  - dentro de cada sección se crean, editan y eliminan progresiones;
  - se agregan, modifican, eliminan y reordenan sus acordes con los botones ◀ ▶;
  - se muestra la duración total en pulsos y compases.
- **Reproductor musical** (RF12), presente en el generador, el editor y los proyectos compartidos:
  - botones Reproducir y Detener;
  - barra de avance;
  - el acorde que suena se ilumina y se muestra en el piano y en la guitarra.
- **Selector de instrumentos** (RF13): piano, guitarra y sintetizador.
- **Configuración de reproducción:** tempo, volumen y repetición en bucle. Se recuerda en el navegador.
- **Visualización en guitarra** (RF09): busca automáticamente una posición tocable del acorde y la dibuja como diagrama SVG.
- **Teclado de piano:** se convirtió en un componente reutilizable. Ahora ilumina correctamente los bemoles (Eb = D#) y la octava real de cada nota.
- **Perfil de usuario** (RF03): consulta de nombre, correo y fecha de registro, y edición del nombre.
- **Compartir proyectos** (RF16):
  - genera enlaces con permiso de lectura o de edición y expiración opcional;
  - permite copiarlos y desactivarlos.
- **Acceso a proyectos compartidos** (RF17):
  - página `compartido.html`, que no requiere iniciar sesión;
  - muestra la estructura del proyecto y permite reproducir sus progresiones;
  - con permiso de edición, también permite modificar los datos generales del proyecto.
- **Guardar progresión generada** (RF14): la progresión del generador se guarda en una sección de cualquier proyecto.

**Sonido**
- **Integración de Tone.js:** cada instrumento es un `PolySynth` con su propio oscilador y envolvente. El audio se activa con `Tone.start()` al dar clic en Reproducir. La guitarra suena rasgueada y el volumen se convierte a decibeles.

**Backend**
- **Endpoints para compartir proyectos:**
  - `POST /proyectos/{id}/compartir`
  - `GET /proyectos/{id}/compartidos`
  - `DELETE /compartidos/{id}`
  - `GET /compartidos/{token}`
  - `PUT /compartidos/{token}`

  Los tokens son aleatorios, de 32 caracteres. Se verifican el propietario, el permiso y la expiración. No hubo cambios en la base de datos, porque la tabla `compartir_proyecto` ya existía.
- **Progresión generada:** ahora devuelve `notasConOctava`, que se necesita para el teclado y para Tone.js.

**Documentación**
- Registros de uso de IA de este periodo en `docs/IAG/Integrante1-César/reporte3/` y `docs/IAG/Integrante2-Nino/reporte3/`.
- Reorganización por reporte de los registros de IA de Carlos (`docs/IAG/Integrante3-Carlos/reporte1/` y `reporte2/`).

# 2. Evidencias de trabajo
Las contribuciones individuales se respaldan mediante el historial de commits del repositorio de GitHub.

## 2.1. Historial de contribuciones

| Actividad | Integrante responsable | Enlace a commit |
|---|---|---|
| Pantallas de login, registro, proyectos, secciones y generador musical | César Rodrigo Díaz Hernández | [`c635743`](https://github.com/CarlosLR19/desarrollo-web/commit/c635743) |
| Generador de acordes y progresiones armónicas | César Rodrigo Díaz Hernández | [`80de460`](https://github.com/CarlosLR19/desarrollo-web/commit/80de460) |
| Hoja de estilos del generador musical | César Rodrigo Díaz Hernández | [`2b43e58`](https://github.com/CarlosLR19/desarrollo-web/commit/2b43e58) |
| Documentación de uso de IA (`docs/IAG/Integrante1-César/reporte3/`) | César Rodrigo Díaz Hernández | [`a4cc06e`](https://github.com/CarlosLR19/desarrollo-web/commit/a4cc06e) |
| Pantallas restantes, endpoints para compartir e integración del frontend con el backend | Carlos Vicente López Rosales | [`1f75dbc`](https://github.com/CarlosLR19/desarrollo-web/commit/1f75dbc) |
| Reorganización y registros de uso de IA (`docs/IAG/Integrante3-Carlos/`) | Carlos Vicente López Rosales | [`26adb65`](https://github.com/CarlosLR19/desarrollo-web/commit/26adb65), [`b43b52f`](https://github.com/CarlosLR19/desarrollo-web/commit/b43b52f) |
| Sonido del reproductor con Tone.js | Nino Alessandro Navarro Lam | [`20182e6`](https://github.com/CarlosLR19/desarrollo-web/commit/20182e6) |

## 2.2. Evidencias visuales
Las pantallas integradas en este entregable se capturaron durante las pruebas del Entregable 5. Cada captura muestra también la petición Fetch a la API en la pestaña Network:

| Archivo | Descripción |
|---|---|
| [E5-10.png](../evidencias/pruebas/E5-10.png) | Tabla de proyectos con búsqueda y botones de acción (Editar, Eliminar, Secciones y Compartir). |
| [E5-18.png](../evidencias/pruebas/E5-18.png) | Secciones de un proyecto con el botón Progresiones, que abre el editor. |
| [E5-15.png](../evidencias/pruebas/E5-15.png) | Generador de acordes con el reproductor. |
| [E5_WSL_08_reproductor_piano_guitarra.png](../evidencias/entregable5/E5_WSL_08_reproductor_piano_guitarra.png) | Progresión generada con su reproductor, teclado de piano y diagrama de guitarra. |
| [E5-19.png](../evidencias/pruebas/E5-19.png) | Guardar la progresión generada en un proyecto: se crean la progresión y sus acordes (201). |
| [E5-20.png](../evidencias/pruebas/E5-20.png) | Generación de un enlace para compartir y tabla de enlaces con su estado. |
| [E5-21.png](../evidencias/pruebas/E5-21.png) | Proyecto abierto desde un enlace compartido, con permiso de solo lectura. |

# 3. Problemas encontrados
- **Scripts cargados dos veces.** `proyectos.html` repetía los `<script>` después de `</html>`. El navegador ejecutaba cada archivo dos veces y aparecían errores como `Identifier 'API_URL' has already been declared`. Se eliminó el bloque duplicado.
- **Teclado de piano incorrecto.**
  - **Problema:** comparaba las notas por nombre, así que nunca iluminaba los bemoles (por ejemplo, el Eb de F7) e iluminaba cada nota en dos octavas.
  - **Solución:** cada nota se convierte a su número MIDI (C4 = 60), así Eb5 y D#5 coinciden. Se usan las `notasConOctava` de la API.
- **Navegación entre pantallas.**
  - **Problema:** cada vista ocultaba y mostraba elementos sueltos, lo que dejaba partes visibles al agregar pantallas nuevas.
  - **Solución:** cada pantalla se agrupó en un `<section class="vista">` y se usa una sola función, `mostrarVistaChordLab`.
- **Compartir sin backend.** La tabla `compartir_proyecto` existía, pero no había endpoints. Se implementaron el controlador, el servicio y los DTO.
- **Progresión generada sin octavas.** El generador de progresiones no devolvía `notasConOctava`, así que no se podían dibujar ni reproducir sus acordes. Se agregó el campo a `AcordeProgresion`.
- **Audio bloqueado por el navegador.** Los navegadores no permiten reproducir sonido hasta que el usuario interactúa. Se llama `Tone.start()` dentro del clic de Reproducir.
- **Errores al aplicar el código de Tone.js.** En el commit `20182e6`:
  - faltó `async` en `reproducir()`;
  - se borró la función `crearCampo`;
  - quedó duplicada la apertura de `detener()`;
  - faltó cargar Tone.js en `compartido.html`.

  El error de sintaxis impedía cargar todos los reproductores. Se detectó al revisar el commit y se corrige en el commit siguiente.
- **Acceso denegado a MySQL.** Al iniciar el backend en un equipo nuevo aparecía `Access denied for user 'chordlab'@'localhost'`, porque la contraseña de `DB_PASSWORD` no coincidía con la del usuario de MySQL. Se resuelve asignando la contraseña con `ALTER USER` y exportando la misma en `DB_PASSWORD`.

# 4. Avance funcional
**Operativo:**
- Registro, inicio y cierre de sesión, y perfil de usuario.
- Proyectos: crear, consultar, editar, eliminar, buscar y filtrar.
- Secciones, progresiones y acordes: crear, consultar, editar, eliminar y reordenar.
- Generador de acordes y progresiones con piano y guitarra, y guardado en un proyecto.
- Reproducción con sonido en tres instrumentos, con tempo, volumen y repetición configurables.
- Compartir proyectos con enlaces de lectura o edición, y acceso a ellos sin iniciar sesión.
- Mensajes de error de la API y confirmaciones antes de eliminar.

**Pendiente:**
- Autenticación con JWT y Spring Security (hoy se usa la cabecera temporal `X-Usuario-Id`).
- Página con plantillas Thymeleaf.
- Observaciones: por confirmar su alcance con el profesor.
- Actualizar `04-api.md` con los endpoints de compartir y con `notasConOctava` en la progresión generada.
- Corregir el README: el puerto es 8090 y ya no existe `js/app.js`. Unificar el puerto en los scripts de pruebas.
- Script de pruebas CURL para los endpoints de compartir.
- Capturas de evidencia del Entregable 4.

# 5. Uso de IA generativa

**César Rodrigo Díaz Hernández**
- **Herramienta utilizada:** ChatGPT (OpenAI), modelo GPT-6, desde la interfaz web.
- **Actividad para la que se utilizó:** desarrollo del generador de acordes y progresiones, diseño de su hoja de estilos, consultas sobre cómo visualizar el frontend junto al backend y organización de las interfaces pendientes.
- **Código o contenido generado:** interfaz del generador en HTML, CSS y JavaScript, y hoja de estilos `generador.css`.
- **Forma en que se verificó el resultado:** generación de acordes y progresiones desde el navegador contra la API.

**Nino Alessandro Navarro Lam**
- **Herramienta utilizada:** Claude Code (Anthropic), modelo Claude Opus 5.5, desde la aplicación de escritorio.
- **Actividad para la que se utilizó:** implementación del sonido del reproductor con Tone.js, explicación de cada cambio, instrucciones para ejecutar el sistema completo y solución del error de acceso a MySQL.
- **Código o contenido generado:** funciones `crearInstrumento`, `obtenerInstrumento`, `sonarAcorde` y `silenciar`; activación del audio con `Tone.start()` en `frontend/js/reproductor.js`; etiqueta de Tone.js en las páginas.
- **Modificaciones realizadas por el equipo:** el código se aplicó a mano siguiendo las instrucciones. Los errores de ese proceso se detectaron en la revisión del commit y se corrigieron.
- **Forma en que se verificó el resultado:** en el navegador, `Tone.context.state` quedó en `running` y se registraron las notas tocadas por cada instrumento (por ejemplo, F7 = `F4 A4 C5 D#5` durante 2.28 s), sin errores en la consola.

**Carlos Vicente López Rosales**
Integrar el frontend con el backend: subir las pantallas restantes (editor de progresiones, reproductor, guitarra, perfil, compartir y compartido.html) y los endpoints para compartir proyectos.
Reorganizar sus registros de IA en carpetas por reporte (reporte1/ y reporte2/).
Agregar sus registros de IA de los entregables anteriores: el esquema SQL con Gemini, la configuración de MySQL en WSL y las pruebas CURL.
Las sesiones se documentan en `docs/IAG/`:
- César: `Integrante1-César/reporte3/`.
- Nino: `Integrante2-Nino/reporte3/` (`r-ia-dev-03.md` y `r-ia-doc-03.md`).
- Carlos: `Integrante3-Carlos/`.

# 6. Participación individual
**César Rodrigo Díaz Hernández**
- Pantallas de inicio de sesión, registro, proyectos y secciones, consumiendo la API con Fetch.
- Generador de acordes y progresiones armónicas con teclado de piano.
- Diseño visual y hoja de estilos del generador.
- Registro de uso de IA del periodo.

**Nino Alessandro Navarro Lam**
- Sonido del reproductor con Tone.js para los tres instrumentos.
- Revisión del avance del Entregable 4 y de la integración.
- Registros de IA del periodo y reporte de actividades R4.

**Carlos Vicente López Rosales**
- Integración del frontend con el backend: pantallas restantes y endpoints para compartir proyectos.
- Reorganización de sus registros de uso de IA por reporte.

# 7. Próximas actividades
- Integrar Spring Security con JWT, obteniendo el usuario del token en lugar de la cabecera `X-Usuario-Id`.
- Agregar la página con plantillas Thymeleaf.
- Confirmar con el profesor el alcance de "observaciones" e implementarlas.
- Actualizar `04-api.md` y el README, unificar el puerto 8090 y agregar las pruebas CURL de compartir.
- Tomar las capturas de evidencia del Entregable 4.
- Publicar el release V4 y preparar la documentación final y el video.
