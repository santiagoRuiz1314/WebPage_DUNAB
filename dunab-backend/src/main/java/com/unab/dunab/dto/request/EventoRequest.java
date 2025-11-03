package com.unab.dunab.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoRequest {

    @NotBlank(message = "El nombre del evento es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "La fecha del evento es obligatoria")
    private LocalDateTime fechaEvento;

    private String ubicacion;

    @Min(value = 0, message = "La capacidad no puede ser negativa")
    private Integer capacidadMaxima;

    @Min(value = 0, message = "El costo no puede ser negativo")
    private BigDecimal costoDunab = BigDecimal.ZERO;

    @Min(value = 0, message = "La recompensa no puede ser negativa")
    private BigDecimal recompensaDunab = BigDecimal.ZERO;

    private Boolean requiereConfirmacion = false;
}
