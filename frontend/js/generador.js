
(() => {

    const idUsuarioGenerador = sessionStorage.getItem("idUsuario");

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
    const guitarraAcorde = document.getElementById("guitarraAcorde");


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

    const tituloAcordeProgresion = document.getElementById("tituloAcordeProgresion");
    const tecladoProgresion = document.getElementById("tecladoProgresion");
    const guitarraProgresion = document.getElementById("guitarraProgresion");

    // Guardar la progresión generada en un proyecto
    const formGuardarProgresion = document.getElementById("formGuardarProgresion");
    const proyectoDestino = document.getElementById("proyectoDestino");
    const seccionDestino = document.getElementById("seccionDestino");
    const nombreProgresionGuardar = document.getElementById("nombreProgresionGuardar");
    const pulsosProgresionGuardar = document.getElementById("pulsosProgresionGuardar");
    const mensajeGuardarProgresion = document.getElementById("mensajeGuardarProgresion");


    // ==========================================
    // ESTADO
    // ==========================================

    let acordeActual = null;
    let progresionActual = null;


    // ==========================================
    // REPRODUCTORES (sin sonido por ahora; Tone.js después)
    // ==========================================

    const reproductorAcorde = window.ReproductorChordLab.crear(
        document.getElementById("reproductorAcorde"),
        {
            tempo: 100,
            obtenerSecuencia: () => acordeActual
                ? [{ etiqueta: acordeActual.simbolo, notasConOctava: acordeActual.notasConOctava, pulsos: 4 }]
                : []
        }
    );

    const reproductorProgresion = window.ReproductorChordLab.crear(
        document.getElementById("reproductorProgresion"),
        {
            tempo: 100,
            obtenerSecuencia: () => (progresionActual?.progresion ?? []).map(acorde => ({
                etiqueta: acorde.acorde,
                notasConOctava: acorde.notasConOctava,
                pulsos: Number(pulsosProgresionGuardar.value) || 4
            })),
            alCambiarAcorde: (indice) => seleccionarAcordeProgresion(indice, true),
            alTerminar: () => marcarSonando(-1)
        }
    );


    // ==========================================
    // CARGAR CATÁLOGO MUSICAL
    // ==========================================

    function llenarSelect(select, valores) {
        select.replaceChildren();

        valores.forEach(valor => {
            const opcion = document.createElement("option");
            opcion.value = valor;
            opcion.textContent = valor;
            select.appendChild(opcion);
        });
    }

    async function cargarCatalogoGenerador() {

        try {

            const catalogo = await peticionAPI("/musica/catalogo");

            // Opciones para generar acordes
            llenarSelect(fundamentalAcorde, catalogo.notas);
            llenarSelect(tipoAcorde, catalogo.tipos);

            // Opciones para generar progresiones
            llenarSelect(tonalidadProgresion, catalogo.notas);
            llenarSelect(escalaProgresion, catalogo.escalas);
            llenarSelect(estiloProgresion, catalogo.estilos);

        } catch (error) {

            mensajeGenerador.textContent =
                "No fue posible cargar el catálogo musical.";

            mensajeProgresion.textContent =
                "No fue posible cargar el catálogo musical.";

        }

    }


    // ==========================================
    // GENERAR ACORDE
    // ==========================================

    async function generarAcorde() {

        mensajeGenerador.textContent = "Generando acorde...";
        resultadoAcorde.classList.add("oculto");
        reproductorAcorde.detener();

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

            acordeActual = acorde;

            nombreAcorde.textContent = acorde.nombre;
            simboloAcorde.textContent = acorde.simbolo;

            notasAcorde.replaceChildren();

            acorde.notas.forEach(nota => {

                const elemento = document.createElement("span");

                elemento.textContent = nota;
                elemento.className = "nota-acorde";

                notasAcorde.appendChild(elemento);

            });

            // Mostrar las notas en el teclado virtual y en la guitarra
            window.TecladoChordLab.dibujar(tecladoPiano, acorde.notasConOctava);
            window.GuitarraChordLab.dibujar(guitarraAcorde, acorde.notas);

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
        reproductorProgresion.detener();

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

            progresionActual = respuesta;

            // Mostrar información general
            resumenProgresion.textContent =
                `Tonalidad: ${respuesta.tonalidad} | ` +
                `Escala: ${respuesta.escala} | ` +
                `Estilo: ${respuesta.estilo}`;

            // Limpiar resultados anteriores
            listaProgresion.replaceChildren();

            // Crear una tarjeta para cada acorde
            respuesta.progresion.forEach((acorde, indice) => {

                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta-acorde";
                tarjeta.tabIndex = 0;
                tarjeta.title = "Ver en piano y guitarra";

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

                tarjeta.addEventListener("click", () => seleccionarAcordeProgresion(indice));
                tarjeta.addEventListener("keydown", (evento) => {
                    if (evento.key === "Enter") seleccionarAcordeProgresion(indice);
                });

                listaProgresion.appendChild(tarjeta);

            });

            seleccionarAcordeProgresion(0);

            // Nombre sugerido para guardarla
            nombreProgresionGuardar.value =
                `${respuesta.tonalidad} ${respuesta.escala} · ${respuesta.estilo}`;
            mensajeGuardarProgresion.textContent = "";

            resultadoProgresion.classList.remove("oculto");

            mensajeProgresion.textContent =
                "¡Progresión generada correctamente!";

            cargarProyectosDestino();

        } catch (error) {

            mensajeProgresion.textContent = error.message;

        }

    }

    function seleccionarAcordeProgresion(indice, sonando = false) {
        const acorde = progresionActual?.progresion[indice];

        listaProgresion.querySelectorAll(".tarjeta-acorde").forEach((tarjeta, i) => {
            tarjeta.classList.toggle("seleccionada", i === indice);
        });

        if (sonando) marcarSonando(indice);

        if (!acorde) return;

        tituloAcordeProgresion.textContent = `${acorde.grado} · ${acorde.acorde} · ${acorde.notas.join(" ")}`;
        window.TecladoChordLab.dibujar(tecladoProgresion, acorde.notasConOctava ?? []);
        window.GuitarraChordLab.dibujar(guitarraProgresion, acorde.notas);
    }

    function marcarSonando(indice) {
        listaProgresion.querySelectorAll(".tarjeta-acorde").forEach((tarjeta, i) => {
            tarjeta.classList.toggle("sonando", i === indice);
        });
    }


    // ==========================================
    // GUARDAR PROGRESIÓN GENERADA EN UN PROYECTO (RF14)
    // ==========================================

    function opcionVacia(select, texto) {
        const opcion = document.createElement("option");
        opcion.value = "";
        opcion.textContent = texto;
        select.replaceChildren(opcion);
    }

    async function cargarProyectosDestino() {
        opcionVacia(proyectoDestino, "Cargando proyectos...");
        opcionVacia(seccionDestino, "Primero elige un proyecto");

        try {
            const proyectos = await peticionAPI(
                "/proyectos?pagina=0&limite=100",
                "GET",
                null,
                idUsuarioGenerador
            );

            if (proyectos.length === 0) {
                opcionVacia(proyectoDestino, "No tienes proyectos todavía");
                return;
            }

            opcionVacia(proyectoDestino, "Elige un proyecto");

            proyectos.forEach(proyecto => {
                const opcion = document.createElement("option");
                opcion.value = proyecto.idProyecto;
                opcion.textContent = `${proyecto.nombre} (${proyecto.tonalidad} ${proyecto.escala})`;
                opcion.dataset.compas = proyecto.compasNum;
                proyectoDestino.appendChild(opcion);
            });
        } catch (error) {
            opcionVacia(proyectoDestino, "No fue posible cargar los proyectos");
        }
    }

    async function cargarSeccionesDestino() {
        if (!proyectoDestino.value) {
            opcionVacia(seccionDestino, "Primero elige un proyecto");
            return;
        }

        // Duración sugerida: un compás completo del proyecto
        const compas = proyectoDestino.selectedOptions[0].dataset.compas;
        if (compas) pulsosProgresionGuardar.value = compas;

        opcionVacia(seccionDestino, "Cargando secciones...");

        try {
            const secciones = await peticionAPI(
                `/proyectos/${proyectoDestino.value}/secciones`,
                "GET",
                null,
                idUsuarioGenerador
            );

            if (secciones.length === 0) {
                opcionVacia(seccionDestino, "El proyecto no tiene secciones");
                return;
            }

            opcionVacia(seccionDestino, "Elige una sección");

            secciones.forEach(seccion => {
                const opcion = document.createElement("option");
                opcion.value = seccion.idSeccion;
                opcion.textContent = `${seccion.orden}. ${seccion.nombre}`;
                seccionDestino.appendChild(opcion);
            });
        } catch (error) {
            opcionVacia(seccionDestino, "No fue posible cargar las secciones");
        }
    }

    async function guardarProgresionGenerada(evento) {
        evento.preventDefault();

        if (!progresionActual || !seccionDestino.value) {
            mensajeGuardarProgresion.textContent = "Elige un proyecto y una sección.";
            return;
        }

        mensajeGuardarProgresion.textContent = "Guardando progresión...";

        try {
            const existentes = await peticionAPI(
                `/secciones/${seccionDestino.value}/progresiones`,
                "GET",
                null,
                idUsuarioGenerador
            );

            const orden = existentes.reduce((mayor, p) => Math.max(mayor, p.orden), 0) + 1;

            const progresion = await peticionAPI(
                `/secciones/${seccionDestino.value}/progresiones`,
                "POST",
                { nombre: nombreProgresionGuardar.value.trim(), orden },
                idUsuarioGenerador
            );

            const pulsos = Number(pulsosProgresionGuardar.value);

            // Se guardan los acordes uno por uno, en el mismo orden
            for (let i = 0; i < progresionActual.progresion.length; i++) {
                const acorde = progresionActual.progresion[i];

                await peticionAPI(
                    `/progresiones/${progresion.idProgresion}/acordes`,
                    "POST",
                    {
                        fundamental: acorde.fundamental,
                        tipo: acorde.tipo,
                        inversion: 0,
                        duracionPulsos: pulsos,
                        orden: i + 1
                    },
                    idUsuarioGenerador
                );
            }

            mensajeGuardarProgresion.textContent =
                `Progresión guardada en "${seccionDestino.selectedOptions[0].textContent}". ` +
                "Puedes editarla desde Mis proyectos › Secciones › Progresiones.";

        } catch (error) {
            mensajeGuardarProgresion.textContent = error.message;
        }
    }


    // ==========================================
    // EVENTOS
    // ==========================================

    btnGenerarAcorde.addEventListener("click", generarAcorde);

    btnGenerarProgresion.addEventListener("click", generarProgresion);

    proyectoDestino.addEventListener("change", cargarSeccionesDestino);

    formGuardarProgresion.addEventListener("submit", guardarProgresionGenerada);

    // Si se cambia de pantalla, la reproducción se detiene
    document.addEventListener("chordlab:vista", (evento) => {
        if (evento.detail !== "vistaGenerador") {
            reproductorAcorde.detener();
            reproductorProgresion.detener();
        }
    });


    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    cargarCatalogoGenerador();

})();
