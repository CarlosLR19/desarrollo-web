package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.*;
import mx.uv.chordlab.entity.Usuario;
import mx.uv.chordlab.exception.ConflictoException;
import mx.uv.chordlab.exception.NoAutorizadoException;
import mx.uv.chordlab.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    /** RF01: registro con contraseña cifrada con BCrypt (RNF04). */
    @Transactional
    public RegistroResponse registrar(RegistroRequest req) {
        String correo = normalizarCorreo(req.correo());
        if (usuarios.existsByCorreo(correo)) {
            throw new ConflictoException("Ya existe una cuenta registrada con ese correo");
        }
        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setCorreo(correo);
        u.setContrasenaHash(encoder.encode(req.contrasena()));
        usuarios.save(u);
        return new RegistroResponse("Usuario registrado correctamente", u.getIdUsuario());
    }

    /** RF02: inicio de sesión. El token JWT se incorpora en el Entregable 3. */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest req) {
        Usuario u = usuarios.findByCorreo(normalizarCorreo(req.correo()))
                .filter(x -> encoder.matches(req.contrasena(), x.getContrasenaHash()))
                .orElseThrow(() -> new NoAutorizadoException("Correo o contraseña incorrectos"));
        return new LoginResponse("Inicio de sesión exitoso", u.getIdUsuario(), u.getNombre());
    }

    @Transactional(readOnly = true)
    public PerfilResponse perfil(Integer idUsuario) {
        Usuario u = buscar(idUsuario);
        return new PerfilResponse(u.getIdUsuario(), u.getNombre(), u.getCorreo(), u.getFechaRegistro());
    }

    /** Busca al usuario que hace la petición; si no existe la petición no está autorizada. */
    @Transactional(readOnly = true)
    public Usuario buscar(Integer idUsuario) {
        return usuarios.findById(idUsuario)
                .orElseThrow(() -> new NoAutorizadoException("El usuario " + idUsuario + " no existe"));
    }

    private String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase(Locale.ROOT);
    }
}
