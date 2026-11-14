package mx.uv.chordlab.repository;

import mx.uv.chordlab.entity.Acorde;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AcordeRepository extends JpaRepository<Acorde, Integer> {
    List<Acorde> findByProgresionIdProgresionOrderByOrdenAsc(Integer idProgresion);
}
