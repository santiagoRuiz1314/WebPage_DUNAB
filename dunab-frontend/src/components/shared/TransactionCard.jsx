import React from 'react';

const TransactionCard = ({ transaction }) => {
  // TODO: Implementar tarjeta de transacción

  return (
    <div className="transaction-card">
      <h4>{transaction?.description || 'Transacción'}</h4>
      {/* TODO: Mostrar detalles de transacción */}
    </div>
  );
};

export default TransactionCard;
