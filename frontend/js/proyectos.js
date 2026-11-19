
// Elementos de la interfaz
const tablaProyectos = document.getElementById("tablaProyectos");
const nombreUsuario = document.getElementById("nombreUsuario");
const busqueda = document.getElementById("busqueda");
const filtroEscala = document.getElementById("filtroEscala");
const mensaje = document.getElementById("mensaje");

const formularioProyecto = document.getElementById("formularioProyecto");
const formProyecto = document.getElementById("formProyecto");
const tituloFormulario = document.getElementById("tituloFormulario");

const btnNuevoProyecto = document.getElementById("btnNuevoProyecto");
const btnCancelar = document.getElementById("btnCancelar");

const tonalidadProyecto = document.getElementById("tonalidadProyecto");

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// Comprobar que exista una sesión
const idUsuario = sessionStorage.getItem("idUsuario");

// ID del proyecto que se está editando
let proyectoEditando = null;



if (!idUsuario) {
    window.location.href = "login.html";
}

// Mostrar nombre del usuario
nombreUsuario.textContent =
    sessionStorage.getItem("nombreUsuario") || "Usuario";

// Mostrar mensajes
function mostrarMensaje(texto, tipo = "") {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

// Cargar tonalidades desde el catálogo
async function cargarCatalogo() {
    try {
        const catalogo = await peticionAPI("/musica/catalogo");

        tonalidadProyecto.replaceChildren();

        catalogo.notas.forEach(nota => {
            const opcion = document.createElement("option");
            opcion.value = nota;
            opcion.textContent = nota;

            tonalidadProyecto.appendChild(opcion);
        });

    } catch (error) {
        mostrarMensaje("No fue posible cargar las tonalidades.", "error");
    }
}

// Abrir formulario para crear proyecto
function abrirFormulario() {
    proyectoEditando = null;
    formProyecto.reset();

    tituloFormulario.textContent = "Nuevo proyecto";
    formularioProyecto.classList.remove("oculto");
    mostrarMensaje();

    formularioProyecto.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Abrir formulario para editar un proyecto
async function abrirEdicion(idProyecto) {
    try {
        const proyecto = await peticionAPI(
            `/proyectos/${idProyecto}`,
            "GET",
            null,
            idUsuario
        );

        proyectoEditando = idProyecto;

        document.getElementById("nombreProyecto").value = proyecto.nombre;
        document.getElementById("descripcionProyecto").value = proyecto.descripcion ?? "";
        tonalidadProyecto.value = proyecto.tonalidad;
        document.getElementById("escalaProyecto").value = proyecto.escala;
        document.getElementById("tempoProyecto").value = proyecto.tempo;
        document.getElementById("compasNumProyecto").value = proyecto.compasNum;
        document.getElementById("compasDenProyecto").value = proyecto.compasDen;

        tituloFormulario.textContent = "Editar proyecto";
        formularioProyecto.classList.remove("oculto");
        mostrarMensaje();

        formularioProyecto.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}


 // Eliminar proyecto
async function eliminarProyecto(idProyecto) {
    const confirmar = confirm(
        "¿Estás seguro de que deseas eliminar este proyecto?"
    );

    if (!confirmar) {
        return;
    }

    try {
        await peticionAPI(
            `/proyectos/${idProyecto}`,
            "DELETE",
            null,
            idUsuario
        );

        mostrarMensaje("Proyecto eliminado correctamente.", "exito");

        await cargarProyectos();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Cerrar formulario
function cerrarFormulario() {
    formularioProyecto.classList.add("oculto");
    formProyecto.reset();
    proyectoEditando = null;
}

// Guardar proyecto
async function guardarProyecto(evento) {
    evento.preventDefault();

    const datos = {
        nombre: document.getElementById("nombreProyecto").value.trim(),
        descripcion: document.getElementById("descripcionProyecto").value.trim() || null,
        tonalidad: tonalidadProyecto.value,
        escala: document.getElementById("escalaProyecto").value,
        tempo: Number(document.getElementById("tempoProyecto").value),
        compasNum: Number(document.getElementById("compasNumProyecto").value),
        compasDen: Number(document.getElementById("compasDenProyecto").value)
    };

    try {
        if (proyectoEditando !== null) {
            await peticionAPI(
                `/proyectos/${proyectoEditando}`,
                "PUT",
                datos,
                idUsuario
            );

            mostrarMensaje("Proyecto actualizado correctamente.", "exito");

        } else {
            await peticionAPI(
                "/proyectos",
                "POST",
                datos,
                idUsuario
            );

            mostrarMensaje("Proyecto creado correctamente.", "exito");
        }

        cerrarFormulario();
        await cargarProyectos();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Crear una celda de tabla
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto ?? "";
    return celda;
}

// Mostrar proyectos en la tabla
function mostrarProyectos(proyectos) {
    tablaProyectos.replaceChildren();

    if (proyectos.length === 0) {
        const fila = document.createElement("tr");
        const celda = crearCelda("No se encontraron proyectos.");
        celda.colSpan = 6;
        celda.className = "estado-tabla";

        fila.appendChild(celda);
        tablaProyectos.appendChild(fila);
        return;
    }

    proyectos.forEach(proyecto => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(proyecto.nombre));
        fila.appendChild(crearCelda(proyecto.tonalidad));
        fila.appendChild(crearCelda(proyecto.escala));
        fila.appendChild(crearCelda(`${proyecto.tempo} BPM`));
        fila.appendChild(
            crearCelda(`${proyecto.compasNum}/${proyecto.compasDen}`)
        );
        const celdaAcciones = document.createElement("td");

// Botón Editar
const btnEditar = document.createElement("button");
btnEditar.type = "button";
btnEditar.textContent = "Editar";
btnEditar.className = "boton-secundario";

btnEditar.addEventListener("click", () => {
    abrirEdicion(proyecto.idProyecto);
});

celdaAcciones.appendChild(btnEditar);

// Botón Eliminar
const btnEliminar = document.createElement("button");
btnEliminar.type = "button";
btnEliminar.textContent = "Eliminar";
btnEliminar.className = "boton-eliminar";

btnEliminar.addEventListener("click", () => {
    eliminarProyecto(proyecto.idProyecto);
});

celdaAcciones.appendChild(btnEliminar);

// Botón Secciones
const btnSecciones = document.createElement("button");
btnSecciones.type = "button";
btnSecciones.textContent = "Secciones";
btnSecciones.className = "boton-secundario";

btnSecciones.addEventListener("click", () => {
    window.abrirSeccionesChordLab(proyecto.idProyecto);
});

celdaAcciones.appendChild(btnSecciones);

fila.appendChild(celdaAcciones);

        tablaProyectos.appendChild(fila);
    });
}

// Consultar proyectos al backend
async function cargarProyectos() {
    tablaProyectos.innerHTML = `
        <tr>
            <td colspan="6" class="estado-tabla">
                Cargando proyectos...
            </td>
        </tr>
    `;

    mostrarMensaje();

    const parametros = new URLSearchParams();

    if (busqueda.value.trim()) {
        parametros.append("busqueda", busqueda.value.trim());
    }

    if (filtroEscala.value) {
        parametros.append("escala", filtroEscala.value);
    }

    parametros.append("pagina", "0");
    parametros.append("limite", "50");

    try {
        const proyectos = await peticionAPI(
            `/proyectos?${parametros.toString()}`,
            "GET",
            null,
            idUsuario
        );

        mostrarProyectos(proyectos);

    } catch (error) {
        tablaProyectos.replaceChildren();

        const fila = document.createElement("tr");
        const celda = crearCelda("No fue posible cargar los proyectos.");
        celda.colSpan = 6;
        celda.className = "estado-tabla";

        fila.appendChild(celda);
        tablaProyectos.appendChild(fila);

        mostrarMensaje(error.message, "error");
    }
}

// Buscar al escribir
busqueda.addEventListener("input", cargarProyectos);

// Filtrar al seleccionar una escala
filtroEscala.addEventListener("change", cargarProyectos);

// Cerrar sesión
btnCerrarSesion.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "login.html";
});

// Eventos del formulario
btnNuevoProyecto.addEventListener("click", abrirFormulario);
btnCancelar.addEventListener("click", cerrarFormulario);
formProyecto.addEventListener("submit", guardarProyecto);

// Cargar información inicial
cargarCatalogo();
cargarProyectos();