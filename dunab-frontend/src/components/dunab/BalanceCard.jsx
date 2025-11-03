import React from 'react';

const BalanceCard = ({ balance }) => {
  // TODO: Implementar tarjeta de saldo

  return (
    <div className="balance-card">
      <h3>Balance Actual</h3>
      <p className="balance-amount">{balance || 0} DUNAB</p>
    </div>
  );
};

export default BalanceCard;
