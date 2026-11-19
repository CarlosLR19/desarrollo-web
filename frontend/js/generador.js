
(() => {

    const fundamentalAcorde = document.getElementById("fundamentalAcorde");
    const tipoAcorde = document.getElementById("tipoAcorde");
    const inversionAcorde = document.getElementById("inversionAcorde");

    const btnGenerarAcorde = document.getElementById("btnGenerarAcorde");
    const mensajeGenerador = document.getElementById("mensajeGenerador");

    const resultadoAcorde = document.getElementById("resultadoAcorde");
    const nombreAcorde = document.getElementById("nombreAcorde");
    const simboloAcorde = document.getElementById("simboloAcorde");
    const notasAcorde = document.getElementById("notasAcorde");

    // Cargar opciones desde el catálogo del backend
    async function cargarCatalogoGenerador() {
        try {
            const catalogo = await peticionAPI("/musica/catalogo");

            fundamentalAcorde.replaceChildren();
            tipoAcorde.replaceChildren();

            catalogo.notas.forEach(nota => {
                const opcion = document.createElement("option");
                opcion.value = nota;
                opcion.textContent = nota;
                fundamentalAcorde.appendChild(opcion);
            });

            catalogo.tipos.forEach(tipo => {
                const opcion = document.createElement("option");
                opcion.value = tipo;
                opcion.textContent = tipo;
                tipoAcorde.appendChild(opcion);
            });

        } catch (error) {
            mensajeGenerador.textContent =
                "No fue posible cargar el catálogo musical.";
        }
    }

    // Generar acorde mediante la API
    async function generarAcorde() {
        mensajeGenerador.textContent = "Generando acorde...";
        resultadoAcorde.classList.add("oculto");

        const datos = {
            fundamental: fundamentalAcorde.value,
            tipo: tipoAcorde.value,
            inversion: Number(inversionAcorde.value)
        };

        try {
            const acorde = await peticionAPI(
                "/musica/acordes/generar",
                "POST",
                datos
            );

            nombreAcorde.textContent = acorde.nombre;
            simboloAcorde.textContent = acorde.simbolo;

            notasAcorde.replaceChildren();

            acorde.notas.forEach(nota => {
                const elemento = document.createElement("span");
                elemento.textContent = nota;
                elemento.className = "nota-acorde";

                notasAcorde.appendChild(elemento);
            });

            resultadoAcorde.classList.remove("oculto");
            mensajeGenerador.textContent = "Acorde generado correctamente.";

        } catch (error) {
            mensajeGenerador.textContent = error.message;
        }
    }

    btnGenerarAcorde.addEventListener("click", generarAcorde);

    cargarCatalogoGenerador();

})();
