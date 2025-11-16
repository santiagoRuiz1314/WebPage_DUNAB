package com.unab.dunab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String tipo = "Bearer";
    private Long id;
    private String email;
    private String nombre;
    private String apellido;
}
