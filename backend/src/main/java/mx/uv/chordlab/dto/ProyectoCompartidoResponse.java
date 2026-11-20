package mx.uv.chordlab.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Lo que ve quien abre un enlace compartido (RF17): el proyecto completo con sus secciones,
 * progresiones y acordes, el permiso del enlace y el nombre del propietario.
 */
public record ProyectoCompartidoResponse(
        String permiso,
        LocalDateTime fechaExpiracion,
        String propietario,
        ProyectoResponse proyecto,
        List<SeccionCompartida> secciones
) {
    public record SeccionCompartida(Integer idSeccion, String nombre, Integer orden,
                                    List<ProgresionResponse> progresiones) {}
}
