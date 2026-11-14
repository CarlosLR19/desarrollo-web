# ChordLab — Diseño de API REST

## 1. Descripción

La API REST de ChordLab permite comunicar el frontend con el backend desarrollado en Java y Spring Boot.

Se utilizan peticiones HTTP mediante Fetch y el formato JSON para intercambiar información.

La API permite administrar usuarios, proyectos musicales, secciones, progresiones armónicas y acordes, además de generar acordes y progresiones y compartir proyectos mediante enlaces.

## 2. Configuración general

URL base: http://localhost:8090/api

El prefijo `/api` se define en `application.properties` con `server.servlet.context-path=/api`, por lo que los controladores declaran rutas sin el prefijo (por ejemplo `/usuarios/registro`).

Tecnologías:
- Java 21 con Spring Boot.
- MySQL.
- Hibernate/JPA.
- JavaScript con Fetch.
- JSON.

Métodos HTTP:
- GET: consultar información.
- POST: registrar información o ejecutar acciones.
- PUT: actualizar información.
- DELETE: eliminar registros.

Alcance por entregable:
- **Entregable 2 (backend básico):** POST y GET.
- **Entregable 3 (API completa):** PUT, DELETE, filtros y validación de respuestas HTTP.

## 3. Endpoints de usuarios

Responsable del módulo: Nino.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| POST | /usuarios/registro | Registrar usuario | Público |
| POST | /usuarios/login | Iniciar sesión | Público |
| GET | /usuarios/perfil | Consultar perfil propio | Autenticado |
| PUT | /usuarios/perfil | Actualizar datos personales | Autenticado |

### Ejemplo: registrar usuario

POST /usuarios/registro

Solicitud JSON:

```json
{
  "nombre": "Juan Perez",
  "correo": "juan@example.com",
  "contrasena": "EjemploSeguro123"
}
```

Respuesta esperada: HTTP 201 Created

```json
{
  "mensaje": "Usuario registrado correctamente",
  "idUsuario": 1
}
```

La contraseña se almacena con un algoritmo de hash y nunca se devuelve en las respuestas.

### Ejemplo: iniciar sesión

POST /usuarios/login

Solicitud JSON:

```json
{
  "correo": "juan@example.com",
  "contrasena": "EjemploSeguro123"
}
```

Respuesta esperada: HTTP 200 OK

```json
{
  "token": "jwt_generado",
  "tipo": "Bearer",
  "mensaje": "Inicio de sesión exitoso"
}
```

Las solicitudes a endpoints protegidos incluyen la cabecera `Authorization: Bearer <token>`.

## 4. Endpoints de proyectos musicales

Responsable del módulo: Carlos.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| GET | /proyectos | Listar proyectos propios | Autenticado |
| POST | /proyectos | Crear proyecto | Autenticado |
| GET | /proyectos/{id} | Consultar un proyecto | Propietario |
| PUT | /proyectos/{id} | Modificar proyecto | Propietario |
| DELETE | /proyectos/{id} | Eliminar proyecto | Propietario |

### Ejemplo: crear proyecto

POST /proyectos

Solicitud JSON:

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

Respuesta esperada: HTTP 201 Created

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

### Búsqueda con Query String

GET /proyectos?busqueda=cancion&pagina=0&limite=10

Devuelve los proyectos cuyo nombre coincida con la búsqueda, con paginación.

## 5. Endpoints de secciones

Responsable del módulo: Carlos.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| GET | /proyectos/{idProyecto}/secciones | Listar secciones de un proyecto | Propietario |
| POST | /proyectos/{idProyecto}/secciones | Crear sección | Propietario |
| PUT | /secciones/{id} | Modificar sección | Propietario |
| DELETE | /secciones/{id} | Eliminar sección | Propietario |

### Ejemplo: crear sección

POST /proyectos/1/secciones

```json
{
  "nombre": "Verso",
  "orden": 1
}
```

Respuesta esperada: HTTP 201 Created

```json
{
  "idSeccion": 1,
  "nombre": "Verso",
  "orden": 1,
  "mensaje": "Sección creada correctamente"
}
```

## 6. Endpoints de progresiones

Responsable del módulo: Carlos.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| GET | /secciones/{idSeccion}/progresiones | Listar progresiones de una sección | Propietario |
| POST | /secciones/{idSeccion}/progresiones | Crear progresión | Propietario |
| GET | /progresiones/{id} | Consultar una progresión | Propietario |
| PUT | /progresiones/{id} | Modificar progresión | Propietario |
| DELETE | /progresiones/{id} | Eliminar progresión | Propietario |

### Ejemplo: crear progresión

POST /secciones/1/progresiones

```json
{
  "nombre": "Progresión principal",
  "orden": 1
}
```

Respuesta esperada: HTTP 201 Created

```json
{
  "idProgresion": 1,
  "nombre": "Progresión principal",
  "mensaje": "Progresión creada correctamente"
}
```

## 7. Endpoints de acordes

Responsable del módulo: Carlos.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| GET | /progresiones/{idProgresion}/acordes | Listar acordes de una progresión | Propietario |
| POST | /progresiones/{idProgresion}/acordes | Agregar acorde | Propietario |
| PUT | /acordes/{id} | Modificar acorde | Propietario |
| DELETE | /acordes/{id} | Eliminar acorde | Propietario |

Valores válidos de `tipo`: `mayor`, `menor`, `disminuido`, `aumentado`, `7`, `maj7`, `m7`, `sus2`, `sus4`.

### Ejemplo: agregar acorde

POST /progresiones/1/acordes

```json
{
  "fundamental": "C",
  "tipo": "mayor",
  "inversion": 0,
  "duracionPulsos": 4,
  "orden": 1
}
```

Respuesta esperada: HTTP 201 Created

```json
{
  "idAcorde": 1,
  "fundamental": "C",
  "tipo": "mayor",
  "notas": ["C", "E", "G"],
  "mensaje": "Acorde agregado correctamente"
}
```

## 8. Endpoints del generador musical

Responsable del módulo: César.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| POST | /musica/acordes/generar | Generar un acorde | Público |
| POST | /musica/progresiones/generar | Generar una progresión | Público |

Estos endpoints no guardan información: calculan el resultado a partir de los parámetros recibidos.

### Ejemplo: generar acorde

POST /musica/acordes/generar

```json
{
  "fundamental": "C",
  "tipo": "maj7",
  "inversion": 0
}
```

Respuesta esperada: HTTP 200 OK

```json
{
  "fundamental": "C",
  "tipo": "maj7",
  "notas": ["C", "E", "G", "B"],
  "nombre": "Do mayor séptima"
}
```

### Ejemplo: generar progresión

POST /musica/progresiones/generar

```json
{
  "tonalidad": "C",
  "escala": "mayor",
  "cantidadAcordes": 4,
  "estilo": "pop"
}
```

Respuesta esperada: HTTP 200 OK

```json
{
  "tonalidad": "C",
  "escala": "mayor",
  "progresion": [
    { "acorde": "C", "tipo": "mayor", "grado": "I" },
    { "acorde": "G", "tipo": "mayor", "grado": "V" },
    { "acorde": "A", "tipo": "menor", "grado": "vi" },
    { "acorde": "F", "tipo": "mayor", "grado": "IV" }
  ]
}
```

Escalas admitidas: `mayor` y `menor`. Estilos: `pop`, `rock`, `jazz` y `triste`. Las progresiones generadas pueden modificarse y guardarse en un proyecto.

## 9. Endpoints para compartir proyectos

Responsable del módulo: César.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| POST | /proyectos/{id}/compartir | Generar enlace para compartir | Propietario |
| GET | /compartidos/{token} | Consultar proyecto por enlace | Con token |
| DELETE | /compartidos/{id} | Desactivar enlace | Propietario |

Permisos: **lectura** (solo consulta) y **edición** (permite modificar). Los enlaces pueden tener fecha de expiración y desactivarse.

Este módulo se implementará después del backend básico.

## 10. Reglas de la API

1. Los proyectos y su contenido solo pueden ser consultados o modificados por su propietario, o por quien tenga un enlace compartido válido.
2. Las operaciones sobre proyectos, secciones, progresiones y acordes requieren inicio de sesión.
3. Los endpoints de generación musical son públicos.
4. Las contraseñas se almacenan con hash y no se devuelven nunca.
5. Los valores de `tipo`, `escala` y `fundamental` se validan en el backend.
6. Los acordes y secciones se ordenan con el campo `orden`.
7. Al eliminar un proyecto se eliminan sus secciones, progresiones y acordes.
8. La API devuelve respuestas JSON.
9. Las validaciones de datos se realizan en el backend.
10. La reproducción de audio se realiza en el navegador; la API solo entrega los datos musicales.

## 11. Códigos HTTP esperados

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Registro creado |
| 204 | Recurso eliminado |
| 400 | Datos inválidos |
| 401 | Usuario no autenticado |
| 403 | Permisos insuficientes |
| 404 | Recurso no encontrado |
| 409 | Conflicto (por ejemplo, correo ya registrado) |
| 500 | Error interno del servidor |

## 12. Organización en el backend

- **Controller:** recibe las solicitudes HTTP y devuelve las respuestas (`@RestController`, `@CrossOrigin`).
- **Service:** lógica de negocio y generación musical.
- **Repository:** acceso a MySQL mediante JPA e Hibernate.
- **Entity:** tablas almacenadas en MySQL.
- **DTO:** datos que se reciben y envían por la API.

## 13. Pruebas previstas

Durante el desarrollo se utiliza CURL para comprobar los endpoints. Los comandos y resultados se documentan en `docs/pruebas/curl.md`.

Se probará:
- Registro e inicio de sesión de usuarios.
- Creación y consulta de proyectos.
- Creación y consulta de secciones, progresiones y acordes.
- Generación de acordes y progresiones.
- Persistencia de la información en MySQL.
- Casos de error: datos inválidos, correo repetido, recurso inexistente y falta de autenticación.

Las pruebas deberán documentar resultados exitosos y casos de error.