package mx.uv.chordlab.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/** Datos para generar un enlace (RF16). diasExpiracion es opcional: si no se envía, el enlace no expira. */
public record CompartirRequest(
        @NotBlank(message = "El permiso es obligatorio (lectura o edicion)")
        String permiso,
        @Min(value = 1, message = "La expiración mínima es 1 día")
        @Max(value = 365, message = "La expiración máxima es 365 días")
        Integer diasExpiracion
) {}
