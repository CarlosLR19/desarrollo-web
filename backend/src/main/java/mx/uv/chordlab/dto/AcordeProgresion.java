package mx.uv.chordlab.dto;

import java.util.List;

/**
 * Un acorde dentro de una progresión generada: "acorde" es el cifrado (Am) y "grado" el número romano (vi).
 * notasConOctava sirve para dibujar el teclado y reproducir el acorde (p. ej. "A3", "C4", "E4").
 */
public record AcordeProgresion(String acorde, String grado, String fundamental, String tipo, List<String> notas,
                               List<String> notasConOctava) {}
