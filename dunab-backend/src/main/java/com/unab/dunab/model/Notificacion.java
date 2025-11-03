package com.unab.dunab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private User estudiante;

    @NotBlank(message = "El tipo de notificación es obligatorio")
    @Column(nullable = false, length = 50)
    private String tipo;

    @NotBlank(message = "El mensaje es obligatorio")
    @Column(nullable = false, length = 500)
    private String mensaje;

    @Column(nullable = false)
    private Boolean leida = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaLectura;

    // Tipos de notificaciones predefinidos
    public static final String TIPO_CREDITO = "CREDITO";
    public static final String TIPO_DEBITO = "DEBITO";
    public static final String TIPO_EVENTO = "EVENTO";
    public static final String TIPO_LOGRO = "LOGRO";
    public static final String TIPO_SISTEMA = "SISTEMA";

    /**
     * Marca la notificación como leída
     */
    public void marcarComoLeida() {
        this.leida = true;
        this.fechaLectura = LocalDateTime.now();
    }
}
