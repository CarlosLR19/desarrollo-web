package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.SeccionRequest;
import mx.uv.chordlab.dto.SeccionResponse;
import mx.uv.chordlab.entity.Seccion;
import mx.uv.chordlab.exception.RecursoNoEncontradoException;
import mx.uv.chordlab.repository.SeccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SeccionService {

    private final SeccionRepository secciones;
    private final ProyectoService proyectoService;

    public SeccionService(SeccionRepository secciones, ProyectoService proyectoService) {
        this.secciones = secciones;
        this.proyectoService = proyectoService;
    }

    @Transactional(readOnly = true)
    public List<SeccionResponse> listar(Integer idProyecto) {
        proyectoService.buscar(idProyecto);
        return secciones.findByProyectoIdProyectoOrderByOrdenAsc(idProyecto).stream()
                .map(s -> SeccionResponse.de(s, null))
                .toList();
    }

    /** RF15: organiza el proyecto en secciones (intro, verso, coro, puente...). */
    @Transactional
    public SeccionResponse crear(Integer idProyecto, SeccionRequest req) {
        Seccion s = new Seccion();
        s.setProyecto(proyectoService.buscar(idProyecto));
        s.setNombre(req.nombre().trim());
        s.setOrden(req.orden());
        secciones.save(s);
        return SeccionResponse.de(s, "Sección creada correctamente");
    }

    @Transactional(readOnly = true)
    public Seccion buscar(Integer idSeccion) {
        return secciones.findById(idSeccion)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la sección " + idSeccion));
    }
}
