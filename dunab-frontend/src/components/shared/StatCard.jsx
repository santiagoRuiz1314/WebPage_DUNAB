import React from 'react';

const StatCard = ({ title, value, icon }) => {
  // TODO: Implementar tarjeta de estadística

  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <h4>{title}</h4>
      <p className="stat-value">{value}</p>
    </div>
  );
};

export default StatCard;
