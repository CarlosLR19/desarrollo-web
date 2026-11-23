# Reporte de Uso Documental en el Proyecto

**Fecha:** 20/11/2026  
**Número de reporte:** 03  

---

# 1. Breve descripción de uso

Las consultas documentales y técnicas de la tercera entrega tuvieron como objetivo orientar el diseño, organización e integración frontend-backend de las funcionalidades de ChordLab: editor de progresiones, reproductor musical, selector de instrumentos, configuración de reproducción, visualización de guitarra, gestión de proyectos/secciones, registro/perfil de usuario y compartición/acceso a proyectos compartidos.

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
| 20/11/2026 | Gemini (Google) | [Prompt 1](#prompt-1) | [Respuesta 1](#respuesta-1) |
| 20/11/2026 | Gemini (Google) | [Prompt 2](#prompt-2) | [Respuesta 2](#respuesta-2) |
| 20/11/2026 | Gemini (Google) | [Prompt 3](#prompt-3) | [Respuesta 3](#respuesta-3) |


## Consulta 1. Editor de progresiones, reproductor, instrumentos, reproducción y guitarra

### Prompt 1

Estoy terminando el espacio de trabajo musical del frontend (`frontend/js/editor.js`, `frontend/css/editor.css`, `frontend/js/guitarra.js`, `frontend/js/generador.js` y `frontend/css/generador.css`). ¿Cómo estructuro el editor de progresiones junto con el reproductor musical, el selector de instrumentos, la configuración de reproducción y la visualización de guitarra para que se mantengan sincronizados?

### Respuesta 1

Gemini propuso organizar el espacio de trabajo separando el estado de la progresión de los componentes visuales y de audio:

1. **Estado central del editor y progresiones:** mantener la secuencia de acordes y parámetros activos en `editor.js` / `generador.js`, sincronizando la interfaz con `editor.css` y `generador.css`.
2. **Reproductor, instrumentos y configuración:** desacoplar el motor de reproducción (tempo/ajustes de reproducción y selección de instrumento) de los eventos de la interfaz para reproducir acordes o progresiones sin bloquear el DOM.
3. **Visualización de guitarra (`guitarra.js`):** actualizar las posiciones/notas mostradas en la guitarra cada vez que cambie el acorde seleccionado o el estado de reproducción.

**Aplicación en el proyecto:** se estructuraron y ajustaron los archivos del editor, reproductor, selector de instrumentos, configuración de reproducción y visualización de guitarra en el frontend.

---

## Consulta 2. Proyectos, secciones y ajustes de teoría musical

### Prompt 2

En la integración entre frontend y backend estoy ajustando la gestión de proyectos y secciones (`frontend/proyectos.html`, `frontend/js/proyectos.js`, `frontend/js/secciones.js`, `frontend/js/navegacion.js`) junto con las clases `AcordeProgresion.java` y `TeoriaMusicalService.java`. ¿Cómo coordino la navegación y el envío de datos de progresiones/secciones con el servicio musical del backend?

### Respuesta 2

Gemini orientó la coordinación entre las vistas y la lógica de dominio en Java:

1. **Navegación y vistas de proyectos/secciones:** centralizar el flujo entre pantallas en `navegacion.js` y actualizar listas y formularios en `proyectos.js` (`proyectos.html`) y `secciones.js` conforme respondan los endpoints.
2. **Coherencia con teoría musical y DTOs:** alinear los campos enviados desde el frontend con `AcordeProgresion.java` y las reglas/cálculos de `TeoriaMusicalService.java` para evitar discrepancias en acordes y progresiones.
3. **Validación de flujo:** comprobar que crear o modificar proyectos, secciones y acordes actualice la vista y persista correctamente en el servidor.

**Aplicación en el proyecto:** se integraron las vistas de proyectos, secciones y navegación con los DTOs y servicios del backend de teoría musical y progresiones.

---

## Consulta 3. Registro, perfil y compartición de proyectos

### Prompt 3

También estoy implementando el registro de usuarios, el perfil de usuario (`frontend/js/perfil.js`) y el flujo para compartir y acceder a proyectos compartidos (`frontend/compartido.html`, `frontend/js/compartir.js`, `frontend/js/compartido.js`, `CompartirController.java`, `CompartirService.java`, `CompartirProyectoRepository.java` y los DTOs `CompartirRequest.java`, `CompartirResponse.java`, `ProyectoCompartidoResponse.java`). ¿Cómo estructuro el flujo de extremo a extremo?

### Respuesta 3

Gemini estructuró el flujo completo entre las vistas del frontend y las capas del backend:

1. **Registro y perfil de usuario:** validar los formularios de registro y perfil (`perfil.js`) y sincronizar los datos del usuario con el backend y la sesión activa.
2. **Compartir proyectos:** capturar la solicitud en `compartir.js`, enviarla a `CompartirController.java`, procesar la lógica y validación en `CompartirService.java` usando `CompartirRequest.java` y `CompartirResponse.java`, y persistir mediante `CompartirProyectoRepository.java`.
3. **Acceso a proyectos compartidos:** consultar y renderizar en `compartido.html` mediante `compartido.js` los proyectos disponibles para el usuario usando `ProyectoCompartidoResponse.java`.

**Aplicación en el proyecto:** se implementó e integró el flujo de registro, perfil de usuario, compartición de proyectos y acceso a proyectos compartidos entre frontend y backend.

---