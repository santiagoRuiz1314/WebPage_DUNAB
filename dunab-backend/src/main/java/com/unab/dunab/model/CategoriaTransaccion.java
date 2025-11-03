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
@Table(name = "categorias_transaccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaTransaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(length = 200)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType tipo;

    @Column(nullable = false)
    private Boolean activa = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // Categorías predefinidas comunes
    public static final String MATERIA_COMPLETADA = "MATERIA_COMPLETADA";
    public static final String EVENTO_ASISTENCIA = "EVENTO_ASISTENCIA";
    public static final String PROYECTO_GRADO = "PROYECTO_GRADO";
    public static final String REFERIDO = "REFERIDO";
    public static final String INSCRIPCION_EVENTO = "INSCRIPCION_EVENTO";
    public static final String SERVICIO = "SERVICIO";
    public static final String AJUSTE_MANUAL = "AJUSTE_MANUAL";
}
