import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getToken, saveToken, removeToken, getUser, saveUser, removeUser, getRefreshToken } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  const login = async (email, password) => {
    try {
      console.log('🚀 AuthContext: Iniciando login...');
      const authData = await authService.login(email, password);

      console.log('📥 AuthContext: authData recibido:', authData);

      if (authData.token) {
        console.log('✅ AuthContext: Token válido encontrado');
        // authService ya guardó el token y user en localStorage
        // Solo actualizar state
        setToken(authData.token);
        const userData = {
          id: authData.id,
          email: authData.email,
          nombre: authData.nombre,
          apellido: authData.apellido,
          rol: authData.rol,
        };
        setUser(userData);
        setIsAuthenticated(true);

        console.log('🎉 AuthContext: Login exitoso! Usuario autenticado:', userData);
        return authData;
      } else {
        console.error('❌ AuthContext: No se encontró token en la respuesta');
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      // Ensure user is logged out on failure
      logout();
      throw error;
    }
  };

  /**
   * Logout user and clear session
   */
  const logout = () => {
    try {
      // Call backend logout (optional, mainly for cleanup)
      authService.logout().catch(err => console.error('Logout error:', err));

      // Clear localStorage
      removeToken();
      removeUser();

      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user data
   */
  const register = async (userData) => {
    try {
      console.log('🚀 AuthContext: Iniciando registro...');
      console.log('📥 AuthContext: userData recibido:', userData);

      const authData = await authService.register(userData);

      console.log('📦 AuthContext: authData recibido:', authData);

      // After successful registration, don't authenticate automatically
      // User should login manually
      console.log('✅ AuthContext: Registro exitoso! Usuario debe iniciar sesión');

      // Clear any tokens that might have been saved
      removeToken();
      removeUser();

      return authData;
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      // Ensure clean state on registration failure
      logout();
      throw error;
    }
  };

  /**
   * Refresh authentication token
   */
  const refreshToken = async () => {
    try {
      const currentRefreshToken = getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const newToken = await authService.refreshToken(currentRefreshToken);

      if (newToken) {
        saveToken(newToken);
        setToken(newToken);
        return newToken;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout(); // Logout if refresh fails
      throw error;
    }
  };

  /**
   * Update user profile
   * @param {Object} updates - User data to update
   */
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    saveUser(updatedUser);
  };


  // Verify and restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = getToken();
        const storedUser = getUser();

        if (storedToken && storedUser) {
          // Verify token is still valid
          try {
            await authService.verifyToken();

            setToken(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);
          } catch (error) {
            // Token invalid, clear session
            console.error('Token verification failed:', error);
            removeToken();
            removeUser();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    refreshToken,
    updateUser,
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
