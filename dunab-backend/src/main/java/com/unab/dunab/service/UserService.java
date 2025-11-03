package com.unab.dunab.service;

import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.model.User;
import com.unab.dunab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para la gestión de usuarios
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Obtiene un usuario por ID
     */
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
    }

    /**
     * Obtiene un usuario por email
     */
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
    }

    /**
     * Obtiene todos los usuarios
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Actualiza un usuario
     */
    @Transactional
    public User actualizarUsuario(Long id, User usuarioActualizado) {
        User usuario = getUserById(id);

        if (usuarioActualizado.getNombre() != null) {
            usuario.setNombre(usuarioActualizado.getNombre());
        }
        if (usuarioActualizado.getApellido() != null) {
            usuario.setApellido(usuarioActualizado.getApellido());
        }
        if (usuarioActualizado.getEmail() != null) {
            usuario.setEmail(usuarioActualizado.getEmail());
        }
        if (usuarioActualizado.getCodigoEstudiante() != null) {
            usuario.setCodigoEstudiante(usuarioActualizado.getCodigoEstudiante());
        }

        return userRepository.save(usuario);
    }

    /**
     * Cambia la contraseña de un usuario
     */
    @Transactional
    public void cambiarPassword(Long id, String nuevaPassword) {
        User usuario = getUserById(id);
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        userRepository.save(usuario);
        log.info("Contraseña actualizada para usuario: {}", id);
    }

    /**
     * Activa o desactiva un usuario
     */
    @Transactional
    public User cambiarEstadoUsuario(Long id, boolean activo) {
        User usuario = getUserById(id);
        usuario.setActivo(activo);
        return userRepository.save(usuario);
    }

    /**
     * Elimina un usuario
     */
    @Transactional
    public void eliminarUsuario(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", "id", id);
        }
        userRepository.deleteById(id);
        log.warn("Usuario eliminado - ID: {}", id);
    }

    /**
     * Verifica si existe un email
     */
    public boolean existeEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Verifica si existe un código de estudiante
     */
    public boolean existeCodigoEstudiante(String codigo) {
        return userRepository.existsByCodigoEstudiante(codigo);
    }
}
