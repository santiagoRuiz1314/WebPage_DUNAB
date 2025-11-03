package com.unab.dunab.controller;

import com.unab.dunab.dto.request.LoginRequest;
import com.unab.dunab.dto.request.RegisterRequest;
import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.dto.response.AuthResponse;
import com.unab.dunab.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de autenticación
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register - Registrar nuevo usuario
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registrar(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registrar(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Usuario registrado exitosamente"));
    }

    /**
     * POST /api/auth/login - Iniciar sesión
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Inicio de sesión exitoso"));
    }

    /**
     * POST /api/auth/refresh - Refrescar token
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refrescarToken(@RequestParam String refreshToken) {
        AuthResponse response = authService.refrescarToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refrescado exitosamente"));
    }
}
