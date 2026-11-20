// ==========================================
// EDITOR DE PROGRESIONES (RF11, RF14, RF15)
// Dentro de una sección: crear, editar y eliminar progresiones;
// agregar, modificar, eliminar y reordenar sus acordes;
// ver cada acorde en piano y guitarra y reproducir la progresión.
// ==========================================

(() => {

    const idUsuarioEditor = sessionStorage.getItem("idUsuario");

    // Elementos de la interfaz
    const subtituloEditor = document.getElementById("subtituloEditor");
    const btnVolverSecciones = document.getElementById("btnVolverSecciones");

    const tablaProgresiones = document.getElementById("tablaProgresiones");
    const mensajeProgresiones = document.getElementById("mensajeProgresiones");
    const btnNuevaProgresion = document.getElementById("btnNuevaProgresion");
    const formProgresion = document.getElementById("formProgresion");
    const tituloFormularioProgresion = document.getElementById("tituloFormularioProgresion");
    const btnCancelarProgresion = document.getElementById("btnCancelarProgresion");

    const panelAcordes = document.getElementById("panelAcordes");
    const tituloProgresionAbierta = document.getElementById("tituloProgresionAbierta");
    const resumenProgresionAbierta = document.getElementById("resumenProgresionAbierta");
    const btnNuevoAcorde = document.getElementById("btnNuevoAcorde");
    const formAcorde = document.getElementById("formAcorde");
    const tituloFormularioAcorde = document.getElementById("tituloFormularioAcorde");
    const btnCancelarAcorde = document.getElementById("btnCancelarAcorde");
    const listaAcordesEditor = document.getElementById("listaAcordesEditor");
    const mensajeAcordes = document.getElementById("mensajeAcordes");

    const fundamentalEditor = document.getElementById("fundamentalEditor");
    const tipoEditor = document.getElementById("tipoEditor");
    const inversionEditor = document.getElementById("inversionEditor");
    const duracionEditor = document.getElementById("duracionEditor");
    const ordenEditor = document.getElementById("ordenEditor");

    const tituloVisualizacion = document.getElementById("tituloVisualizacion");
    const tecladoEditor = document.getElementById("tecladoEditor");
    const guitarraEditor = document.getElementById("guitarraEditor");

    // Estado del editor
    let proyecto = null;
    let seccion = null;
    let progresiones = [];
    let progresionEditando = null;
    let progresionAbierta = null;
    let acordes = [];
    let acordeEditando = null;
    let indiceSeleccionado = -1;

    // Reproductor de la progresión abierta
    const reproductor = window.ReproductorChordLab.crear(
        document.getElementById("reproductorEditor"),
        {
            tempo: 100,
            obtenerSecuencia: () => acordes.map(acorde => ({
                etiqueta: acorde.simbolo,
                notasConOctava: acorde.notasConOctava,
                pulsos: acorde.duracionPulsos
            })),
            alCambiarAcorde: (indice) => seleccionarAcorde(indice, true),
            alTerminar: () => marcarSonando(-1)
        }
    );


    // ==========================================
    // UTILIDADES
    // ==========================================

    function mostrarMensaje(elemento, texto = "", tipo = "") {
        elemento.textContent = texto;
        elemento.className = `mensaje ${tipo}`;
    }

    function crearBoton(texto, clase, alHacerClic) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        boton.className = clase;
        boton.addEventListener("click", (evento) => {
            evento.stopPropagation();
            alHacerClic();
        });
        return boton;
    }

    function crearCelda(texto) {
        const celda = document.createElement("td");
        celda.textContent = texto ?? "";
        return celda;
    }

    function filaVacia(tbody, columnas, texto) {
        const fila = document.createElement("tr");
        const celda = crearCelda(texto);
        celda.colSpan = columnas;
        celda.className = "estado-tabla";
        fila.appendChild(celda);
        tbody.replaceChildren(fila);
    }

    function llenarSelect(select, valores) {
        select.replaceChildren();
        valores.forEach(valor => {
            const opcion = document.createElement("option");
            opcion.value = valor;
            opcion.textContent = valor;
            select.appendChild(opcion);
        });
    }

    async function cargarCatalogoEditor() {
        try {
            const catalogo = await peticionAPI("/musica/catalogo");
            llenarSelect(fundamentalEditor, catalogo.notas);
            llenarSelect(tipoEditor, catalogo.tipos);
        } catch (error) {
            mostrarMensaje(mensajeAcordes, "No fue posible cargar el catálogo musical.", "error");
        }
    }


    // ==========================================
    // ABRIR EL EDITOR DE UNA SECCIÓN
    // ==========================================

    async function abrirEditor(idProyecto, nombreProyecto, seccionElegida) {
        seccion = seccionElegida;

        subtituloEditor.textContent = `Proyecto: ${nombreProyecto} · Sección: ${seccion.nombre}`;
        cerrarProgresion();
        cerrarFormularioProgresion();
        window.mostrarVistaChordLab("vistaEditor");

        try {
            proyecto = await peticionAPI(`/proyectos/${idProyecto}`, "GET", null, idUsuarioEditor);
            reproductor.cambiarTempo(proyecto.tempo);
        } catch (error) {
            mostrarMensaje(mensajeProgresiones, error.message, "error");
        }

        await cargarProgresiones();
    }


    // ==========================================
    // PROGRESIONES DE LA SECCIÓN
    // ==========================================

    async function cargarProgresiones() {
        filaVacia(tablaProgresiones, 3, "Cargando progresiones...");

        try {
            progresiones = await peticionAPI(
                `/secciones/${seccion.idSeccion}/progresiones`,
                "GET",
                null,
                idUsuarioEditor
            );
            mostrarProgresiones();
        } catch (error) {
            filaVacia(tablaProgresiones, 3, "No fue posible cargar las progresiones.");
            mostrarMensaje(mensajeProgresiones, error.message, "error");
        }
    }

    function mostrarProgresiones() {
        if (progresiones.length === 0) {
            filaVacia(tablaProgresiones, 3, "Esta sección todavía no tiene progresiones.");
            return;
        }

        tablaProgresiones.replaceChildren();

        progresiones.forEach(progresion => {
            const fila = document.createElement("tr");

            if (progresionAbierta?.idProgresion === progresion.idProgresion) {
                fila.className = "fila-activa";
            }

            fila.appendChild(crearCelda(progresion.orden));
            fila.appendChild(crearCelda(progresion.nombre));

            const acciones = document.createElement("td");
            acciones.append(
                crearBoton("Abrir", "boton-principal boton-chico", () => abrirProgresion(progresion.idProgresion)),
                crearBoton("Editar", "boton-secundario", () => abrirEdicionProgresion(progresion)),
                crearBoton("Eliminar", "boton-eliminar", () => eliminarProgresion(progresion))
            );
            fila.appendChild(acciones);

            tablaProgresiones.appendChild(fila);
        });
    }

    function abrirFormularioProgresion() {
        progresionEditando = null;
        formProgresion.reset();
        tituloFormularioProgresion.textContent = "Nueva progresión";

        const mayorOrden = progresiones.reduce((mayor, p) => Math.max(mayor, p.orden), 0);
        document.getElementById("ordenProgresion").value = mayorOrden + 1;

        formProgresion.classList.remove("oculto");
        document.getElementById("nombreProgresion").focus();
    }

    function abrirEdicionProgresion(progresion) {
        progresionEditando = progresion.idProgresion;
        document.getElementById("nombreProgresion").value = progresion.nombre;
        document.getElementById("ordenProgresion").value = progresion.orden;
        tituloFormularioProgresion.textContent = "Editar progresión";
        formProgresion.classList.remove("oculto");
        document.getElementById("nombreProgresion").focus();
    }

    function cerrarFormularioProgresion() {
        formProgresion.reset();
        formProgresion.classList.add("oculto");
        progresionEditando = null;
    }

    async function guardarProgresion(evento) {
        evento.preventDefault();

        const datos = {
            nombre: document.getElementById("nombreProgresion").value.trim(),
            orden: Number(document.getElementById("ordenProgresion").value)
        };

        try {
            const editando = progresionEditando !== null;
            const idEditada = progresionEditando;

            if (editando) {
                await peticionAPI(`/progresiones/${idEditada}`, "PUT", datos, idUsuarioEditor);
            } else {
                await peticionAPI(`/secciones/${seccion.idSeccion}/progresiones`, "POST", datos, idUsuarioEditor);
            }

            cerrarFormularioProgresion();
            await cargarProgresiones();

            if (editando && progresionAbierta?.idProgresion === idEditada) {
                tituloProgresionAbierta.textContent = datos.nombre;
            }

            mostrarMensaje(
                mensajeProgresiones,
                editando ? "Progresión actualizada correctamente." : "Progresión creada correctamente.",
                "exito"
            );
        } catch (error) {
            mostrarMensaje(mensajeProgresiones, error.message, "error");
        }
    }

    async function eliminarProgresion(progresion) {
        if (!confirm(`¿Eliminar la progresión "${progresion.nombre}" y todos sus acordes?`)) {
            return;
        }

        try {
            await peticionAPI(`/progresiones/${progresion.idProgresion}`, "DELETE", null, idUsuarioEditor);

            if (progresionAbierta?.idProgresion === progresion.idProgresion) {
                cerrarProgresion();
            }

            await cargarProgresiones();
            mostrarMensaje(mensajeProgresiones, "Progresión eliminada correctamente.", "exito");
        } catch (error) {
            mostrarMensaje(mensajeProgresiones, error.message, "error");
        }
    }


    // ==========================================
    // ACORDES DE LA PROGRESIÓN ABIERTA
    // ==========================================

    async function abrirProgresion(idProgresion, conservarSeleccion = false) {
        try {
            progresionAbierta = await peticionAPI(`/progresiones/${idProgresion}`, "GET", null, idUsuarioEditor);
            acordes = progresionAbierta.acordes ?? [];

            tituloProgresionAbierta.textContent = progresionAbierta.nombre;
            panelAcordes.classList.remove("oculto");
            mostrarProgresiones();
            mostrarAcordes();

            if (!conservarSeleccion) {
                reproductor.detener();
                cerrarFormularioAcorde();
                mostrarMensaje(mensajeAcordes);
                seleccionarAcorde(acordes.length > 0 ? 0 : -1);
                panelAcordes.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                seleccionarAcorde(Math.min(indiceSeleccionado, acordes.length - 1));
            }
        } catch (error) {
            mostrarMensaje(mensajeProgresiones, error.message, "error");
        }
    }

    function cerrarProgresion() {
        reproductor.detener();
        progresionAbierta = null;
        acordes = [];
        indiceSeleccionado = -1;
        panelAcordes.classList.add("oculto");
        cerrarFormularioAcorde();
    }

    function mostrarAcordes() {
        listaAcordesEditor.replaceChildren();

        const totalPulsos = acordes.reduce((suma, a) => suma + Number(a.duracionPulsos), 0);
        const compases = proyecto ? totalPulsos / proyecto.compasNum : null;

        resumenProgresionAbierta.textContent =
            `${acordes.length} acorde(s) · ${totalPulsos} pulsos` +
            (compases !== null ? ` · ${Number(compases.toFixed(2))} compás(es) de ${proyecto.compasNum}/${proyecto.compasDen}` : "");

        if (acordes.length === 0) {
            const vacio = document.createElement("p");
            vacio.className = "estado-tabla";
            vacio.textContent = "Esta progresión todavía no tiene acordes. Usa \"+ Agregar acorde\".";
            listaAcordesEditor.appendChild(vacio);
            return;
        }

        acordes.forEach((acorde, indice) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-editor";
            tarjeta.tabIndex = 0;
            tarjeta.addEventListener("click", () => seleccionarAcorde(indice));
            tarjeta.addEventListener("keydown", (evento) => {
                if (evento.key === "Enter") seleccionarAcorde(indice);
            });

            const orden = document.createElement("span");
            orden.className = "orden-acorde";
            orden.textContent = `#${acorde.orden}`;

            const simbolo = document.createElement("h4");
            simbolo.textContent = acorde.simbolo;

            const notas = document.createElement("p");
            notas.className = "notas-progresion";
            notas.textContent = acorde.notas.join(" · ");

            const duracion = document.createElement("p");
            duracion.className = "texto-suave";
            duracion.textContent = `${Number(acorde.duracionPulsos)} pulso(s)`;

            const acciones = document.createElement("div");
            acciones.className = "acciones-tarjeta";

            const btnIzquierda = crearBoton("◀", "boton-secundario boton-icono", () => moverAcorde(indice, -1));
            btnIzquierda.title = "Mover a la izquierda";
            btnIzquierda.disabled = indice === 0;

            const btnDerecha = crearBoton("▶", "boton-secundario boton-icono", () => moverAcorde(indice, 1));
            btnDerecha.title = "Mover a la derecha";
            btnDerecha.disabled = indice === acordes.length - 1;

            acciones.append(
                btnIzquierda,
                btnDerecha,
                crearBoton("Editar", "boton-secundario", () => abrirEdicionAcorde(acorde)),
                crearBoton("Eliminar", "boton-eliminar", () => eliminarAcorde(acorde))
            );

            tarjeta.append(orden, simbolo, notas, duracion, acciones);
            listaAcordesEditor.appendChild(tarjeta);
        });
    }

    // Ilumina el acorde en la lista y lo muestra en piano y guitarra
    function seleccionarAcorde(indice, sonando = false) {
        indiceSeleccionado = indice;

        listaAcordesEditor.querySelectorAll(".tarjeta-editor").forEach((tarjeta, i) => {
            tarjeta.classList.toggle("seleccionada", i === indice);
        });

        if (sonando) {
            marcarSonando(indice);
        }

        const acorde = acordes[indice];

        if (!acorde) {
            tituloVisualizacion.textContent = "Selecciona un acorde para verlo";
            window.TecladoChordLab.dibujar(tecladoEditor, []);
            guitarraEditor.replaceChildren();
            return;
        }

        tituloVisualizacion.textContent = `${acorde.simbolo} · ${acorde.notas.join(" ")}`;
        window.TecladoChordLab.dibujar(tecladoEditor, acorde.notasConOctava);
        window.GuitarraChordLab.dibujar(guitarraEditor, acorde.notas);
    }

    function marcarSonando(indice) {
        listaAcordesEditor.querySelectorAll(".tarjeta-editor").forEach((tarjeta, i) => {
            tarjeta.classList.toggle("sonando", i === indice);
        });
    }

    function abrirFormularioAcorde() {
        acordeEditando = null;
        formAcorde.reset();
        tituloFormularioAcorde.textContent = "Agregar acorde";

        const mayorOrden = acordes.reduce((mayor, a) => Math.max(mayor, a.orden), 0);
        ordenEditor.value = mayorOrden + 1;
        duracionEditor.value = proyecto?.compasNum ?? 4;

        // Sugerir la tonalidad del proyecto como nota fundamental
        if (proyecto) fundamentalEditor.value = proyecto.tonalidad;

        formAcorde.classList.remove("oculto");
        fundamentalEditor.focus();
    }

    function abrirEdicionAcorde(acorde) {
        acordeEditando = acorde.idAcorde;

        fundamentalEditor.value = acorde.fundamental;
        tipoEditor.value = acorde.tipo;
        inversionEditor.value = acorde.inversion;
        duracionEditor.value = Number(acorde.duracionPulsos);
        ordenEditor.value = acorde.orden;

        tituloFormularioAcorde.textContent = `Editar acorde ${acorde.simbolo}`;
        formAcorde.classList.remove("oculto");
        formAcorde.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function cerrarFormularioAcorde() {
        formAcorde.reset();
        formAcorde.classList.add("oculto");
        acordeEditando = null;
    }

    function datosDeAcorde(acorde, cambios = {}) {
        return {
            fundamental: acorde.fundamental,
            tipo: acorde.tipo,
            inversion: acorde.inversion,
            duracionPulsos: Number(acorde.duracionPulsos),
            orden: acorde.orden,
            ...cambios
        };
    }

    async function guardarAcorde(evento) {
        evento.preventDefault();

        const datos = {
            fundamental: fundamentalEditor.value,
            tipo: tipoEditor.value,
            inversion: Number(inversionEditor.value),
            duracionPulsos: Number(duracionEditor.value),
            orden: Number(ordenEditor.value)
        };

        try {
            const editando = acordeEditando !== null;

            if (editando) {
                await peticionAPI(`/acordes/${acordeEditando}`, "PUT", datos, idUsuarioEditor);
            } else {
                await peticionAPI(
                    `/progresiones/${progresionAbierta.idProgresion}/acordes`,
                    "POST",
                    datos,
                    idUsuarioEditor
                );
            }

            cerrarFormularioAcorde();
            await abrirProgresion(progresionAbierta.idProgresion, true);

            // Seleccionar el acorde recién guardado
            const indice = acordes.findIndex(a => a.orden === datos.orden);
            if (indice >= 0) seleccionarAcorde(indice);

            mostrarMensaje(
                mensajeAcordes,
                editando ? "Acorde actualizado correctamente." : "Acorde agregado correctamente.",
                "exito"
            );
        } catch (error) {
            mostrarMensaje(mensajeAcordes, error.message, "error");
        }
    }

    // Intercambia el orden de dos acordes vecinos (reorganizar, RF11)
    async function moverAcorde(indice, direccion) {
        const otro = indice + direccion;

        if (otro < 0 || otro >= acordes.length) return;

        const a = acordes[indice];
        const b = acordes[otro];

        // Si dos acordes tienen el mismo orden, se separan para que el cambio se note
        const ordenA = a.orden === b.orden ? b.orden + direccion : b.orden;
        const ordenB = a.orden;

        try {
            reproductor.detener();
            await peticionAPI(`/acordes/${a.idAcorde}`, "PUT", datosDeAcorde(a, { orden: Math.max(1, ordenA) }), idUsuarioEditor);
            await peticionAPI(`/acordes/${b.idAcorde}`, "PUT", datosDeAcorde(b, { orden: ordenB }), idUsuarioEditor);

            indiceSeleccionado = otro;
            await abrirProgresion(progresionAbierta.idProgresion, true);
            mostrarMensaje(mensajeAcordes, "Orden actualizado.", "exito");
        } catch (error) {
            mostrarMensaje(mensajeAcordes, error.message, "error");
        }
    }

    async function eliminarAcorde(acorde) {
        if (!confirm(`¿Eliminar el acorde ${acorde.simbolo}?`)) {
            return;
        }

        try {
            reproductor.detener();
            await peticionAPI(`/acordes/${acorde.idAcorde}`, "DELETE", null, idUsuarioEditor);
            await abrirProgresion(progresionAbierta.idProgresion, true);
            mostrarMensaje(mensajeAcordes, "Acorde eliminado correctamente.", "exito");
        } catch (error) {
            mostrarMensaje(mensajeAcordes, error.message, "error");
        }
    }


    // ==========================================
    // EVENTOS
    // ==========================================

    btnVolverSecciones.addEventListener("click", () => {
        cerrarProgresion();
        window.mostrarVistaChordLab("vistaSecciones");
    });

    btnNuevaProgresion.addEventListener("click", abrirFormularioProgresion);
    btnCancelarProgresion.addEventListener("click", cerrarFormularioProgresion);
    formProgresion.addEventListener("submit", guardarProgresion);

    btnNuevoAcorde.addEventListener("click", abrirFormularioAcorde);
    btnCancelarAcorde.addEventListener("click", cerrarFormularioAcorde);
    formAcorde.addEventListener("submit", guardarAcorde);

    // Si se cambia de pantalla, la reproducción se detiene
    document.addEventListener("chordlab:vista", (evento) => {
        if (evento.detail !== "vistaEditor") reproductor.detener();
    });

    cargarCatalogoEditor();

    // Permitir que secciones.js abra el editor
    window.abrirEditorChordLab = abrirEditor;

})();
