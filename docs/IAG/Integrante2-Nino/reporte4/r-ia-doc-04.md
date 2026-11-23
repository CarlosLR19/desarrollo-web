# Reporte de Uso Documental en el Proyecto

**Fecha:** 22/11/2026  
**Número de reporte:** 04  
**Integrante:** Nino Alessandro Navarro Lam  
**Entregable:** 5 – Pruebas y documentación (reporte de actividades R5)

---

# 1. Breve descripción de uso

Las consultas tuvieron como objetivo comprobar que el proyecto se puede clonar y ejecutar en otro entorno WSL siguiendo solo el README, como lo pide el proyecto final, y resolver los problemas que aparecieron en el proceso:

- la escritura de la tilde en la terminal;
- GitHub pidiendo usuario al clonar;
- la contraseña del usuario de MySQL.

También se consultó cómo traer los cambios de los compañeros sin perder el trabajo local cuando dos integrantes crearon el mismo archivo.

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
| 22/11/2026 | Claude Code (Anthropic) | [Prompt 1](#prompt-1) | [Respuesta 1](#respuesta-1) |
| 22/11/2026 | Claude Code (Anthropic) | [Prompt 2](#prompt-2) | [Respuesta 2](#respuesta-2) |
| 22/11/2026 | Claude Code (Anthropic) | [Prompt 3](#prompt-3) | [Respuesta 3](#respuesta-3) |
| 22/11/2026 | Claude Code (Anthropic) | [Prompt 4](#prompt-4) | [Respuesta 4](#respuesta-4) |
| 22/11/2026 | Claude Code (Anthropic) | [Prompt 5](#prompt-5) | [Respuesta 5](#respuesta-5) |
| 22/11/2026 | Claude Code (Anthropic) | [Prompt 6](#prompt-6) | [Respuesta 6](#respuesta-6) |

> El prompt y la respuesta se copian como subsecciones y se enlazan desde la tabla.

## Consulta 1. Guía para verificar la ejecución en WSL

### Prompt 1

¿Cómo compruebo lo de ejecución en WSL paso a paso?

### Respuesta 1

Claude explicó que la verificación consiste en repetir lo que haría el profesor: clonar el repositorio en una carpeta nueva y ejecutarlo siguiendo solo el README. Si algún paso falla, ese es el defecto que hay que corregir. Recomendó que, de ser posible, lo hiciera otro integrante en su propio equipo, para que fuera realmente "otro entorno".

Propuso estos pasos, con una captura en cada uno:

0. Liberar los puertos 8090 y 5500 con `fuser -k`.
1. Clonar dentro de la carpeta personal de Linux (`~/verificacion`), no en `/mnt/c`, y revisar `git log`.
2. Comprobar las versiones de Java, Maven y MySQL.
3. Iniciar MySQL y comprobar las tablas con el usuario `chordlab`.
4. Exportar `DB_PASSWORD` y ejecutar `mvn spring-boot:run`.
5. Abrir `/api/musica/catalogo` y `/api/pagina`.
6. Servir el frontend con `python3 -m http.server 5500`, registrarse, crear un proyecto con una progresión y reproducirla.
7. Ejecutar `bash pruebas/curl-entregable3.sh`.
8. Reiniciar el backend y comprobar que los datos siguen ahí (persistencia).

Al final, guardar las capturas en `docs/evidencias/entregable5/` del repositorio de trabajo y borrar la carpeta de prueba.

**Aplicación en el proyecto:** se siguió la guía y se completaron los 8 pasos. Las capturas se agregaron como evidencia del Entregable 5.

---

## Consulta 2. Escritura de la tilde en la terminal

### Prompt 2

¿Cómo hago el gusanito después de `cd`?

### Respuesta 2

Claude explicó que el "gusanito" es la tilde `~`, que en Linux representa la carpeta personal del usuario (`/home/ninoa`). Se escribe así:

| Teclado | Combinación |
|---|---|
| Español latinoamericano | `AltGr` + la tecla `+`, junto a la `Ñ` |
| Cualquiera, con teclado numérico | `Alt` + `126` |
| Español de España | `AltGr` + `4` |

También explicó que no es indispensable: `$HOME`, la ruta completa `/home/ninoa` o `cd` sin argumentos llevan a la misma carpeta.

**Aplicación en el proyecto:** se pudieron escribir los comandos de la guía para crear la carpeta `~/verificacion`.

---

## Consulta 3. GitHub pide usuario al clonar

### Prompt 3

Si me pide username for https github

### Respuesta 3

Claude comprobó que el repositorio es público, porque GitHub responde sin pedir sesión, así que clonarlo no requiere credenciales. Explicó que cuando un repositorio público pide usuario, casi siempre es porque la URL tiene un error: GitHub responde igual que si el repositorio fuera privado o no existiera.

Indicó:

- cancelar con `Ctrl + C`, sin escribir credenciales;
- revisar la URL letra por letra: las mayúsculas de `CarlosLR19`, el guion medio y la terminación `.git`;
- pegarla en lugar de escribirla;
- no usar la contraseña de la cuenta, porque GitHub ya no la acepta para `git`.

**Aplicación en el proyecto:** el error era que se había escrito `desarrollo-web-git` en lugar de `desarrollo-web.git`. Con la URL correcta, el clon se descargó sin credenciales.

---

## Consulta 4. Contraseña de MySQL en la verificación

### Prompt 4

Se compartieron las capturas de los pasos 1 y 2 (clon y versiones), con la pregunta:

> y me pidió una contraseña en el show tables

### Respuesta 4

Claude confirmó que los pasos 1 y 2 estaban completos. Explicó que el primer intento de clonar pidió usuario por el error en la URL, y que la salida `5500/tcp: 12908` correspondía al proceso que se cerró para liberar el puerto.

Sobre la contraseña, explicó que la opción `-p` de `mysql` pide la contraseña del usuario `chordlab` de MySQL, no la de Ubuntu ni la de GitHub, y que es la misma que se usa en `DB_PASSWORD`. Si no se recuerda, se puede asignar una nueva como administrador:

1. Con `sudo mysql`, ejecutar `CREATE DATABASE IF NOT EXISTS`, `CREATE USER IF NOT EXISTS`, `ALTER USER ... IDENTIFIED BY`, `GRANT ALL PRIVILEGES` y `FLUSH PRIVILEGES`.
2. Volver a probar con `mysql -u chordlab -p`.
3. Si no hay tablas, cargarlas con `database/esquema.sql`.

**Aplicación en el proyecto:** los dos primeros intentos fallaron por escribir mal la contraseña. Al tercero se mostraron las 6 tablas de `chordlab`.

---

## Consulta 5. Revisión de los resultados de la verificación

### Prompt 5

Se compartieron las capturas de los pasos 3 a 7: las tablas de MySQL, el backend iniciado, el catálogo de la API, la página Thymeleaf, el frontend con un proyecto, el generador con el piano y la guitarra, y el resultado del script CURL.

### Respuesta 5

Claude revisó cada captura y confirmó el resultado de cada paso:

- las 6 tablas de la base de datos;
- `Started ChordlabApplication` en el puerto 8090, con MySQL;
- el JSON del catálogo y la tabla de `/api/pagina`;
- el registro de un usuario nuevo con su proyecto, y una progresión D–Bm–Em–A con su teclado y su diagrama de guitarra;
- `RESULTADO: 60 correctas, 0 con fallo`.

Explicó que los dos errores `Access denied` anteriores fueron solo la contraseña mal escrita.

Para el paso 8 indicó: detener el backend con `Ctrl + C`, volver a ejecutar `mvn spring-boot:run` y recargar Mis proyectos para comprobar que el proyecto sigue guardado. También sugirió una captura adicional del editor de progresiones, porque la que se tenía era del generador.

**Aplicación en el proyecto:** se completó el paso 8; el proyecto seguía en la lista después de reiniciar el backend.

---

## Consulta 6. Traer los cambios de los compañeros sin perder el trabajo local

### Prompt 6

Oye, es que hicieron commits ellos, ¿cómo le hago para que no se borre nada y siga todo implementado, o para hacer pull sin que se borre nada de lo que hicimos?

### Respuesta 6

Claude revisó el repositorio con `git fetch` antes de responder. Encontró un commit nuevo de César (`0ef2139`) con dos archivos:

| Archivo | Situación |
|---|---|
| `r-act-05.md` | César creó su propia versión, con el mismo nombre que la versión local, que aún no estaba en ningún commit. Git se negaría a hacer el `pull` para no sobrescribirla |
| `pruebas.md` | César la reorganizó a partir de la versión corregida. Conservaba las correcciones y arreglaba una nota al pie que había quedado en medio de una tabla, así que convenía aceptarla |
| Capturas de `entregable5/` | Son archivos nuevos que César no tenía, así que no había conflicto |

Propuso estos pasos:

1. Renombrar la versión local para guardarla aparte con `mv`.
2. Hacer `git pull`.
3. Comprobar que estuvieran las dos versiones y las capturas.
4. Combinarlas en un solo reporte antes de hacer commit.

**Aplicación en el proyecto:** se siguieron los pasos sin perder ningún archivo. Las dos versiones del reporte se combinaron después; la generación de ese contenido se registra en [r-ia-dev-04.md](r-ia-dev-04.md).

---

## Observaciones adicionales

Las consultas se hicieron en la misma sesión de Claude Code en la que se combinaron los reportes. Los comandos se ejecutaron en el equipo del estudiante, y la herramienta revisó los resultados a partir de las capturas compartidas.

Las consultas permitieron completar la actividad "Verificar ejecución en WSL" del Entregable 5. También ayudaron a entender cómo se relacionan el usuario de MySQL y la variable `DB_PASSWORD`, y cómo integrar en Git el trabajo de varios integrantes sin perder cambios.

**Herramienta registrada:** Claude Code (Anthropic), modelo Claude Opus 5.5.
