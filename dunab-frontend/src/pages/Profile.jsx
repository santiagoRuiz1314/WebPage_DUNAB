import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>👤 Mi Perfil</h1>
      <div className="dashboard-card">
        <h3>Información Personal</h3>
        <div style={{ marginTop: '20px' }}>
          <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Código:</strong> {user?.studentCode}</p>
          <p><strong>Rol:</strong> {user?.role}</p>
        </div>
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
          Próximamente: Edición de perfil y configuración de cuenta
        </p>
      </div>
    </div>
  );
};

export default Profile;
