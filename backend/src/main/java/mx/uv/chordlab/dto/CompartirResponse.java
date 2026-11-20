package mx.uv.chordlab.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import mx.uv.chordlab.entity.CompartirProyecto;

import java.time.LocalDateTime;

/** Un enlace para compartir. "vigente" es false si se desactivó o ya expiró. */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CompartirResponse(
        Integer idCompartir,
        Integer idProyecto,
        String token,
        String permiso,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaExpiracion,
        Boolean activo,
        Boolean vigente,
        String mensaje
) {
    public static CompartirResponse de(CompartirProyecto c, String mensaje) {
        boolean expirado = c.getFechaExpiracion() != null && c.getFechaExpiracion().isBefore(LocalDateTime.now());
        return new CompartirResponse(c.getIdCompartir(), c.getProyecto().getIdProyecto(), c.getToken(),
                c.getPermiso(), c.getFechaCreacion(), c.getFechaExpiracion(), c.getActivo(),
                c.getActivo() && !expirado, mensaje);
    }
}
