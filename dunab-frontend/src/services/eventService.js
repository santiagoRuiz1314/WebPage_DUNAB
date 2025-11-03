import api from './api';

const eventService = {
  // TODO: Crear evento
  createEvent: async (eventData) => {
    // const response = await api.post('/events', eventData);
    // return response.data;
  },

  // TODO: Listar eventos
  getAllEvents: async (page = 0, size = 10) => {
    // const response = await api.get('/events', { params: { page, size } });
    // return response.data;
  },

  // TODO: Obtener evento por ID
  getEvent: async (eventId) => {
    // const response = await api.get(`/events/${eventId}`);
    // return response.data;
  },

  // TODO: Actualizar evento
  updateEvent: async (eventId, eventData) => {
    // const response = await api.put(`/events/${eventId}`, eventData);
    // return response.data;
  },

  // TODO: Eliminar evento
  deleteEvent: async (eventId) => {
    // const response = await api.delete(`/events/${eventId}`);
    // return response.data;
  },

  // TODO: Inscribirse a evento
  registerToEvent: async (eventId, studentId) => {
    // const response = await api.post(`/events/${eventId}/register`, { studentId });
    // return response.data;
  },

  // TODO: Confirmar asistencia
  confirmAttendance: async (eventId, studentId) => {
    // const response = await api.post(`/events/${eventId}/confirm`, { studentId });
    // return response.data;
  },
};

export default eventService;
