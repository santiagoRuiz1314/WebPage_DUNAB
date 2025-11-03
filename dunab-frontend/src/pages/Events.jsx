import React from 'react';

const Events = () => {
  return (
    <div className="events-page">
      <h1>🎉 Eventos Institucionales</h1>
      <div className="dashboard-card">
        <p>Próximamente: Catálogo de eventos disponibles</p>
        <ul style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
          <li>Ver eventos disponibles</li>
          <li>Inscribirse con DUNAB</li>
          <li>Ganar DUNAB por asistencia</li>
          <li>Historial de eventos</li>
        </ul>
      </div>
    </div>
  );
};

export default Events;
