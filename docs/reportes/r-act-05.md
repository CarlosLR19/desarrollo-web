# Reporte de Avance del Proyecto

**Proyecto:** ChordLab  
**Fecha:** 22 de noviembre de 2026  
**Reporte:** R5 — Pruebas, documentación y cierre del proyecto  
**Repositorio:** https://github.com/CarlosLR19/desarrollo-web

## 1. Actividades realizadas

Durante esta etapa se realizaron las pruebas finales del sistema, se recopilaron evidencias de funcionamiento y se completó la documentación del proyecto.

Las principales actividades fueron:

- **Pruebas funcionales:** se ejecutaron 22 casos de prueba manuales para verificar el registro, inicio de sesión, gestión de proyectos, generación musical, creación de secciones y progresiones, y las funciones para compartir proyectos.
- **Pruebas de errores:** se verificó el comportamiento del sistema ante datos incompletos, credenciales incorrectas, correos duplicados y enlaces de acceso inexistentes.
- **Pruebas de API:** se ejecutó el script `curl-entregable3.sh`, con 60 comprobaciones de solicitudes correctas y respuestas de error.
- **Evidencias:** se agregaron capturas de las pruebas realizadas y de los registros almacenados en MySQL.
- **Documentación:** se completó el README, se actualizó `04-api.md` y se corrigieron las referencias al puerto 8090 en los scripts de pruebas.
- **Plantilla del backend:** se agregó `templates/pagina.html` junto con su controlador `PlantillaController.java`.

## 2. Evidencias de trabajo

Los siguientes commits registran los cambios realizados durante esta etapa:

| Commit | Integrante | Actividad |
|---|---|---|
| `25c9808` | César Díaz | Creación de `templates/pagina.html` y su controlador. |
| `cf04441` | César Díaz | Incorporación de los casos de prueba y evidencias. |
| `ac14d8a` | CarlosLR19 | Organización de la documentación y registros de uso de IA. |
| `40332c5` | NinoNL24 | Actualización del README, documentación de la API, puerto 8090 en scripts y correcciones en `pruebas.md`. |

Las evidencias de las pruebas se encuentran en `docs/evidencias/pruebas/`.

Se incorporaron las siguientes capturas:

- `E5-01.png` a `E5-22.png`: evidencias de los 22 casos de prueba manuales.
- `creacionUsuarioDB.png`: registro de usuario en MySQL.
- `creacionProyectoDB.png`: creación de proyecto.
- `modificacionProyectoDB.png`: modificación de proyecto.
- `eliminacionProyectoDB.png`: eliminación de proyecto.
- `creacionSeccionDB.png`: creación de sección.
- `creacionProgresionDB.png`: almacenamiento de progresión.
- `compartirProyectoDB.png`: registro de enlace compartido.

## 3. Problemas encontrados y soluciones

Durante las pruebas se identificaron situaciones que permitieron comprobar el manejo de errores y la comunicación entre el frontend, el backend y la base de datos.

- **Datos incompletos en formularios:** se comprobó que los campos obligatorios y las restricciones del navegador impiden enviar formularios incompletos. También se verificó la validación del backend cuando recibe datos incorrectos.
- **Registro con correo duplicado:** el sistema rechaza el registro y devuelve el código HTTP 409, mostrando un mensaje de error.
- **Credenciales incorrectas:** el inicio de sesión rechaza los datos y devuelve el código HTTP 401.
- **Búsquedas sin resultados:** la búsqueda de proyectos devuelve una lista vacía y muestra el mensaje correspondiente.
- **Enlaces compartidos inexistentes:** el sistema responde con el código HTTP 404 cuando se intenta acceder a un enlace inválido.
- **Configuración del puerto:** se actualizaron las referencias de los scripts de pruebas para utilizar el puerto 8090, de acuerdo con la configuración del backend.

Estas situaciones fueron verificadas mediante las pruebas manuales y las solicitudes realizadas a la API.

## 4. Avance funcional final

Al finalizar el proyecto, se verificó el funcionamiento de los siguientes módulos:

| Módulo | Funcionalidades verificadas |
|---|---|
| Usuarios | Registro, inicio de sesión, validación de credenciales y perfil. |
| Proyectos | Consulta, creación, búsqueda, modificación y eliminación. |
| Secciones | Creación y consulta de secciones dentro de los proyectos. |
| Generador musical | Generación de acordes y progresiones con diferentes tonalidades y estilos. |
| Editor musical | Almacenamiento de progresiones y acordes dentro de los proyectos. |
| Reproductor | Reproducción de progresiones mediante Tone.js. |
| Compartir proyectos | Generación de enlaces, permisos de solo lectura y edición, y acceso mediante enlaces compartidos. |
| Base de datos | Persistencia y actualización de los registros correspondientes. |

## 5. Resultados de las pruebas

Se realizaron 22 pruebas manuales documentadas en `docs/evidencias/pruebas/pruebas.md`. Todas obtuvieron el resultado esperado.

También se ejecutó el script `pruebas/curl-entregable3.sh`, que contiene 60 comprobaciones de solicitudes a la API, incluyendo operaciones correctas y escenarios de error.

| Tipo de prueba | Resultado |
|---|---|
| Pruebas manuales | 22 de 22 correctas |
| Pruebas mediante CURL | 60 de 60 correctas |

Las pruebas permitieron comprobar la comunicación entre el frontend y el backend, las respuestas HTTP, la validación de datos y la persistencia de la información en MySQL.

## 6. Uso de IA generativa

Durante el desarrollo y documentación de ChordLab se utilizaron herramientas de IA generativa como apoyo para resolver dudas, revisar implementaciones y organizar información.


- **CarlosLR19:** organizó los registros de uso de IA correspondientes a su participación y los incorporó a la documentación del proyecto.
- **NinoNL24:** participó en la documentación técnica, incluyendo la actualización del README y de la documentación de la API.

El código y los cambios incorporados al proyecto fueron revisados y probados por los integrantes antes de considerarse terminados.

## 7. Participación individual

**César Rodrigo Díaz Hernández**
- Desarrollo de las pantallas de inicio de sesión, registro, proyectos y secciones.
- Implementación del generador de acordes y progresiones armónicas.
- Desarrollo de estilos para el generador musical.
- Incorporación de la plantilla `templates/pagina.html` y su controlador.
- Elaboración y ejecución de casos de prueba manuales.
- Recopilación de evidencias de funcionamiento y persistencia en MySQL.

**Nino Alessandro Navarro Lam**
- Implementación del reproductor musical mediante Tone.js.
- Correcciones en la reproducción de progresiones.
- Actualización del README y de la documentación de la API.
- Actualización de los scripts para utilizar el puerto 8090.
- Revisión y corrección de la documentación de pruebas.

**Carlos Vicente López Rosales**
- Integración de las pantallas restantes del frontend.
- Implementación de las funciones para compartir proyectos y sus endpoints.
- Organización de la documentación del proyecto.
- Incorporación de los registros de uso de IA correspondientes a su participación.

## 8. Conclusión

Con esta etapa se concluyó el desarrollo de ChordLab y se verificó el funcionamiento de sus principales módulos. Las pruebas manuales y las comprobaciones mediante CURL permitieron revisar tanto las operaciones correctas como las respuestas ante situaciones de error.

También se completó la documentación técnica y se organizaron las evidencias del proyecto, incluyendo capturas del frontend y registros de persistencia en MySQL.

El resultado es una aplicación que permite gestionar proyectos musicales, crear acordes y progresiones armónicas, reproducirlas y compartir proyectos mediante enlaces.