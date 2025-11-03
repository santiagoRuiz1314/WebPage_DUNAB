package com.unab.dunab.dto.response;

import com.unab.dunab.model.TransactionStatus;
import com.unab.dunab.model.TransactionType;
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
public class TransaccionResponse {
    private Long id;
    private Long cuentaId;
    private String estudianteNombre;
    private TransactionType tipo;
    private BigDecimal monto;
    private String categoriaNombre;
    private String descripcion;
    private String referencia;
    private TransactionStatus estado;
    private BigDecimal saldoAnterior;
    private BigDecimal saldoPosterior;
    private String creadoPor;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
