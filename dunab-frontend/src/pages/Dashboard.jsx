import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDunab } from '../context/DunabContext';
import DunabWallet from '../components/dunab/DunabWallet';

const Dashboard = () => {
  const { user } = useAuth();
  const { balance, loading } = useDunab();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>¡Bienvenido, {user?.firstName}!</h1>
        <p className="dashboard-subtitle">
          Aquí puedes ver un resumen de tu actividad DUNAB
        </p>
      </div>

      <div className="dashboard-content">
        <DunabWallet />

        {/* Placeholder sections for future implementation */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📚 Progreso Académico</h3>
            <p>Próximamente: Visualización de créditos y materias</p>
          </div>

          <div className="dashboard-card">
            <h3>🎉 Eventos Próximos</h3>
            <p>Próximamente: Lista de eventos disponibles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
