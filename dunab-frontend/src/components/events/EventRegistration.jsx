import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useDunab } from '../../context/DunabContext';
import eventService from '../../services/eventService';
import './EventRegistration.css';

/**
 * Modal de inscripción a eventos
 * Maneja el pago con DUNAB si el evento tiene costo
 */
const EventRegistration = ({ event, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { balance, fetchBalance } = useDunab();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Confirmación, 2: Procesando, 3: Éxito

  const esGratuito = event.costoDunab === 0;
  const saldoSuficiente = balance >= event.costoDunab;

  useEffect(() => {
    // Asegurarse de tener el saldo actualizado
    fetchBalance();
  }, []);

  /**
   * Procesar inscripción al evento
   */
  const handleRegistration = async () => {
    // Validaciones previas
    if (!esGratuito && !saldoSuficiente) {
      setError('Saldo insuficiente para inscribirte a este evento');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStep(2); // Procesando

      // Realizar inscripción (el backend manejará el débito de DUNAB si aplica)
      await eventService.registerToEvent(event.id, user.id);

      // Actualizar saldo
      await fetchBalance();

      // Inscripción exitosa
      setStep(3);

      // Notificar éxito después de 2 segundos
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (err) {
      console.error('Error registering to event:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error al procesar la inscripción. Por favor, intenta de nuevo.'
      );
      setStep(1); // Volver al paso de confirmación
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renderizar contenido según el paso actual
   */
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* Header */}
            <div className="event-registration__header">
              <h2>Confirmar Inscripción</h2>
              <p className="event-registration__event-name">{event.nombre}</p>
            </div>

            {/* Información del evento */}
            <div className="event-registration__info">
              <div className="event-registration__info-item">
                <span className="event-registration__info-label">Fecha:</span>
                <span className="event-registration__info-value">
                  {new Date(event.fecha).toLocaleDateString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="event-registration__info-item">
                <span className="event-registration__info-label">Lugar:</span>
                <span className="event-registration__info-value">{event.lugar}</span>
              </div>

              <div className="event-registration__info-item">
                <span className="event-registration__info-label">Cupos disponibles:</span>
                <span className="event-registration__info-value">
                  {event.cuposDisponibles} de {event.cuposTotal}
                </span>
              </div>
            </div>

            {/* Información de pago */}
            <div className="event-registration__payment">
              <h3>Detalles de la Inscripción</h3>

              {esGratuito ? (
                <div className="event-registration__free">
                  <div className="event-registration__free-icon">🎉</div>
                  <p>¡Este evento es gratuito!</p>
                  <p className="event-registration__free-sub">
                    No se debitará DUNAB de tu cuenta
                  </p>
                </div>
              ) : (
                <>
                  <div className="event-registration__cost">
                    <span className="event-registration__cost-label">Costo del evento:</span>
                    <span className="event-registration__cost-value">
                      {formatCurrency(event.costoDunab)}
                    </span>
                  </div>

                  <div className="event-registration__balance">
                    <span className="event-registration__balance-label">Tu saldo actual:</span>
                    <span className={`event-registration__balance-value ${!saldoSuficiente ? 'insufficient' : ''}`}>
                      {formatCurrency(balance)}
                    </span>
                  </div>

                  {!saldoSuficiente && (
                    <div className="event-registration__warning">
                      <span className="event-registration__warning-icon">⚠️</span>
                      <p>No tienes saldo suficiente para inscribirte a este evento</p>
                      <p className="event-registration__warning-sub">
                        Necesitas {formatCurrency(event.costoDunab - balance)} más
                      </p>
                    </div>
                  )}

                  {saldoSuficiente && (
                    <div className="event-registration__balance-after">
                      <span className="event-registration__balance-label">Saldo después:</span>
                      <span className="event-registration__balance-value">
                        {formatCurrency(balance - event.costoDunab)}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Recompensa */}
              {event.recompensaDunab > 0 && (
                <div className="event-registration__reward">
                  <span className="event-registration__reward-icon">🎁</span>
                  <p>
                    Ganarás <strong>{formatCurrency(event.recompensaDunab)}</strong> al
                    confirmar tu asistencia
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="event-registration__error">
                <span className="event-registration__error-icon">❌</span>
                <p>{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="event-registration__actions">
              <button
                onClick={onClose}
                className="event-registration__button event-registration__button--secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleRegistration}
                className="event-registration__button event-registration__button--primary"
                disabled={loading || (!esGratuito && !saldoSuficiente)}
              >
                {esGratuito ? 'Confirmar Inscripción' : 'Pagar e Inscribirse'}
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <div className="event-registration__processing">
            <div className="event-registration__spinner" />
            <h3>Procesando inscripción...</h3>
            <p>Por favor espera un momento</p>
          </div>
        );

      case 3:
        return (
          <div className="event-registration__success">
            <div className="event-registration__success-icon">✓</div>
            <h3>¡Inscripción exitosa!</h3>
            <p>Te has inscrito correctamente al evento</p>
            <p className="event-registration__success-sub">{event.nombre}</p>

            {!esGratuito && (
              <div className="event-registration__success-payment">
                <p>Se han debitado {formatCurrency(event.costoDunab)} de tu cuenta</p>
                <p>Tu nuevo saldo es: {formatCurrency(balance - event.costoDunab)}</p>
              </div>
            )}

            {event.recompensaDunab > 0 && (
              <div className="event-registration__success-reward">
                <span className="event-registration__reward-icon">🎁</span>
                <p>Recuerda que ganarás {formatCurrency(event.recompensaDunab)} al asistir</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="event-registration-overlay" onClick={onClose}>
      <div
        className="event-registration"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar (solo en paso 1 y 3) */}
        {(step === 1 || step === 3) && (
          <button
            onClick={onClose}
            className="event-registration__close"
            aria-label="Cerrar"
          >
            ✕
          </button>
        )}

        {/* Contenido dinámico */}
        {renderContent()}
      </div>
    </div>
  );
};

export default EventRegistration;
