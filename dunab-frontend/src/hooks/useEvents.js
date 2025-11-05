/**
 * Custom hook para gestión de eventos
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllEvents, registerForEvent } from '../services/eventService';

export const useEvents = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Cargar eventos
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents(filters);
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err.message || 'Error loading events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Recargar eventos cuando cambian los filtros
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Actualizar filtros
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters(initialFilters);
  };

  // Registrarse a un evento
  const registerToEvent = async (eventId) => {
    try {
      setLoading(true);
      await registerForEvent(eventId);
      await loadEvents(); // Recargar eventos
      return { success: true };
    } catch (err) {
      console.error('Error registering for event:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Obtener eventos upcoming
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date() && event.status === 'UPCOMING';
  });

  // Obtener eventos pasados
  const pastEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate < new Date() || event.status === 'COMPLETED';
  });

  // Obtener eventos por categoría
  const getEventsByCategory = (category) => {
    return events.filter((event) => event.category === category);
  };

  // Refrescar eventos
  const refresh = () => {
    loadEvents();
  };

  return {
    events,
    upcomingEvents,
    pastEvents,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    registerToEvent,
    getEventsByCategory,
    refresh,
  };
};

export default useEvents;
