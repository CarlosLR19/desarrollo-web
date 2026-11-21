# Reporte de IA Desarrollo en el Proyecto

**Fecha:** 20/11/2026  
**Número de reporte:** 03  
**Integrante:** Nino Alessandro Navarro Lam  
**Entregable:** 4 – Frontend e integración (reporte de actividades R4)

---

# 1. Breve descripción de uso

Se utilizó Claude Code para implementar el sonido del reproductor musical con Tone.js (requisitos RF12 y RF13). La interfaz del reproductor ya existía: recorría los acordes de una progresión con el tempo correcto y los iluminaba en pantalla, pero la función `sonarAcorde` de `frontend/js/reproductor.js` estaba vacía.

La herramienta escribió y probó el código en una copia aparte del proyecto y después entregó instrucciones paso a paso para aplicarlo en el repositorio. Los cambios los aplicó el estudiante a mano:

- cargar Tone.js desde un CDN;
- crear un instrumento por cada opción del selector (piano, guitarra y sintetizador);
- tocar las notas de cada acorde con su duración y volumen;
- activar el audio con `Tone.start()` al dar clic en Reproducir;
- cortar el sonido al detener.

---

# 2. Evidencias de uso

| Evidencia | Formato |
|------------|------------------------|
| Herramienta | Claude Code (Anthropic), aplicación de escritorio |
| Modelo/temperatura | Claude Opus 5.5 (`claude-opus-5-5`) / no configurable en Claude Code |
| Prompt original | [Ver prompt](#prompt-original) |
| Respuesta de IA | [Ver respuesta](#respuesta-de-ia) |
| Código anterior | Commit [`b43b52f`](https://github.com/CarlosLR19/desarrollo-web/commit/b43b52f) |
| Código posterior | Commit [`20182e6`](https://github.com/CarlosLR19/desarrollo-web/commit/20182e6) |
| Diferencias entre versiones | [Ver salida de `git diff --numstat`](#diferencias-entre-versiones) |
| Prueba de funcionamiento | [Ver pruebas](#prueba-de-funcionamiento) |
| Código de uso | Generación / Explicación / Pruebas / Revisión |
| Reflexión del estudiante | [Ver reflexión](#reflexión-del-estudiante) |

> El prompt y la respuesta se copian como subsecciones y se enlazan desde la tabla.

## Prompt original

Indicación para implementar el sonido del reproductor, que estaba pendiente para cumplir RF12 y RF13:

> Tone.js primero

## Respuesta de IA

1. **Implementación en una copia aparte.** Para no modificar el repositorio del estudiante, la herramienta escribió y probó el código en una copia del proyecto.
2. **Instrucciones para aplicarlo.** Se entregaron 4 cambios en 3 archivos.

   - **Cambio 1. Cargar la librería.** En `proyectos.html` y `compartido.html` se agrega Tone.js antes de `reproductor.js`, porque ese archivo usa la variable global `Tone`:

     ```html
     <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
     ```

   - **Cambio 2. Instrumentos y función que suena.** En `reproductor.js` se reemplaza la función vacía `sonarAcorde` por:
     - `crearInstrumento(nombre)`: crea un `Tone.PolySynth` (varias notas a la vez) con distinto oscilador y envolvente para cada opción:

       | Instrumento | Oscilador | Envolvente |
       |---|---|---|
       | Piano | `triangle` | Decaimiento largo |
       | Guitarra | `FMSynth` | Ataque de 2 ms y sustain bajo |
       | Sintetizador | `sawtooth` | Sustain alto |

     - `obtenerInstrumento(nombre)`: crea cada instrumento una sola vez y lo reutiliza.
     - `sonarAcorde(notasConOctava, segundos, configuracion)`:
       - convierte el volumen de 0–100 % a decibeles con `Tone.gainToDb`;
       - toca las notas con `triggerAttackRelease` durante el 95 % de la duración del acorde, para que no se encimen;
       - en la guitarra, cada cuerda entra 30 ms después de la anterior para simular un rasgueo.
     - `silenciar()`: suelta todas las notas con `releaseAll()`.

   - **Cambio 3. Activar el audio.** `reproducir()` se vuelve `async` y llama `await Tone.start()` dentro del clic, porque los navegadores bloquean el audio hasta que el usuario interactúa. Si Tone.js no cargó, avisa en pantalla y reproduce sin sonido.

   - **Cambio 4. Detener el sonido.** `detener()` llama `silenciar()` para cortar el acorde que esté sonando.

3. **Explicación.** Se explicó cómo se relacionan el tiempo del reproductor y el sonido:
   - un pulso dura `60 / tempo` segundos;
   - el reproductor decide cuándo cambia el acorde;
   - Tone.js solo produce el sonido de cada uno con las `notasConOctava` que entrega el backend.

## Diferencias entre versiones

```
$ git diff --numstat b43b52f 20182e6 -- frontend/js/reproductor.js frontend/proyectos.html
77	14	frontend/js/reproductor.js
1	0	frontend/proyectos.html
```

## Prueba de funcionamiento

La herramienta probó el código en la copia aparte, con el backend en ejecución y el frontend en `http://localhost:5500`. Los clics sobre el botón Reproducir se hicieron en el navegador.

| Prueba | Resultado |
|---|---|
| Carga de la librería | `Tone.version` = `14.8.49` |
| Activación del audio al dar clic | `Tone.context.state` = `running` |
| Acorde F7 con piano | Se tocaron `F4 A4 C5 D#5` durante 2.28 s (4 pulsos a 100 BPM × 0.95) |
| Progresión de 4 acordes con guitarra a 240 BPM | 12 notas tocadas (3 por acorde, rasgueadas) |
| Progresión con sintetizador | Cada acorde se tocó 0.95 s (4 pulsos a 240 BPM × 0.95) |
| Botón Detener | El estado regresa a "Detenido" y se cortan las notas |
| Consola del navegador | Sin errores |

Al revisar el commit `20182e6`, la herramienta detectó errores al aplicar las instrucciones a mano:

- faltaba `async` en `reproducir()`, lo que provoca un error de sintaxis y que no cargue ningún reproductor;
- se borró la función `crearCampo`;
- quedó duplicada la apertura de `detener()`;
- faltó agregar Tone.js en `compartido.html`.

Se corrigen en el commit siguiente.

## Reflexión del estudiante

`<Escribe aquí tu reflexión sobre lo que aprendiste al implementar Tone.js.>`

---

## Observaciones adicionales

- Las consultas de esta sesión se registran en [r-ia-doc-03.md](r-ia-doc-03.md): qué hace cada cambio, cómo ejecutar el proyecto y el error de acceso a MySQL.
- Tone.js se carga desde cdnjs, así que el sonido necesita conexión a internet. Si la librería no carga, el reproductor sigue funcionando sin sonido y lo indica en pantalla.
