// ==========================================
// DIAGRAMA DE GUITARRA (RF09)
// Busca una posición tocable del acorde en afinación estándar
// y la dibuja como diagrama (SVG).
// ==========================================

(() => {

    const BASE_NOTA = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

    // Cuerdas al aire de la 6ª (grave) a la 1ª (aguda): E2 A2 D3 G3 B3 E4
    const CUERDAS = [40, 45, 50, 55, 59, 64];
    const NOMBRES_CUERDAS = ["E", "A", "D", "G", "B", "E"];
    const NOMBRES_NOTAS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    const TRASTES_VISIBLES = 5;

    // Clase de altura de una nota sin octava: "Eb" -> 3, "F#" -> 6
    function claseDeAltura(nota) {
        const letra = nota[0];
        let valor = BASE_NOTA[letra];

        for (const signo of nota.slice(1)) {
            if (signo === "#") valor += 1;
            if (signo === "x") valor += 2;
            if (signo === "b") valor -= 1;
        }

        return ((valor % 12) + 12) % 12;
    }

    // Revisa una combinación de trastes (-1 = cuerda muda) y le da un puntaje.
    // Devuelve null si no sirve. Menor puntaje = posición más cómoda.
    function evaluar(trastes, clases, clasesObligatorias, bajo, inicio) {

        const tocadas = trastes
            .map((traste, cuerda) => ({ traste, cuerda }))
            .filter(t => t.traste >= 0);

        if (tocadas.length < Math.min(3, clases.length)) {
            return null;
        }

        // La nota más grave debe ser el bajo del acorde (fundamental o inversión)
        const masGrave = tocadas[0];
        if ((CUERDAS[masGrave.cuerda] + masGrave.traste) % 12 !== bajo) {
            return null;
        }

        const presentes = new Set(
            tocadas.map(t => (CUERDAS[t.cuerda] + t.traste) % 12)
        );

        if (!clasesObligatorias.every(c => presentes.has(c))) {
            return null;
        }

        // Dedos: los trastes pisados; si el traste más bajo se repite se toma como cejilla
        const pisadas = tocadas.filter(t => t.traste > 0).map(t => t.traste);
        let dedos = pisadas.length;

        if (pisadas.length > 0) {
            const menor = Math.min(...pisadas);
            const enCejilla = pisadas.filter(t => t === menor).length;
            if (enCejilla > 1) dedos -= enCejilla - 1;
        }

        if (dedos > 4) {
            return null;
        }

        // Cuerdas mudas: en los graves es normal; entre cuerdas tocadas es difícil
        const primera = tocadas[0].cuerda;
        const ultima = tocadas[tocadas.length - 1].cuerda;
        let mudasInternas = 0;

        for (let c = primera; c <= ultima; c++) {
            if (trastes[c] < 0) mudasInternas++;
        }

        const mudasGraves = primera;
        const mudasAgudas = CUERDAS.length - 1 - ultima;

        const faltantes = clases.length - [...presentes].filter(c => clases.includes(c)).length;

        // Separación entre dedos y altura promedio en el mástil
        const mayorPisada = pisadas.length ? Math.max(...pisadas) : 0;
        const menorPisada = pisadas.length ? Math.min(...pisadas) : 0;
        const separacion = mayorPisada - menorPisada;
        const promedio = tocadas.reduce((suma, t) => suma + t.traste, 0) / tocadas.length;

        // Mezclar cuerdas al aire con trastes altos suena y se ve raro
        const alAireConTrastesAltos = tocadas.some(t => t.traste === 0) && mayorPisada >= 4;

        return mudasGraves * 0.8
            + mudasAgudas * 1.5
            + mudasInternas * 5
            + faltantes * 4
            + dedos * 0.3
            + separacion * 0.6
            + promedio * 0.25
            + inicio * 0.35
            + (alAireConTrastesAltos ? 1.5 : 0);
    }

    // notas: nombres del acorde; la primera es la más grave (["F", "A", "C", "Eb"])
    function buscarPosicion(notas) {

        const clases = [...new Set(notas.map(claseDeAltura))];
        const bajo = claseDeAltura(notas[0]);

        // En acordes de 5 notas o más se permite omitir la quinta
        const quinta = (claseDeAltura(notas[0]) + 7) % 12;
        const clasesObligatorias = clases.length > 4
            ? clases.filter(c => c !== quinta)
            : clases;

        let mejor = null;

        for (let inicio = 0; inicio <= 10; inicio++) {

            const desde = Math.max(1, inicio);
            const hasta = inicio === 0 ? 3 : inicio + 3;

            // Opciones de cada cuerda: muda, al aire (si suena) o un traste de la ventana
            const opciones = CUERDAS.map(abierta => {
                const lista = [-1];

                if (clases.includes(abierta % 12)) lista.push(0);

                for (let traste = desde; traste <= hasta; traste++) {
                    if (clases.includes((abierta + traste) % 12)) lista.push(traste);
                }

                return lista;
            });

            const actual = [];

            const recorrer = (cuerda) => {
                if (cuerda === CUERDAS.length) {
                    const puntaje = evaluar(actual, clases, clasesObligatorias, bajo, inicio);
                    if (puntaje !== null && (mejor === null || puntaje < mejor.puntaje)) {
                        mejor = { trastes: [...actual], puntaje };
                    }
                    return;
                }

                for (const traste of opciones[cuerda]) {
                    actual[cuerda] = traste;
                    recorrer(cuerda + 1);
                }
            };

            recorrer(0);
        }

        return mejor ? mejor.trastes : null;
    }

    function crearSvg(etiqueta, atributos = {}) {
        const elemento = document.createElementNS("http://www.w3.org/2000/svg", etiqueta);
        Object.entries(atributos).forEach(([clave, valor]) => elemento.setAttribute(clave, valor));
        return elemento;
    }

    function dibujar(contenedor, notas = []) {

        contenedor.replaceChildren();

        if (notas.length === 0) {
            return;
        }

        const trastes = buscarPosicion(notas);

        if (!trastes) {
            const aviso = document.createElement("p");
            aviso.className = "guitarra-aviso";
            aviso.textContent = "No se encontró una posición cómoda para este acorde.";
            contenedor.appendChild(aviso);
            return;
        }

        const pisados = trastes.filter(t => t > 0);
        const mayor = pisados.length ? Math.max(...pisados) : 0;
        const menor = pisados.length ? Math.min(...pisados) : 1;

        // Si todo cabe en los primeros trastes se dibuja la cejuela; si no, se indica el traste inicial
        const primerTraste = mayor <= TRASTES_VISIBLES ? 1 : menor;

        const ancho = 190;
        const alto = 230;
        const margenX = 30;
        const margenY = 45;
        const sepCuerda = (ancho - margenX * 2) / 5;
        const sepTraste = 30;

        const svg = crearSvg("svg", {
            viewBox: `0 0 ${ancho} ${alto}`,
            class: "diagrama-guitarra",
            role: "img",
            "aria-label": "Diagrama de guitarra"
        });

        // Trastes (líneas horizontales)
        for (let i = 0; i <= TRASTES_VISIBLES; i++) {
            const y = margenY + i * sepTraste;
            svg.appendChild(crearSvg("line", {
                x1: margenX, y1: y, x2: ancho - margenX, y2: y,
                class: i === 0 && primerTraste === 1 ? "cejuela" : "traste"
            }));
        }

        // Cuerdas (líneas verticales)
        CUERDAS.forEach((_, c) => {
            const x = margenX + c * sepCuerda;
            svg.appendChild(crearSvg("line", {
                x1: x, y1: margenY, x2: x, y2: margenY + TRASTES_VISIBLES * sepTraste,
                class: "cuerda"
            }));
        });

        if (primerTraste > 1) {
            const numero = crearSvg("text", {
                x: margenX - 10, y: margenY + sepTraste * 0.65, class: "numero-traste", "text-anchor": "end"
            });
            numero.textContent = primerTraste + "fr";
            svg.appendChild(numero);
        }

        trastes.forEach((traste, c) => {
            const x = margenX + c * sepCuerda;

            // Arriba: X = no se toca, O = al aire
            if (traste <= 0) {
                const marca = crearSvg("text", {
                    x, y: margenY - 12, class: "marca-cuerda", "text-anchor": "middle"
                });
                marca.textContent = traste < 0 ? "×" : "○";
                svg.appendChild(marca);
            } else {
                const y = margenY + (traste - primerTraste + 0.5) * sepTraste;
                svg.appendChild(crearSvg("circle", { cx: x, cy: y, r: 10, class: "dedo" }));
            }

            // Abajo: nota que suena en cada cuerda
            const nota = crearSvg("text", {
                x, y: alto - 12, class: "nota-cuerda", "text-anchor": "middle"
            });
            nota.textContent = traste < 0 ? "" : NOMBRES_NOTAS[(CUERDAS[c] + traste) % 12];
            svg.appendChild(nota);
        });

        contenedor.appendChild(svg);

        const leyenda = document.createElement("p");
        leyenda.className = "guitarra-leyenda";
        leyenda.textContent = "Cuerdas " + NOMBRES_CUERDAS.join(" ") + " · trastes: "
            + trastes.map(t => (t < 0 ? "x" : t)).join("-");
        contenedor.appendChild(leyenda);
    }

    window.GuitarraChordLab = { dibujar, buscarPosicion };

})();
