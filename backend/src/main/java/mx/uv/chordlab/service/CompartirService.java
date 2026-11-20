package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.*;
import mx.uv.chordlab.entity.CompartirProyecto;
import mx.uv.chordlab.entity.Proyecto;
import mx.uv.chordlab.exception.ProhibidoException;
import mx.uv.chordlab.exception.RecursoNoEncontradoException;
import mx.uv.chordlab.repository.CompartirProyectoRepository;
import mx.uv.chordlab.repository.ProgresionRepository;
import mx.uv.chordlab.repository.SeccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Set;

/** RF16 y RF17: enlaces para compartir proyectos con permiso de lectura o de edición. */
@Service
public class CompartirService {

    private static final Set<String> PERMISOS = Set.of("lectura", "edicion");
    private static final SecureRandom ALEATORIO = new SecureRandom();

    private final CompartirProyectoRepository enlaces;
    private final SeccionRepository secciones;
    private final ProgresionRepository progresiones;
    private final ProyectoService proyectoService;
    private final AcordeService acordeService;

    public CompartirService(CompartirProyectoRepository enlaces, SeccionRepository secciones,
                            ProgresionRepository progresiones, ProyectoService proyectoService,
                            AcordeService acordeService) {
        this.enlaces = enlaces;
        this.secciones = secciones;
        this.progresiones = progresiones;
        this.proyectoService = proyectoService;
        this.acordeService = acordeService;
    }

    /** Genera un enlace nuevo. Solo el propietario del proyecto puede hacerlo. */
    @Transactional
    public CompartirResponse crear(Integer idProyecto, Integer idUsuario, CompartirRequest req) {
        Proyecto proyecto = proyectoService.buscarDelUsuario(idProyecto, idUsuario);
        String permiso = req.permiso().trim().toLowerCase();
        if (!PERMISOS.contains(permiso)) {
            throw new IllegalArgumentException("El permiso debe ser lectura o edicion");
        }
        CompartirProyecto c = new CompartirProyecto();
        c.setProyecto(proyecto);
        c.setPermiso(permiso);
        c.setToken(generarToken());
        if (req.diasExpiracion() != null) {
            c.setFechaExpiracion(LocalDateTime.now().plusDays(req.diasExpiracion()));
        }
        enlaces.save(c);
        return CompartirResponse.de(c, "Enlace generado correctamente");
    }

    @Transactional(readOnly = true)
    public List<CompartirResponse> listar(Integer idProyecto, Integer idUsuario) {
        proyectoService.buscarDelUsuario(idProyecto, idUsuario);
        return enlaces.findByProyectoIdProyectoOrderByIdCompartirDesc(idProyecto).stream()
                .map(c -> CompartirResponse.de(c, null))
                .toList();
    }

    /** Desactiva el enlace (no se borra, para conservar el historial). */
    @Transactional
    public void desactivar(Integer idCompartir, Integer idUsuario) {
        CompartirProyecto c = enlaces.findById(idCompartir)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el enlace " + idCompartir));
        proyectoService.buscarDelUsuario(c.getProyecto().getIdProyecto(), idUsuario);
        c.setActivo(false);
        enlaces.save(c);
    }

    /** Consulta pública con el token: no requiere iniciar sesión. */
    @Transactional(readOnly = true)
    public ProyectoCompartidoResponse obtenerPorToken(String token) {
        CompartirProyecto c = buscarVigente(token);
        Proyecto p = c.getProyecto();
        Integer idPropietario = p.getUsuario().getIdUsuario();

        List<ProyectoCompartidoResponse.SeccionCompartida> lista = secciones
                .findByProyectoIdProyectoOrderByOrdenAsc(p.getIdProyecto()).stream()
                .map(s -> new ProyectoCompartidoResponse.SeccionCompartida(
                        s.getIdSeccion(), s.getNombre(), s.getOrden(),
                        progresiones.findBySeccionIdSeccionOrderByOrdenAsc(s.getIdSeccion()).stream()
                                .map(pr -> ProgresionResponse.de(pr,
                                        acordeService.listar(pr.getIdProgresion(), idPropietario, null), null))
                                .toList()))
                .toList();

        return new ProyectoCompartidoResponse(c.getPermiso(), c.getFechaExpiracion(),
                p.getUsuario().getNombre(), ProyectoResponse.de(p, null), lista);
    }

    /** Con un enlace de edición se pueden modificar los datos generales del proyecto. */
    @Transactional
    public ProyectoResponse actualizarPorToken(String token, ProyectoRequest req) {
        CompartirProyecto c = buscarVigente(token);
        if (!"edicion".equals(c.getPermiso())) {
            throw new ProhibidoException("Este enlace solo permite consultar el proyecto");
        }
        Proyecto p = c.getProyecto();
        return proyectoService.actualizar(p.getIdProyecto(), p.getUsuario().getIdUsuario(), req);
    }

    private CompartirProyecto buscarVigente(String token) {
        CompartirProyecto c = enlaces.findByToken(token)
                .orElseThrow(() -> new RecursoNoEncontradoException("El enlace no existe"));
        if (!c.getActivo()) {
            throw new ProhibidoException("El enlace fue desactivado por su propietario");
        }
        if (c.getFechaExpiracion() != null && c.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new ProhibidoException("El enlace ya expiró");
        }
        return c;
    }

    /** 24 bytes aleatorios en Base64 URL: 32 caracteres que no se pueden adivinar. */
    private String generarToken() {
        byte[] bytes = new byte[24];
        ALEATORIO.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
