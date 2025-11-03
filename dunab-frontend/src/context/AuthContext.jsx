import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getToken, saveToken, removeToken, getUser, saveUser, removeUser } from '../utils/storage';

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
      const response = await authService.login(email, password);

      if (response.token && response.user) {
        // Save to localStorage
        saveToken(response.token);
        saveUser(response.user);

        // Update state
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);

        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
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
      const response = await authService.register(userData);

      if (response.token && response.user) {
        // Auto-login after registration
        saveToken(response.token);
        saveUser(response.user);

        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);

        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  /**
   * Refresh authentication token
   */
  const refreshToken = async () => {
    try {
      const currentToken = getToken();
      if (!currentToken) {
        throw new Error('No token available');
      }

      const response = await authService.refreshToken(currentToken);

      if (response.token) {
        saveToken(response.token);
        setToken(response.token);
        return response.token;
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

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole('ADMIN');
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
            await authService.verifyToken(storedToken);

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
    hasRole,
    isAdmin,
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
