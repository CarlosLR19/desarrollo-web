
(() => {

    // Elementos de la interfaz
    const vistaSecciones = document.getElementById("vistaSecciones");
    const tablaSecciones = document.getElementById("tablaSecciones");
    const tituloProyectoSecciones = document.getElementById("tituloProyectoSecciones");
    const mensajeSecciones = document.getElementById("mensajeSecciones");

    const formularioSeccion = document.getElementById("formSeccion");
    const tituloFormularioSeccion = document.getElementById("tituloFormularioSeccion");

    const btnNuevaSeccion = document.getElementById("btnNuevaSeccion");
    const btnCancelarSeccion = document.getElementById("btnCancelarSeccion");
    const btnVolverProyectos = document.getElementById("btnVolverProyectos");

    const idUsuarioSecciones = sessionStorage.getItem("idUsuario");

    // Estado de las secciones
    let proyectoActual = null;
    let seccionEditando = null;
    let seccionesActuales = [];

    // Abrir las secciones de un proyecto
    async function abrirSeccionesChordLab(idProyecto) {
        try {
            const proyecto = await peticionAPI(
                `/proyectos/${idProyecto}`,
                "GET",
                null,
                idUsuarioSecciones
            );

            proyectoActual = idProyecto;
            tituloProyectoSecciones.textContent = proyecto.nombre;

            document.querySelectorAll(
                ".contenido > section:not(#vistaSecciones), .contenido > #mensaje"
            ).forEach(elemento => {
                elemento.classList.add("oculto");
            });

            vistaSecciones.classList.remove("oculto");

            await cargarSecciones();

        } catch (error) {
            document.getElementById("mensaje").textContent = error.message;
        }
    }

    // Consultar secciones
    async function cargarSecciones() {
        tablaSecciones.innerHTML = `
            <tr>
                <td colspan="3" class="estado-tabla">
                    Cargando secciones...
                </td>
            </tr>
        `;

        mensajeSecciones.textContent = "";

        try {
            const secciones = await peticionAPI(
                `/proyectos/${proyectoActual}/secciones`,
                "GET",
                null,
                idUsuarioSecciones
            );

            seccionesActuales = secciones;
            mostrarSecciones(secciones);

        } catch (error) {
            tablaSecciones.innerHTML = `
                <tr>
                    <td colspan="3" class="estado-tabla">
                        No fue posible cargar las secciones.
                    </td>
                </tr>
            `;

            mensajeSecciones.textContent = error.message;
        }
    }

    // Crear una celda
    function crearCeldaSeccion(texto) {
        const celda = document.createElement("td");
        celda.textContent = texto ?? "";
        return celda;
    }

    // Mostrar secciones
    function mostrarSecciones(secciones) {
        tablaSecciones.replaceChildren();

        if (secciones.length === 0) {
            const fila = document.createElement("tr");
            const celda = crearCeldaSeccion(
                "Este proyecto todavía no tiene secciones."
            );

            celda.colSpan = 3;
            celda.className = "estado-tabla";

            fila.appendChild(celda);
            tablaSecciones.appendChild(fila);
            return;
        }

        secciones.forEach(seccion => {
            const fila = document.createElement("tr");

            fila.appendChild(crearCeldaSeccion(seccion.orden));
            fila.appendChild(crearCeldaSeccion(seccion.nombre));

            const celdaAcciones = document.createElement("td");

            // Botón Editar
            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.textContent = "Editar";
            btnEditar.className = "boton-secundario";

            btnEditar.addEventListener("click", () => {
                abrirEdicionSeccion(seccion);
            });

            celdaAcciones.appendChild(btnEditar);

            // Botón Eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "boton-eliminar";

            btnEliminar.addEventListener("click", () => {
                eliminarSeccion(seccion.idSeccion);
            });

            celdaAcciones.appendChild(btnEliminar);

            fila.appendChild(celdaAcciones);
            tablaSecciones.appendChild(fila);
        });
    }

    // Abrir formulario para crear
    function abrirFormularioSeccion() {
        seccionEditando = null;
        formularioSeccion.reset();

        tituloFormularioSeccion.textContent = "Nueva sección";

        const mayorOrden = seccionesActuales.reduce(
            (mayor, seccion) => Math.max(mayor, seccion.orden),
            0
        );

        document.getElementById("ordenSeccion").value = mayorOrden + 1;

        formularioSeccion.classList.remove("oculto");
    }

    // Abrir formulario para editar
    function abrirEdicionSeccion(seccion) {
        seccionEditando = seccion.idSeccion;

        document.getElementById("nombreSeccion").value = seccion.nombre;
        document.getElementById("ordenSeccion").value = seccion.orden;

        tituloFormularioSeccion.textContent = "Editar sección";
        formularioSeccion.classList.remove("oculto");

        formularioSeccion.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // Guardar sección (crear o actualizar)
    async function guardarSeccion(evento) {
        evento.preventDefault();

        const datos = {
            nombre: document.getElementById("nombreSeccion").value.trim(),
            orden: Number(document.getElementById("ordenSeccion").value)
        };

        try {
            if (seccionEditando !== null) {
                await peticionAPI(
                    `/secciones/${seccionEditando}`,
                    "PUT",
                    datos,
                    idUsuarioSecciones
                );
            } else {
                await peticionAPI(
                    `/proyectos/${proyectoActual}/secciones`,
                    "POST",
                    datos,
                    idUsuarioSecciones
                );
            }

            const mensaje = seccionEditando !== null
                ? "Sección actualizada correctamente."
                : "Sección creada correctamente.";

            cerrarFormularioSeccion();
            await cargarSecciones();

            mensajeSecciones.textContent = mensaje;

        } catch (error) {
            mensajeSecciones.textContent = error.message;
        }
    }

    // Eliminar sección
    async function eliminarSeccion(idSeccion) {
        const confirmar = confirm(
            "¿Estás seguro de que deseas eliminar esta sección?"
        );

        if (!confirmar) return;

        try {
            await peticionAPI(
                `/secciones/${idSeccion}`,
                "DELETE",
                null,
                idUsuarioSecciones
            );

            await cargarSecciones();
            mensajeSecciones.textContent =
                "Sección eliminada correctamente.";

        } catch (error) {
            mensajeSecciones.textContent = error.message;
        }
    }

    // Cerrar formulario
    function cerrarFormularioSeccion() {
        formularioSeccion.reset();
        formularioSeccion.classList.add("oculto");
        seccionEditando = null;
    }

    // Regresar a proyectos
    function volverProyectos() {
        vistaSecciones.classList.add("oculto");

        document.getElementById("formularioProyecto").classList.add("oculto");

        document.querySelector(".titulo-seccion").classList.remove("oculto");
        document.querySelector(".herramientas").classList.remove("oculto");
        document.querySelector(".tabla-contenedor").classList.remove("oculto");

        document.getElementById("mensaje").classList.remove("oculto");
        proyectoActual = null;
        seccionesActuales = [];
    }

    // Eventos
    btnNuevaSeccion.addEventListener("click", abrirFormularioSeccion);

    btnCancelarSeccion.addEventListener("click", cerrarFormularioSeccion);

    formularioSeccion.addEventListener("submit", guardarSeccion);

    btnVolverProyectos.addEventListener("click", volverProyectos);

    // Permitir que proyectos.js abra esta vista
    window.abrirSeccionesChordLab = abrirSeccionesChordLab;

})();
