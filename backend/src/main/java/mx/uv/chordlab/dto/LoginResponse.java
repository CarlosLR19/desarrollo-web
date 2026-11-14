package mx.uv.chordlab.dto;

/**
 * Respuesta temporal de inicio de sesión.
 * En el Entregable 3 se agregará el token JWT ("token" y "tipo": "Bearer").
 */
public record LoginResponse(String mensaje, Integer idUsuario, String nombre) {}
