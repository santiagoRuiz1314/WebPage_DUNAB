import React from 'react';
import { useDunab } from '../../context/DunabContext';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../shared/LoadingSpinner';
import { MdAccountBalanceWallet } from 'react-icons/md';

const DunabBalance = () => {
  const { balance, loading } = useDunab();

  if (loading) {
    return (
      <div className="dunab-balance-header">
        <LoadingSpinner size="small" />
      </div>
    );
  }

  return (
    <div className="dunab-balance-header">
      <span className="balance-icon">
        <MdAccountBalanceWallet size={24} />
      </span>
      <div className="balance-info">
        <span className="balance-label">Tu Saldo DUNAB</span>
        <span className="balance-value">{formatCurrency(balance || 0)} D</span>
      </div>
    </div>
  );
};

export default DunabBalance;
