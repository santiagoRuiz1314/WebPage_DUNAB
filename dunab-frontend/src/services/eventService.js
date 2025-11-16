import api from './api';

/**
 * Servicio para gestión de eventos institucionales
 * Sistema DUNAB - UNAB
 */

const eventService = {
  /**
   * Crear un nuevo evento (Solo ADMIN/COORDINATOR)
   * @param {Object} eventData - Datos del evento
   * @returns {Promise<Object>} Evento creado
   */
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  /**
   * Listar todos los eventos con paginación y filtros
   * @param {number} page - Número de página (default: 0)
   * @param {number} size - Tamaño de página (default: 10)
   * @param {Object} filters - Filtros opcionales (categoria, gratuito, search, sortBy, order)
   * @returns {Promise<Object>} Lista paginada de eventos desde el backend
   */
  getAllEvents: async (page = 0, size = 10, filters = {}) => {
    try {
      // El backend maneja TODOS los filtros, ordenamiento y búsqueda
      const params = {
        page,
        size,
        ...filters // categoria, gratuito, search, sortBy, order
      };
      const response = await api.get('/events', { params });
      return response;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Datos mock para desarrollo cuando backend no está disponible
      return {
        content: [
          {
            id: 1,
            nombre: 'Conferencia de Inteligencia Artificial',
            descripcion: 'Explora las últimas tendencias en IA y Machine Learning. Charlas magistrales con expertos de la industria.',
            descripcionLarga: 'Una conferencia completa sobre las últimas tendencias en Inteligencia Artificial y Machine Learning. Los participantes tendrán la oportunidad de aprender sobre:\n- Redes neuronales profundas\n- Procesamiento de lenguaje natural\n- Visión por computadora\n- Aplicaciones prácticas de IA en la industria',
            fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            fechaInicio: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            fechaFin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
            lugar: 'Auditorio Principal',
            categoria: 'académico',
            costoDunab: 0,
            recompensaDunab: 100,
            estado: 'UPCOMING',
            cuposDisponibles: 150,
            cuposTotal: 200,
            imagen: 'https://via.placeholder.com/400x250/4A90E2/ffffff?text=IA+Conference',
            organizador: 'Facultad de Ingeniería',
            requisitos: ['Ser estudiante activo', 'Interés en tecnología'],
            inscritosCount: 50
          },
          {
            id: 2,
            nombre: 'Taller de Emprendimiento',
            descripcion: 'Aprende a crear tu propia startup desde cero con mentores experimentados',
            descripcionLarga: 'Taller práctico de emprendimiento donde aprenderás:\n- Validación de ideas de negocio\n- Creación de modelo de negocio Canvas\n- Pitch para inversionistas\n- Financiamiento y captación de recursos',
            fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            fechaInicio: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            fechaFin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
            lugar: 'Sala de Innovación - Edificio B',
            categoria: 'taller',
            costoDunab: 50,
            recompensaDunab: 150,
            estado: 'UPCOMING',
            cuposDisponibles: 30,
            cuposTotal: 50,
            imagen: 'https://via.placeholder.com/400x250/50C878/ffffff?text=Emprendimiento',
            organizador: 'Centro de Emprendimiento UNAB',
            requisitos: ['Traer laptop', 'Tener una idea de negocio (opcional)'],
            inscritosCount: 20
          },
          {
            id: 3,
            nombre: 'Torneo Deportivo Inter-Facultades',
            descripcion: 'Participa en el torneo inter-facultades de fútbol y baloncesto',
            descripcionLarga: 'Gran torneo deportivo donde las facultades compiten en:\n- Fútbol 11\n- Baloncesto 5x5\n- Voleibol\n\nPremios en DUNAB para los equipos ganadores y participantes.',
            fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            fechaInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
            lugar: 'Canchas Deportivas UNAB',
            categoria: 'deportivo',
            costoDunab: 0,
            recompensaDunab: 200,
            estado: 'UPCOMING',
            cuposDisponibles: 200,
            cuposTotal: 300,
            imagen: 'https://via.placeholder.com/400x250/FF6B6B/ffffff?text=Torneo+Deportivo',
            organizador: 'Bienestar Universitario',
            requisitos: ['Certificado médico', 'Ser estudiante activo'],
            inscritosCount: 100
          },
          {
            id: 4,
            nombre: 'Hackathon UNAB 2025',
            descripcion: '24 horas de programación intensiva. Desarrolla soluciones innovadoras',
            descripcionLarga: 'Hackathon de 24 horas donde equipos de estudiantes desarrollan soluciones tecnológicas innovadoras. Categorías:\n- Inteligencia Artificial\n- Aplicaciones móviles\n- IoT y Hardware\n- Blockchain\n\nPremios: 1er lugar 500 DUNAB, 2do lugar 300 DUNAB, 3er lugar 200 DUNAB',
            fecha: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            fechaInicio: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            fechaFin: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            lugar: 'Laboratorios de Computación',
            categoria: 'competencia',
            costoDunab: 100,
            recompensaDunab: 500,
            estado: 'UPCOMING',
            cuposDisponibles: 40,
            cuposTotal: 60,
            imagen: 'https://via.placeholder.com/400x250/9B59B6/ffffff?text=Hackathon',
            organizador: 'Programa de Ingeniería de Sistemas',
            requisitos: ['Equipo de 3-5 personas', 'Laptop propia', 'Conocimientos de programación'],
            inscritosCount: 20
          },
          {
            id: 5,
            nombre: 'Conferencia de Liderazgo',
            descripcion: 'Desarrolla habilidades de liderazgo con expertos internacionales',
            descripcionLarga: 'Conferencia magistral sobre liderazgo efectivo con speakers internacionales. Temas:\n- Liderazgo transformacional\n- Gestión de equipos de alto rendimiento\n- Comunicación efectiva\n- Inteligencia emocional',
            fecha: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            fechaInicio: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            fechaFin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
            lugar: 'Teatro Universidad',
            categoria: 'conferencia',
            costoDunab: 0,
            recompensaDunab: 120,
            estado: 'UPCOMING',
            cuposDisponibles: 250,
            cuposTotal: 300,
            imagen: 'https://via.placeholder.com/400x250/E67E22/ffffff?text=Liderazgo',
            organizador: 'Dirección de Desarrollo Estudiantil',
            requisitos: ['Interés en liderazgo'],
            inscritosCount: 50
          }
        ],
        totalElements: 5,
        totalPages: 1,
        number: 0,
        size: 10
      };
    }
  },

  /**
   * Obtener eventos próximos (para dashboard)
   * @param {number} limit - Número de eventos a obtener
   * @returns {Promise<Array>} Lista de eventos próximos
   */
  getUpcomingEvents: async (limit = 3) => {
    try {
      const response = await api.get('/events/upcoming', { params: { limit } });
      return response;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      // Retornar primeros N eventos del mock
      const allEvents = await eventService.getAllEvents(0, limit);
      return allEvents.content || [];
    }
  },

  /**
   * Obtener evento por ID
   * @param {number} eventId - ID del evento
   * @returns {Promise<Object>} Datos del evento
   */
  getEvent: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response;
    } catch (error) {
      console.error('Error fetching event:', error);
      // Mock para desarrollo
      const allEvents = await eventService.getAllEvents();
      const event = allEvents.content.find(e => e.id === parseInt(eventId));
      if (event) return event;
      throw new Error('Evento no encontrado');
    }
  },

  /**
   * Actualizar evento (Solo ADMIN/COORDINATOR)
   * @param {number} eventId - ID del evento
   * @param {Object} eventData - Datos actualizados
   * @returns {Promise<Object>} Evento actualizado
   */
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  /**
   * Eliminar evento (Solo ADMIN)
   * @param {number} eventId - ID del evento
   * @returns {Promise<Object>} Confirmación
   */
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  /**
   * Inscribirse a un evento
   * Si el evento tiene costo, se debita DUNAB automáticamente
   * @param {number} eventId - ID del evento
   * @param {number} studentId - ID del estudiante (opcional si usa token)
   * @returns {Promise<Object>} Datos de la inscripción
   */
  registerToEvent: async (eventId, studentId = null) => {
    try {
      const payload = studentId ? { studentId } : {};
      const response = await api.post(`/events/${eventId}/register`, payload);
      return response;
    } catch (error) {
      console.error('Error registering to event:', error);
      throw error;
    }
  },

  /**
   * Cancelar inscripción a un evento
   * Si el evento tenía costo, se reembolsa DUNAB
   * @param {number} eventId - ID del evento
   * @param {number} registrationId - ID de la inscripción
   * @returns {Promise<Object>} Confirmación
   */
  cancelRegistration: async (eventId, registrationId) => {
    try {
      const response = await api.delete(`/events/${eventId}/register/${registrationId}`);
      return response;
    } catch (error) {
      console.error('Error canceling registration:', error);
      throw error;
    }
  },

  /**
   * Confirmar asistencia a un evento (Solo ADMIN/COORDINATOR)
   * Otorga la recompensa DUNAB al estudiante
   * @param {number} eventId - ID del evento
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<Object>} Confirmación y recompensa otorgada
   */
  confirmAttendance: async (eventId, studentId) => {
    try {
      const response = await api.post(`/events/${eventId}/confirm`, { studentId });
      return response;
    } catch (error) {
      console.error('Error confirming attendance:', error);
      throw error;
    }
  },

  /**
   * Obtener inscripciones de un estudiante
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<Array>} Lista de inscripciones
   */
  getStudentRegistrations: async (studentId) => {
    try {
      const response = await api.get(`/events/registrations/student/${studentId}`);
      return response;
    } catch (error) {
      console.error('Error fetching student registrations:', error);
      return [];
    }
  },

  /**
   * Obtener historial de participación del estudiante
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<Array>} Historial de eventos
   */
  getParticipationHistory: async (studentId) => {
    try {
      const response = await api.get(`/events/history/student/${studentId}`);
      return response;
    } catch (error) {
      console.error('Error fetching participation history:', error);
      return [];
    }
  },

  /**
   * Verificar si el estudiante está inscrito en un evento
   * @param {number} eventId - ID del evento
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<boolean>} true si está inscrito
   */
  isRegistered: async (eventId, studentId) => {
    try {
      const response = await api.get(`/events/${eventId}/is-registered`, {
        params: { studentId }
      });
      return response.isRegistered || false;
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  },

  /**
   * Obtener categorías de eventos disponibles
   * @returns {Promise<Array>} Lista de categorías
   */
  getEventCategories: async () => {
    try {
      const response = await api.get('/events/categories');
      return response;
    } catch (error) {
      console.error('Error fetching event categories:', error);
      // Categorías por defecto
      return [
        { id: 'académico', nombre: 'Académico', icono: 'school' },
        { id: 'taller', nombre: 'Taller', icono: 'construction' },
        { id: 'deportivo', nombre: 'Deportivo', icono: 'sports' },
        { id: 'competencia', nombre: 'Competencia', icono: 'trophy' },
        { id: 'conferencia', nombre: 'Conferencia', icono: 'mic' },
        { id: 'cultural', nombre: 'Cultural', icono: 'theater' },
        { id: 'social', nombre: 'Social', icono: 'handshake' }
      ];
    }
  },

  /**
   * Filtrar eventos por criterios específicos
   * IMPORTANTE: Este método usa el endpoint /events/filter del backend
   * El backend maneja TODA la lógica de filtrado
   * @param {Object} filters - Filtros (categoria, gratuito, search, sortBy, order, fechaInicio, fechaFin)
   * @returns {Promise<Object>} Eventos filtrados por el backend
   */
  filterEvents: async (filters) => {
    try {
      // Delegar TODA la lógica de filtrado al backend
      const response = await api.get('/events/filter', { params: filters });
      return response;
    } catch (error) {
      console.error('Error filtering events:', error);

      // FALLBACK solo para desarrollo sin backend
      // En producción, esto debería mostrar un error al usuario
      console.warn('⚠️ Usando datos mock - El backend debería manejar los filtros');

      // Llamar a getAllEvents que tiene los datos mock
      const allEvents = await eventService.getAllEvents(0, 50);

      // Aplicar filtros MÍNIMOS solo para desarrollo
      let filtered = allEvents.content || [];

      if (filters.categoria) {
        filtered = filtered.filter(e => e.categoria === filters.categoria);
      }

      if (filters.gratuito !== undefined) {
        filtered = filtered.filter(e =>
          filters.gratuito ? e.costoDunab === 0 : e.costoDunab > 0
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(e =>
          e.nombre.toLowerCase().includes(searchLower) ||
          e.descripcion.toLowerCase().includes(searchLower)
        );
      }

      // Ordenamiento básico (el backend debería hacer esto)
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'date':
              return filters.order === 'desc'
                ? new Date(b.fecha) - new Date(a.fecha)
                : new Date(a.fecha) - new Date(b.fecha);
            case 'name':
              return filters.order === 'desc'
                ? b.nombre.localeCompare(a.nombre)
                : a.nombre.localeCompare(b.nombre);
            case 'reward':
              return filters.order === 'desc'
                ? b.recompensaDunab - a.recompensaDunab
                : a.recompensaDunab - b.recompensaDunab;
            default:
              return 0;
          }
        });
      }

      return {
        content: filtered,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / (filters.size || 10)),
        number: filters.page || 0
      };
    }
  },
};

export default eventService;
