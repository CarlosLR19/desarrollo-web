# Reporte de Uso Documental en el Proyecto

**Fecha:** 20/11/2026  
**Número de reporte:** 03  
**Integrante:** Nino Alessandro Navarro Lam  
**Entregable:** 4 – Frontend e integración (reporte de actividades R4)

---

# 1. Breve descripción de uso

Las consultas tuvieron dos objetivos: entender el código de Tone.js que se agregó al reproductor musical, y ejecutar el sistema completo en WSL. Se preguntó:

- qué hace cada cambio de la implementación;
- cómo levantar la base de datos, el backend y el frontend;
- cómo resolver el error de acceso a MySQL que impedía arrancar el backend.

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
| 20/11/2026 | Claude Code (Anthropic) | [Prompt 1](#prompt-1) | [Respuesta 1](#respuesta-1) |
| 20/11/2026 | Claude Code (Anthropic) | [Prompt 2](#prompt-2) | [Respuesta 2](#respuesta-2) |
| 20/11/2026 | Claude Code (Anthropic) | [Prompt 3](#prompt-3) | [Respuesta 3](#respuesta-3) |

> El prompt y la respuesta se copian como subsecciones y se enlazan desde la tabla.

## Consulta 1. Funcionamiento de la implementación de Tone.js

### Prompt 1

¿Y qué hace cada cosa que cambiamos?

### Respuesta 1

Claude explicó cada uno de los cambios hechos para que el reproductor suene.

**1. Carga de la librería**

- La etiqueta `<script>` descarga Tone.js desde un CDN y crea la variable global `Tone`.
- Debe ir antes de `reproductor.js`, porque el navegador ejecuta los scripts en orden.

**2. Instrumentos**

- `Tone.PolySynth` permite tocar varias notas al mismo tiempo, que es lo que necesita un acorde.
- Cada instrumento usa un **oscilador** distinto, que da el color del sonido:

  | Instrumento | Oscilador | Cómo suena |
  |---|---|---|
  | Piano | Onda triangular | Suave |
  | Sintetizador | Onda de sierra | Brillante |
  | Guitarra | FM | Más metálico |

- La **envolvente** define cómo nace y muere el sonido:

  | Parte | Qué controla |
  |---|---|
  | `attack` | Cuánto tarda en llegar al volumen máximo |
  | `decay` | Cuánto tarda en bajar después del golpe |
  | `sustain` | El nivel que mantiene mientras la nota sigue |
  | `release` | Cuánto tarda en apagarse al soltarla |

- `.toDestination()` conecta el instrumento a las bocinas.
- Los instrumentos se guardan en un objeto para crearlos una sola vez.

**3. Función que suena**

- `Tone.gainToDb` convierte el volumen de 0–100 % a decibeles.
- La duración se reduce al 95 % para que los acordes no se encimen.
- `triggerAttackRelease` toca las notas y las suelta después de la duración indicada.
- En la guitarra, cada nota entra 30 ms después de la anterior, usando `Tone.now()`, para simular un rasgueo.

**4. Activación del audio**

- Los navegadores bloquean el audio hasta que el usuario hace clic.
- `Tone.start()` lo desbloquea y se llama dentro del clic de Reproducir.
- `await` espera a que el audio esté activo antes de tocar el primer acorde, por eso la función se marca como `async`.

**5. Detener**

`silenciar()` suelta las notas con `releaseAll()`, para que el botón Detener corte también el acorde que está sonando.

**Aplicación en el proyecto:** la explicación permitió entender la relación entre el tiempo del reproductor, que es de `pulsos × 60 / tempo` segundos por acorde, y el sonido que produce Tone.js con las `notasConOctava` del backend. También sirve como preparación para la defensa técnica individual.

---

## Consulta 2. Ejecución del sistema completo

### Prompt 2

¿Cómo lo corro?

### Respuesta 2

Claude indicó que el sistema necesita tres procesos en WSL, cada uno en su propia terminal.

**1. Base de datos**

- Se inicia con `sudo service mysql start`.
- Solo la primera vez se crean la base de datos `chordlab`, el usuario `chordlab` y sus permisos, y se carga `database/esquema.sql`.

**2. Backend**

- Desde `backend/` se exporta `DB_PASSWORD`, porque `application.properties` lee de ahí la contraseña.
- Después se ejecuta `mvn spring-boot:run`.
- La API queda en `http://localhost:8090/api` y se comprueba abriendo `/api/musica/catalogo`.

**3. Frontend**

- Desde `frontend/` se ejecuta `python3 -m http.server 5500`.
- La aplicación se abre en `http://localhost:5500/login.html`.

También se explicaron los errores más comunes:

| Error | Causa |
|---|---|
| `Access denied` | Contraseña incorrecta o falta el `export` |
| Puerto 8090 ocupado | Quedó otro backend en ejecución |
| No suena | Falta recargar la página o no hay conexión para descargar Tone.js |

Además, se señaló que el README todavía indica el puerto 8080 y menciona un archivo `js/app.js` que ya no existe.

**Aplicación en el proyecto:** se identificó el orden correcto para levantar el sistema y probar la integración del frontend con la API real.

---

## Consulta 3. Error de acceso a MySQL al iniciar el backend

### Prompt 3

Se compartió la salida de `mvn spring-boot:run`. El proyecto compilaba, pero el arranque terminaba con este error:

```
Access denied for user 'chordlab'@'localhost' (using password: YES)
Unable to determine Dialect without JDBC metadata
```

### Respuesta 3

Claude explicó que el backend compila y arranca, pero se detiene al conectarse a MySQL. El error de dialecto es una consecuencia del primero: como Hibernate no pudo conectarse, no pudo saber qué base de datos usar. Las causas posibles son que el usuario `chordlab` no exista o que la contraseña de `DB_PASSWORD` no coincida con la de MySQL.

Para resolverlo, indicó estos pasos:

1. Verificar que el usuario y la base de datos existan con una consulta a `mysql.user`.
2. Crear o corregir el usuario como administrador con `sudo mysql`: `CREATE DATABASE IF NOT EXISTS`, `CREATE USER IF NOT EXISTS`, `ALTER USER ... IDENTIFIED BY`, `GRANT ALL PRIVILEGES ON chordlab.*` y `FLUSH PRIVILEGES`.
3. Comprobar la contraseña conectándose con `mysql -u chordlab -p`.
4. Exportar la misma contraseña en `DB_PASSWORD`, en la misma terminal donde se ejecuta Maven. Si se quiere evitar repetirlo, se puede agregar a `~/.bashrc`.

**Aplicación en el proyecto:** se entendió cómo se relacionan el usuario de MySQL, la variable de entorno `DB_PASSWORD` y la configuración de Spring Boot, y cómo diagnosticar un error de arranque a partir de la primera excepción del registro.

---

## Observaciones adicionales

Las consultas se hicieron en la misma sesión de Claude Code en la que se implementó el sonido del reproductor. Esa implementación se registra por separado en [r-ia-dev-03.md](r-ia-dev-03.md).

La información se usó como apoyo para entender el código antes de aplicarlo y para preparar el entorno de pruebas del sistema completo.

**Herramienta registrada:** Claude Code (Anthropic), modelo Claude Opus 5.5.
