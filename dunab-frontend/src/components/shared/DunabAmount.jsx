import React from 'react';

const DunabAmount = ({ amount, showCurrency = true }) => {
  // TODO: Implementar componente para formatear montos DUNAB

  return (
    <span className="dunab-amount">
      {amount || 0} {showCurrency && 'DUNAB'}
    </span>
  );
};

export default DunabAmount;
