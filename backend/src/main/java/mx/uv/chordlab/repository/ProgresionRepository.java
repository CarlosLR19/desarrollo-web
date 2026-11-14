package mx.uv.chordlab.repository;

import mx.uv.chordlab.entity.Progresion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgresionRepository extends JpaRepository<Progresion, Integer> {
    List<Progresion> findBySeccionIdSeccionOrderByOrdenAsc(Integer idSeccion);
}
