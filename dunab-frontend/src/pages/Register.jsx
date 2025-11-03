import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateStudentCode,
} from '../utils/validators';
import '../styles/auth.css';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentCode: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
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

    // First name validation
    const firstNameError = validateName(formData.firstName, 'Nombre');
    if (firstNameError) {
      newErrors.firstName = firstNameError;
    }

    // Last name validation
    const lastNameError = validateName(formData.lastName, 'Apellido');
    if (lastNameError) {
      newErrors.lastName = lastNameError;
    }

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Student code validation
    const studentCodeError = validateStudentCode(formData.studentCode);
    if (studentCodeError) {
      newErrors.studentCode = studentCodeError;
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor, confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare user data
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        studentCode: formData.studentCode.trim(),
        password: formData.password,
      };

      await register(userData);
      // Navigation will happen automatically via useEffect
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different error types
      if (error.response) {
        switch (error.response.status) {
          case 409:
            setServerError('Este correo o código de estudiante ya está registrado.');
            break;
          case 400:
            setServerError(error.response.data?.message || 'Datos inválidos. Verifica la información.');
            break;
          case 500:
            setServerError('Error del servidor. Por favor, intenta más tarde.');
            break;
          default:
            setServerError(error.response.data?.message || 'Error al registrar usuario.');
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
          <h2 className="auth-title">Crear Cuenta</h2>

          {serverError && (
            <div className="alert alert-error" role="alert">
              {serverError}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                Nombre
                <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Juan"
                autoComplete="given-name"
                disabled={loading}
                required
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Apellido
                <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Pérez"
                autoComplete="family-name"
                disabled={loading}
                required
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Correo Electrónico
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
            <label htmlFor="studentCode">
              Código de Estudiante
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="studentCode"
              name="studentCode"
              value={formData.studentCode}
              onChange={handleChange}
              className={errors.studentCode ? 'error' : ''}
              placeholder="U00123456"
              autoComplete="off"
              disabled={loading}
              required
            />
            {errors.studentCode && <span className="error-message">{errors.studentCode}</span>}
            <small className="field-hint">Formato: U00000000</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
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
                autoComplete="new-password"
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
            <small className="field-hint">Mínimo 8 caracteres, una mayúscula, una minúscula y un número</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmar Contraseña
              <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                disabled={loading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <div className="auth-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="auth-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

        <div className="auth-info">
          <p className="info-text">
            🎓 Solo estudiantes de UNAB pueden registrarse
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
