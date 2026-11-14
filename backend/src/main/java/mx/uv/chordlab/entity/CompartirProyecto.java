package mx.uv.chordlab.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.LocalDateTime;

/** Enlaces para compartir proyectos (RF16, RF17). Sus endpoints se implementan en el Entregable 3. */
@Entity
@Table(name = "compartir_proyecto")
public class CompartirProyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_compartir")
    private Integer idCompartir;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_proyecto", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Proyecto proyecto;

    @Column(nullable = false, length = 255, unique = true)
    private String token;

    /** "lectura" o "edicion" */
    @Column(nullable = false, length = 15)
    private String permiso;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;

    @Column(nullable = false)
    private Boolean activo = true;

    @PrePersist
    void alCrear() {
        fechaCreacion = LocalDateTime.now();
    }

    public Integer getIdCompartir() { return idCompartir; }
    public Proyecto getProyecto() { return proyecto; }
    public void setProyecto(Proyecto proyecto) { this.proyecto = proyecto; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getPermiso() { return permiso; }
    public void setPermiso(String permiso) { this.permiso = permiso; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDateTime fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
