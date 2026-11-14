package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.SeccionRequest;
import mx.uv.chordlab.dto.SeccionResponse;
import mx.uv.chordlab.service.SeccionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SeccionController {

    private final SeccionService service;

    public SeccionController(SeccionService service) {
        this.service = service;
    }

    @GetMapping("/proyectos/{idProyecto}/secciones")
    public List<SeccionResponse> listar(@PathVariable Integer idProyecto) {
        return service.listar(idProyecto);
    }

    @PostMapping("/proyectos/{idProyecto}/secciones")
    @ResponseStatus(HttpStatus.CREATED)
    public SeccionResponse crear(@PathVariable Integer idProyecto, @Valid @RequestBody SeccionRequest req) {
        return service.crear(idProyecto, req);
    }
}
