package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.ProyectoRequest;
import mx.uv.chordlab.dto.ProyectoResponse;
import mx.uv.chordlab.service.ProyectoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proyectos")
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProyectoResponse> listar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario) {
        return service.listar(idUsuario);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProyectoResponse crear(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                                  @Valid @RequestBody ProyectoRequest req) {
        return service.crear(idUsuario, req);
    }

    @GetMapping("/{id}")
    public ProyectoResponse obtener(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                                    @PathVariable Integer id) {
        return service.obtener(id, idUsuario);
    }
}
