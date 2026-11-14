package mx.uv.chordlab.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record AcordeRequest(
        @NotBlank(message = "La nota fundamental es obligatoria (C, C#, Db, ...)")
        String fundamental,

        @NotBlank(message = "El tipo de acorde es obligatorio (mayor, menor, 7, maj7, ...)")
        String tipo,

        @NotNull(message = "La inversión es obligatoria (0 = estado fundamental)")
        @Min(value = 0, message = "La inversión no puede ser negativa")
        @Max(value = 3, message = "La inversión máxima es 3")
        Integer inversion,

        @NotNull(message = "La duración en pulsos es obligatoria")
        @DecimalMin(value = "0.25", message = "La duración mínima es 0.25 pulsos")
        @DecimalMax(value = "64", message = "La duración máxima es 64 pulsos")
        BigDecimal duracionPulsos,

        @NotNull(message = "El orden es obligatorio")
        @Min(value = 1, message = "El orden empieza en 1")
        Integer orden
) {}
