import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDunab } from '../context/DunabContext';
import { useTranslation } from 'react-i18next';
import { MdWavingHand } from 'react-icons/md';

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
  const { t } = useTranslation();

  // Obtener el saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  if (loading && !user) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner message={t('dashboard.loadingDashboard')} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="dashboard-title">
            {getGreeting()}, {user?.nombre || t('dashboard.student')}! <MdWavingHand size={32} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </h1>
          <p className="dashboard-subtitle">
            {t('dashboard.activitySummary')}
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
      </div>
    </div>
  );
};

export default Dashboard;
