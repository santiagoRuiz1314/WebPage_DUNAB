package com.unab.dunab.service;

import com.unab.dunab.dto.request.LoginRequest;
import com.unab.dunab.dto.request.RegisterRequest;
import com.unab.dunab.dto.response.AuthResponse;
import com.unab.dunab.exception.DuplicateResourceException;
import com.unab.dunab.model.User;
import com.unab.dunab.repository.UserRepository;
import com.unab.dunab.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de autenticación y registro
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final DunabService dunabService;

    /**
     * Registra un nuevo usuario y crea su cuenta DUNAB
     */
    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        // Validar email único
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Usuario", "email", request.getEmail());
        }

        // Validar código de estudiante único si se proporciona
        if (request.getCodigoEstudiante() != null &&
                userRepository.existsByCodigoEstudiante(request.getCodigoEstudiante())) {
            throw new DuplicateResourceException("Usuario", "codigoEstudiante", request.getCodigoEstudiante());
        }

        // Crear usuario
        User usuario = User.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .codigoEstudiante(request.getCodigoEstudiante())
                .rol(request.getRol())
                .activo(true)
                .build();

        usuario = userRepository.save(usuario);

        // Crear cuenta DUNAB automáticamente
        try {
            dunabService.crearCuenta(usuario.getId());
            log.info("Cuenta DUNAB creada automáticamente para usuario: {}", usuario.getId());
        } catch (Exception e) {
            log.error("Error al crear cuenta DUNAB para usuario: {}", usuario.getId(), e);
        }

        // Generar tokens
        String token = tokenProvider.generateTokenFromEmail(usuario.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(usuario.getEmail());

        log.info("Usuario registrado exitosamente: {}", usuario.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tipo("Bearer")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(usuario.getRol())
                .build();
    }

    /**
     * Autentica un usuario y genera tokens JWT
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generar tokens
        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(request.getEmail());

        // Obtener información del usuario
        User usuario = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        log.info("Usuario autenticado exitosamente: {}", usuario.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tipo("Bearer")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(usuario.getRol())
                .build();
    }

    /**
     * Refresca el token de acceso usando el refresh token
     */
    public AuthResponse refrescarToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Refresh token inválido o expirado");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User usuario = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String nuevoToken = tokenProvider.generateTokenFromEmail(email);

        return AuthResponse.builder()
                .token(nuevoToken)
                .refreshToken(refreshToken)
                .tipo("Bearer")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(usuario.getRol())
                .build();
    }
}
