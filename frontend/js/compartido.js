// ==========================================
// ACCESO A PROYECTOS COMPARTIDOS (RF17)
// Abre un proyecto con su enlace (token). No requiere iniciar sesión.
// Con permiso de lectura solo se consulta; con permiso de edición
// también se pueden modificar los datos generales del proyecto.
// ==========================================

(() => {

    const CLAVE_RECIENTES = "chordlab.compartidos";
    const PERMISOS = { lectura: "Solo lectura", edicion: "Lectura y edición" };

    // Vistas
    const vistaAcceso = document.getElementById("vistaAcceso");
    const vistaCompartido = document.getElementById("vistaCompartido");

    // Acceso
    const enlaceVolver = document.getElementById("enlaceVolver");
    const formAcceso = document.getElementById("formAcceso");
    const textoAcceso = document.getElementById("textoAcceso");
    const mensajeAcceso = document.getElementById("mensajeAcceso");
    const bloqueRecientes = document.getElementById("bloqueRecientes");
    const tablaRecientes = document.getElementById("tablaRecientes");

    // Proyecto
    const nombreCompartido = document.getElementById("nombreCompartido");
    const propietarioCompartido = document.getElementById("propietarioCompartido");
    const permisoCompartido = document.getElementById("permisoCompartido");
    const btnOtroEnlace = document.getElementById("btnOtroEnlace");
    const descripcionCompartido = document.getElementById("descripcionCompartido");
    const mensajeCompartido = document.getElementById("mensajeCompartido");
    const estructuraCompartido = document.getElementById("estructuraCompartido");

    // Edición
    const btnEditarCompartido = document.getElementById("btnEditarCompartido");
    const formEditarCompartido = document.getElementById("formEditarCompartido");
    const btnCancelarEditCompartido = document.getElementById("btnCancelarEditCompartido");
    const tonalidadEditCompartido = document.getElementById("tonalidadEditCompartido");

    // Reproducción
    const panelReproduccion = document.getElementById("panelReproduccion");
    const tituloReproduccion = document.getElementById("tituloReproduccion");
    const tituloVisualizacion = document.getElementById("tituloVisualizacionCompartido");
    const tecladoCompartido = document.getElementById("tecladoCompartido");
    const guitarraCompartido = document.getElementById("guitarraCompartido");

    // Estado
    let token = null;
    let datos = null;
    let progresionElegida = null;

    const reproductor = window.ReproductorChordLab.crear(
        document.getElementById("reproductorCompartido"),
        {
            tempo: 100,
            obtenerSecuencia: () => (progresionElegida?.acordes ?? []).map(acorde => ({
                etiqueta: acorde.simbolo,
                notasConOctava: acorde.notasConOctava,
                pulsos: acorde.duracionPulsos
            })),
            alCambiarAcorde: (indice) => verAcorde(progresionElegida, indice, true),
            alTerminar: () => marcarChip(null, -1, "sonando")
        }
    );


    // ==========================================
    // UTILIDADES
    // ==========================================

    function mostrarMensaje(elemento, texto = "", tipo = "") {
        elemento.textContent = texto;
        elemento.className = `mensaje ${tipo}`;
    }

    function leerRecientes() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE_RECIENTES)) ?? [];
        } catch {
            return [];
        }
    }

    function guardarReciente(elemento) {
        try {
            const lista = leerRecientes().filter(r => r.token !== elemento.token);
            lista.unshift(elemento);
            localStorage.setItem(CLAVE_RECIENTES, JSON.stringify(lista.slice(0, 10)));
        } catch {
            // Sin almacenamiento solo se pierde la lista de recientes
        }
    }

    function quitarReciente(tokenQuitar) {
        try {
            const lista = leerRecientes().filter(r => r.token !== tokenQuitar);
            localStorage.setItem(CLAVE_RECIENTES, JSON.stringify(lista));
        } catch {
            // Nada que hacer
        }
    }

    // Acepta el enlace completo o solo el código
    function extraerToken(texto) {
        const limpio = texto.trim();

        try {
            const url = new URL(limpio);
            return url.searchParams.get("token") ?? "";
        } catch {
            return limpio;
        }
    }


    // ==========================================
    // VISTA DE ACCESO
    // ==========================================

    function mostrarAcceso() {
        reproductor.detener();
        token = null;
        datos = null;

        vistaCompartido.classList.add("oculto");
        vistaAcceso.classList.remove("oculto");
        mostrarRecientes();
    }

    function mostrarRecientes() {
        const recientes = leerRecientes();
        bloqueRecientes.classList.toggle("oculto", recientes.length === 0);
        tablaRecientes.replaceChildren();

        recientes.forEach(reciente => {
            const fila = document.createElement("tr");

            [reciente.nombre, reciente.propietario, PERMISOS[reciente.permiso] ?? reciente.permiso]
                .forEach(texto => {
                    const celda = document.createElement("td");
                    celda.textContent = texto ?? "";
                    fila.appendChild(celda);
                });

            const acciones = document.createElement("td");

            const btnAbrir = document.createElement("button");
            btnAbrir.type = "button";
            btnAbrir.className = "boton-principal boton-chico";
            btnAbrir.textContent = "Abrir";
            btnAbrir.addEventListener("click", () => abrirToken(reciente.token));

            const btnQuitar = document.createElement("button");
            btnQuitar.type = "button";
            btnQuitar.className = "boton-secundario";
            btnQuitar.textContent = "Quitar";
            btnQuitar.addEventListener("click", () => {
                quitarReciente(reciente.token);
                mostrarRecientes();
            });

            acciones.append(btnAbrir, btnQuitar);
            fila.appendChild(acciones);
            tablaRecientes.appendChild(fila);
        });
    }

    function abrirToken(nuevoToken) {
        const url = new URL(window.location.href);
        url.searchParams.set("token", nuevoToken);
        history.pushState(null, "", url);
        cargarCompartido(nuevoToken);
    }


    // ==========================================
    // CARGAR Y MOSTRAR EL PROYECTO
    // ==========================================

    async function cargarCompartido(nuevoToken) {
        mostrarMensaje(mensajeAcceso, "Abriendo proyecto...");

        try {
            datos = await peticionAPI(`/compartidos/${encodeURIComponent(nuevoToken)}`);
            token = nuevoToken;

            guardarReciente({
                token,
                nombre: datos.proyecto.nombre,
                propietario: datos.propietario,
                permiso: datos.permiso
            });

            mostrarMensaje(mensajeAcceso);
            vistaAcceso.classList.add("oculto");
            vistaCompartido.classList.remove("oculto");

            mostrarProyecto();
            mostrarEstructura();

        } catch (error) {
            mostrarAcceso();
            mostrarMensaje(mensajeAcceso, error.message, "error");
        }
    }

    function mostrarProyecto() {
        const p = datos.proyecto;

        nombreCompartido.textContent = p.nombre;

        let texto = `Compartido por ${datos.propietario}`;
        if (datos.fechaExpiracion) {
            texto += ` · el enlace expira el ${new Date(datos.fechaExpiracion).toLocaleDateString("es-MX")}`;
        }
        propietarioCompartido.textContent = texto;

        permisoCompartido.textContent = PERMISOS[datos.permiso] ?? datos.permiso;
        permisoCompartido.className = `etiqueta etiqueta-${datos.permiso}`;

        descripcionCompartido.textContent = p.descripcion || "Sin descripción.";
        document.getElementById("tonalidadCompartido").textContent = p.tonalidad;
        document.getElementById("escalaCompartido").textContent = p.escala;
        document.getElementById("tempoCompartido").textContent = `${p.tempo} BPM`;
        document.getElementById("compasCompartido").textContent = `${p.compasNum}/${p.compasDen}`;

        btnEditarCompartido.classList.toggle("oculto", datos.permiso !== "edicion");
        formEditarCompartido.classList.add("oculto");

        reproductor.cambiarTempo(p.tempo);
    }

    function mostrarEstructura() {
        estructuraCompartido.replaceChildren();
        panelReproduccion.classList.add("oculto");
        progresionElegida = null;

        if (datos.secciones.length === 0) {
            const vacio = document.createElement("p");
            vacio.className = "estado-tabla";
            vacio.textContent = "Este proyecto todavía no tiene secciones.";
            estructuraCompartido.appendChild(vacio);
            return;
        }

        datos.secciones.forEach(seccion => {
            const bloque = document.createElement("div");
            bloque.className = "bloque-seccion";

            const titulo = document.createElement("h4");
            titulo.textContent = `${seccion.orden}. ${seccion.nombre}`;
            bloque.appendChild(titulo);

            if (seccion.progresiones.length === 0) {
                const vacio = document.createElement("p");
                vacio.className = "texto-suave";
                vacio.textContent = "Sin progresiones.";
                bloque.appendChild(vacio);
            }

            seccion.progresiones.forEach(progresion => {
                const fila = document.createElement("div");
                fila.className = "fila-progresion";
                fila.dataset.id = progresion.idProgresion;

                const nombre = document.createElement("strong");
                nombre.textContent = progresion.nombre;

                const chips = document.createElement("div");
                chips.className = "chips-acordes";

                if (progresion.acordes.length === 0) {
                    const vacio = document.createElement("span");
                    vacio.className = "texto-suave";
                    vacio.textContent = "Sin acordes";
                    chips.appendChild(vacio);
                }

                progresion.acordes.forEach((acorde, indice) => {
                    const chip = document.createElement("button");
                    chip.type = "button";
                    chip.className = "chip-acorde";
                    chip.textContent = acorde.simbolo;
                    chip.title = acorde.notas.join(" ");
                    chip.addEventListener("click", () => {
                        elegirProgresion(progresion);
                        verAcorde(progresion, indice);
                    });
                    chips.appendChild(chip);
                });

                const btnEscuchar = document.createElement("button");
                btnEscuchar.type = "button";
                btnEscuchar.className = "boton-secundario";
                btnEscuchar.textContent = "▶ Escuchar";
                btnEscuchar.disabled = progresion.acordes.length === 0;
                btnEscuchar.addEventListener("click", () => {
                    elegirProgresion(progresion);
                    verAcorde(progresion, 0);
                    panelReproduccion.scrollIntoView({ behavior: "smooth", block: "start" });
                });

                fila.append(nombre, chips, btnEscuchar);
                bloque.appendChild(fila);
            });

            estructuraCompartido.appendChild(bloque);
        });
    }

    function elegirProgresion(progresion) {
        if (progresionElegida?.idProgresion !== progresion.idProgresion) {
            reproductor.detener();
        }

        progresionElegida = progresion;
        tituloReproduccion.textContent = `Progresión: ${progresion.nombre}`;
        panelReproduccion.classList.remove("oculto");
    }

    function marcarChip(progresion, indice, clase) {
        estructuraCompartido.querySelectorAll(".fila-progresion").forEach(fila => {
            const esLaFila = progresion && Number(fila.dataset.id) === progresion.idProgresion;
            fila.querySelectorAll(".chip-acorde").forEach((chip, i) => {
                chip.classList.toggle(clase, esLaFila && i === indice);
            });
        });
    }

    function verAcorde(progresion, indice, sonando = false) {
        const acorde = progresion?.acordes[indice];
        if (!acorde) return;

        marcarChip(progresion, indice, "seleccionada");
        if (sonando) marcarChip(progresion, indice, "sonando");

        tituloVisualizacion.textContent = `${acorde.simbolo} · ${acorde.notas.join(" ")}`;
        window.TecladoChordLab.dibujar(tecladoCompartido, acorde.notasConOctava);
        window.GuitarraChordLab.dibujar(guitarraCompartido, acorde.notas);
    }


    // ==========================================
    // EDICIÓN (solo con permiso de edición)
    // ==========================================

    async function cargarTonalidades() {
        try {
            const catalogo = await peticionAPI("/musica/catalogo");
            tonalidadEditCompartido.replaceChildren();
            catalogo.notas.forEach(nota => {
                const opcion = document.createElement("option");
                opcion.value = nota;
                opcion.textContent = nota;
                tonalidadEditCompartido.appendChild(opcion);
            });
        } catch {
            mostrarMensaje(mensajeCompartido, "No fue posible cargar las tonalidades.", "error");
        }
    }

    function abrirEdicion() {
        const p = datos.proyecto;

        document.getElementById("nombreEditCompartido").value = p.nombre;
        document.getElementById("descripcionEditCompartido").value = p.descripcion ?? "";
        tonalidadEditCompartido.value = p.tonalidad;
        document.getElementById("escalaEditCompartido").value = p.escala;
        document.getElementById("tempoEditCompartido").value = p.tempo;
        document.getElementById("compasNumEditCompartido").value = p.compasNum;
        document.getElementById("compasDenEditCompartido").value = p.compasDen;

        formEditarCompartido.classList.remove("oculto");
        mostrarMensaje(mensajeCompartido);
    }

    async function guardarEdicion(evento) {
        evento.preventDefault();

        const cambios = {
            nombre: document.getElementById("nombreEditCompartido").value.trim(),
            descripcion: document.getElementById("descripcionEditCompartido").value.trim() || null,
            tonalidad: tonalidadEditCompartido.value,
            escala: document.getElementById("escalaEditCompartido").value,
            tempo: Number(document.getElementById("tempoEditCompartido").value),
            compasNum: Number(document.getElementById("compasNumEditCompartido").value),
            compasDen: Number(document.getElementById("compasDenEditCompartido").value)
        };

        try {
            const proyecto = await peticionAPI(`/compartidos/${encodeURIComponent(token)}`, "PUT", cambios);
            datos.proyecto = proyecto;
            mostrarProyecto();
            mostrarMensaje(mensajeCompartido, "Proyecto actualizado correctamente.", "exito");
        } catch (error) {
            mostrarMensaje(mensajeCompartido, error.message, "error");
        }
    }


    // ==========================================
    // EVENTOS E INICIO
    // ==========================================

    formAcceso.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const nuevoToken = extraerToken(textoAcceso.value);

        if (!nuevoToken) {
            mostrarMensaje(mensajeAcceso, "El enlace no contiene un código válido.", "error");
            return;
        }

        abrirToken(nuevoToken);
    });

    btnOtroEnlace.addEventListener("click", () => {
        history.pushState(null, "", window.location.pathname);
        mostrarAcceso();
    });

    btnEditarCompartido.addEventListener("click", abrirEdicion);
    btnCancelarEditCompartido.addEventListener("click", () => formEditarCompartido.classList.add("oculto"));
    formEditarCompartido.addEventListener("submit", guardarEdicion);

    // Botones atrás / adelante del navegador
    window.addEventListener("popstate", iniciar);

    // Si hay sesión, el botón del encabezado regresa a los proyectos
    if (sessionStorage.getItem("idUsuario")) {
        enlaceVolver.textContent = "Mis proyectos";
        enlaceVolver.href = "proyectos.html";
    }

    function iniciar() {
        const tokenUrl = new URLSearchParams(window.location.search).get("token");

        if (tokenUrl) {
            cargarCompartido(tokenUrl);
        } else {
            mostrarAcceso();
        }
    }

    cargarTonalidades();
    iniciar();

})();
