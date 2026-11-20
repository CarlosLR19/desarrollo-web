package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.CompartirRequest;
import mx.uv.chordlab.dto.CompartirResponse;
import mx.uv.chordlab.dto.ProyectoCompartidoResponse;
import mx.uv.chordlab.dto.ProyectoRequest;
import mx.uv.chordlab.dto.ProyectoResponse;
import mx.uv.chordlab.service.CompartirService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints para compartir proyectos (RF16, RF17). */
@RestController
public class CompartirController {

    private final CompartirService service;

    public CompartirController(CompartirService service) {
        this.service = service;
    }

    /** Propietario: genera un enlace. Cuerpo: {"permiso": "lectura", "diasExpiracion": 7} */
    @PostMapping("/proyectos/{id}/compartir")
    @ResponseStatus(HttpStatus.CREATED)
    public CompartirResponse crear(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                                   @PathVariable Integer id,
                                   @Valid @RequestBody CompartirRequest req) {
        return service.crear(id, idUsuario, req);
    }

    /** Propietario: lista los enlaces de su proyecto. */
    @GetMapping("/proyectos/{id}/compartidos")
    public List<CompartirResponse> listar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                                          @PathVariable Integer id) {
        return service.listar(id, idUsuario);
    }

    /** Propietario: desactiva un enlace. */
    @DeleteMapping("/compartidos/{idCompartir}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario,
                           @PathVariable Integer idCompartir) {
        service.desactivar(idCompartir, idUsuario);
    }

    /** Público con token: consulta el proyecto compartido. */
    @GetMapping("/compartidos/{token}")
    public ProyectoCompartidoResponse obtener(@PathVariable String token) {
        return service.obtenerPorToken(token);
    }

    /** Público con token de edición: modifica los datos generales del proyecto. */
    @PutMapping("/compartidos/{token}")
    public ProyectoResponse actualizar(@PathVariable String token,
                                       @Valid @RequestBody ProyectoRequest req) {
        return service.actualizarPorToken(token, req);
    }
}
