package com.unab.dunab.dto.response;

import com.unab.dunab.model.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaDunabResponse {
    private Long id;
    private Long estudianteId;
    private String estudianteNombre;
    private BigDecimal saldoActual;
    private BigDecimal totalGanado;
    private BigDecimal totalGastado;
    private AccountStatus estado;
    private BigDecimal limiteTransaccion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
