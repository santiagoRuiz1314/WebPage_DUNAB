package com.unab.dunab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
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

@Entity
@Table(name = "transacciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuenta_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private CuentaDunab cuenta;

    @NotNull(message = "El tipo de transacción es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType tipo;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private CategoriaTransaccion categoria;

    @NotBlank(message = "La descripción es obligatoria")
    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(length = 100)
    private String referencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus estado = TransactionStatus.COMPLETADA;

    @Column(precision = 10, scale = 2)
    private BigDecimal saldoAnterior;

    @Column(precision = 10, scale = 2)
    private BigDecimal saldoPosterior;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creado_por")
    private User creadoPor;

    @Column(length = 500)
    private String justificacionAnulacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anulado_por")
    private User anuladoPor;

    private LocalDateTime fechaAnulacion;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

    /**
     * Método para anular una transacción
     */
    public void anular(User usuario, String justificacion) {
        if (this.estado == TransactionStatus.ANULADA) {
            throw new IllegalStateException("La transacción ya está anulada");
        }
        this.estado = TransactionStatus.ANULADA;
        this.anuladoPor = usuario;
        this.justificacionAnulacion = justificacion;
        this.fechaAnulacion = LocalDateTime.now();
    }

    /**
     * Verifica si es una transacción de crédito
     */
    public boolean esCredito() {
        return this.tipo == TransactionType.CREDITO;
    }

    /**
     * Verifica si es una transacción de débito
     */
    public boolean esDebito() {
        return this.tipo == TransactionType.DEBITO;
    }
}
