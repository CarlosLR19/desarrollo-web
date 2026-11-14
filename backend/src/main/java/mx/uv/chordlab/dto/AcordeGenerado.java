package mx.uv.chordlab.dto;

import java.util.List;

/**
 * Resultado del generador de acordes.
 * - notas: nombres con ortografía musical correcta (p. ej. F7 = F A C Eb).
 * - notasConOctava: notas listas para reproducirse con Tone.js (p. ej. "C4", "E4").
 */
public record AcordeGenerado(
        String fundamental,
        String tipo,
        Integer inversion,
        String simbolo,
        String nombre,
        List<String> notas,
        List<String> notasConOctava
) {}
