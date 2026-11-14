package mx.uv.chordlab.dto;

import jakarta.validation.constraints.*;

public record ProyectoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 120, message = "El nombre admite máximo 120 caracteres")
        String nombre,

        @Size(max = 2000, message = "La descripción admite máximo 2000 caracteres")
        String descripcion,

        @NotBlank(message = "La tonalidad es obligatoria (C, C#, Db, D, ...)")
        String tonalidad,

        @NotBlank(message = "La escala es obligatoria (mayor o menor)")
        String escala,

        @NotNull(message = "El tempo es obligatorio")
        @Min(value = 20, message = "El tempo mínimo es 20 BPM")
        @Max(value = 300, message = "El tempo máximo es 300 BPM")
        Integer tempo,

        @NotNull(message = "El numerador del compás es obligatorio")
        @Min(value = 1, message = "El numerador del compás debe ser al menos 1")
        @Max(value = 16, message = "El numerador del compás debe ser máximo 16")
        Integer compasNum,

        @NotNull(message = "El denominador del compás es obligatorio")
        Integer compasDen
) {}
