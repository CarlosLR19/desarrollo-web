# Reporte de IA Desarrollo en el Proyecto

**Fecha:** 16/11/2026  
**Número de reporte:** 02  

---

# 1. Breve descripción de uso

Apoyo mediante inteligencia artificial generativa para configurar el entorno de desarrollo y base de datos MySQL dentro de WSL, habilitar la conexión del backend en Spring Boot mediante variables de entorno, y ejecutar pruebas funcionales con CURL sobre los endpoints REST de ChordLab verificando códigos de estado HTTP y persistencia en la base de datos.

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
| **Herramienta** | Gemini (Google) |
| **Modelo/temperatura** | No se registró el identificador exacto del modelo ni la temperatura utilizada |
| **Prompt original** | [Prompt 1 – Configuración de MySQL y servicio en WSL](#prompt-1) / [Prompt 2 – Creación de base de datos, usuario y variables de entorno](#prompt-2) / [Prompt 3 – Validación de endpoints con CURL y persistencia](#prompt-3) |
| **Respuesta de IA** | [Respuesta 1](#respuesta-1) / [Respuesta 2](#respuesta-2) / [Respuesta 3](#respuesta-3) |
| **Código anterior** | Commit ([c82ff83]) |
| **Código posterior** | Commit ([Mismo estado del repositorio tras validar conexión y endpoints localmente]) |
| **Prueba de funcionamiento** | Ejecución del backend en el puerto `8090` (`./mvnw spring-boot:run`), pruebas con `curl -i` sobre `/api/musica/acordes/generar` (`200 OK`), `/api/usuarios/registro` (`201 Created` / `409 Conflict`), `/api/proyectos` (`201 Created` / `401 Unauthorized`) y consulta `SELECT` en MySQL confirmando la persistencia en las tablas `usuario` y `proyecto` |
| **Código de uso** | Depuración / Explicación / Pruebas / Revisión |
| **Reflexión del estudiante** | A través de estas consultas logré levantar de forma independiente el entorno completo del backend en WSL, comprendiendo cómo separar la configuración de base de datos en MySQL 8 mediante usuarios dedicados y variables de entorno en Spring Boot. Además, aprendí a validar una API REST directamente desde terminal con CURL y contrastar las respuestas HTTP y los registros almacenados contra la documentación técnica (`docs/04-api.md`). |

---

## Consulta 1. Configuración de MySQL y servicio en WSL

### Prompt 1

Estoy tratando de correr mi proyecto en WSL siguiendo los pasos del README, pero al intentar arrancar la base de datos con `sudo service mysql start` aparece el error `Failed to start mysql.service: Unit mysql.service not found`.

### Respuesta 1

Gemini explicó que WSL es un entorno Linux independiente de Windows y que el error ocurre cuando el motor de base de datos no está instalado dentro de la distribución de Ubuntu en WSL (o cuando está instalado MariaDB en su lugar). Indicó los pasos para:

1. Verificar si estaba instalado MariaDB (`sudo service mariadb start`).
2. Actualizar repositorios e instalar `mysql-server` dentro de WSL (`sudo apt update && sudo apt install mysql-server -y`).
3. Iniciar y comprobar el estado del servicio (`sudo service mysql start` y `sudo service mysql status`).

---

## Consulta 2. Creación de base de datos, usuario `chordlab` y variables de entorno

### Prompt 2

Al importar el esquema me marcó `ERROR 1049 (42000): Unknown database 'chordlab'`. Además, el archivo `application.properties` tiene `spring.datasource.username=chordlab`, `spring.datasource.password=${DB_PASSWORD}` y `server.port=8090`. ¿Cómo configuro el usuario en MySQL y arranco el backend?

### Respuesta 2

Gemini explicó que `esquema.sql` requería crear previamente la base de datos y configurar un usuario dedicado distinto de `root` en MySQL 8:

1. Crear la base de datos e importar las tablas (`CREATE DATABASE IF NOT EXISTS chordlab;` y `sudo mysql chordlab < database/esquema.sql`).
2. Crear el usuario `'chordlab'@'localhost'` con `CREATE USER`, asignarle privilegios sobre `chordlab.*` con `GRANT ALL PRIVILEGES` y aplicar cambios con `FLUSH PRIVILEGES`.
3. Pasar las variables de entorno `DB_PASSWORD` y `SERVER_PORT=8090` al ejecutar el Maven Wrapper (`DB_PASSWORD=1234 SERVER_PORT=8090 ./mvnw spring-boot:run`).

---

## Consulta 3. Validación de respuestas HTTP mediante CURL y verificación de persistencia en MySQL

### Prompt 3

El backend ya arrancó sin errores en el puerto 8090, pero al abrir `http://localhost:8090` en el navegador no carga ninguna vista. ¿Cómo valido los endpoints REST, los códigos de respuesta HTTP (`200`, `201`, `401`, `409`) y la persistencia real en MySQL según `docs/04-api.md`?

### Respuesta 3

Gemini aclaró que una API REST en Spring Boot sin frontend acoplado no renderiza vistas HTML en la raíz, y que los endpoints públicos del proyecto son de tipo `POST`, mientras que los `GET`, `PUT` y `DELETE` requieren identificar al usuario mediante la cabecera `X-Usuario-Id` (definida en `Cabeceras.java`). Proporcionó una batería de pruebas con `curl -i` para comprobar:

- Generación de acordes (`POST /api/musica/acordes/generar` -> `200 OK`).
- Registro de usuario (`POST /api/usuarios/registro` -> `201 Created`) y rechazo de correo duplicado (`409 Conflict`).
- Creación y modificación de proyectos (`POST` -> `201 Created`, `PUT` -> `200 OK`) y rechazo por falta de cabecera de autenticación (`401 Unauthorized`).
- Consulta directa en MySQL (`SELECT` sobre las tablas `usuario` y `proyecto`) para verificar la persistencia física de los registros.

---

## Observaciones adicionales

El uso de Gemini permitió resolver los problemas de configuración del entorno en WSL, la administración de usuarios y permisos en MySQL 8, y el manejo de variables de entorno en Spring Boot. Asimismo, facilitó la estructuración de pruebas con CURL para verificar tanto los códigos de respuesta HTTP como la persistencia de datos en la base de datos relacional, contrastando cada resultado contra la especificación de `docs/04-api.md`.