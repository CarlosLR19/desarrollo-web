package mx.uv.chordlab.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AcordeResponse(
        Integer idAcorde,
        String fundamental,
        String tipo,
        Integer inversion,
        BigDecimal duracionPulsos,
        Integer orden,
        String simbolo,
        List<String> notas,
        List<String> notasConOctava,
        String mensaje
) {}
