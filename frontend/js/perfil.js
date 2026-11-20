// ==========================================
// PERFIL DE USUARIO (RF03)
// Consulta los datos del usuario y permite cambiar su nombre.
// ==========================================

(() => {

    const idUsuarioPerfil = sessionStorage.getItem("idUsuario");

    const avatarPerfil = document.getElementById("avatarPerfil");
    const nombrePerfil = document.getElementById("nombrePerfil");
    const correoPerfil = document.getElementById("correoPerfil");
    const fechaPerfil = document.getElementById("fechaPerfil");
    const formPerfil = document.getElementById("formPerfil");
    const nombrePerfilInput = document.getElementById("nombrePerfilInput");
    const correoPerfilInput = document.getElementById("correoPerfilInput");
    const mensajePerfil = document.getElementById("mensajePerfil");

    function mostrarMensaje(texto = "", tipo = "") {
        mensajePerfil.textContent = texto;
        mensajePerfil.className = `mensaje ${tipo}`;
    }

    function mostrarPerfil(perfil) {
        avatarPerfil.textContent = perfil.nombre.trim().charAt(0).toUpperCase() || "U";
        nombrePerfil.textContent = perfil.nombre;
        correoPerfil.textContent = perfil.correo;

        fechaPerfil.textContent = perfil.fechaRegistro
            ? "Miembro desde el " + new Date(perfil.fechaRegistro).toLocaleDateString("es-MX", {
                day: "numeric", month: "long", year: "numeric"
            })
            : "";

        nombrePerfilInput.value = perfil.nombre;
        correoPerfilInput.value = perfil.correo;

        // Mantener el nombre del encabezado actualizado
        sessionStorage.setItem("nombreUsuario", perfil.nombre);
        document.getElementById("nombreUsuario").textContent = perfil.nombre;
    }

    async function cargarPerfil() {
        mostrarMensaje();

        try {
            const perfil = await peticionAPI("/usuarios/perfil", "GET", null, idUsuarioPerfil);
            mostrarPerfil(perfil);
        } catch (error) {
            nombrePerfil.textContent = "No fue posible cargar el perfil.";
            mostrarMensaje(error.message, "error");
        }
    }

    async function guardarPerfil(evento) {
        evento.preventDefault();

        try {
            const perfil = await peticionAPI(
                "/usuarios/perfil",
                "PUT",
                { nombre: nombrePerfilInput.value.trim() },
                idUsuarioPerfil
            );

            mostrarPerfil(perfil);
            mostrarMensaje("Perfil actualizado correctamente.", "exito");
        } catch (error) {
            mostrarMensaje(error.message, "error");
        }
    }

    formPerfil.addEventListener("submit", guardarPerfil);

    // Cargar los datos cada vez que se abre la vista
    document.addEventListener("chordlab:vista", (evento) => {
        if (evento.detail === "vistaPerfil") cargarPerfil();
    });

})();
