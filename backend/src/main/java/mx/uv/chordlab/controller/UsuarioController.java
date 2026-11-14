package mx.uv.chordlab.controller;

import jakarta.validation.Valid;
import mx.uv.chordlab.dto.*;
import mx.uv.chordlab.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistroResponse registrar(@Valid @RequestBody RegistroRequest req) {
        return service.registrar(req);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return service.login(req);
    }

    @GetMapping("/perfil")
    public PerfilResponse perfil(@RequestHeader(Cabeceras.USUARIO) Integer idUsuario) {
        return service.perfil(idUsuario);
    }
}
