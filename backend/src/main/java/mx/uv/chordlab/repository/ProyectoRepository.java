package mx.uv.chordlab.repository;

import mx.uv.chordlab.entity.Proyecto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProyectoRepository extends JpaRepository<Proyecto, Integer> {

    List<Proyecto> findByUsuarioIdUsuarioOrderByFechaActualizacionDesc(Integer idUsuario);

    /** Filtros opcionales: un texto vacío significa "sin filtro". */
    @Query("""
            select p from Proyecto p
            where p.usuario.idUsuario = :idUsuario
              and (:busqueda = '' or lower(p.nombre) like lower(concat('%', :busqueda, '%')))
              and (:tonalidad = '' or p.tonalidad = :tonalidad)
              and (:escala = '' or p.escala = :escala)
            order by p.fechaActualizacion desc
            """)
    Page<Proyecto> buscar(@Param("idUsuario") Integer idUsuario,
                          @Param("busqueda") String busqueda,
                          @Param("tonalidad") String tonalidad,
                          @Param("escala") String escala,
                          Pageable pageable);
}
