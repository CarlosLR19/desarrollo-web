package mx.uv.chordlab.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

/** Formato único de error que devuelve la API. "campos" solo aparece en errores de validación. */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(int estado, String error, String mensaje, Map<String, String> campos, LocalDateTime fecha) {

    public ErrorResponse(int estado, String error, String mensaje, Map<String, String> campos) {
        this(estado, error, mensaje, campos, LocalDateTime.now());
    }
}
