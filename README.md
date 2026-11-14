# ChordLab
Proyecto final de Desarrollo Web

## Descripción
Plataforma web para crear acordes y progresiones armónicas, reproducirlas con instrumentos virtuales y guardarlas en proyectos organizados por secciones, con cuentas de usuario y opción de compartir.

## Integrantes
* César Rodrigo Díaz Hernández
* Nino Alessandro Navarro Lam
* Carlos Vicente López Rosales

## Tecnologías
* Java y Spring Boot
* MySQL y Hibernate/JPA
* HTML, CSS y JavaScript
* API Fetch
* Git y GitHub
* WSL

## Estructura
* backend: API REST y lógica del sistema
* frontend: Interfaces web
* database: Scripts de base de datos
* docs: Diseño, reportes y evidencias (incluye docs/IAG con el uso de IA)

## Estado hasta el momento
Entregable 1: Diseño inicial

## Cómo ejecutar (WSL)
1. Clonar: `git clone https://github.com/<usuario>/desarrollo-web.git`
2. Base de datos: `sudo service mysql start` y `sudo mysql chordlab < database/esquema.sql`
3. Backend: `cd backend && mvn spring-boot:run` (queda en `http://localhost:8080/api`)
4. Frontend: `cd frontend && python3 -m http.server 5500`, y abrir `http://localhost:5500`

En `frontend/js/app.js`, `CFG.MOCK=false` usa la API real y `true` funciona sin backend con datos simulados.