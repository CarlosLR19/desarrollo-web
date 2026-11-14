package mx.uv.chordlab.controller;

/**
 * Mientras no exista JWT (Entregable 3), el usuario que hace la petición se identifica
 * con esta cabecera, usando el idUsuario que devuelve /usuarios/login.
 */
public final class Cabeceras {
    public static final String USUARIO = "X-Usuario-Id";

    private Cabeceras() {}
}
