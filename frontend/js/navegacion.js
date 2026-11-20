// ==========================================
// NAVEGACIÓN ENTRE VISTAS
// Cada pantalla es un <section class="vista">. Solo una se muestra a la vez.
// Los demás archivos cambian de pantalla con window.mostrarVistaChordLab("idVista").
// ==========================================

(() => {

    const btnVistaProyectos = document.getElementById("btnVistaProyectos");
    const btnVistaGenerador = document.getElementById("btnVistaGenerador");
    const btnVistaPerfil = document.getElementById("btnVistaPerfil");

    // Botón del menú que queda marcado en cada vista
    const BOTON_DE_VISTA = {
        vistaProyectos: btnVistaProyectos,
        vistaSecciones: btnVistaProyectos,
        vistaEditor: btnVistaProyectos,
        vistaCompartir: btnVistaProyectos,
        vistaGenerador: btnVistaGenerador,
        vistaPerfil: btnVistaPerfil
    };

    function mostrarVista(idVista) {

        document.querySelectorAll(".contenido > .vista").forEach(vista => {
            vista.classList.toggle("oculto", vista.id !== idVista);
        });

        document.querySelectorAll(".navegacion-principal .boton-nav").forEach(boton => {
            boton.classList.toggle("activo", boton === BOTON_DE_VISTA[idVista]);
        });

        // Avisar a los módulos que cambió la vista (por ejemplo, para detener la reproducción)
        document.dispatchEvent(new CustomEvent("chordlab:vista", { detail: idVista }));

        window.scrollTo({ top: 0 });
    }

    btnVistaProyectos.addEventListener("click", () => mostrarVista("vistaProyectos"));
    btnVistaGenerador.addEventListener("click", () => mostrarVista("vistaGenerador"));
    btnVistaPerfil.addEventListener("click", () => mostrarVista("vistaPerfil"));

    window.mostrarVistaChordLab = mostrarVista;

})();
