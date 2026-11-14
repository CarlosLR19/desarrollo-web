# r-ia-doc – Consultas de dudas (César Rodrigo Díaz Hernández)

Consultas de apoyo para instalar MySQL dentro de WSL y configurar el proyecto Spring Boot de ChordLab. Herramienta: ChatGPT (OpenAI), modelo GPT-6. No se generó código de la aplicación en estas consultas.

| Fecha | Herramienta | Prompt original | Respuesta IA |
|---|---|---|---|
| 13/11/2026 | ChatGPT | "oye como puedo instalar mysql y correrlo dentro de wsl?" | Indicó instalar MySQL con `sudo apt install mysql-server -y`, iniciar el servicio mediante `sudo service mysql start` y acceder al gestor con `sudo mysql`. También proporcionó comandos para comprobar el estado del servicio (`sudo service mysql status`), consultar las bases de datos (`SHOW DATABASES;`) y detener o reiniciar MySQL. |
| 13/11/2026 | ChatGPT | "ya cree mi pom.xml dentro de https://start.spring.io/, lo descargue en .zip, ahora dime los comandos para meterlo dentro de mi proyecto: cesar@Cesar5:/mnt/c/Users/cesar/Desktop/tomyork/desarrollo-web/backend" | Indicó identificar el nombre del archivo ZIP, revisar su contenido con `unzip -l`, extraerlo en una carpeta temporal mediante `unzip` y copiar los archivos a `backend/` con `cp -a`. Finalmente, explicó cómo comprobar la estructura del proyecto con `ls -la` y ejecutarlo mediante `./mvnw spring-boot:run`. |
| 13/11/2026 | ChatGPT | "me salió anidada la carpeta mira: cesar@Cesar5:/mnt/c/Users/cesar/Desktop/tomyork/desarrollo-web$ ls backend chordlab. ¿Cómo muevo los archivos?" | Explicó que los archivos del proyecto habían quedado dentro de una carpeta adicional llamada `chordlab`. Indicó mover su contenido un nivel arriba utilizando `shopt -s dotglob` y `mv chordlab/* .`, para después eliminar la carpeta vacía con `rmdir chordlab`. También explicó que así `pom.xml`, `mvnw` y `src/` quedarían directamente dentro de `backend/`. |

## Verificación

Las consultas permitieron obtener instrucciones para instalar y ejecutar MySQL dentro de WSL, incorporar el proyecto generado desde Spring Initializr y organizar correctamente los archivos de Spring Boot dentro de la carpeta `backend/` de ChordLab.