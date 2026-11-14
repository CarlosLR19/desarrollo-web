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

    public AcordeService(AcordeRepository acordes, ProgresionRepository progresiones, TeoriaMusicalService teoria) {
        this.acordes = acordes;
        this.progresiones = progresiones;
        this.teoria = teoria;
    }

    @Transactional(readOnly = true)
    public List<AcordeResponse> listar(Integer idProgresion) {
        buscarProgresion(idProgresion);
        return acordes.findByProgresionIdProgresionOrderByOrdenAsc(idProgresion).stream()
                .map(a -> aRespuesta(a, null))
                .toList();
    }

    /** RF11 / RF14: agrega un acorde a una progresión guardada. Se valida con la lógica musical antes de guardar. */
    @Transactional
    public AcordeResponse crear(Integer idProgresion, AcordeRequest req) {
        Progresion progresion = buscarProgresion(idProgresion);
        // Si la nota, el tipo o la inversión no son válidos, esto lanza IllegalArgumentException (HTTP 400)
        AcordeGenerado generado = teoria.generarAcorde(req.fundamental(), req.tipo(), req.inversion());

        Acorde a = new Acorde();
        a.setProgresion(progresion);
        a.setFundamental(generado.fundamental());
        a.setTipo(generado.tipo());
        a.setInversion(req.inversion());
        a.setDuracionPulsos(req.duracionPulsos());
        a.setOrden(req.orden());
        acordes.save(a);
        return aRespuesta(a, "Acorde agregado correctamente");
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
