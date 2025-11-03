package com.unab.dunab.dto.request;

import com.unab.dunab.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionRequest {

    @NotNull(message = "El ID de cuenta es obligatorio")
    private Long cuentaId;

    @NotNull(message = "El tipo de transacción es obligatorio")
    private TransactionType tipo;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal monto;

    private Long categoriaId;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    private String referencia;
}
