package mx.uv.chordlab.dto;

import java.util.List;

public record ProgresionGenerada(String tonalidad, String escala, String estilo, List<AcordeProgresion> progresion) {}
