package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.AcordeGenerado;
import mx.uv.chordlab.dto.AcordeRequest;
import mx.uv.chordlab.dto.AcordeResponse;
import mx.uv.chordlab.entity.Acorde;
import mx.uv.chordlab.entity.Progresion;
import mx.uv.chordlab.exception.RecursoNoEncontradoException;
import mx.uv.chordlab.repository.AcordeRepository;
import mx.uv.chordlab.repository.ProgresionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AcordeService {

    private final AcordeRepository acordes;
    private final ProgresionRepository progresiones;
    private final TeoriaMusicalService teoria;
    private final ProyectoService proyectoService;

    public AcordeService(AcordeRepository acordes, ProgresionRepository progresiones,
                         TeoriaMusicalService teoria, ProyectoService proyectoService) {
        this.acordes = acordes;
        this.progresiones = progresiones;
        this.teoria = teoria;
        this.proyectoService = proyectoService;
    }

    /** Lista los acordes de una progresión; si se indica "tipo" (ej. maj7) solo devuelve los de ese tipo. */
    @Transactional(readOnly = true)
    public List<AcordeResponse> listar(Integer idProgresion, String tipo) {
        buscarProgresion(idProgresion);
        String filtro = (tipo == null || tipo.isBlank()) ? null : teoria.normalizarTipo(tipo);
        return acordes.findByProgresionIdProgresionOrderByOrdenAsc(idProgresion).stream()
                .filter(a -> filtro == null || filtro.equals(a.getTipo()))
                .map(a -> aRespuesta(a, null))
                .toList();
    }

    /** RF11 / RF14: agrega un acorde a una progresión guardada. Se valida con la lógica musical antes de guardar. */
    @Transactional
    public AcordeResponse crear(Integer idProgresion, AcordeRequest req) {
        Progresion progresion = buscarProgresion(idProgresion);
        Acorde a = new Acorde();
        a.setProgresion(progresion);
        aplicar(a, req);
        acordes.save(a);
        return aRespuesta(a, "Acorde agregado correctamente");
    }

    @Transactional
    public AcordeResponse actualizar(Integer idAcorde, Integer idUsuario, AcordeRequest req) {
        Acorde a = buscarDelUsuario(idAcorde, idUsuario);
        aplicar(a, req);
        acordes.save(a);
        return aRespuesta(a, "Acorde actualizado correctamente");
    }

    @Transactional
    public void eliminar(Integer idAcorde, Integer idUsuario) {
        acordes.delete(buscarDelUsuario(idAcorde, idUsuario));
    }

    /** Si la nota, el tipo o la inversión no son válidos, la lógica musical lanza IllegalArgumentException (HTTP 400). */
    private void aplicar(Acorde a, AcordeRequest req) {
        AcordeGenerado generado = teoria.generarAcorde(req.fundamental(), req.tipo(), req.inversion());
        a.setFundamental(generado.fundamental());
        a.setTipo(generado.tipo());
        a.setInversion(req.inversion());
        a.setDuracionPulsos(req.duracionPulsos());
        a.setOrden(req.orden());
    }

    private Acorde buscarDelUsuario(Integer idAcorde, Integer idUsuario) {
        Acorde a = acordes.findById(idAcorde)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el acorde " + idAcorde));
        proyectoService.buscarDelUsuario(a.getProgresion().getSeccion().getProyecto().getIdProyecto(), idUsuario);
        return a;
    }

    private AcordeResponse aRespuesta(Acorde a, String mensaje) {
        AcordeGenerado g = teoria.generarAcorde(a.getFundamental(), a.getTipo(), a.getInversion());
        return new AcordeResponse(a.getIdAcorde(), a.getFundamental(), a.getTipo(), a.getInversion(),
                a.getDuracionPulsos(), a.getOrden(), g.simbolo(), g.notas(), g.notasConOctava(), mensaje);
    }

    private Progresion buscarProgresion(Integer idProgresion) {
        return progresiones.findById(idProgresion)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la progresión " + idProgresion));
    }
}
