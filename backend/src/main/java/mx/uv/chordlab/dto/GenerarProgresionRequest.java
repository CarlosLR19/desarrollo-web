package mx.uv.chordlab.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GenerarProgresionRequest(
        @NotBlank(message = "La tonalidad es obligatoria")
        String tonalidad,

        @NotBlank(message = "La escala es obligatoria (mayor o menor)")
        String escala,

        @NotNull(message = "La cantidad de acordes es obligatoria")
        @Min(value = 2, message = "Se requieren al menos 2 acordes")
        @Max(value = 16, message = "Máximo 16 acordes")
        Integer cantidadAcordes,

        /** pop, clasico, jazz, blues o aleatorio. Si no se envía se usa pop. */
        String estilo,

        /** Opcional: con la misma semilla el estilo "aleatorio" genera siempre la misma progresión. */
        Long semilla
) {}
