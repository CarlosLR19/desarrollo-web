// ==========================================
// REPRODUCTOR MUSICAL (RF12, RF13)
// Barra con: Reproducir / Detener, selector de instrumento
// y configuración de reproducción (tempo, volumen, repetir).
//
// Por ahora NO suena: recorre los acordes con el tiempo correcto
// y avisa qué acorde "está sonando" para iluminarlo en pantalla.
// El sonido con Tone.js se conecta después en la función sonarAcorde.
// ==========================================

(() => {

    const CLAVE_CONFIGURACION = "chordlab.reproduccion";

    const INSTRUMENTOS = [
        { valor: "piano", texto: "Piano" },
        { valor: "guitarra", texto: "Guitarra" },
        { valor: "sintetizador", texto: "Sintetizador" }
    ];

    // La configuración se recuerda en este navegador (instrumento, volumen y repetir)
    function leerConfiguracion() {
        try {
            const guardada = JSON.parse(localStorage.getItem(CLAVE_CONFIGURACION));
            return { instrumento: "piano", volumen: 80, repetir: false, ...guardada };
        } catch {
            return { instrumento: "piano", volumen: 80, repetir: false };
        }
    }

    function guardarConfiguracion(configuracion) {
        try {
            localStorage.setItem(CLAVE_CONFIGURACION, JSON.stringify(configuracion));
        } catch {
            // Si el navegador no deja guardar, solo se pierde la preferencia
        }
    }

        // ==========================================
    // SONIDO CON TONE.JS
    // Cada instrumento es un PolySynth (varias notas a la vez)
    // con distinto oscilador y envolvente. Se crean una sola vez.
    // ==========================================

    const instrumentos = {};

    function crearInstrumento(nombre) {
        if (nombre === "guitarra") {
            // Ataque rápido y caída corta: suena "pulsado"
            return new Tone.PolySynth(Tone.FMSynth, {
                harmonicity: 2,
                modulationIndex: 3,
                envelope: { attack: 0.002, decay: 0.5, sustain: 0.1, release: 0.8 }
            }).toDestination();
        }

        if (nombre === "sintetizador") {
            // Onda de sierra con entrada suave
            return new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "sawtooth" },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.6 }
            }).toDestination();
        }

        // Piano (por defecto): onda triangular que se apaga poco a poco
        return new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.005, decay: 0.8, sustain: 0.25, release: 1.2 }
        }).toDestination();
    }

    function obtenerInstrumento(nombre) {
        if (!instrumentos[nombre]) {
            instrumentos[nombre] = crearInstrumento(nombre);
        }
        return instrumentos[nombre];
    }

    // Recibe las notas ("C4", "E4"...), la duración en segundos y la configuración
    function sonarAcorde(notasConOctava, segundos, configuracion) {
        if (!window.Tone || notasConOctava.length === 0) {
            return;
        }

        const instrumento = obtenerInstrumento(configuracion.instrumento);

        // Volumen: 0–100 % se convierte a decibeles (100 % = 0 dB)
        instrumento.volume.value = Tone.gainToDb(configuracion.volumen / 100);

        // Se suelta un poco antes del siguiente acorde para que no se encimen
        const duracion = Math.max(0.1, segundos * 0.95);

        if (configuracion.instrumento === "guitarra") {
            // Rasgueo: cada cuerda entra 30 ms después de la anterior
            notasConOctava.forEach((nota, i) => {
                instrumento.triggerAttackRelease(nota, duracion, Tone.now() + i * 0.03);
            });
        } else {
            instrumento.triggerAttackRelease(notasConOctava, duracion);
        }
    }

    // Corta las notas que sigan sonando
    function silenciar() {
        Object.values(instrumentos).forEach(instrumento => instrumento.releaseAll());
    }

        function crearCampo(etiqueta, control) {
        const campo = document.createElement("label");
        campo.className = "reproductor-campo";

        const texto = document.createElement("span");
        texto.textContent = etiqueta;

        campo.append(texto, control);
        return campo;
    }


    // contenedor: div donde se dibuja la barra
    // opciones.obtenerSecuencia(): [{ etiqueta: "Am", notasConOctava: [...], pulsos: 4 }]
    // opciones.tempo: BPM inicial
    // opciones.alCambiarAcorde(indice, elemento): se llama cada vez que "suena" un acorde
    // opciones.alTerminar(): se llama cuando termina o se detiene
    function crear(contenedor, opciones) {

        const configuracion = leerConfiguracion();
        let temporizador = null;
        let indiceActual = -1;
        let secuencia = [];

        contenedor.replaceChildren();
        contenedor.classList.add("reproductor");

        // Controles principales
        const btnReproducir = document.createElement("button");
        btnReproducir.type = "button";
        btnReproducir.className = "boton-principal boton-reproducir";
        btnReproducir.textContent = "▶ Reproducir";

        const btnDetener = document.createElement("button");
        btnDetener.type = "button";
        btnDetener.className = "boton-secundario";
        btnDetener.textContent = "■ Detener";
        btnDetener.disabled = true;

        // Selector de instrumentos (RF13)
        const selectInstrumento = document.createElement("select");
        INSTRUMENTOS.forEach(instrumento => {
            const opcion = document.createElement("option");
            opcion.value = instrumento.valor;
            opcion.textContent = instrumento.texto;
            selectInstrumento.appendChild(opcion);
        });
        selectInstrumento.value = configuracion.instrumento;

        const btnConfiguracion = document.createElement("button");
        btnConfiguracion.type = "button";
        btnConfiguracion.className = "boton-secundario";
        btnConfiguracion.textContent = "⚙ Configuración";

        const fila = document.createElement("div");
        fila.className = "reproductor-fila";
        fila.append(
            btnReproducir,
            btnDetener,
            crearCampo("Instrumento", selectInstrumento),
            btnConfiguracion
        );

        // Configuración de reproducción
        const inputTempo = document.createElement("input");
        inputTempo.type = "number";
        inputTempo.min = 20;
        inputTempo.max = 300;
        inputTempo.value = opciones.tempo ?? 100;

        const inputVolumen = document.createElement("input");
        inputVolumen.type = "range";
        inputVolumen.min = 0;
        inputVolumen.max = 100;
        inputVolumen.value = configuracion.volumen;

        const textoVolumen = document.createElement("span");
        textoVolumen.className = "reproductor-valor";
        textoVolumen.textContent = configuracion.volumen + "%";

        const checkRepetir = document.createElement("input");
        checkRepetir.type = "checkbox";
        checkRepetir.checked = configuracion.repetir;

        const campoVolumen = crearCampo("Volumen", inputVolumen);
        campoVolumen.appendChild(textoVolumen);

        const campoRepetir = document.createElement("label");
        campoRepetir.className = "reproductor-check";
        campoRepetir.append(checkRepetir, document.createTextNode(" Repetir en bucle"));

        const panelConfiguracion = document.createElement("div");
        panelConfiguracion.className = "reproductor-configuracion oculto";
        panelConfiguracion.append(
            crearCampo("Tempo (BPM)", inputTempo),
            campoVolumen,
            campoRepetir
        );

        // Estado y barra de avance
        const estado = document.createElement("p");
        estado.className = "reproductor-estado";
        estado.textContent = "Detenido";

        const barra = document.createElement("div");
        barra.className = "reproductor-barra";
        const avance = document.createElement("div");
        avance.className = "reproductor-avance";
        barra.appendChild(avance);

        contenedor.append(fila, panelConfiguracion, barra, estado);

        function actualizarConfiguracion() {
            configuracion.instrumento = selectInstrumento.value;
            configuracion.volumen = Number(inputVolumen.value);
            configuracion.repetir = checkRepetir.checked;
            textoVolumen.textContent = configuracion.volumen + "%";
            guardarConfiguracion(configuracion);
        }

        function tempoActual() {
            const tempo = Number(inputTempo.value);
            return tempo >= 20 && tempo <= 300 ? tempo : 100;
        }

        function tocar(indice) {
            if (indice >= secuencia.length) {
                if (configuracion.repetir && secuencia.length > 0) {
                    indice = 0;
                } else {
                    detener("Reproducción terminada");
                    return;
                }
            }

            indiceActual = indice;
            const elemento = secuencia[indice];

            // Un pulso dura 60 / tempo segundos
            const segundos = (Number(elemento.pulsos) || 4) * 60 / tempoActual();

            sonarAcorde(elemento.notasConOctava ?? [], segundos, { ...configuracion });

            const instrumento = selectInstrumento.selectedOptions[0].textContent;
            estado.textContent = `Sonando ${elemento.etiqueta} (${indice + 1} de ${secuencia.length}) · ${instrumento}`;
            avance.style.width = ((indice + 1) / secuencia.length * 100) + "%";

            opciones.alCambiarAcorde?.(indice, elemento);

            temporizador = setTimeout(() => tocar(indice + 1), segundos * 1000);
        }

        async function reproducir() {
            secuencia = opciones.obtenerSecuencia() ?? [];

            if (secuencia.length === 0) {
                estado.textContent = "No hay acordes para reproducir.";
                return;
            }

            detener();
            btnReproducir.disabled = true;
            btnDetener.disabled = false;
                        contenedor.classList.add("reproduciendo");

            // El navegador solo deja sonar audio después de un clic del usuario:
            // Tone.start() activa el audio y se llama dentro del clic de "Reproducir"
            if (window.Tone) {
                await Tone.start();
            } else {
                estado.textContent = "No se pudo cargar Tone.js: se reproduce sin sonido.";
            }

            tocar(0);
        }

        function detener(texto = "Detenido") {
            clearTimeout(temporizador);
            temporizador = null;
            silenciar();

            const estabaSonando = indiceActual >= 0;
            indiceActual = -1;

            btnReproducir.disabled = false;
            btnDetener.disabled = true;
            contenedor.classList.remove("reproduciendo");
            avance.style.width = "0";
            estado.textContent = texto;

            if (estabaSonando) {
                opciones.alTerminar?.();
            }
        }

        btnReproducir.addEventListener("click", reproducir);
        btnDetener.addEventListener("click", () => detener());

        btnConfiguracion.addEventListener("click", () => {
            panelConfiguracion.classList.toggle("oculto");
        });

        selectInstrumento.addEventListener("change", actualizarConfiguracion);
        inputVolumen.addEventListener("input", actualizarConfiguracion);
        checkRepetir.addEventListener("change", actualizarConfiguracion);

        return {
            detener: () => detener(),
            cambiarTempo: (tempo) => { inputTempo.value = tempo; },
            configuracion: () => ({ ...configuracion, tempo: tempoActual() })
        };
    }

    window.ReproductorChordLab = { crear, INSTRUMENTOS };

})();
