// ==========================================
// COMPARTIR PROYECTOS (RF16)
// El propietario genera enlaces de lectura o edición,
// los copia y los puede desactivar.
// ==========================================

(() => {

    const idUsuarioCompartir = sessionStorage.getItem("idUsuario");

    const subtituloCompartir = document.getElementById("subtituloCompartir");
    const btnVolverDeCompartir = document.getElementById("btnVolverDeCompartir");
    const formCompartir = document.getElementById("formCompartir");
    const permisoCompartir = document.getElementById("permisoCompartir");
    const expiracionCompartir = document.getElementById("expiracionCompartir");
    const enlaceGenerado = document.getElementById("enlaceGenerado");
    const textoEnlace = document.getElementById("textoEnlace");
    const btnCopiarEnlace = document.getElementById("btnCopiarEnlace");
    const tablaEnlaces = document.getElementById("tablaEnlaces");
    const mensajeCompartir = document.getElementById("mensajeCompartir");

    const PERMISOS = { lectura: "Solo lectura", edicion: "Lectura y edición" };

    let proyectoCompartido = null;

    function mostrarMensaje(texto = "", tipo = "") {
        mensajeCompartir.textContent = texto;
        mensajeCompartir.className = `mensaje ${tipo}`;
    }

    // Dirección completa de la página compartida: .../compartido.html?token=...
    function crearEnlace(token) {
        return new URL(`compartido.html?token=${encodeURIComponent(token)}`, window.location.href).href;
    }

    function formatearFecha(fecha) {
        if (!fecha) return "Nunca";

        return new Date(fecha).toLocaleString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    async function copiar(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            mostrarMensaje("Enlace copiado al portapapeles.", "exito");
        } catch {
            // Si el navegador no permite copiar, se selecciona el texto para copiarlo a mano
            textoEnlace.value = texto;
            enlaceGenerado.classList.remove("oculto");
            textoEnlace.select();
            mostrarMensaje("Copia el enlace con Ctrl + C.", "");
        }
    }

    async function abrirCompartir(proyecto) {
        proyectoCompartido = proyecto;
        subtituloCompartir.textContent = `Proyecto: ${proyecto.nombre}`;

        formCompartir.reset();
        enlaceGenerado.classList.add("oculto");
        mostrarMensaje();

        window.mostrarVistaChordLab("vistaCompartir");
        await cargarEnlaces();
    }

    async function cargarEnlaces() {
        tablaEnlaces.innerHTML = `
            <tr><td colspan="6" class="estado-tabla">Cargando enlaces...</td></tr>
        `;

        try {
            const enlaces = await peticionAPI(
                `/proyectos/${proyectoCompartido.idProyecto}/compartidos`,
                "GET",
                null,
                idUsuarioCompartir
            );
            mostrarEnlaces(enlaces);
        } catch (error) {
            tablaEnlaces.innerHTML = `
                <tr><td colspan="6" class="estado-tabla">No fue posible cargar los enlaces.</td></tr>
            `;
            mostrarMensaje(error.message, "error");
        }
    }

    function crearCelda(texto) {
        const celda = document.createElement("td");
        celda.textContent = texto ?? "";
        return celda;
    }

    function mostrarEnlaces(enlaces) {
        tablaEnlaces.replaceChildren();

        if (enlaces.length === 0) {
            const fila = document.createElement("tr");
            const celda = crearCelda("Este proyecto todavía no tiene enlaces.");
            celda.colSpan = 6;
            celda.className = "estado-tabla";
            fila.appendChild(celda);
            tablaEnlaces.appendChild(fila);
            return;
        }

        enlaces.forEach(enlace => {
            const fila = document.createElement("tr");

            const celdaToken = crearCelda("…" + enlace.token.slice(-8));
            celdaToken.title = crearEnlace(enlace.token);
            fila.appendChild(celdaToken);

            fila.appendChild(crearCelda(PERMISOS[enlace.permiso] ?? enlace.permiso));
            fila.appendChild(crearCelda(formatearFecha(enlace.fechaCreacion)));
            fila.appendChild(crearCelda(formatearFecha(enlace.fechaExpiracion)));

            const estado = !enlace.activo ? "Desactivado" : (enlace.vigente ? "Activo" : "Expirado");
            const celdaEstado = document.createElement("td");
            const etiqueta = document.createElement("span");
            etiqueta.className = `etiqueta etiqueta-${estado.toLowerCase()}`;
            etiqueta.textContent = estado;
            celdaEstado.appendChild(etiqueta);
            fila.appendChild(celdaEstado);

            const acciones = document.createElement("td");

            if (enlace.vigente) {
                const btnCopiar = document.createElement("button");
                btnCopiar.type = "button";
                btnCopiar.className = "boton-secundario";
                btnCopiar.textContent = "Copiar";
                btnCopiar.addEventListener("click", () => copiar(crearEnlace(enlace.token)));

                const btnAbrir = document.createElement("a");
                btnAbrir.className = "boton-secundario";
                btnAbrir.textContent = "Abrir";
                btnAbrir.href = crearEnlace(enlace.token);
                btnAbrir.target = "_blank";
                btnAbrir.rel = "noopener";

                const btnDesactivar = document.createElement("button");
                btnDesactivar.type = "button";
                btnDesactivar.className = "boton-eliminar";
                btnDesactivar.textContent = "Desactivar";
                btnDesactivar.addEventListener("click", () => desactivar(enlace));

                acciones.append(btnCopiar, btnAbrir, btnDesactivar);
            } else {
                acciones.textContent = "—";
            }

            fila.appendChild(acciones);
            tablaEnlaces.appendChild(fila);
        });
    }

    async function generarEnlace(evento) {
        evento.preventDefault();

        const datos = {
            permiso: permisoCompartir.value,
            diasExpiracion: expiracionCompartir.value ? Number(expiracionCompartir.value) : null
        };

        try {
            const enlace = await peticionAPI(
                `/proyectos/${proyectoCompartido.idProyecto}/compartir`,
                "POST",
                datos,
                idUsuarioCompartir
            );

            textoEnlace.value = crearEnlace(enlace.token);
            enlaceGenerado.classList.remove("oculto");
            textoEnlace.select();

            mostrarMensaje("Enlace generado correctamente.", "exito");
            await cargarEnlaces();
        } catch (error) {
            mostrarMensaje(error.message, "error");
        }
    }

    async function desactivar(enlace) {
        if (!confirm("¿Desactivar este enlace? Quien lo tenga ya no podrá abrir el proyecto.")) {
            return;
        }

        try {
            await peticionAPI(`/compartidos/${enlace.idCompartir}`, "DELETE", null, idUsuarioCompartir);
            await cargarEnlaces();
            mostrarMensaje("Enlace desactivado.", "exito");
        } catch (error) {
            mostrarMensaje(error.message, "error");
        }
    }

    formCompartir.addEventListener("submit", generarEnlace);
    btnCopiarEnlace.addEventListener("click", () => copiar(textoEnlace.value));
    btnVolverDeCompartir.addEventListener("click", () => window.mostrarVistaChordLab("vistaProyectos"));

    // Permitir que proyectos.js abra esta vista
    window.abrirCompartirChordLab = abrirCompartir;

})();
