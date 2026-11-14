package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.ProgresionRequest;
import mx.uv.chordlab.dto.ProgresionResponse;
import mx.uv.chordlab.service.ProgresionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProgresionController {

    private final ProgresionService service;

    public ProgresionController(ProgresionService service) {
        this.service = service;
    }

    @GetMapping("/secciones/{idSeccion}/progresiones")
    public List<ProgresionResponse> listar(@PathVariable Integer idSeccion) {
        return service.listar(idSeccion);
    }

    @PostMapping("/secciones/{idSeccion}/progresiones")
    @ResponseStatus(HttpStatus.CREATED)
    public ProgresionResponse crear(@PathVariable Integer idSeccion, @Valid @RequestBody ProgresionRequest req) {
        return service.crear(idSeccion, req);
    }

    @GetMapping("/progresiones/{id}")
    public ProgresionResponse obtener(@PathVariable Integer id) {
        return service.obtener(id);
    }
}
