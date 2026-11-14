package mx.uv.chordlab.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import mx.uv.chordlab.entity.Proyecto;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProyectoResponse(
        Integer idProyecto,
        String nombre,
        String descripcion,
        String tonalidad,
        String escala,
        Integer tempo,
        Integer compasNum,
        Integer compasDen,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion,
        String mensaje
) {
    public static ProyectoResponse de(Proyecto p, String mensaje) {
        return new ProyectoResponse(p.getIdProyecto(), p.getNombre(), p.getDescripcion(), p.getTonalidad(),
                p.getEscala(), p.getTempo(), p.getCompasNum(), p.getCompasDen(),
                p.getFechaCreacion(), p.getFechaActualizacion(), mensaje);
    }
}
