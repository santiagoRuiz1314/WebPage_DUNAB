import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import eventService from '../../services/eventService';
import LoadingSpinner from '../shared/LoadingSpinner';
import { MdSearch, MdCalendarToday } from 'react-icons/md';
import './EventsCatalog.css';

/**
 * Catálogo de eventos con filtros y búsqueda
 * Permite explorar todos los eventos disponibles
 */
const EventsCatalog = ({ onEventClick }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, free, paid
  const [sortBy, setSortBy] = useState('date'); // date, name, reward

  /**
   * Cargar categorías y eventos iniciales al montar
   */
  useEffect(() => {
    loadCategories();
    applyFilters(); // Cargar eventos iniciales sin filtros
  }, []);

  /**
   * Aplicar filtros cuando cambian - LLAMA AL BACKEND
   */
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchTerm, filterType, sortBy]);

  /**
   * Cargar solo categorías (se ejecuta una vez)
   */
  const loadCategories = async () => {
    try {
      const categoriesData = await eventService.getEventCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  /**
   * Aplicar filtros - DELEGA AL BACKEND
   * Esta función construye los parámetros y llama al backend
   */
  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir objeto de filtros para el backend
      const filters = {
        page: 0,
        size: 50, // Cargar más eventos para mejor UX
      };

      // Agregar filtros solo si tienen valor
      if (selectedCategory) {
        filters.categoria = selectedCategory;
      }

      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      if (filterType === 'free') {
        filters.gratuito = true;
      } else if (filterType === 'paid') {
        filters.gratuito = false;
      }

      if (sortBy) {
        filters.sortBy = sortBy;
        filters.order = 'asc'; // Puedes hacerlo configurable si quieres
      }

      // EL BACKEND HACE TODO EL TRABAJO
      const eventsData = await eventService.getAllEvents(filters.page, filters.size, filters);

      setFilteredEvents(eventsData.content || []);
      setEvents(eventsData.content || []); // Mantener copia para referencia

    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Error al aplicar filtros. Por favor, intente de nuevo.');
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setFilterType('all');
    setSortBy('date');
  };

  /**
   * Manejar click en una tarjeta de evento
   */
  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="events-catalog">
        <LoadingSpinner />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="events-catalog">
        <div className="events-catalog__error">
          <p>{error}</p>
          <button onClick={applyFilters} className="events-catalog__retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-catalog">
      {/* Header */}
      <div className="events-catalog__header">
        <h2 className="events-catalog__title">Catálogo de Eventos</h2>
        <p className="events-catalog__subtitle">
          Explora y participa en eventos institucionales
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="events-catalog__filters">
        {/* Búsqueda */}
        <div className="events-catalog__search">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="events-catalog__search-input"
          />
          <span className="events-catalog__search-icon"><MdSearch size={20} /></span>
        </div>

        {/* Filtros */}
        <div className="events-catalog__filter-group">
          {/* Categoría */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="events-catalog__select"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icono} {cat.nombre}
              </option>
            ))}
          </select>

          {/* Tipo de costo */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="events-catalog__select"
          >
            <option value="all">Todos</option>
            <option value="free">Gratuitos</option>
            <option value="paid">Con costo</option>
          </select>

          {/* Ordenar por */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="events-catalog__select"
          >
            <option value="date">Por fecha</option>
            <option value="name">Por nombre</option>
            <option value="reward">Por recompensa</option>
          </select>

          {/* Botón limpiar filtros */}
          {(selectedCategory || searchTerm || filterType !== 'all' || sortBy !== 'date') && (
            <button
              onClick={clearFilters}
              className="events-catalog__clear-button"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="events-catalog__results-count">
        {filteredEvents.length === 0 ? (
          <span>No se encontraron eventos</span>
        ) : (
          <span>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </span>
        )}
      </div>

      {/* Grid de eventos */}
      {filteredEvents.length > 0 ? (
        <div className="events-catalog__grid">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>
      ) : (
        <div className="events-catalog__empty">
          <div className="events-catalog__empty-icon"><MdCalendarToday size={64} /></div>
          <h3>No hay eventos disponibles</h3>
          <p>
            {searchTerm || selectedCategory
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay eventos programados en este momento'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsCatalog;
