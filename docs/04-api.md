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
- **Entregable 4 (integración):** endpoints para compartir proyectos y `notasConOctava` en las progresiones generadas.
- **Entregable 5:** página generada en el servidor con Thymeleaf.

### Identificación del usuario

Los endpoints marcados como **Autenticado** o **Propietario** requieren la cabecera `X-Usuario-Id` con el `idUsuario` que devuelve el inicio de sesión. El frontend la guarda en `sessionStorage` y la envía en cada petición.

```
X-Usuario-Id: 1
```

- Si falta la cabecera, la API responde **401**.
- Si el recurso pertenece a otro usuario, responde **403**.

Esta cabecera es temporal: identifica al usuario, pero no lo autentica. Más adelante se puede reemplazar por un token JWT sin cambiar las rutas.

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
  "mensaje": "Inicio de sesión exitoso",
  "idUsuario": 1,
  "nombre": "Juan Perez"
}
```

Si el correo o la contraseña son incorrectos, responde **401**. Las solicitudes a endpoints protegidos envían el `idUsuario` en la cabecera `X-Usuario-Id`.

### Ejemplo: consultar y actualizar perfil

GET /usuarios/perfil (con `X-Usuario-Id: 1`)

Respuesta esperada: HTTP 200 OK

```json
{
  "idUsuario": 1,
  "nombre": "Juan Perez",
  "correo": "juan@example.com",
  "fechaRegistro": "2026-11-22T18:56:14"
}
```

PUT /usuarios/perfil recibe `{ "nombre": "Nuevo nombre" }` y devuelve el perfil actualizado. El correo no se puede modificar.

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
  "descripcion": "Primera composición en ChordLab",
  "tonalidad": "C",
  "escala": "mayor",
  "tempo": 90,
  "compasNum": 4,
  "compasDen": 4,
  "fechaCreacion": "2026-11-22T18:56:14",
  "fechaActualizacion": "2026-11-22T18:56:14",
  "mensaje": "Proyecto creado correctamente"
}
```

Validaciones:
- `tempo`: de 20 a 300.
- `compasNum`: de 1 a 16.
- `compasDen`: 1, 2, 4, 8 o 16.
- `escala`: `mayor` o `menor`.

### Búsqueda con Query String

GET /proyectos?busqueda=primera&escala=mayor&pagina=0&limite=10

| Parámetro | Descripción | Por defecto |
|---|---|---|
| `busqueda` | Texto contenido en el nombre | Todos |
| `tonalidad` | Tonalidad exacta (C, F#, Bb…) | Todas |
| `escala` | `mayor` o `menor` | Todas |
| `pagina` | Número de página, desde 0 | 0 |
| `limite` | Proyectos por página, de 1 a 100 | 50 |

El total de proyectos que cumplen los filtros se devuelve en la cabecera `X-Total-Count`.

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
  "idProyecto": 1,
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
  "idSeccion": 1,
  "nombre": "Progresión principal",
  "orden": 1,
  "mensaje": "Progresión creada correctamente"
}
```

`GET /progresiones/{id}` devuelve además la lista `acordes`, ordenada por `orden`.

## 7. Endpoints de acordes

Responsable del módulo: Carlos.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| GET | /progresiones/{idProgresion}/acordes | Listar acordes de una progresión | Propietario |
| POST | /progresiones/{idProgresion}/acordes | Agregar acorde | Propietario |
| PUT | /acordes/{id} | Modificar acorde | Propietario |
| DELETE | /acordes/{id} | Eliminar acorde | Propietario |

Valores válidos de `tipo`: `mayor`, `menor`, `disminuido`, `aumentado`, `sus2`, `sus4`, `7`, `maj7`, `m7`, `m7b5` y `dim7`.

Otras validaciones:
- `inversion`: de 0 a 3, y menor que el número de notas del acorde.
- `duracionPulsos`: de 0.25 a 64.

Filtro opcional por tipo: `GET /progresiones/1/acordes?tipo=maj7`.

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
  "inversion": 0,
  "duracionPulsos": 4,
  "orden": 1,
  "simbolo": "C",
  "notas": ["C", "E", "G"],
  "notasConOctava": ["C4", "E4", "G4"],
  "mensaje": "Acorde agregado correctamente"
}
```

`notas` tiene la ortografía musical correcta (por ejemplo, F7 = F A C Eb). `notasConOctava` sirve para dibujar el teclado y para reproducir el acorde con Tone.js.

## 8. Endpoints del generador musical

Responsable del módulo: César.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| POST | /musica/acordes/generar | Generar un acorde | Público |
| POST | /musica/progresiones/generar | Generar una progresión | Público |
| GET | /musica/catalogo | Notas, tipos de acorde, escalas y estilos válidos | Público |
| GET | /musica/escalas?tonalidad=F&escala=mayor | Notas de una escala | Público |

Estos endpoints no guardan información: calculan el resultado a partir de los parámetros recibidos. El frontend usa `/musica/catalogo` para llenar sus listas desplegables.

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
  "inversion": 0,
  "simbolo": "Cmaj7",
  "nombre": "Do mayor séptima",
  "notas": ["C", "E", "G", "B"],
  "notasConOctava": ["C4", "E4", "G4", "B4"]
}
```

`inversion` es opcional; si no se envía, vale 0. Un tipo no válido responde **400** con la lista de tipos permitidos.

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
  "estilo": "pop",
  "progresion": [
    { "acorde": "C",  "grado": "I",  "fundamental": "C", "tipo": "mayor", "notas": ["C", "E", "G"], "notasConOctava": ["C4", "E4", "G4"] },
    { "acorde": "G",  "grado": "V",  "fundamental": "G", "tipo": "mayor", "notas": ["G", "B", "D"], "notasConOctava": ["G4", "B4", "D5"] },
    { "acorde": "Am", "grado": "vi", "fundamental": "A", "tipo": "menor", "notas": ["A", "C", "E"], "notasConOctava": ["A4", "C5", "E5"] },
    { "acorde": "F",  "grado": "IV", "fundamental": "F", "tipo": "mayor", "notas": ["F", "A", "C"], "notasConOctava": ["F4", "A4", "C5"] }
  ]
}
```

- **Escalas admitidas:** `mayor` y `menor`.
- **Estilos:** `pop`, `clasico`, `jazz`, `blues` y `aleatorio`. Si no se envía estilo, se usa `pop`.
- **`cantidadAcordes`:** de 2 a 16.
- **`semilla`:** opcional; hace que el estilo `aleatorio` genere siempre la misma progresión.

Desde el frontend, la progresión generada se puede guardar en una sección de un proyecto, creando la progresión y sus acordes con los endpoints de las secciones 6 y 7.

## 9. Endpoints para compartir proyectos

Responsable del módulo: César.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| POST | /proyectos/{id}/compartir | Generar enlace para compartir | Propietario |
| GET | /proyectos/{id}/compartidos | Listar los enlaces del proyecto | Propietario |
| DELETE | /compartidos/{idCompartir} | Desactivar enlace | Propietario |
| GET | /compartidos/{token} | Consultar el proyecto completo por enlace | Público, con token |
| PUT | /compartidos/{token} | Modificar los datos generales del proyecto | Público, con token de edición |

Permisos:
- **lectura:** solo consulta.
- **edicion:** permite modificar los datos generales del proyecto.

Los enlaces pueden tener fecha de expiración y desactivarse. No se borran, para conservar el historial. El token tiene 32 caracteres aleatorios y no se puede adivinar.

### Ejemplo: generar enlace

POST /proyectos/1/compartir

```json
{
  "permiso": "lectura",
  "diasExpiracion": 7
}
```

`diasExpiracion` es opcional (de 1 a 365); si no se envía, el enlace no expira.

Respuesta esperada: HTTP 201 Created

```json
{
  "idCompartir": 1,
  "idProyecto": 1,
  "token": "aX8wo8QAXPuNmh7sZE68KTZ3KS5vn8dq",
  "permiso": "lectura",
  "fechaCreacion": "2026-11-22T18:56:14",
  "fechaExpiracion": "2026-11-29T18:56:14",
  "activo": true,
  "vigente": true,
  "mensaje": "Enlace generado correctamente"
}
```

`vigente` es `false` si el enlace se desactivó o ya expiró.

### Ejemplo: abrir un enlace

GET /compartidos/aX8wo8QAXPuNmh7sZE68KTZ3KS5vn8dq

Respuesta esperada: HTTP 200 OK. Devuelve el proyecto con todas sus secciones, progresiones y acordes:

```json
{
  "permiso": "lectura",
  "fechaExpiracion": "2026-11-29T18:56:14",
  "propietario": "Juan Perez",
  "proyecto": { "idProyecto": 1, "nombre": "Mi primera canción", "tonalidad": "C", "...": "..." },
  "secciones": [
    {
      "idSeccion": 1, "nombre": "Verso", "orden": 1,
      "progresiones": [
        { "idProgresion": 1, "nombre": "Progresión principal", "orden": 1, "acordes": [ "..." ] }
      ]
    }
  ]
}
```

`PUT /compartidos/{token}` recibe el mismo cuerpo que `PUT /proyectos/{id}`.

Errores:
- **400:** permiso distinto de `lectura` o `edicion`.
- **403:** no es el propietario, el enlace fue desactivado o expiró, o se intenta editar con un enlace de lectura.
- **404:** el token no existe.

En el frontend, el enlace abre `compartido.html?token=...`, que funciona sin iniciar sesión.

## 10. Página con plantilla Thymeleaf

| Método | Ruta | Función | Acceso |
|---|---|---|---|
| GET | /pagina | Catálogo de tipos de acorde sobre C, generado en el servidor | Público |

A diferencia del resto de la API, esta ruta no devuelve JSON: `PlantillaController` (`@Controller`) llena el modelo con los acordes generados por `TeoriaMusicalService`, y la plantilla `templates/pagina.html` los muestra en una tabla con `th:each`. Se abre en http://localhost:8090/api/pagina.

## 11. Reglas de la API

1. Los proyectos y su contenido solo pueden ser consultados o modificados por su propietario, o por quien tenga un enlace compartido válido.
2. Las operaciones sobre proyectos, secciones, progresiones y acordes requieren identificar al usuario con la cabecera `X-Usuario-Id`.
3. Los endpoints de generación musical son públicos.
4. Las contraseñas se almacenan con hash y no se devuelven nunca.
5. Los valores de `tipo`, `escala` y `fundamental` se validan en el backend.
6. Los acordes y secciones se ordenan con el campo `orden`.
7. Al eliminar un proyecto se eliminan sus secciones, progresiones y acordes.
8. La API devuelve respuestas JSON, excepto la página Thymeleaf `/pagina`. Los errores tienen siempre la forma `{ "estado", "error", "mensaje", "fecha" }`, y los errores de validación agregan `campos` con el mensaje de cada campo.
9. Las validaciones de datos se realizan en el backend.
10. La reproducción de audio se realiza en el navegador; la API solo entrega los datos musicales.

## 12. Códigos HTTP esperados

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Registro creado |
| 204 | Recurso eliminado o enlace desactivado |
| 400 | Datos inválidos, JSON mal formado o parámetro faltante |
| 401 | Falta la cabecera `X-Usuario-Id` o las credenciales son incorrectas |
| 403 | Permisos insuficientes (el recurso es de otro usuario o el enlace no lo permite) |
| 404 | Recurso o ruta no encontrados |
| 405 | Método HTTP no permitido en esa ruta |
| 409 | Conflicto (por ejemplo, correo ya registrado) |
| 415 | El cuerpo no se envió como JSON |
| 500 | Error interno del servidor (el detalle se registra solo en el servidor) |

Ejemplo de error (falta la cabecera):

```json
{
  "estado": 401,
  "error": "Unauthorized",
  "mensaje": "Falta la cabecera X-Usuario-Id para identificar al usuario",
  "fecha": "2026-11-22T18:56:14"
}
```

## 13. Organización en el backend

- **Controller:** recibe las solicitudes HTTP y devuelve las respuestas (`@RestController`). `PlantillaController` es un `@Controller` que devuelve la vista Thymeleaf.
- **Config:** CORS (`CorsConfig`, expone la cabecera `X-Total-Count`) y el cifrado de contraseñas con BCrypt (`PasswordConfig`).
- **Exception:** `GlobalExceptionHandler` convierte las excepciones en respuestas JSON con el código HTTP correcto.
- **Service:** lógica de negocio y generación musical.
- **Repository:** acceso a MySQL mediante JPA e Hibernate.
- **Entity:** tablas almacenadas en MySQL.
- **DTO:** datos que se reciben y envían por la API.

## 14. Pruebas

Los endpoints se prueban con CURL mediante los scripts `pruebas/curl-entregable2.sh` y `pruebas/curl-entregable3.sh`. Este último hace 60 verificaciones automáticas de casos de éxito y de error. El plan de pruebas manuales desde el frontend, con sus capturas, está en `docs/evidencias/pruebas/pruebas.md`.

Se prueba:
- Registro e inicio de sesión de usuarios.
- Creación y consulta de proyectos.
- Creación y consulta de secciones, progresiones y acordes.
- Generación de acordes y progresiones.
- Modificación y eliminación (PUT y DELETE), filtros y paginación.
- Permisos: acceso a recursos de otro usuario (403) y peticiones sin cabecera (401).
- Compartir proyectos: generar, listar, abrir, editar con permiso y desactivar enlaces.
- Persistencia de la información en MySQL.
- Casos de error: datos inválidos, correo repetido, recurso inexistente y falta de identificación.