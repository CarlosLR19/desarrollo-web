package mx.uv.chordlab.repository;

import mx.uv.chordlab.entity.CompartirProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompartirProyectoRepository extends JpaRepository<CompartirProyecto, Integer> {
    Optional<CompartirProyecto> findByToken(String token);
}
