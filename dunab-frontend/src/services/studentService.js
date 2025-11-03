import api from './api';

const studentService = {
  // TODO: Crear estudiante
  createStudent: async (studentData) => {
    // const response = await api.post('/students', studentData);
    // return response.data;
  },

  // TODO: Listar estudiantes
  getAllStudents: async (page = 0, size = 10) => {
    // const response = await api.get('/students', { params: { page, size } });
    // return response.data;
  },

  // TODO: Obtener estudiante por ID
  getStudent: async (studentId) => {
    // const response = await api.get(`/students/${studentId}`);
    // return response.data;
  },

  // TODO: Actualizar estudiante
  updateStudent: async (studentId, studentData) => {
    // const response = await api.put(`/students/${studentId}`, studentData);
    // return response.data;
  },

  // TODO: Eliminar estudiante
  deleteStudent: async (studentId) => {
    // const response = await api.delete(`/students/${studentId}`);
    // return response.data;
  },

  // TODO: Obtener progreso académico
  getAcademicProgress: async (studentId) => {
    // const response = await api.get(`/students/${studentId}/progress`);
    // return response.data;
  },
};

export default studentService;
