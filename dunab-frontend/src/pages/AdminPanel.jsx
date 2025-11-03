import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="admin-panel-page">
      <h1>⚙️ Panel de Administración</h1>
      <div className="dashboard-card">
        <p>Bienvenido, {user?.firstName}. Este es el panel de administración de DUNAB.</p>
        <p style={{ marginTop: '20px' }}>Próximamente:</p>
        <ul style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>
          <li>Gestión completa de transacciones DUNAB (CRUD)</li>
          <li>Administración de usuarios</li>
          <li>Creación y gestión de categorías</li>
          <li>Generación de reportes y estadísticas</li>
          <li>Configuración del sistema</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
