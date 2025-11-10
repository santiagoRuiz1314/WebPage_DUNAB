import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role requirements
 *
 * @param {React.ReactNode} children - Child components to render if authorized
 * @param {string} requiredRole - Optional role required to access the route (e.g., 'ADMIN', 'STUDENT')
 * @param {string[]} allowedRoles - Optional array of allowed roles
 */
const ProtectedRoute = ({ children, requiredRole, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

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

  // Check single required role
  if (requiredRole && user?.rol !== requiredRole) {
    console.warn(`Access denied: User rol '${user?.rol}' does not match required role '${requiredRole}'`);
    return <Navigate to="/" replace />;
  }

  // Check multiple allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    console.warn(`Access denied: User rol '${user?.rol}' not in allowed roles [${allowedRoles.join(', ')}]`);
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
