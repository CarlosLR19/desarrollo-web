package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.ProgresionRequest;
import mx.uv.chordlab.dto.ProgresionResponse;
import mx.uv.chordlab.entity.Progresion;
import mx.uv.chordlab.exception.RecursoNoEncontradoException;
import mx.uv.chordlab.repository.ProgresionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProgresionService {

    private final ProgresionRepository progresiones;
    private final SeccionService seccionService;
    private final AcordeService acordeService;
    private final ProyectoService proyectoService;

    public ProgresionService(ProgresionRepository progresiones, SeccionService seccionService,
                             AcordeService acordeService, ProyectoService proyectoService) {
        this.progresiones = progresiones;
        this.seccionService = seccionService;
        this.acordeService = acordeService;
        this.proyectoService = proyectoService;
    }

    @Transactional(readOnly = true)
    public List<ProgresionResponse> listar(Integer idSeccion) {
        seccionService.buscar(idSeccion);
        return progresiones.findBySeccionIdSeccionOrderByOrdenAsc(idSeccion).stream()
                .map(p -> ProgresionResponse.de(p, null, null))
                .toList();
    }

    @Transactional
    public ProgresionResponse crear(Integer idSeccion, ProgresionRequest req) {
        Progresion p = new Progresion();
        p.setSeccion(seccionService.buscar(idSeccion));
        p.setNombre(req.nombre().trim());
        p.setOrden(req.orden());
        progresiones.save(p);
        return ProgresionResponse.de(p, null, "Progresión creada correctamente");
    }

    /** Devuelve la progresión con sus acordes y las notas de cada uno. */
    @Transactional(readOnly = true)
    public ProgresionResponse obtener(Integer idProgresion) {
        Progresion p = buscar(idProgresion);
        return ProgresionResponse.de(p, acordeService.listar(idProgresion, null), null);
    }

    @Transactional
    public ProgresionResponse actualizar(Integer idProgresion, Integer idUsuario, ProgresionRequest req) {
        Progresion p = buscarDelUsuario(idProgresion, idUsuario);
        p.setNombre(req.nombre().trim());
        p.setOrden(req.orden());
        progresiones.save(p);
        return ProgresionResponse.de(p, null, "Progresión actualizada correctamente");
    }

    @Transactional
    public void eliminar(Integer idProgresion, Integer idUsuario) {
        progresiones.delete(buscarDelUsuario(idProgresion, idUsuario));
    }

    private Progresion buscarDelUsuario(Integer idProgresion, Integer idUsuario) {
        Progresion p = buscar(idProgresion);
        proyectoService.buscarDelUsuario(p.getSeccion().getProyecto().getIdProyecto(), idUsuario);
        return p;
    }

    @Transactional(readOnly = true)
    public Progresion buscar(Integer idProgresion) {
        return progresiones.findById(idProgresion)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la progresión " + idProgresion));
    }
}
