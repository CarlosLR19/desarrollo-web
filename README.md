# ChordLab
Proyecto final de Desarrollo Web (LISTI, agosto 2026 – enero 2027).

[Link Video Explicativo Funcionamiento](https://youtu.be/Szb5U1Cr5Ro)

## Descripción
ChordLab es una plataforma web para crear acordes y progresiones armónicas, verlos en un teclado de piano y en un diagrama de guitarra, y reproducirlos con instrumentos virtuales. Las composiciones se guardan en proyectos organizados por secciones. Cada usuario tiene su cuenta y puede compartir sus proyectos mediante enlaces.

## Integrantes
* César Rodrigo Díaz Hernández
* Nino Alessandro Navarro Lam
* Carlos Vicente López Rosales

## Tecnologías
* **Backend:** Java 21, Spring Boot 4, Hibernate/JPA y plantillas Thymeleaf.
* **Base de datos:** MySQL.
* **Frontend:** HTML, CSS y JavaScript con la API Fetch. El sonido se genera con [Tone.js](https://tonejs.github.io/).
* **Entorno:** WSL (Ubuntu), Git y GitHub.

## Estructura
| Carpeta | Contenido |
|---|---|
| `backend/` | API REST en Spring Boot: controladores, servicios, repositorios, entidades, DTO y la plantilla Thymeleaf |
| `frontend/` | Páginas web (`login.html`, `proyectos.html`, `compartido.html`), estilos y scripts |
| `database/` | Script de la base de datos (`esquema.sql`) |
| `pruebas/` | Scripts de pruebas con CURL |
| `docs/` | Diseño, API, reportes de avance (`docs/reportes/`), evidencias (`docs/evidencias/`) y registros de uso de IA (`docs/IAG/`) |

## Funcionalidades
* Registro, inicio y cierre de sesión, y perfil de usuario.
* Proyectos con tonalidad, escala, tempo y compás: crear, consultar, editar, eliminar, buscar y filtrar.
* Secciones dentro de cada proyecto (intro, verso, coro…).
* Editor de progresiones: agregar, editar, eliminar y reordenar acordes.
* Generador de acordes (con inversiones) y de progresiones por tonalidad, escala y estilo.
* Visualización de cada acorde en un teclado de piano y en un diagrama de guitarra.
* Reproductor con piano, guitarra y sintetizador, y configuración de tempo, volumen y repetición.
* Compartir proyectos con enlaces de lectura o edición. Los enlaces pueden expirar o desactivarse.
* Página generada en el servidor con Thymeleaf (`/api/pagina`).

## Requisitos (en WSL)
* Ubuntu en WSL.
* JDK 21: `sudo apt install openjdk-21-jdk`
* Maven: `sudo apt install maven`. También se puede usar el Maven Wrapper incluido, `./mvnw`.
* MySQL: `sudo apt install mysql-server`
* Python 3, para servir el frontend. Ya viene instalado en Ubuntu.
* Conexión a internet en el navegador, para cargar Tone.js.

Comprobar las versiones:
```bash
java -version    # debe indicar 21
mvn -version
mysql --version
```

## Cómo ejecutar (WSL)
Se necesitan **tres terminales**: base de datos, backend y frontend.

### 1. Clonar el repositorio
```bash
git clone https://github.com/CarlosLR19/desarrollo-web.git
cd desarrollo-web
```

### 2. Base de datos (solo la primera vez)
Iniciar MySQL:
```bash
sudo service mysql start
```

Crear la base de datos y el usuario `chordlab`. Cambie `TuContraseña` por la contraseña que quiera usar:
```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS chordlab; CREATE USER IF NOT EXISTS 'chordlab'@'localhost' IDENTIFIED BY 'TuContraseña'; GRANT ALL PRIVILEGES ON chordlab.* TO 'chordlab'@'localhost'; FLUSH PRIVILEGES;"
```

Crear las tablas:
```bash
sudo mysql chordlab < database/esquema.sql
```

En las siguientes ocasiones basta con `sudo service mysql start`.

### 3. Backend (terminal 2)
La contraseña de MySQL se lee de la variable de entorno `DB_PASSWORD`. Debe ser la misma del paso anterior y exportarse en la misma terminal donde se ejecuta Maven:
```bash
cd backend
export DB_PASSWORD='TuContraseña'
mvn spring-boot:run
```

El backend está listo cuando aparece `Started ChordlabApplication`. Queda en:
* API REST: **http://localhost:8090/api**. Para comprobarla, abra http://localhost:8090/api/musica/catalogo.
* Página con Thymeleaf: **http://localhost:8090/api/pagina**.

### 4. Frontend (terminal 3)
```bash
cd frontend
python3 -m http.server 5500
```

Abra **http://localhost:5500/login.html**, cree una cuenta en la pestaña "Registrarse" e inicie sesión.

Para detener el backend o el frontend, presione `Ctrl + C` en su terminal.

## Pruebas
Con el backend en ejecución, desde la raíz del repositorio:
```bash
bash pruebas/curl-entregable2.sh    # registro, login, POST y GET
bash pruebas/curl-entregable3.sh    # PUT, DELETE, filtros, permisos y códigos HTTP
```

El script del Entregable 3 termina con un resumen: `RESULTADO: 60 correctas, 0 con fallo`. Si el backend corre en otro puerto, indíquelo con `API=http://localhost:PUERTO/api bash pruebas/...`.

El plan de pruebas manuales, con casos de éxito y de error y sus capturas, está en [`docs/evidencias/pruebas/pruebas.md`](docs/evidencias/pruebas/pruebas.md).

## Problemas frecuentes
| Error | Causa y solución |
|---|---|
| `Access denied for user 'chordlab'@'localhost'` | La contraseña de `DB_PASSWORD` no coincide con la del usuario de MySQL, o falta el `export` en esa terminal. Vuelva a asignarla con `sudo mysql -e "ALTER USER 'chordlab'@'localhost' IDENTIFIED BY 'TuContraseña';"` |
| `Unit mysql.service not found` | MySQL no está instalado en WSL: `sudo apt install mysql-server` |
| `release version 21 not supported` | Maven está usando otro JDK. Seleccione Java 21 con `sudo update-alternatives --config java` |
| `Port 8090 was already in use` | Ya hay un backend en ejecución. Deténgalo o libere el puerto con `fuser -k 8090/tcp` |
| `$'\r': command not found` al correr un script | El script tiene finales de línea de Windows. Ejecute `git checkout -- pruebas/` (el repositorio los fuerza a LF con `.gitattributes`) |
| El reproductor no suena | Recargue con `Ctrl + Shift + R` y verifique la conexión a internet: Tone.js se descarga de un CDN |

## Documentación
* [Propuesta](docs/01-propuesta.md), [requisitos](docs/02-requisitos.md), [modelo ER](docs/03-modelo-er.md) y [arquitectura](docs/05-arquitectura.md).
* [Diseño de la API REST](docs/04-api.md): endpoints, ejemplos y códigos HTTP.
* [Responsabilidades](docs/06-responsabilidades.md) y [uso de IA](docs/07-uso-ia.md).
* Reportes de avance: [`docs/reportes/`](docs/reportes/).
* Registros de uso de IA por integrante: [`docs/IAG/`](docs/IAG/).

## Entregables
| Hito | Contenido | Release |
|---|---|---|
| 1 | Análisis y diseño | V1 |
| 2 | Backend básico: POST, GET y pruebas CURL | V2 |
| 3 | API completa: PUT, DELETE, filtros, códigos HTTP y persistencia | V3 |
| 4 | Frontend e integración con la API, sonido con Tone.js | V4 |
| 5 | Pruebas, documentación y plantilla Thymeleaf | V5 |
