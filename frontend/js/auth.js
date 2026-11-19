
const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");

const tabLogin = document.getElementById("tabLogin");
const tabRegistro = document.getElementById("tabRegistro");

const mensaje = document.getElementById("mensaje");

// Cambiar entre inicio de sesión y registro
tabLogin.addEventListener("click", () => {
    formLogin.classList.remove("oculto");
    formRegistro.classList.add("oculto");

    tabLogin.classList.add("activo");
    tabRegistro.classList.remove("activo");

    mensaje.textContent = "";
});

tabRegistro.addEventListener("click", () => {
    formRegistro.classList.remove("oculto");
    formLogin.classList.add("oculto");

    tabRegistro.classList.add("activo");
    tabLogin.classList.remove("activo");

    mensaje.textContent = "";
});

// Mostrar mensajes al usuario
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

// Inicio de sesión
formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const datos = {
        correo: document.getElementById("correoLogin").value.trim(),
        contrasena: document.getElementById("contrasenaLogin").value
    };

    try {
        const respuesta = await peticionAPI(
            "/usuarios/login",
            "POST",
            datos
        );

        sessionStorage.setItem("idUsuario", respuesta.idUsuario);
        sessionStorage.setItem("nombreUsuario", respuesta.nombre);

        window.location.href = "proyectos.html";

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
});

// Registro de usuario
formRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const datos = {
        nombre: document.getElementById("nombreRegistro").value.trim(),
        correo: document.getElementById("correoRegistro").value.trim(),
        contrasena: document.getElementById("contrasenaRegistro").value
    };

    try {
        const respuesta = await peticionAPI(
            "/usuarios/registro",
            "POST",
            datos
        );

        mostrarMensaje(
            respuesta.mensaje || "¡Cuenta creada correctamente!",
            "exito"
        );

        formRegistro.reset();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
});
