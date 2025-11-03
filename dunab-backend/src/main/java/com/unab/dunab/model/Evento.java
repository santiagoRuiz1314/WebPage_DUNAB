package com.unab.dunab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del evento es obligatorio")
    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @NotNull(message = "La fecha del evento es obligatoria")
    @Column(nullable = false)
    private LocalDateTime fechaEvento;

    @Column(length = 200)
    private String ubicacion;

    @Min(value = 0, message = "La capacidad no puede ser negativa")
    private Integer capacidadMaxima;

    @Min(value = 0, message = "El costo no puede ser negativo")
    @Column(precision = 10, scale = 2)
    private BigDecimal costoDunab = BigDecimal.ZERO;

    @Min(value = 0, message = "La recompensa no puede ser negativa")
    @Column(precision = 10, scale = 2)
    private BigDecimal recompensaDunab = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean requiereConfirmacion = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InscripcionEvento> inscripciones = new ArrayList<>();

    /**
     * Verifica si el evento es gratuito
     */
    public boolean esGratuito() {
        return this.costoDunab.compareTo(BigDecimal.ZERO) == 0;
    }

    /**
     * Verifica si otorga recompensa
     */
    public boolean otorgaRecompensa() {
        return this.recompensaDunab.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Verifica si hay cupos disponibles
     */
    public boolean hayCuposDisponibles() {
        if (this.capacidadMaxima == null) {
            return true;
        }
        long inscritos = this.inscripciones.stream()
                .filter(i -> i.getEstado() != EstadoInscripcion.CANCELADA)
                .count();
        return inscritos < this.capacidadMaxima;
    }

    /**
     * Verifica si el evento ya pasó
     */
    public boolean yaPaso() {
        return this.fechaEvento.isBefore(LocalDateTime.now());
    }
}
