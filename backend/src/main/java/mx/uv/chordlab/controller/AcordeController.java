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

    /** GET /progresiones/{id}/acordes?tipo=maj7 (el filtro es opcional). */
    @GetMapping("/progresiones/{idProgresion}/acordes")
    public List<AcordeResponse> listar(@PathVariable Integer idProgresion,
                                       @RequestParam(required = false) String tipo) {
        return service.listar(idProgresion, tipo);
    }

    @PostMapping("/progresiones/{idProgresion}/acordes")
    @ResponseStatus(HttpStatus.CREATED)
    public AcordeResponse crear(@PathVariable Integer idProgresion, @Valid @RequestBody AcordeRequest req) {
        return service.crear(idProgresion, req);
    }

    @PutMapping("/acordes/{id}")
    public AcordeResponse actualizar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                                     @PathVariable Integer id,
                                     @Valid @RequestBody AcordeRequest req) {
        return service.actualizar(id, idUsuario, req);
    }

    @DeleteMapping("/acordes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario, @PathVariable Integer id) {
        service.eliminar(id, idUsuario);
    }
}
