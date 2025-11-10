import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { validateEmail, validatePassword } from '../utils/validators';
import '../styles/auth.css';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔄 Login: isAuthenticated cambió a:', isAuthenticated);
    if (isAuthenticated) {
      console.log('➡️ Login: Redirigiendo a Dashboard...');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear server error
    if (serverError) {
      setServerError('');
    }
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    console.log('📝 Login: Formulario enviado');

    // Validate form
    if (!validateForm()) {
      console.log('⚠️ Login: Validación de formulario falló');
      return;
    }

    console.log('✅ Login: Validación OK, iniciando login...');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      console.log('✨ Login: login() completado exitosamente');
      // Navigation will happen automatically via useEffect
    } catch (error) {
      console.error('❌ Login: Error capturado:', error);

      // Handle different error types
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setServerError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
            break;
          case 404:
            setServerError('Usuario no encontrado.');
            break;
          case 500:
            setServerError('Error del servidor. Por favor, intenta más tarde.');
            break;
          default:
            setServerError(error.response.data?.message || 'Error al iniciar sesión.');
        }
      } else if (error.request) {
        setServerError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        setServerError('Error inesperado. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">💰</span>
            <h1>DUNAB</h1>
          </div>
          <p className="auth-subtitle">Sistema de Gestión de Dinero UNAB</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">{t('auth.login')}</h2>

          {serverError && (
            <div className="alert alert-error" role="alert">
              {serverError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              {t('auth.email')}
              <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="ejemplo@unab.edu.co"
              autoComplete="email"
              disabled={loading}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {t('auth.password')}
              <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('auth.login')}
            </button>
          </div>

          <div className="auth-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="auth-link">
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </form>

        <div className="auth-info">
          <p className="info-text">
            🔒 Tus datos están protegidos con encriptación de extremo a extremo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
