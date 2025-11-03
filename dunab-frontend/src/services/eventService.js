import api from './api';

const eventService = {
  // Crear evento
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Listar eventos
  getAllEvents: async (page = 0, size = 10) => {
    try {
      const response = await api.get('/events', { params: { page, size } });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Datos mock para desarrollo
      return {
        content: [
          {
            id: 1,
            nombre: 'Conferencia de Inteligencia Artificial',
            descripcion: 'Explora las últimas tendencias en IA y Machine Learning',
            fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'académico',
            costoDunab: 0,
            recompensaDunab: 100,
            estado: 'UPCOMING'
          },
          {
            id: 2,
            nombre: 'Taller de Emprendimiento',
            descripcion: 'Aprende a crear tu propia startup desde cero',
            fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'taller',
            costoDunab: 50,
            recompensaDunab: 150,
            estado: 'UPCOMING'
          },
          {
            id: 3,
            nombre: 'Torneo Deportivo',
            descripcion: 'Participa en el torneo inter-facultades',
            fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            categoria: 'deportivo',
            costoDunab: 0,
            recompensaDunab: 200,
            estado: 'UPCOMING'
          }
        ],
        totalElements: 3,
        totalPages: 1
      };
    }
  },

  // Obtener evento por ID
  getEvent: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Actualizar evento
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Eliminar evento
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Inscribirse a evento
  registerToEvent: async (eventId, studentId) => {
    try {
      const response = await api.post(`/events/${eventId}/register`, { studentId });
      return response.data;
    } catch (error) {
      console.error('Error registering to event:', error);
      throw error;
    }
  },

  // Confirmar asistencia
  confirmAttendance: async (eventId, studentId) => {
    try {
      const response = await api.post(`/events/${eventId}/confirm`, { studentId });
      return response.data;
    } catch (error) {
      console.error('Error confirming attendance:', error);
      throw error;
    }
  },
};

export default eventService;
