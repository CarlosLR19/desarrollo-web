package mx.uv.chordlab.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import mx.uv.chordlab.entity.Progresion;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProgresionResponse(
        Integer idProgresion,
        Integer idSeccion,
        String nombre,
        Integer orden,
        List<AcordeResponse> acordes,
        String mensaje
) {
    public static ProgresionResponse de(Progresion p, List<AcordeResponse> acordes, String mensaje) {
        return new ProgresionResponse(p.getIdProgresion(), p.getSeccion().getIdSeccion(), p.getNombre(),
                p.getOrden(), acordes, mensaje);
    }
}
