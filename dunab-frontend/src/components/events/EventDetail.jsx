import React, { useState, useEffect } from 'react';
import { formatDateTime, formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import EventRegistration from './EventRegistration';
import LoadingSpinner from '../shared/LoadingSpinner';
import {
  MdCalendarToday,
  MdLocationOn,
  MdPeople,
  MdAttachMoney,
  MdCardGiftcard,
  MdCheckCircle,
  MdClose,
  MdSchool,
  MdBuild,
  MdSportsSoccer,
  MdEmojiEvents,
  MdRecordVoiceOver,
  MdTheaterComedy,
  MdHandshake
} from 'react-icons/md';
import './EventDetail.css';

/**
 * Componente para mostrar el detalle completo de un evento
 * Incluye toda la información y permite inscribirse
 */
const EventDetail = ({ eventId, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEventDetail();
      if (isAuthenticated && user?.id) {
        checkRegistrationStatus();
      }
    }
  }, [eventId, user?.id]);

  /**
   * Cargar detalles del evento
   */
  const loadEventDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventService.getEvent(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error('Error loading event detail:', err);
      setError('Error al cargar los detalles del evento');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verificar si el usuario ya está inscrito
   */
  const checkRegistrationStatus = async () => {
    try {
      const registered = await eventService.isRegistered(eventId, user.id);
      setIsRegistered(registered);
    } catch (err) {
      console.error('Error checking registration:', err);
    }
  };

  /**
   * Manejar inscripción exitosa
   */
  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setShowRegistration(false);
    loadEventDetail(); // Recargar para actualizar cupos
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="event-detail">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail">
        <div className="event-detail__error">
          <p>{error || 'Evento no encontrado'}</p>
          {onClose && (
            <button onClick={onClose} className="event-detail__close-button">
              Cerrar
            </button>
          )}
        </div>
      </div>
    );
  }

  const {
    nombre,
    descripcion,
    descripcionLarga,
    fecha,
    fechaInicio,
    fechaFin,
    lugar,
    categoria,
    costoDunab,
    recompensaDunab,
    cuposDisponibles,
    cuposTotal,
    imagen,
    organizador,
    requisitos = [],
    inscritosCount = 0
  } = event;

  const esGratuito = costoDunab === 0;
  const sinCupos = cuposDisponibles === 0;
  const ocupacionPorcentaje = cuposTotal > 0
    ? ((cuposTotal - cuposDisponibles) / cuposTotal * 100).toFixed(0)
    : 0;

  // Iconos por categoría con React Icons
  const categoriaIconos = {
    'académico': MdSchool,
    'taller': MdBuild,
    'deportivo': MdSportsSoccer,
    'competencia': MdEmojiEvents,
    'conferencia': MdRecordVoiceOver,
    'cultural': MdTheaterComedy,
    'social': MdHandshake
  };

  const getCategoryIcon = (cat) => {
    const IconComponent = categoriaIconos[cat] || MdCalendarToday;
    return IconComponent;
  };

  return (
    <div className="event-detail">
      {/* Botón cerrar */}
      {onClose && (
        <button onClick={onClose} className="event-detail__close-btn" aria-label="Cerrar">
          <MdClose />
        </button>
      )}

      {/* Imagen principal */}
      <div className="event-detail__hero">
        {imagen ? (
          <img src={imagen} alt={nombre} className="event-detail__hero-image" />
        ) : (
          <div className="event-detail__hero-placeholder">
            <span className="event-detail__hero-icon">
              {React.createElement(getCategoryIcon(categoria))}
            </span>
          </div>
        )}

        {/* Overlay con información básica */}
        <div className="event-detail__hero-overlay">
          <div className="event-detail__category-badge">
            {React.createElement(getCategoryIcon(categoria))} {categoria}
          </div>
          <h1 className="event-detail__title">{nombre}</h1>
          {organizador && (
            <p className="event-detail__organizer">
              Organiza: {organizador}
            </p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="event-detail__content">
        {/* Información clave */}
        <div className="event-detail__info-grid">
          {/* Fecha y hora */}
          <div className="event-detail__info-card">
            <div className="event-detail__info-icon"><MdCalendarToday /></div>
            <div className="event-detail__info-content">
              <h3>Fecha y Hora</h3>
              <p>{formatDate(fechaInicio || fecha)}</p>
              <p className="event-detail__info-time">
                {formatTime(fechaInicio || fecha)}
                {fechaFin && ` - ${formatTime(fechaFin)}`}
              </p>
            </div>
          </div>

          {/* Lugar */}
          <div className="event-detail__info-card">
            <div className="event-detail__info-icon"><MdLocationOn /></div>
            <div className="event-detail__info-content">
              <h3>Lugar</h3>
              <p>{lugar}</p>
            </div>
          </div>

          {/* Cupos */}
          <div className="event-detail__info-card">
            <div className="event-detail__info-icon"><MdPeople /></div>
            <div className="event-detail__info-content">
              <h3>Disponibilidad</h3>
              <p>{cuposDisponibles} de {cuposTotal} cupos</p>
              <div className="event-detail__progress">
                <div
                  className="event-detail__progress-bar"
                  style={{ width: `${ocupacionPorcentaje}%` }}
                />
              </div>
            </div>
          </div>

          {/* Costo */}
          <div className="event-detail__info-card">
            <div className="event-detail__info-icon"><MdAttachMoney /></div>
            <div className="event-detail__info-content">
              <h3>Costo</h3>
              <p className={esGratuito ? 'event-detail__free' : ''}>
                {esGratuito ? 'Entrada Gratuita' : formatCurrency(costoDunab)}
              </p>
            </div>
          </div>
        </div>

        {/* Recompensa DUNAB */}
        {recompensaDunab > 0 && (
          <div className="event-detail__reward-banner">
            <span className="event-detail__reward-icon"><MdCardGiftcard /></span>
            <div className="event-detail__reward-content">
              <h3>Recompensa por Asistencia</h3>
              <p>Gana <strong>{formatCurrency(recompensaDunab)}</strong> al confirmar tu asistencia</p>
            </div>
          </div>
        )}

        {/* Descripción */}
        <section className="event-detail__section">
          <h2>Descripción</h2>
          <p className="event-detail__description">
            {descripcionLarga || descripcion}
          </p>
        </section>

        {/* Requisitos */}
        {requisitos && requisitos.length > 0 && (
          <section className="event-detail__section">
            <h2>Requisitos</h2>
            <ul className="event-detail__requirements">
              {requisitos.map((req, index) => (
                <li key={index}><MdCheckCircle /> {req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Botones de acción */}
        <div className="event-detail__actions">
          {isAuthenticated ? (
            <>
              {isRegistered ? (
                <div className="event-detail__registered">
                  <span className="event-detail__registered-icon"><MdCheckCircle /></span>
                  <span>Ya estás inscrito en este evento</span>
                </div>
              ) : sinCupos ? (
                <button className="event-detail__button event-detail__button--disabled" disabled>
                  Cupos Agotados
                </button>
              ) : (
                <button
                  onClick={() => setShowRegistration(true)}
                  className="event-detail__button event-detail__button--primary"
                >
                  {esGratuito ? 'Inscribirse Gratis' : `Inscribirse por ${formatCurrency(costoDunab)}`}
                </button>
              )}
            </>
          ) : (
            <div className="event-detail__login-prompt">
              <p>Debes iniciar sesión para inscribirte en este evento</p>
              <button className="event-detail__button event-detail__button--primary">
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de inscripción */}
      {showRegistration && (
        <EventRegistration
          event={event}
          onClose={() => setShowRegistration(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default EventDetail;
