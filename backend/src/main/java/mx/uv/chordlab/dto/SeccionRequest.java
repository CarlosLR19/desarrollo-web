package mx.uv.chordlab.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SeccionRequest(
        @NotBlank(message = "El nombre es obligatorio (Intro, Verso, Coro, Puente...)")
        @Size(max = 50, message = "El nombre admite máximo 50 caracteres")
        String nombre,

        @NotNull(message = "El orden es obligatorio")
        @Min(value = 1, message = "El orden empieza en 1")
        Integer orden
) {}
