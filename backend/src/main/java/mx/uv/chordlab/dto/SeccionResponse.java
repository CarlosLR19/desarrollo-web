package mx.uv.chordlab.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import mx.uv.chordlab.entity.Seccion;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SeccionResponse(Integer idSeccion, Integer idProyecto, String nombre, Integer orden, String mensaje) {

    public static SeccionResponse de(Seccion s, String mensaje) {
        return new SeccionResponse(s.getIdSeccion(), s.getProyecto().getIdProyecto(), s.getNombre(), s.getOrden(), mensaje);
    }
}
