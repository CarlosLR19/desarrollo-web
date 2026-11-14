# 04. Diseño de API REST – ChordLab

## 1. Introducción

La API REST de ChordLab será el medio de comunicación entre el frontend y el backend de la plataforma. Permitirá intercambiar información mediante solicitudes HTTP y respuestas en formato JSON.

El backend será desarrollado con Java y Spring Boot, mientras que el frontend utilizará HTML, CSS y JavaScript para consumir los servicios mediante Fetch API.

La API permitirá administrar usuarios, proyectos musicales, secciones, progresiones armónicas y acordes. También proporcionará los servicios necesarios para generar estructuras musicales y compartir composiciones.

## 2. Configuración general

La API tendrá las siguientes características:

- **Arquitectura:** REST.
- **Backend:** Java con Spring Boot.
- **Frontend:** HTML, CSS y JavaScript.
- **Comunicación:** HTTP.
- **Formato de intercambio:** JSON.
- **Consumo de servicios:** Fetch API.
- **Base de datos:** MySQL.
- **Persistencia:** Hibernate mediante JPA.
- **Puerto de desarrollo:** 8080.
- **Ruta base:** `/api`.

La dirección local de la API durante el desarrollo será:

`http://localhost:8080/api`

## 3. Métodos HTTP

Para realizar las operaciones sobre los recursos del sistema se utilizarán los siguientes métodos:

**GET:** permite consultar información almacenada, como los proyectos de un usuario o los acordes de una progresión.

**POST:** permite registrar información nueva, como usuarios, proyectos, acordes y progresiones.

**PUT:** permite modificar información existente, como los datos de un proyecto o una sección musical.

**DELETE:** permite eliminar recursos, como proyectos, secciones, progresiones y acordes.

## 4. Endpoints de usuarios

Estos servicios permitirán administrar las cuentas de los usuarios y controlar el acceso a la plataforma.

- `POST /usuarios/registro`: registra un nuevo usuario.
- `POST /usuarios/login`: permite iniciar sesión.
- `GET /usuarios/perfil`: consulta los datos del usuario autenticado.
- `PUT /usuarios/perfil`: modifica la información del perfil.

### Ejemplo de registro

Solicitud:

```json
{
  "nombre": "Chuchin Diaz",
  "correo": "chichin24@email.com",
  "contrasena": "ejemplo123"
}
```

Respuesta esperada:

```json
{
  "mensaje": "Usuario registrado correctamente",
  "idUsuario": 1
}
```

### Ejemplo de inicio de sesión

Solicitud:

```json
{
  "correo": "chichin24@email.com",
  "contrasena": "ejemplo123"
}
```

Respuesta esperada:

```json
{
  "token": "jwt_generado",
  "tipo": "Bearer",
  "mensaje": "Inicio de sesión exitoso"
}
```

## 5. Endpoints de proyectos musicales

Estos servicios permitirán crear y administrar los proyectos musicales de cada usuario.

- `GET /proyectos`: consulta los proyectos del usuario autenticado.
- `POST /proyectos`: crea un nuevo proyecto musical.
- `GET /proyectos/{id}`: consulta un proyecto específico.
- `PUT /proyectos/{id}`: modifica los datos de un proyecto.
- `DELETE /proyectos/{id}`: elimina un proyecto.

### Ejemplo de creación de proyecto

Solicitud:

```json
{
  "nombre": "Mi primera canción",
  "descripcion": "Primera composición en ChordLab",
  "tonalidad": "C",
  "escala": "mayor",
  "tempo": 90,
  "compasNum": 4,
  "compasDen": 4
}
```

Respuesta esperada:

```json
{
  "idProyecto": 1,
  "nombre": "Mi primera canción",
  "tonalidad": "C",
  "escala": "mayor",
  "tempo": 90,
  "mensaje": "Proyecto creado correctamente"
}
```

### Consulta mediante Query String

La API también permitirá utilizar parámetros en la URL para filtrar y organizar los resultados.

Ejemplo:

`GET /proyectos?busqueda=cancion&pagina=0&limite=10`

Los parámetros permitirán buscar proyectos por nombre y controlar la cantidad de resultados mostrados.

## 6. Endpoints de secciones musicales

Permitirán organizar los proyectos en diferentes partes de una canción, como introducción, verso, coro y puente.

- `GET /proyectos/{idProyecto}/secciones`: consulta las secciones de un proyecto.
- `POST /proyectos/{idProyecto}/secciones`: crea una nueva sección.
- `PUT /secciones/{id}`: modifica una sección.
- `DELETE /secciones/{id}`: elimina una sección.

### Ejemplo de creación de sección

Solicitud:

```json
{
  "nombre": "Verso",
  "orden": 1
}
```

Respuesta esperada:

```json
{
  "idSeccion": 1,
  "nombre": "Verso",
  "orden": 1,
  "mensaje": "Sección creada correctamente"
}
```

## 7. Endpoints de progresiones armónicas

Estos servicios permitirán crear y administrar las secuencias de acordes que forman parte de cada sección musical.

- `GET /secciones/{idSeccion}/progresiones`: consulta las progresiones de una sección.
- `POST /secciones/{idSeccion}/progresiones`: crea una progresión.
- `GET /progresiones/{id}`: consulta una progresión específica.
- `PUT /progresiones/{id}`: modifica una progresión.
- `DELETE /progresiones/{id}`: elimina una progresión.

### Ejemplo de creación de progresión

Solicitud:

```json
{
  "nombre": "Progresión principal",
  "orden": 1
}
```

Respuesta esperada:

```json
{
  "idProgresion": 1,
  "nombre": "Progresión principal",
  "mensaje": "Progresión creada correctamente"
}
```

## 8. Endpoints de acordes

Permitirán agregar, consultar, modificar y eliminar acordes dentro de una progresión armónica.

- `GET /progresiones/{idProgresion}/acordes`: consulta los acordes de una progresión.
- `POST /progresiones/{idProgresion}/acordes`: agrega un acorde.
- `PUT /acordes/{id}`: modifica un acorde.
- `DELETE /acordes/{id}`: elimina un acorde.

### Ejemplo de registro de acorde

Solicitud:

```json
{
  "fundamental": "C",
  "tipo": "mayor",
  "inversion": 0,
  "duracionPulsos": 4,
  "orden": 1
}
```

Respuesta esperada:

```json
{
  "idAcorde": 1,
  "fundamental": "C",
  "tipo": "mayor",
  "notas": ["C", "E", "G"],
  "mensaje": "Acorde agregado correctamente"
}
```

## 9. Endpoints del generador musical

Estos servicios contendrán la lógica necesaria para generar acordes y progresiones armónicas a partir de parámetros musicales.

### 9.1 Generación de acordes

- `POST /musica/acordes/generar`: genera un acorde según la nota fundamental, tipo e inversión seleccionados.

Solicitud:

```json
{
  "fundamental": "C",
  "tipo": "maj7",
  "inversion": 0
}
```

Respuesta esperada:

```json
{
  "fundamental": "C",
  "tipo": "maj7",
  "notas": ["C", "E", "G", "B"],
  "nombre": "Do mayor séptima"
}
```

### 9.2 Generación de progresiones

- `POST /musica/progresiones/generar`: genera una progresión armónica de acuerdo con la tonalidad y escala seleccionadas.

Solicitud:

```json
{
  "tonalidad": "C",
  "escala": "mayor",
  "cantidadAcordes": 4,
  "estilo": "pop"
}
```

Respuesta esperada:

```json
{
  "tonalidad": "C",
  "escala": "mayor",
  "progresion": [
    {
      "acorde": "C",
      "grado": "I"
    },
    {
      "acorde": "G",
      "grado": "V"
    },
    {
      "acorde": "Am",
      "grado": "vi"
    },
    {
      "acorde": "F",
      "grado": "IV"
    }
  ]
}
```

Las progresiones generadas podrán ser modificadas por el usuario y posteriormente almacenadas dentro de sus proyectos.

## 10. Endpoints para compartir proyectos

Estos servicios permitirán compartir composiciones mediante enlaces de acceso.

- `POST /proyectos/{id}/compartir`: genera un enlace para compartir un proyecto.
- `GET /compartidos/{token}`: consulta un proyecto mediante su enlace.
- `DELETE /compartidos/{id}`: desactiva un enlace compartido.

Se contemplarán dos tipos de permisos:

- **Lectura:** permite consultar el proyecto sin modificarlo.
- **Edición:** permite realizar modificaciones al proyecto compartido.

Los enlaces podrán contar con una fecha de expiración y podrán desactivarse por su propietario.

## 11. Códigos de respuesta HTTP

La API utilizará códigos de estado HTTP para indicar el resultado de las solicitudes.

- **200 OK:** solicitud procesada correctamente.
- **201 Created:** recurso creado correctamente.
- **204 No Content:** recurso eliminado correctamente.
- **400 Bad Request:** los datos enviados son incorrectos.
- **401 Unauthorized:** el usuario no está autenticado.
- **403 Forbidden:** el usuario no tiene permisos suficientes.
- **404 Not Found:** el recurso solicitado no existe.
- **409 Conflict:** existe un conflicto con la información enviada.
- **500 Internal Server Error:** ocurrió un error interno en el servidor.

## 12. Seguridad de la API

Se contemplan mecanismos de seguridad para proteger las cuentas y composiciones de los usuarios.

- Autenticación mediante tokens JWT.
- Almacenamiento de contraseñas mediante algoritmos seguros de hash.
- Validación de los datos recibidos.
- Protección de los endpoints que requieren autenticación.
- Verificación de permisos antes de modificar o eliminar proyectos.
- Validación de los tokens utilizados para compartir composiciones.

Las solicitudes a los endpoints protegidos deberán incluir el token de autenticación en la cabecera HTTP:

```http
Authorization: Bearer token_del_usuario
```

Para los proyectos compartidos, el backend verificará el token del enlace y el permiso asociado antes de permitir el acceso.

## 13. Comunicación entre frontend y backend

El frontend utilizará Fetch API para realizar solicitudes HTTP al backend y recibir respuestas en formato JSON.

Ejemplo de consulta de proyectos:

```javascript
fetch("http://localhost:8080/api/proyectos", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer token_del_usuario"
    }
})
.then(response => response.json())
.then(datos => {
    console.log(datos);
})
.catch(error => {
    console.error("Error:", error);
});
```

El backend procesará las solicitudes mediante Spring Boot y devolverá los resultados correspondientes.

La reproducción musical se realizará directamente desde el navegador mediante un sintetizador y los instrumentos virtuales seleccionados. La API proporcionará los datos musicales necesarios para dicha reproducción, mientras que el frontend se encargará de generar el audio.

## 14. Pruebas de los servicios

Durante el desarrollo se utilizará CURL para realizar solicitudes HTTP y comprobar el funcionamiento de los endpoints.

Estas pruebas permitirán verificar:

- El registro e inicio de sesión de usuarios.
- La creación, consulta, modificación y eliminación de proyectos.
- La administración de secciones y progresiones.
- La generación de acordes y secuencias armónicas.
- La persistencia de información en MySQL.
- La validación de respuestas y códigos de estado HTTP.

Posteriormente, los mismos servicios serán consumidos desde el frontend mediante Fetch API.

## 15. Organización de la API en el backend

La API se desarrollará utilizando Spring Boot y mantendrá una organización por responsabilidades:

- **Controller:** recibe las solicitudes HTTP y devuelve las respuestas.
- **Service:** contiene la lógica de negocio y el procesamiento de las operaciones.
- **Repository:** realiza las consultas y operaciones sobre la base de datos mediante JPA e Hibernate.
- **Entity:** representa las entidades almacenadas en MySQL.
- **DTO:** define los datos que se reciben y envían mediante la API.

Esta organización permitirá mantener separado el manejo de solicitudes, la lógica musical y el acceso a la información.

## 16. Consideraciones de implementación

Los endpoints descritos representan el diseño inicial de la API REST de ChordLab. Durante el desarrollo podrán realizarse ajustes para mejorar la organización y el funcionamiento de los servicios.

La implementación se realizará de manera incremental, comenzando con las operaciones básicas del backend y posteriormente incorporando la generación musical, la persistencia y la integración con el frontend.

La API deberá funcionar desde el entorno WSL establecido para el proyecto y podrá probarse mediante CURL antes de integrarse completamente con las interfaces web.

## 17. Resultado esperado

Se espera contar con una API REST que permita conectar los diferentes módulos de ChordLab, administrar la información de los usuarios y sus proyectos, generar estructuras musicales y facilitar el almacenamiento y consulta de composiciones.

Su implementación permitirá integrar el frontend, el backend y la base de datos en una aplicación web funcional.