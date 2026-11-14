package mx.uv.chordlab.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.math.BigDecimal;

@Entity
@Table(name = "acorde")
public class Acorde {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_acorde")
    private Integer idAcorde;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_progresion", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Progresion progresion;

    @Column(nullable = false, length = 5)
    private String fundamental;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false)
    private Integer inversion;

    @Column(name = "duracion_pulsos", nullable = false, precision = 4, scale = 2)
    private BigDecimal duracionPulsos;

    @Column(nullable = false)
    private Integer orden;

    public Integer getIdAcorde() { return idAcorde; }
    public Progresion getProgresion() { return progresion; }
    public void setProgresion(Progresion progresion) { this.progresion = progresion; }
    public String getFundamental() { return fundamental; }
    public void setFundamental(String fundamental) { this.fundamental = fundamental; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getInversion() { return inversion; }
    public void setInversion(Integer inversion) { this.inversion = inversion; }
    public BigDecimal getDuracionPulsos() { return duracionPulsos; }
    public void setDuracionPulsos(BigDecimal duracionPulsos) { this.duracionPulsos = duracionPulsos; }
    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
}
