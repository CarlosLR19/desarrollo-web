
const btnVistaProyectos = document.getElementById("btnVistaProyectos");
const btnVistaGenerador = document.getElementById("btnVistaGenerador");

function mostrarVistaProyectos() {
    document.querySelector(".contenido > .titulo-seccion")
        .classList.remove("oculto");

    document.getElementById("formularioProyecto").classList.add("oculto");
    document.querySelector(".herramientas").classList.remove("oculto");
    document.querySelector(".tabla-contenedor").classList.remove("oculto");
    document.getElementById("mensaje").classList.remove("oculto");

    document.getElementById("vistaGenerador").classList.add("oculto");
    document.getElementById("vistaSecciones").classList.add("oculto");

    btnVistaProyectos.classList.add("activo");
    btnVistaGenerador.classList.remove("activo");
}

function mostrarVistaGenerador() {
    document.querySelector(".contenido > .titulo-seccion")
        .classList.add("oculto");

    document.getElementById("formularioProyecto").classList.add("oculto");
    document.querySelector(".herramientas").classList.add("oculto");
    document.querySelector(".tabla-contenedor").classList.add("oculto");
    document.getElementById("mensaje").classList.add("oculto");

    document.getElementById("vistaSecciones").classList.add("oculto");
    document.getElementById("vistaGenerador").classList.remove("oculto");

    btnVistaProyectos.classList.remove("activo");
    btnVistaGenerador.classList.add("activo");
}

btnVistaProyectos.addEventListener("click", mostrarVistaProyectos);
btnVistaGenerador.addEventListener("click", mostrarVistaGenerador);
