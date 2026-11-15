# r-ia-dev – Generación y desarrollo de código mediante IA

**Desarrollo Web Agosto 2026 - Enero 2027 | LISTI**

## Registro 1. ChatGPT

| Concepto | Descripción |
|---|---|
| Herramienta | ChatGPT (OpenAI), interfaz web |
| Modelo/temperatura | GPT-6 / no aplica |
| Prompt original | Consultas sobre configuración, ejecución y depuración del backend Spring Boot con MySQL. Ver conversación correspondiente. |
| Respuesta de IA | Orientación para solucionar errores de autenticación de MySQL, configurar el puerto 8090 mediante variables de entorno, localizar archivos y métodos Java y comprobar endpoints REST. |
| Código anterior | No aplica. No se realizó una modificación directa de archivos fuente mediante IA en esta interacción. |
| Código posterior | No aplica. |
| Diferencias entre versiones | No aplica. |
| Prueba de funcionamiento | Ejecución del backend desde WSL, conexión exitosa con MySQL, creación de tablas mediante Hibernate y comprobación del endpoint `GET /api/musica/catalogo`, que devolvió correctamente JSON. |
| Código de uso | Depuración / Explicación / Pruebas / Configuración. |
| Reflexión del estudiante | La herramienta permitió identificar y solucionar problemas relacionados con la conexión a MySQL y la ejecución de Spring Boot. También ayudó a comprender cómo funcionan los endpoints REST y cómo comprobar que el backend responde correctamente. |

## Registro 2. Claude

| Concepto | Descripción |
|---|---|
| Herramienta | Claude (Anthropic), interfaz web claude.ai |
| Modelo/temperatura | Claude Sonnet 5.5 / no aplica |
| Prompt original | Ver `prompt.md`. |
| Respuesta de IA | Ver `respuesta.md`. |
| Código anterior | Commit `4010c04` (respaldo antes de aplicar los cambios). |
| Código posterior | Commit `<hash>`. |
| Diferencias entre versiones | Ver `cambios.diff` (salida de `git diff --numstat 4010c04 <posterior>`). |
| Prueba de funcionamiento | `pruebas/curl-entregable3.sh`: 39 pasos, 52 verificaciones correctas y 0 con fallo. Persistencia comprobada con consultas `SELECT` en MySQL. Capturas en `docs/evidencias/Entregable3/`. |
| Código de uso | Generación / Pruebas. |
| Reflexión del estudiante | La herramienta permitió generar un script de pruebas CURL para comprobar el funcionamiento de los endpoints del backend. Mediante las verificaciones se comprobó el comportamiento de las solicitudes HTTP y la persistencia de los datos en MySQL. |

