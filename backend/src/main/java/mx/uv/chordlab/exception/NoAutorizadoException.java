package mx.uv.chordlab.exception;

/** Se traduce a HTTP 401 (credenciales incorrectas o usuario no identificado). */
public class NoAutorizadoException extends RuntimeException {
    public NoAutorizadoException(String mensaje) {
        super(mensaje);
    }
}
