// ==========================================
// TECLADO VIRTUAL (RF09)
// Dibuja dos octavas de piano e ilumina las notas del acorde.
// Se usa en el generador, en el editor y en los proyectos compartidos.
// ==========================================

(() => {

    // Valor de cada letra dentro de una octava (C = 0 ... B = 11)
    const BASE_NOTA = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

    const NOTAS_BLANCAS = ["C", "D", "E", "F", "G", "A", "B"];
    const CON_TECLA_NEGRA = ["C", "D", "F", "G", "A"];   // blancas con una negra a su derecha

    // Convierte "Eb5" o "C#4" en su número MIDI (C4 = 60).
    // Así Eb y D# dan el mismo número y se ilumina la misma tecla.
    function aMidi(nota) {
        const partes = nota.match(/^([A-G])(bb|b|#|x)?(-?\d+)$/);

        if (!partes) {
            return null;
        }

        const [, letra, alteracion, octava] = partes;
        const cambio = { "#": 1, "x": 2, "b": -1, "bb": -2 }[alteracion] ?? 0;

        return 12 * (Number(octava) + 1) + BASE_NOTA[letra] + cambio;
    }

    function crearTecla(clase, nombre, activas) {
        const tecla = document.createElement("div");
        tecla.className = clase;
        tecla.title = nombre;

        if (activas.includes(aMidi(nombre))) {
            tecla.classList.add("activa");
        }

        return tecla;
    }

    // contenedor: el div con clase "teclado-piano"
    // notasConOctava: ["F4", "A4", "C5", "Eb5"]
    function dibujar(contenedor, notasConOctava = []) {

        contenedor.replaceChildren();

        const activas = notasConOctava.map(aMidi).filter(n => n !== null);

        // El teclado empieza en el Do de la octava de la nota más grave
        const octavaInicial = activas.length > 0
            ? Math.floor(Math.min(...activas) / 12) - 1
            : 4;

        for (let octava = octavaInicial; octava <= octavaInicial + 1; octava++) {

            NOTAS_BLANCAS.forEach(nota => {

                contenedor.appendChild(
                    crearTecla("tecla-blanca", nota + octava, activas)
                );

                if (CON_TECLA_NEGRA.includes(nota)) {
                    contenedor.appendChild(
                        crearTecla("tecla-negra", nota + "#" + octava, activas)
                    );
                }
            });
        }
    }

    window.TecladoChordLab = { dibujar, aMidi };

})();
