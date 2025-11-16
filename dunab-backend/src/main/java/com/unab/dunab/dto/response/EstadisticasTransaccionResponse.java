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
public class EstadisticasTransaccionResponse {
    private Long cuentaId;
    private BigDecimal saldoActual;
    private BigDecimal totalGanado;
    private BigDecimal totalGastado;
    private BigDecimal totalCreditos;
    private BigDecimal totalDebitos;
    private Long totalTransacciones;
}
