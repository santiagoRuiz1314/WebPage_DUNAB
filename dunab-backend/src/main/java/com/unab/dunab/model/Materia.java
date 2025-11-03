package com.unab.dunab.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "materias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código de la materia es obligatorio")
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @NotBlank(message = "El nombre de la materia es obligatorio")
    @Column(nullable = false, length = 200)
    private String nombre;

    @Min(value = 1, message = "Los créditos deben ser al menos 1")
    @Column(nullable = false)
    private Integer creditos;

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private Boolean activa = true;

    public enum EstadoMateria {
        PENDIENTE,
        EN_CURSO,
        APROBADA,
        REPROBADA
    }
}
