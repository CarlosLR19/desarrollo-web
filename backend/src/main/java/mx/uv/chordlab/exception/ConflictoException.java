package mx.uv.chordlab.exception;

/** Se traduce a HTTP 409 (p. ej. correo ya registrado). */
public class ConflictoException extends RuntimeException {
    public ConflictoException(String mensaje) {
        super(mensaje);
    }
}
