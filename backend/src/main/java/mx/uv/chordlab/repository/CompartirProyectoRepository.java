package mx.uv.chordlab.repository;

import mx.uv.chordlab.entity.CompartirProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompartirProyectoRepository extends JpaRepository<CompartirProyecto, Integer> {
    Optional<CompartirProyecto> findByToken(String token);

    /** Enlaces de un proyecto, del más reciente al más antiguo. */
    List<CompartirProyecto> findByProyectoIdProyectoOrderByIdCompartirDesc(Integer idProyecto);
}
