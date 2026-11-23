# Plan de pruebas – ChordLab

Pruebas manuales desde el frontend (`http://localhost:5500`) con el backend en ejecución (`http://localhost:8090/api`) y MySQL. El código HTTP se tomó de la pestaña **Network** de las herramientas del navegador, que aparece en cada captura.

**Columnas de las tablas:**
- **HTTP:** código que devolvió la API. Un guion (—) indica que el navegador no envió la petición.
- **Resultado:** ✅ si lo obtenido coincide con lo esperado.

## 1. Registro e inicio de sesión

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | HTTP | Resultado | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| P-01 | Registro | Registrar usuario válido | Éxito | Nombre, correo disponible y contraseña de 8 o más caracteres | 201 y usuario registrado | El usuario `cesar` queda guardado en MySQL ([creacionUsuarioDB](creacionUsuarioDB.png)) | 201 ¹ | ✅ | [E5-01](E5-01.png) |
| P-02 | Registro | Registrar con un correo existente | Error | Correo ya registrado | Rechazar el registro duplicado | Mensaje "Ya existe una cuenta registrada con ese correo" | 409 | ✅ | [E5-02](E5-02.png) |
| P-03 | Registro | Registrar con campos vacíos | Error | Formulario sin nombre | No enviar el registro | El navegador muestra "Completa este campo" y no se hace la petición | — | ✅ | [E5-03](E5-03.png) |
| P-04 | Login | Iniciar sesión con credenciales válidas | Éxito | Correo y contraseña correctos | 200 y acceso a Mis proyectos | Se abre Mis proyectos con la sesión de `cesar` y se cargan sus datos | 200 | ✅ | [E5-04](E5-04.png) |

¹ La captura E5-01 se tomó con la petición todavía en curso (*pending*). El registro se confirma con el usuario guardado en MySQL y con P-02, donde el mismo correo ya devuelve 409.
| P-05 | Login | Iniciar sesión con contraseña incorrecta | Error | Correo válido y contraseña incorrecta | Rechazar el acceso y mostrar un mensaje | Acceso rechazado con mensaje de error | 401 | ✅ | [E5-05](E5-05.png) |
| P-06 | Login | Iniciar sesión con campos vacíos | Error | Correo vacío | No enviar la petición | El navegador muestra "Completa este campo" y no se hace la petición | — | ✅ | [E5-06](E5-06.png) |

## 2. Gestión de proyectos

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | HTTP | Resultado | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| P-07 | Proyectos | Consultar proyectos | Éxito | Usuario con sesión iniciada | 200 y listado de proyectos | Listado de proyectos del usuario | 200 | ✅ | [E5-07](E5-07.png) |
| P-08 | Proyectos | Crear proyecto válido | Éxito | Datos completos del proyecto | 201 y proyecto registrado | Proyecto creado, visible en la tabla y guardado en MySQL ([creacionProyectoDB](creacionProyectoDB.png)) | 201 | ✅ | [E5-08](E5-08.png) |
| P-09 | Proyectos | Crear proyecto con datos incompletos | Error | Tempo vacío | No enviar el proyecto | El navegador muestra "Completa este campo" y no se hace la petición | — | ✅ | [E5-09](E5-09.png) |
| P-10 | Proyectos | Buscar proyecto por nombre | Éxito | Texto "PRUEBA4" en el buscador | 200 y solo los proyectos que coinciden | Se muestra únicamente PRUEBA4 | 200 | ✅ | [E5-10](E5-10.png) |
| P-11 | Proyectos | Buscar un proyecto que no existe | Error | Texto "ERROR" en el buscador | Lista vacía con aviso | Mensaje "No se encontraron proyectos." | 200 | ✅ | [E5-11](E5-11.png) |
| P-12 | Proyectos | Editar proyecto existente | Éxito | Nuevo nombre, tonalidad y tempo | 200 y cambios guardados | La tabla muestra PRUEBA4-CAMBIOS, C# y 200 BPM; cambio en MySQL ([modificacionProyectoDB](modificacionProyectoDB.png)) | 200 | ✅ | [E5-12](E5-12.png) |
| P-13 | Proyectos | Eliminar proyecto existente | Éxito | Proyecto existente y confirmación | 204 y proyecto eliminado | El proyecto desaparece de la tabla y de MySQL ([eliminacionProyectoDB](eliminacionProyectoDB.png)) | 204 | ✅ | [E5-13](E5-13.png) |

## 3. Generación musical, secciones y progresiones

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | HTTP | Resultado | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| P-14 | Catálogo musical | Consultar el catálogo | Éxito | `GET /musica/catalogo` | 200 y opciones musicales | Catálogo recibido en JSON | 200 | ✅ | [E5-14](E5-14.png) |
| P-15 | Generador de acordes | Generar un acorde | Éxito | Fundamental Db, tipo sus2 e inversión fundamental | Nombre, símbolo y notas del acorde | "Re bemol suspendido segunda", Dbsus2 y Db, Eb, Ab | 200 | ✅ | [E5-15](E5-15.png) |
| P-16 | Generador de progresiones | Generar una progresión | Éxito | C mayor, estilo clásico, 4 acordes | Progresión de 4 acordes | Progresión generada con su reproductor | 200 | ✅ | [E5-16](E5-16.png) |
| P-17 | Generador de progresiones | Generar con otros parámetros | Éxito | Eb mayor, estilo jazz, 6 acordes | Nueva progresión según los parámetros | Progresión de 6 acordes generada | 200 | ✅ | [E5-17](E5-17.png) |
| P-18 | Secciones | Crear una sección en un proyecto | Éxito | Sección "Verso" | 201 y sección en la tabla | Mensaje "Sección creada correctamente"; registro en MySQL ([creacionSeccionDB](creacionSeccionDB.png)) | 201 | ✅ | [E5-18](E5-18.png) |
| P-19 | Guardar progresión | Guardar una progresión generada en un proyecto | Éxito | Proyecto, sección "1. Verso", nombre y 2 pulsos por acorde | 201 para la progresión y para cada acorde | Progresión y 4 acordes creados; registro en MySQL ([creacionProgresionDB](creacionProgresionDB.png)) | 201 | ✅ | [E5-19](E5-19.png) |

## 4. Compartir proyectos mediante enlace

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | HTTP | Resultado | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| P-20 | Compartir | Generar enlace de un proyecto | Éxito | Permiso "Solo lectura" y expiración de 7 días | 201 y enlace activo en la tabla | Enlace generado y listado como Activo; registro en MySQL ([compartirProyectoDB](compartirProyectoDB.png)) | 201 | ✅ | [E5-20](E5-20.png) |
| P-21 | Compartir | Abrir un enlace válido | Éxito | Enlace generado en P-20 | Mostrar el proyecto compartido | Proyecto abierto con permiso "Solo lectura" y fecha de expiración | 200 | ✅ | [E5-21](E5-21.png) |
| P-22 | Compartir | Abrir un enlace inválido | Error | Código inexistente "123456789" | Recurso no encontrado | Mensaje "El enlace no existe" | 404 | ✅ | [E5-22](E5-22.png) |

## 5. Observaciones

- **Validación en dos niveles.** En P-03, P-06 y P-09 el navegador bloquea el formulario por los atributos `required`, `minlength` y `min`/`max`, así que la petición no llega a la API. El backend también valida los datos con Bean Validation y responde **400** si recibe datos inválidos. Esto lo comprueba el script `pruebas/curl-entregable3.sh` en los pasos 15 (tempo inválido), 16 (JSON mal formado) y 28 (perfil con nombre vacío).
- **Recursos inexistentes.** P-11 prueba la búsqueda desde la interfaz, que responde 200 con una lista vacía. La respuesta **404** al consultar o modificar un recurso que no existe la comprueba el script CURL en los pasos 18, 33 y 39.
- Las pruebas se hicieron con el frontend, el backend y MySQL en ejecución. La comunicación entre el frontend y la API se verificó en las peticiones Fetch de la pestaña Network.
- **Pruebas automáticas.** El script `pruebas/curl-entregable3.sh` complementa este plan con 60 verificaciones de casos de éxito y de error: filtros, permisos 401 y 403, 404, cascada y códigos HTTP. Resultado: 60 correctas, 0 con fallo.
