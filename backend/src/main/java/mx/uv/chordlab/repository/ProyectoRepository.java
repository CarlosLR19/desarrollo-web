package mx.uv.chordlab.repository;

import mx.uv.chordlab.entity.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProyectoRepository extends JpaRepository<Proyecto, Integer> {
    List<Proyecto> findByUsuarioIdUsuarioOrderByFechaActualizacionDesc(Integer idUsuario);
}
