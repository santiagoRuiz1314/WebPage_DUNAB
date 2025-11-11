import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication
 *
 * @param {React.ReactNode} children - Child components to render if authorized
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while authentication state is being verified
  if (loading) {
    return (
      <div className="auth-loading-container">
        <LoadingSpinner size="large" message="Verificando autenticación..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;
