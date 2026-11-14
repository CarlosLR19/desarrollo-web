package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.AcordeRequest;
import mx.uv.chordlab.dto.AcordeResponse;
import mx.uv.chordlab.service.AcordeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AcordeController {

    private final AcordeService service;

    public AcordeController(AcordeService service) {
        this.service = service;
    }

    @GetMapping("/progresiones/{idProgresion}/acordes")
    public List<AcordeResponse> listar(@PathVariable Integer idProgresion) {
        return service.listar(idProgresion);
    }

    @PostMapping("/progresiones/{idProgresion}/acordes")
    @ResponseStatus(HttpStatus.CREATED)
    public AcordeResponse crear(@PathVariable Integer idProgresion, @Valid @RequestBody AcordeRequest req) {
        return service.crear(idProgresion, req);
    }
}
