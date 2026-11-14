package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.AcordeGenerado;
import mx.uv.chordlab.dto.GenerarAcordeRequest;
import mx.uv.chordlab.dto.GenerarProgresionRequest;
import mx.uv.chordlab.dto.ProgresionGenerada;
import mx.uv.chordlab.service.TeoriaMusicalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Generador musical: no guarda nada en la base de datos, solo calcula. */
@RestController
@RequestMapping("/musica")
public class MusicaController {

    private final TeoriaMusicalService teoria;

    public MusicaController(TeoriaMusicalService teoria) {
        this.teoria = teoria;
    }

    @PostMapping("/acordes/generar")
    public AcordeGenerado generarAcorde(@Valid @RequestBody GenerarAcordeRequest req) {
        int inversion = req.inversion() == null ? 0 : req.inversion();
        return teoria.generarAcorde(req.fundamental(), req.tipo(), inversion);
    }

    @PostMapping("/progresiones/generar")
    public ProgresionGenerada generarProgresion(@Valid @RequestBody GenerarProgresionRequest req) {
        return teoria.generarProgresion(req.tonalidad(), req.escala(), req.cantidadAcordes(), req.estilo(), req.semilla());
    }

    /** Opciones válidas para llenar los menús del frontend. */
    @GetMapping("/catalogo")
    public Map<String, List<String>> catalogo() {
        return Map.of(
                "notas", List.of("C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"),
                "tipos", teoria.tiposDisponibles(),
                "escalas", List.of("mayor", "menor"),
                "estilos", TeoriaMusicalService.ESTILOS);
    }

    /** Notas de una escala, p. ej. GET /musica/escalas?tonalidad=F&escala=mayor */
    @GetMapping("/escalas")
    public Map<String, Object> escala(@RequestParam String tonalidad, @RequestParam String escala) {
        return Map.of(
                "tonalidad", teoria.normalizarNota(tonalidad),
                "escala", teoria.normalizarEscala(escala),
                "notas", teoria.notasEscala(tonalidad, escala));
    }
}
