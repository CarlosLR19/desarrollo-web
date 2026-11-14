package mx.uv.chordlab.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record GenerarAcordeRequest(
        @NotBlank(message = "La nota fundamental es obligatoria")
        String fundamental,

        @NotBlank(message = "El tipo de acorde es obligatorio")
        String tipo,

        /** Opcional: si no se envía se usa 0 (estado fundamental). */
        @Min(value = 0, message = "La inversión no puede ser negativa")
        Integer inversion
) {}
