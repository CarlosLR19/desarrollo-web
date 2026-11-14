package mx.uv.chordlab.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.LocalDateTime;

@Entity
@Table(name = "proyecto")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proyecto")
    private Integer idProyecto;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, length = 20)
    private String tonalidad;

    @Column(nullable = false, length = 30)
    private String escala;

    @Column(nullable = false)
    private Integer tempo;

    @Column(name = "compas_num", nullable = false)
    private Integer compasNum;

    @Column(name = "compas_den", nullable = false)
    private Integer compasDen;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    @PrePersist
    void alCrear() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = fechaCreacion;
    }

    @PreUpdate
    void alActualizar() {
        fechaActualizacion = LocalDateTime.now();
    }

    public Integer getIdProyecto() { return idProyecto; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getTonalidad() { return tonalidad; }
    public void setTonalidad(String tonalidad) { this.tonalidad = tonalidad; }
    public String getEscala() { return escala; }
    public void setEscala(String escala) { this.escala = escala; }
    public Integer getTempo() { return tempo; }
    public void setTempo(Integer tempo) { this.tempo = tempo; }
    public Integer getCompasNum() { return compasNum; }
    public void setCompasNum(Integer compasNum) { this.compasNum = compasNum; }
    public Integer getCompasDen() { return compasDen; }
    public void setCompasDen(Integer compasDen) { this.compasDen = compasDen; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
}
