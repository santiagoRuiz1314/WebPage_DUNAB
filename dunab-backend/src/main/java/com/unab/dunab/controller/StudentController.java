package com.unab.dunab.controller;

import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.dto.response.StudentProgressResponse;
import com.unab.dunab.model.User;
import com.unab.dunab.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de estudiantes
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    /**
     * GET /api/students - Obtener todos los estudiantes
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllStudents() {
        List<User> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    /**
     * GET /api/students/{id} - Obtener estudiante por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getStudent(@PathVariable Long id) {
        User student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    /**
     * GET /api/students/{id}/progress - Obtener progreso del estudiante
     */
    @GetMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<StudentProgressResponse>> getStudentProgress(@PathVariable Long id) {
        StudentProgressResponse progress = studentService.getStudentProgress(id);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }

    /**
     * PUT /api/students/{id} - Actualizar estudiante
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateStudent(
            @PathVariable Long id,
            @RequestBody User studentData) {
        User student = studentService.updateStudent(id, studentData);
        return ResponseEntity.ok(ApiResponse.success(student, "Estudiante actualizado exitosamente"));
    }

    /**
     * PUT /api/students/{id}/status - Cambiar estado del estudiante
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<User>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam boolean activo) {
        User student = studentService.cambiarEstadoEstudiante(id, activo);
        return ResponseEntity.ok(ApiResponse.success(student, "Estado actualizado exitosamente"));
    }
}
