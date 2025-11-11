package com.unab.dunab.service;

import com.unab.dunab.dto.response.StudentProgressResponse;
import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.model.CuentaDunab;
import com.unab.dunab.model.User;
import com.unab.dunab.repository.CuentaDunabRepository;
import com.unab.dunab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Servicio para gestión de estudiantes
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final CuentaDunabRepository cuentaDunabRepository;

    /**
     * Obtiene todos los estudiantes (usuarios)
     */
    @Transactional(readOnly = true)
    public List<User> getAllStudents() {
        return userRepository.findAll();
    }

    /**
     * Obtiene un estudiante por ID
     */
    @Transactional(readOnly = true)
    public User getStudentById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante", "id", id));
    }

    /**
     * Obtiene el progreso de un estudiante
     */
    @Transactional(readOnly = true)
    public StudentProgressResponse getStudentProgress(Long id) {
        User student = getStudentById(id);
        CuentaDunab cuenta = cuentaDunabRepository.findByEstudianteId(id)
                .orElse(null);

        BigDecimal saldo = cuenta != null ? cuenta.getSaldoActual() : BigDecimal.ZERO;
        Long transaccionesCount = cuenta != null ? (long) cuenta.getTransacciones().size() : 0L;

        return StudentProgressResponse.builder()
                .studentId(student.getId())
                .nombre(student.getNombre())
                .apellido(student.getApellido())
                .email(student.getEmail())
                .codigoEstudiante(student.getCodigoEstudiante())
                .saldoDunab(saldo)
                .transaccionesTotal(transaccionesCount)
                .activo(student.getActivo())
                .build();
    }

    /**
     * Actualiza la información de un estudiante
     */
    @Transactional
    public User updateStudent(Long id, User studentData) {
        User student = getStudentById(id);

        if (studentData.getNombre() != null) {
            student.setNombre(studentData.getNombre());
        }
        if (studentData.getApellido() != null) {
            student.setApellido(studentData.getApellido());
        }
        if (studentData.getEmail() != null) {
            student.setEmail(studentData.getEmail());
        }
        if (studentData.getCodigoEstudiante() != null) {
            student.setCodigoEstudiante(studentData.getCodigoEstudiante());
        }

        return userRepository.save(student);
    }

    /**
     * Activa o desactiva un estudiante
     */
    @Transactional
    public User cambiarEstadoEstudiante(Long id, boolean activo) {
        User student = getStudentById(id);
        student.setActivo(activo);
        return userRepository.save(student);
    }
}
