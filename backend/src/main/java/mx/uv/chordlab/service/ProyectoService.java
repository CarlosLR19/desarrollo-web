package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.ProyectoRequest;
import mx.uv.chordlab.dto.ProyectoResponse;
import mx.uv.chordlab.entity.Proyecto;
import mx.uv.chordlab.exception.ProhibidoException;
import mx.uv.chordlab.exception.RecursoNoEncontradoException;
import mx.uv.chordlab.repository.ProyectoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class ProyectoService {

    private static final Set<Integer> DENOMINADORES = Set.of(1, 2, 4, 8, 16);

    private final ProyectoRepository proyectos;
    private final UsuarioService usuarioService;
    private final TeoriaMusicalService teoria;

    public ProyectoService(ProyectoRepository proyectos, UsuarioService usuarioService, TeoriaMusicalService teoria) {
        this.proyectos = proyectos;
        this.usuarioService = usuarioService;
        this.teoria = teoria;
    }

    @Transactional(readOnly = true)
    public List<ProyectoResponse> listar(Integer idUsuario) {
        usuarioService.buscar(idUsuario);
        return proyectos.findByUsuarioIdUsuarioOrderByFechaActualizacionDesc(idUsuario).stream()
                .map(p -> ProyectoResponse.de(p, null))
                .toList();
    }

    /** RF04 + RF06: crea el proyecto con su configuración musical validada. */
    @Transactional
    public ProyectoResponse crear(Integer idUsuario, ProyectoRequest req) {
        if (!DENOMINADORES.contains(req.compasDen())) {
            throw new IllegalArgumentException("El denominador del compás debe ser 1, 2, 4, 8 o 16");
        }
        Proyecto p = new Proyecto();
        p.setUsuario(usuarioService.buscar(idUsuario));
        p.setNombre(req.nombre().trim());
        p.setDescripcion(req.descripcion());
        p.setTonalidad(teoria.normalizarNota(req.tonalidad()));
        p.setEscala(teoria.normalizarEscala(req.escala()));
        p.setTempo(req.tempo());
        p.setCompasNum(req.compasNum());
        p.setCompasDen(req.compasDen());
        proyectos.save(p);
        return ProyectoResponse.de(p, "Proyecto creado correctamente");
    }

    @Transactional(readOnly = true)
    public ProyectoResponse obtener(Integer idProyecto, Integer idUsuario) {
        return ProyectoResponse.de(buscarDelUsuario(idProyecto, idUsuario), null);
    }

    /** RNF05: un usuario solo puede ver sus propios proyectos. */
    @Transactional(readOnly = true)
    public Proyecto buscarDelUsuario(Integer idProyecto, Integer idUsuario) {
        Proyecto p = buscar(idProyecto);
        if (!p.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new ProhibidoException("No tienes permiso para acceder a este proyecto");
        }
        return p;
    }

    @Transactional(readOnly = true)
    public Proyecto buscar(Integer idProyecto) {
        return proyectos.findById(idProyecto)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el proyecto " + idProyecto));
    }
}
