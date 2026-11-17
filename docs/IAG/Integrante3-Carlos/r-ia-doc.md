# Registro de uso de inteligencia artificial – Consultas de dudas

**Proyecto:** ChordLab
**Integrante:** Carlos Vicente López Rosales
**Fecha:** 16/11/2026
**Tipo de registro:** Consultas técnicas, configuración de entorno, validación HTTP y persistencia en MySQL.

---

## Consulta 1. Configuración de MySQL y servicio en WSL

**Herramienta utilizada:** Gemini (Google)

**Pregunta realizada:**

Estoy tratando de correr mi proyecto en WSL siguiendo los pasos del README, pero al intentar arrancar la base de datos con `sudo service mysql start` aparece el error `Failed to start mysql.service: Unit mysql.service not found`.

**Respuesta obtenida:**

Gemini explicó que WSL es un entorno Linux independiente de Windows y que el error ocurre cuando el motor de base de datos no está instalado dentro de la distribución de Ubuntu en WSL (o cuando está instalado MariaDB en su lugar). Indicó los pasos para:
1. Verificar si estaba instalado MariaDB (`sudo service mariadb start`).
2. Actualizar repositorios e instalar `mysql-server` dentro de WSL (`sudo apt update && sudo apt install mysql-server -y`).
3. Iniciar y comprobar el estado del servicio (`sudo service mysql start` y `sudo service mysql status`).

**Aplicación en el proyecto:**

Se instaló e inició el servidor MySQL directamente dentro del entorno WSL, logrando levantar el servicio de base de datos de manera local e independiente de Windows.

---

## Consulta 2. Creación de base de datos, usuario `chordlab` y variables de entorno

**Herramienta utilizada:** Gemini (Google)

**Pregunta realizada:**

Al importar el esquema me marcó `ERROR 1049 (42000): Unknown database 'chordlab'`. Además, el archivo `application.properties` tiene `spring.datasource.username=chordlab`, `spring.datasource.password=${DB_PASSWORD}` y `server.port=8090`. ¿Cómo configuro el usuario en MySQL y arranco el backend?

**Respuesta obtenida:**

Gemini explicó que `esquema.sql` requería crear previamente la base de datos y configurar un usuario dedicado distinto de `root` en MySQL 8:
1. Crear la base de datos e importar las tablas (`CREATE DATABASE IF NOT EXISTS chordlab;` y `sudo mysql chordlab < database/esquema.sql`).
2. Crear el usuario `'chordlab'@'localhost'` con `CREATE USER`, asignarle privilegios sobre `chordlab.*` con `GRANT ALL PRIVILEGES` y aplicar cambios con `FLUSH PRIVILEGES`.
3. Pasar las variables de entorno `DB_PASSWORD` y `SERVER_PORT=8090` al ejecutar el Maven Wrapper (`DB_PASSWORD=1234 SERVER_PORT=8090 ./mvnw spring-boot:run`).

**Aplicación en el proyecto:**

Se creó la base de datos `chordlab` con todas sus tablas y relaciones, se configuró el usuario de conexión y se logró ejecutar el backend Spring Boot en el puerto `8090` conectándose correctamente a MySQL mediante Hibernate/JPA.

---

## Consulta 3. Validación de respuestas HTTP mediante CURL y verificación de persistencia en MySQL

**Herramienta utilizada:** Gemini (Google)

**Pregunta realizada:**

El backend ya arrancó sin errores en el puerto 8090, pero al abrir `http://localhost:8090` en el navegador no carga ninguna vista. ¿Cómo valido los endpoints REST, los códigos de respuesta HTTP (`200`, `201`, `401`, `409`) y la persistencia real en MySQL según `docs/04-api.md`?

**Respuesta obtenida:**

Gemini aclaró que una API REST en Spring Boot sin frontend acoplado no renderiza vistas HTML en la raíz, y que los endpoints públicos del proyecto son de tipo `POST`, mientras que los `GET`, `PUT` y `DELETE` requieren identificar al usuario mediante la cabecera `X-Usuario-Id` (definida en `Cabeceras.java`). Proporcionó una batería de pruebas con `curl -i` para comprobar:
- Generación de acordes (`POST /api/musica/acordes/generar` -> `200 OK`).
- Registro de usuario (`POST /api/usuarios/registro` -> `201 Created`) y rechazo de correo duplicado (`409 Conflict`).
- Creación y modificación de proyectos (`POST` -> `201 Created`, `PUT` -> `200 OK`) y rechazo por falta de cabecera de autenticación (`401 Unauthorized`).
- Consulta directa en MySQL (`SELECT` sobre las tablas `usuario` y `proyecto`) para verificar la persistencia física de los registros.

**Aplicación en el proyecto:**

Se ejecutaron las pruebas de validación HTTP y de persistencia sobre la base de datos local en WSL, confirmando que el backend devuelve los códigos HTTP especificados en `04-api.md` y almacena correctamente los registros en MySQL.

---

## 4. Reflexión general del uso de IA

El uso de Gemini permitió resolver rápidamente los problemas de configuración del entorno en WSL, la administración de usuarios y permisos en MySQL 8, y el manejo de variables de entorno en Spring Boot. Asimismo, facilitó la estructuración de pruebas con CURL para verificar tanto los códigos de respuesta HTTP como la persistencia de datos en la base de datos relacional. Todas las soluciones propuestas fueron ejecutadas, verificadas paso a paso en la terminal y contrastadas contra la especificación de `docs/04-api.md`.

**Herramienta registrada:**
- Gemini (Google).

**Responsable del registro:** Carlos Vicente López Rosales.
