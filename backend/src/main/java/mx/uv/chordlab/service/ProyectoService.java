package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.ProyectoRequest;
import mx.uv.chordlab.dto.ProyectoResponse;
import mx.uv.chordlab.entity.Proyecto;
import mx.uv.chordlab.exception.ProhibidoException;
import mx.uv.chordlab.exception.RecursoNoEncontradoException;
import mx.uv.chordlab.repository.ProyectoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class ProyectoService {

    private static final Set<Integer> DENOMINADORES = Set.of(1, 2, 4, 8, 16);

    /** Resultado de una búsqueda: la página de proyectos y el total que cumple los filtros. */
    public record Resultado(List<ProyectoResponse> proyectos, long total) {}

    private final ProyectoRepository proyectos;
    private final UsuarioService usuarioService;
    private final TeoriaMusicalService teoria;

    public ProyectoService(ProyectoRepository proyectos, UsuarioService usuarioService, TeoriaMusicalService teoria) {
        this.proyectos = proyectos;
        this.usuarioService = usuarioService;
        this.teoria = teoria;
    }

    /** Lista los proyectos del usuario con filtros opcionales (nombre, tonalidad, escala) y paginación. */
    @Transactional(readOnly = true)
    public Resultado listar(Integer idUsuario, String busqueda, String tonalidad, String escala, int pagina, int limite) {
        usuarioService.buscar(idUsuario);
        if (pagina < 0) {
            throw new IllegalArgumentException("La página no puede ser negativa");
        }
        if (limite < 1 || limite > 100) {
            throw new IllegalArgumentException("El límite debe estar entre 1 y 100");
        }
        String texto = busqueda == null ? "" : busqueda.trim();
        String t = (tonalidad == null || tonalidad.isBlank()) ? "" : teoria.normalizarNota(tonalidad);
        String e = (escala == null || escala.isBlank()) ? "" : teoria.normalizarEscala(escala);

        Page<Proyecto> resultado = proyectos.buscar(idUsuario, texto, t, e, PageRequest.of(pagina, limite));
        return new Resultado(
                resultado.getContent().stream().map(p -> ProyectoResponse.de(p, null)).toList(),
                resultado.getTotalElements());
    }

    /** RF04 + RF06: crea el proyecto con su configuración musical validada. */
    @Transactional
    public ProyectoResponse crear(Integer idUsuario, ProyectoRequest req) {
        Proyecto p = new Proyecto();
        p.setUsuario(usuarioService.buscar(idUsuario));
        aplicar(p, req);
        proyectos.save(p);
        return ProyectoResponse.de(p, "Proyecto creado correctamente");
    }

    /** RF05: modifica todos los datos del proyecto (PUT reemplaza el recurso completo). */
    @Transactional
    public ProyectoResponse actualizar(Integer idProyecto, Integer idUsuario, ProyectoRequest req) {
        Proyecto p = buscarDelUsuario(idProyecto, idUsuario);
        aplicar(p, req);
        proyectos.saveAndFlush(p);
        return ProyectoResponse.de(p, "Proyecto actualizado correctamente");
    }

    /** Elimina el proyecto. La base de datos elimina en cascada sus secciones, progresiones y acordes. */
    @Transactional
    public void eliminar(Integer idProyecto, Integer idUsuario) {
        proyectos.delete(buscarDelUsuario(idProyecto, idUsuario));
    }

    @Transactional(readOnly = true)
    public ProyectoResponse obtener(Integer idProyecto, Integer idUsuario) {
        return ProyectoResponse.de(buscarDelUsuario(idProyecto, idUsuario), null);
    }

    /** RNF05: un usuario solo puede acceder a sus propios proyectos. */
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

    private void aplicar(Proyecto p, ProyectoRequest req) {
        if (!DENOMINADORES.contains(req.compasDen())) {
            throw new IllegalArgumentException("El denominador del compás debe ser 1, 2, 4, 8 o 16");
        }
        p.setNombre(req.nombre().trim());
        p.setDescripcion(req.descripcion());
        p.setTonalidad(teoria.normalizarNota(req.tonalidad()));
        p.setEscala(teoria.normalizarEscala(req.escala()));
        p.setTempo(req.tempo());
        p.setCompasNum(req.compasNum());
        p.setCompasDen(req.compasDen());
    }
}
