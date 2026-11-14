package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.AcordeGenerado;
import mx.uv.chordlab.dto.AcordeProgresion;
import mx.uv.chordlab.dto.ProgresionGenerada;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/** Pruebas unitarias de la lógica musical (no necesitan MySQL). Ejecutar: mvn test */
class TeoriaMusicalServiceTest {

    private final TeoriaMusicalService teoria = new TeoriaMusicalService();

    private List<String> simbolos(ProgresionGenerada p) {
        return p.progresion().stream().map(AcordeProgresion::acorde).toList();
    }

    @Test
    void doMayorSeptimaComoEnLaDocumentacion() {
        AcordeGenerado a = teoria.generarAcorde("C", "maj7", 0);
        assertEquals(List.of("C", "E", "G", "B"), a.notas());
        assertEquals("Do mayor séptima", a.nombre());
        assertEquals("Cmaj7", a.simbolo());
    }

    @Test
    void triadasBasicas() {
        assertEquals(List.of("C", "E", "G"), teoria.generarAcorde("C", "mayor", 0).notas());
        assertEquals(List.of("A", "C", "E"), teoria.generarAcorde("A", "menor", 0).notas());
        assertEquals(List.of("B", "D", "F"), teoria.generarAcorde("B", "dim", 0).notas());
        assertEquals(List.of("C", "E", "G#"), teoria.generarAcorde("C", "aug", 0).notas());
    }

    @Test
    void ortografiaCorrectaConBemoles() {
        assertEquals(List.of("F", "A", "C", "Eb"), teoria.generarAcorde("F", "7", 0).notas());
        assertEquals(List.of("Bb", "D", "F"), teoria.generarAcorde("bb", "mayor", 0).notas());
        assertEquals(List.of("C", "Eb", "Gb", "Bbb"), teoria.generarAcorde("C", "dim7", 0).notas());
    }

    @Test
    void inversiones() {
        AcordeGenerado primera = teoria.generarAcorde("C", "mayor", 1);
        assertEquals(List.of("E", "G", "C"), primera.notas());
        assertEquals(List.of("E4", "G4", "C5"), primera.notasConOctava());
        assertThrows(IllegalArgumentException.class, () -> teoria.generarAcorde("C", "mayor", 3));
    }

    @Test
    void aliasDeTipos() {
        assertEquals("menor", teoria.normalizarTipo("m"));
        assertEquals("mayor", teoria.normalizarTipo("M"));
        assertEquals("7", teoria.normalizarTipo("septima"));
    }

    @Test
    void datosInvalidos() {
        assertThrows(IllegalArgumentException.class, () -> teoria.generarAcorde("H", "mayor", 0));
        assertThrows(IllegalArgumentException.class, () -> teoria.generarAcorde("C", "raro", 0));
        assertThrows(IllegalArgumentException.class, () -> teoria.normalizarEscala("dórica"));
    }

    @Test
    void escalas() {
        assertEquals(List.of("F", "G", "A", "Bb", "C", "D", "E"), teoria.notasEscala("F", "mayor"));
        assertEquals(List.of("A", "B", "C", "D", "E", "F", "G"), teoria.notasEscala("A", "menor"));
    }

    @Test
    void progresionPopEnDoMayorComoEnLaDocumentacion() {
        ProgresionGenerada p = teoria.generarProgresion("C", "mayor", 4, "pop", null);
        assertEquals(List.of("C", "G", "Am", "F"), simbolos(p));
        assertEquals(List.of("I", "V", "vi", "IV"), p.progresion().stream().map(AcordeProgresion::grado).toList());
    }

    @Test
    void progresionesPorEstilo() {
        assertEquals(List.of("Am", "F", "C", "G"), simbolos(teoria.generarProgresion("A", "menor", 4, "pop", null)));
        assertEquals(List.of("Dm7", "G7", "Cmaj7", "Cmaj7"), simbolos(teoria.generarProgresion("C", "mayor", 4, "jazz", null)));
        assertEquals(List.of("Am", "Dm", "E", "Am"), simbolos(teoria.generarProgresion("A", "menor", 4, "clasico", null)));
        assertEquals(12, teoria.generarProgresion("E", "mayor", 12, "blues", null).progresion().size());
        // El patrón se repite si se piden más acordes
        assertEquals(List.of("C", "G", "Am", "F", "C", "G"), simbolos(teoria.generarProgresion("C", "mayor", 6, "pop", null)));
    }

    @Test
    void aleatorioEsReproducibleConSemillaYTerminaEnCadencia() {
        ProgresionGenerada a = teoria.generarProgresion("G", "mayor", 8, "aleatorio", 42L);
        ProgresionGenerada b = teoria.generarProgresion("G", "mayor", 8, "aleatorio", 42L);
        assertEquals(simbolos(a), simbolos(b));
        assertEquals("G", a.progresion().get(0).acorde());
        String ultimo = a.progresion().get(7).acorde();
        assertTrue(ultimo.equals("G") || ultimo.equals("D"), "Debe terminar en I o V, terminó en " + ultimo);
    }
}
