# Plan de pruebas – ChordLab

## 1. Registro e inicio de sesión

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-01 | Registro | Registrar usuario válido | Éxito | Datos completos y correo disponible | 201 y usuario registrado | OK | 201 | E5_01 |
| P-02 | Registro | Registrar usuario con correo existente | Error | Correo previamente registrado | Rechazar registro duplicado | Error | 409 | E5_02 |
| P-03 | Registro | Registrar con campos vacíos | Error | Datos incompletos | Validar campos y rechazar registro | Sin error | Excepción | E5_03 |
| P-04 | Login | Iniciar sesión con credenciales válidas | Éxito | Correo y contraseña correctos | 200 y acceso permitido | Inicio de sesión correcto | 200 | E5_04 |
| P-05 | Login | Iniciar sesión con contraseña incorrecta | Error | Correo válido y contraseña incorrecta | Rechazar acceso y mostrar mensaje | OK | 401 | E5_05 |
| P-06 | Login | Iniciar sesión con campos vacíos | Error | Correo o contraseña vacíos | Validar campos y rechazar acceso | Sin error | Excepción | E5_06 |

## 2. Gestión de proyectos

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-07 | Proyectos | Consultar proyectos | Éxito | Usuario autenticado | 200 y listado de proyectos | HTTP 200, listado recibido | 200 | E5_07 |
| P-08 | Proyectos | Crear proyecto válido | Éxito | Datos completos del proyecto | 201 y proyecto registrado | HTTP 201, proyecto creado y registrado en MySQL | 200, 201 | E5_08 |
| P-09 | Proyectos | Crear proyecto con datos incompletos | Error | Campos obligatorios vacíos | Rechazar creación y mostrar error | Sin error | Excepción | E5_09 |
| P-10 | Proyectos | Consultar proyecto existente | Éxito | ID de proyecto válido | 200 y datos del proyecto | Operación probada; código HTTP no registrado |  200 | E5_10 |
| P-11 | Proyectos | Consultar proyecto inexistente | Error | ID que no existe | Respuesta de recurso no encontrado | Sin error | Excepción | E5_11 |
| P-12 | Proyectos | Editar proyecto existente | Éxito | ID válido y nuevos datos | 200 y cambios guardados | Operación probada; código HTTP no registrado | 200 | E5_12 |
| P-13 | Proyectos | Eliminar proyecto existente | Éxito | ID de proyecto válido | 204 y proyecto eliminado | Operación probada; código HTTP no registrado | 200 | E5_13 |

## 3. Generación musical

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-14 | Catálogo musical | Consultar catálogo | Éxito | Solicitud GET al catálogo | 200 y opciones musicales disponibles | HTTP 200, catálogo recibido en formato JSON | 200 | E5_14 |
| P-15 | Generador de acordes | Generar acordes con parámetros válidos | Éxito | Tonalidad, escala y tipo de acorde válidos | Generar acordes correspondientes |  Generacion exitosa | 200 | E5_15 |
| P-16 | Generador de progresiones | Generar progresión válida | Éxito | Tonalidad y parámetros musicales válidos | Generar progresión de acordes | Generacion exitosa | 200 | E5_16 |
| P-17 | Editor musical | Modificar una progresión | Éxito | Cambios en los acordes de la progresión | Mostrar la progresión modificada | Modificacion exitosa | 200 | E5_17 |
| P-18 | Secciones de un proyecto | Crear una seccion en un proyecto existente | Éxito | Nueva seccion con nombre en el apartado de secciones | Mostrar la seccion  | Creacion exitosa | 200 | E5_18 |
| P-19 | Guadar progresion en un proyecto | Agregar una progresión generada a un proyecto existente | Éxito | Progresion guardada | Mostrar la progresión guardada | Creacion exitosa | 200 | E5_19 |

## 4. Compartir proyectos mediante URL

| ID | Módulo | Caso | Tipo | Entrada | Esperado | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| P-20 | Compartir | Generar URL de proyecto existente | Éxito | ID de proyecto válido | Generar enlace para compartir | Generacion exitosa | 201, 200 | E5_20 |
| P-21 | Compartir | Abrir URL compartida válida | Éxito | Enlace generado previamente | Mostrar el contenido compartido | Proyecto abierto | 200 | E5_21 |
| P-22 | Compartir | Abrir URL inválida | Error | Enlace inexistente o alterado | Mostrar error o recurso no encontrado | Enlace no existe | 404 | E5_22 |

## 5. Observaciones

- Las pruebas se realizaron con el frontend, backend y base de datos disponibles cuando correspondió.
- Se verificó la comunicación entre el frontend y la API mediante solicitudes Fetch/XHR.
- Se comprobó la creación de proyectos y su almacenamiento en MySQL.