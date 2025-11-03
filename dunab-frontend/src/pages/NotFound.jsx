import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="not-found-content">
          <div className="not-found-icon">404</div>
          <h1>Página no encontrada</h1>
          <p>Lo sentimos, la página que buscas no existe.</p>
          <div className="not-found-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Volver al Dashboard
            </button>
            <button
              className="btn"
              onClick={() => navigate(-1)}
              style={{ marginLeft: '10px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
