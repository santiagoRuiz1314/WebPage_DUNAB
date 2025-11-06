import api from './api';

const studentService = {
  // Crear estudiante
  createStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response;
  },

  // Listar estudiantes
  getAllStudents: async (page = 0, size = 10) => {
    const response = await api.get('/students', { params: { page, size } });
    return response;
  },

  // Obtener estudiante por ID
  getStudent: async (studentId) => {
    const response = await api.get(`/students/${studentId}`);
    return response;
  },

  // Actualizar estudiante
  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/students/${studentId}`, studentData);
    return response;
  },

  // Eliminar estudiante
  deleteStudent: async (studentId) => {
    const response = await api.delete(`/students/${studentId}`);
    return response;
  },

  // Obtener progreso académico
  getAcademicProgress: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/progress`);
      return response;
    } catch (error) {
      console.error('Error fetching academic progress:', error);
      // Datos mock para desarrollo
      return {
        totalCredits: 160,
        completedCredits: 120,
        remainingCredits: 40,
        completionPercentage: 75,
        currentSemester: 8,
        coursesCompleted: 32,
        coursesInProgress: 5,
        coursesPending: 8,
        gpa: 4.2,
        requirements: {
          thesis: false,
          internship: true,
          socialService: true,
          englishTest: false
        }
      };
    }
  },
};

export default studentService;
