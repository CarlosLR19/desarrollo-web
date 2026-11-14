package mx.uv.chordlab.exception;

import mx.uv.chordlab.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Convierte las excepciones en respuestas JSON con el código HTTP adecuado (RNF10).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> noEncontrado(RecursoNoEncontradoException e) {
        return construir(HttpStatus.NOT_FOUND, e.getMessage(), null);
    }

    @ExceptionHandler(ConflictoException.class)
    public ResponseEntity<ErrorResponse> conflicto(ConflictoException e) {
        return construir(HttpStatus.CONFLICT, e.getMessage(), null);
    }

    @ExceptionHandler(NoAutorizadoException.class)
    public ResponseEntity<ErrorResponse> noAutorizado(NoAutorizadoException e) {
        return construir(HttpStatus.UNAUTHORIZED, e.getMessage(), null);
    }

    @ExceptionHandler(ProhibidoException.class)
    public ResponseEntity<ErrorResponse> prohibido(ProhibidoException e) {
        return construir(HttpStatus.FORBIDDEN, e.getMessage(), null);
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ErrorResponse> sinCabecera(MissingRequestHeaderException e) {
        return construir(HttpStatus.UNAUTHORIZED,
                "Falta la cabecera " + e.getHeaderName() + " para identificar al usuario", null);
    }

    /** Errores de @Valid: devuelve qué campo falló y por qué. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validacion(MethodArgumentNotValidException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors()
                .forEach(err -> campos.putIfAbsent(err.getField(), err.getDefaultMessage()));
        return construir(HttpStatus.BAD_REQUEST, "Datos inválidos", campos);
    }

    @ExceptionHandler({IllegalArgumentException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErrorResponse> argumentoInvalido(RuntimeException e) {
        return construir(HttpStatus.BAD_REQUEST, e.getMessage(), null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> jsonMalFormado(HttpMessageNotReadableException e) {
        return construir(HttpStatus.BAD_REQUEST, "El cuerpo de la solicitud no es un JSON válido", null);
    }

    private ResponseEntity<ErrorResponse> construir(HttpStatus estado, String mensaje, Map<String, String> campos) {
        return ResponseEntity.status(estado)
                .body(new ErrorResponse(estado.value(), estado.getReasonPhrase(), mensaje, campos));
    }
}
