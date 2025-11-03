import { createContext, useContext, useState, useEffect } from 'react';

const DunabContext = createContext(null);

export const DunabProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  // TODO: Implementar obtención de saldo
  const fetchBalance = async () => {
    // Implementación pendiente
  };

  // TODO: Implementar obtención de transacciones
  const fetchTransactions = async (filters = {}) => {
    // Implementación pendiente
  };

  // TODO: Implementar obtención de estadísticas
  const fetchStatistics = async () => {
    // Implementación pendiente
  };

  // TODO: Implementar creación de transacción
  const createTransaction = async (transactionData) => {
    // Implementación pendiente
  };

  const value = {
    balance,
    transactions,
    statistics,
    loading,
    fetchBalance,
    fetchTransactions,
    fetchStatistics,
    createTransaction,
  };

  return <DunabContext.Provider value={value}>{children}</DunabContext.Provider>;
};

export const useDunab = () => {
  const context = useContext(DunabContext);
  if (!context) {
    throw new Error('useDunab must be used within a DunabProvider');
  }
  return context;
};
