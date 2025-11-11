package com.unab.dunab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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
@Table(name = "cuentas_dunab")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaDunab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false, unique = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User estudiante;

    @Min(value = 0, message = "El saldo actual no puede ser negativo")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoActual = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalGanado = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalGastado = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccountStatus estado = AccountStatus.ACTIVA;

    @Column(precision = 10, scale = 2)
    private BigDecimal limiteTransaccion = new BigDecimal("10000.00");

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

    @OneToMany(mappedBy = "cuenta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Transaccion> transacciones = new ArrayList<>();

    /**
     * Método para agregar DUNAB a la cuenta
     */
    public void agregarDunab(BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero");
        }
        this.saldoActual = this.saldoActual.add(monto);
        this.totalGanado = this.totalGanado.add(monto);
    }

    /**
     * Método para restar DUNAB de la cuenta
     */
    public void restarDunab(BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero");
        }
        if (this.saldoActual.compareTo(monto) < 0) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        this.saldoActual = this.saldoActual.subtract(monto);
        this.totalGastado = this.totalGastado.add(monto);
    }

    /**
     * Verifica si hay saldo suficiente
     */
    public boolean tieneSaldoSuficiente(BigDecimal monto) {
        return this.saldoActual.compareTo(monto) >= 0;
    }

    /**
     * Verifica si la cuenta está activa
     */
    public boolean isActiva() {
        return this.estado == AccountStatus.ACTIVA;
    }
}
