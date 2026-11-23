# Plan de pruebas – ChordLab

Las pruebas se realizaron manualmente desde el frontend (`http://localhost:5500`), con el backend en ejecución (`http://localhost:8090/api`) y MySQL disponible.

El código HTTP corresponde a la respuesta obtenida en la pestaña **Network** de las herramientas de desarrollador del navegador. Un guion (—) indica que el navegador no envió ninguna petición.

## 1. Registro e inicio de sesión

| ID | Módulo | Caso | Tipo | Entrada | Esperado | HTTP | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-01 | Registro | Registrar usuario válido | Éxito | Nombre, correo disponible y contraseña de 8 o más caracteres | 201 y usuario registrado | 201¹ | OK | [E5-01](E5-01.png) |
| P-02 | Registro | Registrar con un correo existente | Error | Correo ya registrado | Rechazar el registro duplicado | 409 | OK | [E5-02](E5-02.png) |
| P-03 | Registro | Registrar con campos vacíos | Error | Formulario sin nombre | No enviar el registro | — | OK | [E5-03](E5-03.png) |
| P-04 | Login | Iniciar sesión con credenciales válidas | Éxito | Correo y contraseña correctos | 200 y acceso a Mis proyectos | 200 | OK | [E5-04](E5-04.png) |
| P-05 | Login | Iniciar sesión con contraseña incorrecta | Error | Correo válido y contraseña incorrecta | Rechazar el acceso y mostrar un mensaje | 401 | OK | [E5-05](E5-05.png) |
| P-06 | Login | Iniciar sesión con campos vacíos | Error | Correo vacío | No enviar la petición | — | OK | [E5-06](E5-06.png) |

¹ La captura E5-01 se tomó mientras la petición todavía estaba pendiente. El registro se confirmó mediante la consulta del usuario en MySQL y la prueba P-02, donde el mismo correo devuelve 409.

## 2. Gestión de proyectos

| ID | Módulo | Caso | Tipo | Entrada | Esperado | HTTP | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-07 | Proyectos | Consultar proyectos | Éxito | Usuario con sesión iniciada | 200 y listado de proyectos | 200 | OK | [E5-07](E5-07.png) |
| P-08 | Proyectos | Crear proyecto válido | Éxito | Datos completos del proyecto | 201 y proyecto registrado | 201 | OK | [E5-08](E5-08.png) |
| P-09 | Proyectos | Crear proyecto con datos incompletos | Error | Tempo vacío | No enviar el proyecto | — | OK | [E5-09](E5-09.png) |
| P-10 | Proyectos | Buscar proyecto por nombre | Éxito | Texto "PRUEBA4" en el buscador | 200 y solo los proyectos coincidentes | 200 | OK | [E5-10](E5-10.png) |
| P-11 | Proyectos | Buscar un proyecto inexistente | Error | Texto "ERROR" en el buscador | Lista vacía con aviso | 200 | OK | [E5-11](E5-11.png) |
| P-12 | Proyectos | Editar proyecto existente | Éxito | Nuevo nombre, tonalidad y tempo | 200 y cambios guardados | 200 | OK | [E5-12](E5-12.png) |
| P-13 | Proyectos | Eliminar proyecto existente | Éxito | Proyecto existente y confirmación | 204 y proyecto eliminado | 204 | OK | [E5-13](E5-13.png) |

## 3. Generación musical, secciones y progresiones

| ID | Módulo | Caso | Tipo | Entrada | Esperado | HTTP | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-14 | Catálogo musical | Consultar el catálogo | Éxito | `GET /musica/catalogo` | 200 y opciones musicales | 200 | OK | [E5-14](E5-14.png) |
| P-15 | Generador de acordes | Generar un acorde | Éxito | Fundamental Db, tipo sus2 e inversión fundamental | Nombre, símbolo y notas del acorde | 200 | OK | [E5-15](E5-15.png) |
| P-16 | Generador de progresiones | Generar una progresión | Éxito | C mayor, estilo clásico, 4 acordes | Progresión de 4 acordes | 200 | OK | [E5-16](E5-16.png) |
| P-17 | Generador de progresiones | Generar con otros parámetros | Éxito | Eb mayor, estilo jazz, 6 acordes | Nueva progresión según los parámetros | 200 | OK | [E5-17](E5-17.png) |
| P-18 | Secciones | Crear una sección en un proyecto | Éxito | Sección "Verso" | 201 y sección registrada | 201 | OK | [E5-18](E5-18.png) |
| P-19 | Guardar progresión | Guardar una progresión generada en un proyecto | Éxito | Proyecto, sección "1. Verso", nombre y 2 pulsos por acorde | 201 para la progresión y para cada acorde | 201 | OK | [E5-19](E5-19.png) |

## 4. Compartir proyectos mediante enlace

| ID | Módulo | Caso | Tipo | Entrada | Esperado | HTTP | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-20 | Compartir | Generar enlace de un proyecto | Éxito | Permiso "Solo lectura" y expiración de 7 días | 201 y enlace activo en la tabla | 201 | OK | [E5-20](E5-20.png) |
| P-21 | Compartir | Abrir un enlace válido | Éxito | Enlace generado previamente | Mostrar el proyecto compartido | 200 | OK | [E5-21](E5-21.png) |
| P-22 | Compartir | Abrir un enlace inválido | Error | Código inexistente "123456789" | Recurso no encontrado | 404 | OK | [E5-22](E5-22.png) |

## 5. Observaciones

- **Validación en dos niveles:** En P-03, P-06 y P-09, el navegador bloquea el envío del formulario mediante atributos como `required`, `minlength`, `min` y `max`. Por este motivo, la petición no llega a la API. El backend también realiza validaciones mediante Bean Validation y responde con código 400 cuando recibe datos inválidos. Esto se comprueba en el script `pruebas/curl-entregable3.sh`, en los pasos 15 (tempo inválido), 16 (JSON mal formado) y 28 (perfil con nombre vacío).

- **Recursos inexistentes:** La prueba P-11 verifica la búsqueda desde la interfaz, que devuelve una lista vacía con código 200. Las respuestas 404 al consultar o modificar recursos inexistentes se comprueban mediante el script CURL, en los pasos 18, 33 y 39.

- **Comunicación entre componentes:** Las pruebas se realizaron con el frontend, backend y MySQL en ejecución. La comunicación entre el frontend y la API se verificó mediante las solicitudes Fetch de la pestaña Network.

- **Pruebas automáticas:** El script `pruebas/curl-entregable3.sh` complementa este plan con 60 verificaciones de casos exitosos y de error, incluyendo filtros, permisos 401 y 403, recursos inexistentes, eliminación en cascada y códigos HTTP. El resultado registrado fue de 60 pruebas correctas y 0 fallidas.