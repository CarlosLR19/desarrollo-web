package mx.uv.chordlab.dto;

import java.time.LocalDateTime;

public record PerfilResponse(Integer idUsuario, String nombre, String correo, LocalDateTime fechaRegistro) {}
