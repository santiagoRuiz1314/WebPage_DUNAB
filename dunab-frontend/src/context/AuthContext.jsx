import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // TODO: Implementar login
  const login = async (email, password) => {
    // Implementación pendiente
  };

  // TODO: Implementar logout
  const logout = () => {
    // Implementación pendiente
  };

  // TODO: Implementar registro
  const register = async (userData) => {
    // Implementación pendiente
  };

  // TODO: Verificar token al cargar
  useEffect(() => {
    // Implementación pendiente
    setLoading(false);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
