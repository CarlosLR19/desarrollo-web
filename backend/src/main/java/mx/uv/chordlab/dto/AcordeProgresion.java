package mx.uv.chordlab.dto;

import java.util.List;

/** Un acorde dentro de una progresión generada: "acorde" es el cifrado (Am) y "grado" el número romano (vi). */
public record AcordeProgresion(String acorde, String grado, String fundamental, String tipo, List<String> notas) {}
