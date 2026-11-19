//Define la dirección de nuestro backend.
//Permite enviar peticiones GET, POST, PUT y DELETE.
//Convierte los datos de JavaScript a JSON.
//Agrega el encabezado X-Usuario-Id cuando una operación lo necesita.
//Detecta errores y devuelve su mensaje.
const API_URL = "http://localhost:8090/api";

async function peticionAPI(endpoint, metodo = "GET", datos = null, usuarioId = null) {
    const opciones = {
        method: metodo,
        headers: {}
    };

    if (datos !== null) {
        opciones.headers["Content-Type"] = "application/json";
        opciones.body = JSON.stringify(datos);
    }

    if (usuarioId !== null) {
        opciones.headers["X-Usuario-Id"] = usuarioId;
    }

    const respuesta = await fetch(`${API_URL}${endpoint}`, opciones);

    if (respuesta.status === 204) {
        return null;
    }

    const contenido = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        throw new Error(contenido?.mensaje || "Ocurrió un error en la solicitud.");
    }

    return contenido;
}
