package mx.uv.chordlab.repository;

import mx.uv.chordlab.entity.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeccionRepository extends JpaRepository<Seccion, Integer> {
    List<Seccion> findByProyectoIdProyectoOrderByOrdenAsc(Integer idProyecto);
}
