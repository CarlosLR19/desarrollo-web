package mx.uv.chordlab.exception;

/** Se traduce a HTTP 403 (el recurso pertenece a otro usuario). */
public class ProhibidoException extends RuntimeException {
    public ProhibidoException(String mensaje) {
        super(mensaje);
    }
}
