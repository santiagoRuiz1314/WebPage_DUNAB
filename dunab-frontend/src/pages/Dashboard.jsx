import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDunab } from '../context/DunabContext';

// Componentes del Dashboard
import StatisticsWidget from '../components/dashboard/StatisticsWidget';
import BalanceChart from '../components/dashboard/BalanceChart';
import RecentTransactions from '../components/dunab/RecentTransactions';
import AcademicProgress from '../components/academic/AcademicProgress';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import LoadingSpinner from '../components/shared/LoadingSpinner';

import './Dashboard.css';

/**
 * Página principal del Dashboard
 * Muestra resumen completo de DUNAB, progreso académico y eventos
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { loading } = useDunab();

  // Obtener el saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  if (loading && !user) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner message="Cargando tu dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="dashboard-title">
            {getGreeting()}, {user?.nombre || 'Estudiante'}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Aquí tienes un resumen de tu actividad en DUNAB
          </p>
        </div>
      </div>

      {/* Contenido principal del Dashboard */}
      <div className="dashboard-content">
        {/* Sección de Estadísticas Principales */}
        <section className="dashboard-section statistics-section">
          <StatisticsWidget />
        </section>

        {/* Grid de 2 columnas: Gráfico y Transacciones Recientes */}
        <section className="dashboard-section chart-transactions-section">
          <div className="dashboard-grid-2col">
            <div className="grid-item chart-item">
              <BalanceChart />
            </div>
            <div className="grid-item transactions-item">
              <RecentTransactions limit={5} />
            </div>
          </div>
        </section>

        {/* Grid de 2 columnas: Progreso Académico y Eventos */}
        <section className="dashboard-section progress-events-section">
          <div className="dashboard-grid-2col">
            <div className="grid-item academic-item">
              <AcademicProgress />
            </div>
            <div className="grid-item events-item">
              <UpcomingEvents limit={3} />
            </div>
          </div>
        </section>

        {/* Sección de Acciones Rápidas (opcional) */}
        <section className="dashboard-section quick-actions-section">
          <div className="quick-actions-card">
            <h3 className="quick-actions-title">⚡ Acciones Rápidas</h3>
            <div className="quick-actions-grid">
              <a href="/transactions" className="quick-action-btn">
                <span className="action-icon">💳</span>
                <span className="action-label">Historial Completo</span>
              </a>
              <a href="/events" className="quick-action-btn">
                <span className="action-icon">🎉</span>
                <span className="action-label">Ver Eventos</span>
              </a>
              <a href="/profile" className="quick-action-btn">
                <span className="action-icon">👤</span>
                <span className="action-label">Mi Perfil</span>
              </a>
              {user?.rol === 'ADMINISTRADOR' && (
                <a href="/admin" className="quick-action-btn">
                  <span className="action-icon">⚙️</span>
                  <span className="action-label">Panel Admin</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
