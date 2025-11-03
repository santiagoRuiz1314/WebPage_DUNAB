package com.unab.dunab.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones_evento",
       uniqueConstraints = @UniqueConstraint(columnNames = {"evento_id", "estudiante_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscripcionEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private User estudiante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoInscripcion estado = EstadoInscripcion.PENDIENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaccion_pago_id")
    private Transaccion transaccionPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaccion_recompensa_id")
    private Transaccion transaccionRecompensa;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaInscripcion;

    private LocalDateTime fechaConfirmacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

    /**
     * Confirma la asistencia del estudiante
     */
    public void confirmarAsistencia() {
        if (this.estado == EstadoInscripcion.CANCELADA) {
            throw new IllegalStateException("No se puede confirmar una inscripción cancelada");
        }
        this.estado = EstadoInscripcion.ASISTIO;
        this.fechaConfirmacion = LocalDateTime.now();
    }

    /**
     * Cancela la inscripción
     */
    public void cancelar() {
        this.estado = EstadoInscripcion.CANCELADA;
    }
}
