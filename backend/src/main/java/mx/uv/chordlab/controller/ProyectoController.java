package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.ProyectoRequest;
import mx.uv.chordlab.dto.ProyectoResponse;
import mx.uv.chordlab.service.ProyectoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proyectos")
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    /** GET /proyectos?busqueda=cancion&tonalidad=C&escala=mayor&pagina=0&limite=10 (todos los filtros son opcionales). */
    @GetMapping
    public ResponseEntity<List<ProyectoResponse>> listar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                                                         @RequestParam(defaultValue = "") String busqueda,
                                                         @RequestParam(required = false) String tonalidad,
                                                         @RequestParam(required = false) String escala,
                                                         @RequestParam(defaultValue = "0") int pagina,
                                                         @RequestParam(defaultValue = "50") int limite) {
        ProyectoService.Resultado r = service.listar(idUsuario, busqueda, tonalidad, escala, pagina, limite);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(r.total()))
                .body(r.proyectos());
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

    @PutMapping("/{id}")
    public ProyectoResponse actualizar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                                       @PathVariable Integer id,
                                       @Valid @RequestBody ProyectoRequest req) {
        return service.actualizar(id, idUsuario, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario, @PathVariable Integer id) {
        service.eliminar(id, idUsuario);
    }
}
