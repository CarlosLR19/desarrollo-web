
(() => {

    // ==========================================
    // ELEMENTOS DEL GENERADOR DE ACORDES
    // ==========================================

    const fundamentalAcorde = document.getElementById("fundamentalAcorde");
    const tipoAcorde = document.getElementById("tipoAcorde");
    const inversionAcorde = document.getElementById("inversionAcorde");

    const btnGenerarAcorde = document.getElementById("btnGenerarAcorde");
    const mensajeGenerador = document.getElementById("mensajeGenerador");

    const resultadoAcorde = document.getElementById("resultadoAcorde");
    const nombreAcorde = document.getElementById("nombreAcorde");
    const simboloAcorde = document.getElementById("simboloAcorde");
    const notasAcorde = document.getElementById("notasAcorde");

    const tecladoPiano = document.getElementById("tecladoPiano");


    // ==========================================
    // ELEMENTOS DEL GENERADOR DE PROGRESIONES
    // ==========================================

    const tonalidadProgresion = document.getElementById("tonalidadProgresion");
    const escalaProgresion = document.getElementById("escalaProgresion");
    const estiloProgresion = document.getElementById("estiloProgresion");

    const cantidadProgresion = document.getElementById("cantidadProgresion");
    const btnGenerarProgresion = document.getElementById("btnGenerarProgresion");

    const mensajeProgresion = document.getElementById("mensajeProgresion");
    const resultadoProgresion = document.getElementById("resultadoProgresion");
    const resumenProgresion = document.getElementById("resumenProgresion");
    const listaProgresion = document.getElementById("listaProgresion");


    // ==========================================
    // CARGAR CATÁLOGO MUSICAL
    // ==========================================

    async function cargarCatalogoGenerador() {

        try {

            const catalogo = await peticionAPI("/musica/catalogo");

            // Opciones para generar acordes
            fundamentalAcorde.replaceChildren();
            tipoAcorde.replaceChildren();

            catalogo.notas.forEach(nota => {

                const opcion = document.createElement("option");
                opcion.value = nota;
                opcion.textContent = nota;

                fundamentalAcorde.appendChild(opcion);

            });

            catalogo.tipos.forEach(tipo => {

                const opcion = document.createElement("option");
                opcion.value = tipo;
                opcion.textContent = tipo;

                tipoAcorde.appendChild(opcion);

            });


            // Opciones para generar progresiones
            tonalidadProgresion.replaceChildren();
            escalaProgresion.replaceChildren();
            estiloProgresion.replaceChildren();

            catalogo.notas.forEach(nota => {

                const opcion = document.createElement("option");
                opcion.value = nota;
                opcion.textContent = nota;

                tonalidadProgresion.appendChild(opcion);

            });

            catalogo.escalas.forEach(escala => {

                const opcion = document.createElement("option");
                opcion.value = escala;
                opcion.textContent = escala;

                escalaProgresion.appendChild(opcion);

            });

            catalogo.estilos.forEach(estilo => {

                const opcion = document.createElement("option");
                opcion.value = estilo;
                opcion.textContent = estilo;

                estiloProgresion.appendChild(opcion);

            });

        } catch (error) {

            mensajeGenerador.textContent =
                "No fue posible cargar el catálogo musical.";

            mensajeProgresion.textContent =
                "No fue posible cargar el catálogo musical.";

        }

    }


    // ==========================================
    // TECLADO VIRTUAL
    // ==========================================

    function normalizarNota(nota) {

        return nota
            .replace("♯", "#")
            .replace("♭", "b")
            .replace("♮", "");

    }


    function crearTeclado(notasAcorde) {

        tecladoPiano.replaceChildren();

        const notasBlancas = ["C", "D", "E", "F", "G", "A", "B"];
        const notasNegras = ["C#", "D#", "F#", "G#", "A#"];

        const notasActivas = notasAcorde.map(normalizarNota);

        for (let octava = 3; octava <= 4; octava++) {

            notasBlancas.forEach(nota => {

                const tecla = document.createElement("div");
                tecla.className = "tecla-blanca";

                const nombreNota = nota + octava;

                if (notasActivas.includes(normalizarNota(nota))) {
                    tecla.classList.add("activa");
                }

                tecla.title = nombreNota;

                tecladoPiano.appendChild(tecla);


                if (notasNegras.includes(nota + "#")) {

                    const teclaNegra = document.createElement("div");

                    teclaNegra.className = "tecla-negra";
                    teclaNegra.title = nota + "#" + octava;

                    if (notasActivas.includes(normalizarNota(nota + "#"))) {
                        teclaNegra.classList.add("activa");
                    }

                    tecladoPiano.appendChild(teclaNegra);

                }

            });

        }

    }


    // ==========================================
    // GENERAR ACORDE
    // ==========================================

    async function generarAcorde() {

        mensajeGenerador.textContent = "Generando acorde...";
        resultadoAcorde.classList.add("oculto");

        const datos = {

            fundamental: fundamentalAcorde.value,
            tipo: tipoAcorde.value,
            inversion: Number(inversionAcorde.value)

        };

        try {

            const acorde = await peticionAPI(
                "/musica/acordes/generar",
                "POST",
                datos
            );

            nombreAcorde.textContent = acorde.nombre;
            simboloAcorde.textContent = acorde.simbolo;

            notasAcorde.replaceChildren();

            acorde.notas.forEach(nota => {

                const elemento = document.createElement("span");

                elemento.textContent = nota;
                elemento.className = "nota-acorde";

                notasAcorde.appendChild(elemento);

            });

            // Mostrar las notas en el teclado virtual
            crearTeclado(acorde.notas);

            resultadoAcorde.classList.remove("oculto");

            mensajeGenerador.textContent =
                "Acorde generado correctamente.";

        } catch (error) {

            mensajeGenerador.textContent = error.message;

        }

    }


    // ==========================================
    // GENERAR PROGRESIÓN ARMÓNICA
    // ==========================================

    async function generarProgresion() {

        mensajeProgresion.textContent = "Generando progresión...";
        resultadoProgresion.classList.add("oculto");

        const datos = {

            tonalidad: tonalidadProgresion.value,
            escala: escalaProgresion.value,
            cantidadAcordes: Number(cantidadProgresion.value),
            estilo: estiloProgresion.value

        };

        try {

            const respuesta = await peticionAPI(
                "/musica/progresiones/generar",
                "POST",
                datos
            );

            // Mostrar información general
            resumenProgresion.textContent =
                `Tonalidad: ${respuesta.tonalidad} | ` +
                `Escala: ${respuesta.escala} | ` +
                `Estilo: ${respuesta.estilo}`;

            // Limpiar resultados anteriores
            listaProgresion.replaceChildren();

            // Crear una tarjeta para cada acorde
            respuesta.progresion.forEach(acorde => {

                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta-acorde";

                const grado = document.createElement("span");
                grado.className = "grado-acorde";
                grado.textContent = acorde.grado;

                const cifrado = document.createElement("h3");
                cifrado.textContent = acorde.acorde;

                const tipo = document.createElement("p");
                tipo.textContent = acorde.tipo;

                const notas = document.createElement("p");
                notas.className = "notas-progresion";
                notas.textContent = acorde.notas.join(" · ");

                tarjeta.append(
                    grado,
                    cifrado,
                    tipo,
                    notas
                );

                listaProgresion.appendChild(tarjeta);

            });

            resultadoProgresion.classList.remove("oculto");

            mensajeProgresion.textContent =
                "¡Progresión generada correctamente!";

        } catch (error) {

            mensajeProgresion.textContent = error.message;

        }

    }


    // ==========================================
    // EVENTOS
    // ==========================================

    btnGenerarAcorde.addEventListener("click", generarAcorde);

    btnGenerarProgresion.addEventListener("click", generarProgresion);


    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    cargarCatalogoGenerador();

})();
