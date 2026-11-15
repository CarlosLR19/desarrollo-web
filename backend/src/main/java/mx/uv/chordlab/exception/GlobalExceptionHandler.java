package mx.uv.chordlab.exception;

import mx.uv.chordlab.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Convierte las excepciones en respuestas JSON con el código HTTP adecuado (RNF10).
 * Códigos: 400, 401, 403, 404, 405, 409, 415 y 500.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> noEncontrado(RecursoNoEncontradoException e) {
        return construir(HttpStatus.NOT_FOUND, e.getMessage(), null);
    }

    /** Ruta que no existe (por ejemplo /api/xyz). */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> rutaInexistente(NoResourceFoundException e) {
        return construir(HttpStatus.NOT_FOUND, "La ruta solicitada no existe", null);
    }

    @ExceptionHandler(ConflictoException.class)
    public ResponseEntity<ErrorResponse> conflicto(ConflictoException e) {
        return construir(HttpStatus.CONFLICT, e.getMessage(), null);
    }

    /** Violación de una restricción de la base de datos (duplicados, llaves foráneas). */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> integridad(DataIntegrityViolationException e) {
        log.warn("Violación de integridad de datos", e);
        return construir(HttpStatus.CONFLICT, "La operación viola una restricción de la base de datos", null);
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

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> sinParametro(MissingServletRequestParameterException e) {
        return construir(HttpStatus.BAD_REQUEST, "Falta el parámetro " + e.getParameterName(), null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> jsonMalFormado(HttpMessageNotReadableException e) {
        return construir(HttpStatus.BAD_REQUEST, "El cuerpo de la solicitud no es un JSON válido", null);
    }

    /** Método HTTP no permitido en esa ruta (por ejemplo PATCH /proyectos/1). */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> metodoNoPermitido(HttpRequestMethodNotSupportedException e) {
        return construir(HttpStatus.METHOD_NOT_ALLOWED,
                "El método " + e.getMethod() + " no está permitido en esta ruta", null);
    }

    /** El cuerpo no viene como JSON (falta Content-Type: application/json). */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> tipoNoSoportado(HttpMediaTypeNotSupportedException e) {
        return construir(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "La API solo acepta solicitudes en formato JSON", null);
    }

    /** Cualquier error no previsto: se registra en el servidor y no se expone el detalle al cliente. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> inesperado(Exception e) {
        log.error("Error interno no controlado", e);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error interno en el servidor", null);
    }

    private ResponseEntity<ErrorResponse> construir(HttpStatus estado, String mensaje, Map<String, String> campos) {
        return ResponseEntity.status(estado)
                .body(new ErrorResponse(estado.value(), estado.getReasonPhrase(), mensaje, campos));
    }
}
