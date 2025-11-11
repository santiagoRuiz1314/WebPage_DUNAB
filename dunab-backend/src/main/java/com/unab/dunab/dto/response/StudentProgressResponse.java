package com.unab.dunab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProgressResponse {
    private Long studentId;
    private String nombre;
    private String apellido;
    private String email;
    private String codigoEstudiante;
    private BigDecimal saldoDunab;
    private Long transaccionesTotal;
    private Boolean activo;
}
