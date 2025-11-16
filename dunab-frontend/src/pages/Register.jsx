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
import { MdAttachMoney, MdVisibility, MdVisibilityOff, MdSchool } from 'react-icons/md';
import '../styles/auth.css';

console.log('📄 REGISTER.JSX FILE LOADED - TOP LEVEL');

const Register = () => {
  console.log('🏁 REGISTER COMPONENT LOADED');

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  console.log('🔧 Register function from useAuth:', register);
  console.log('🔒 isAuthenticated:', isAuthenticated);

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
      console.log('➡️ Register: User already authenticated, redirecting to dashboard...');
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
    console.log('🔎 Starting validation with formData:', formData);
    const newErrors = {};

    // First name validation
    const firstNameValidation = validateName(formData.firstName);
    console.log('✔️ First name validation:', firstNameValidation);
    if (!firstNameValidation.valid) {
      newErrors.firstName = firstNameValidation.error;
    }

    // Last name validation
    const lastNameValidation = validateName(formData.lastName);
    console.log('✔️ Last name validation:', lastNameValidation);
    if (!lastNameValidation.valid) {
      newErrors.lastName = lastNameValidation.error;
    }

    // Email validation
    const emailValidation = validateEmail(formData.email);
    console.log('✔️ Email validation:', emailValidation);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    // Student code validation
    const studentCodeValidation = validateStudentCode(formData.studentCode);
    console.log('✔️ Student code validation:', studentCodeValidation);
    if (!studentCodeValidation.valid) {
      newErrors.studentCode = studentCodeValidation.error;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    console.log('✔️ Password validation:', passwordValidation);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor, confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    console.log('📝 New errors object:', newErrors);
    console.log('📏 Number of errors:', Object.keys(newErrors).length);

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('✅ Is form valid?', isValid);
    return isValid;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🎯 FORM SUBMIT TRIGGERED');
    console.log('📋 Form Data:', formData);

    setServerError('');

    // Validate form
    console.log('🔍 Validating form...');
    const isValid = validateForm();
    if (!isValid) {
      console.log('❌ Validation failed - check logs above for details');
      return;
    }
    console.log('✅ Validation passed - proceeding with registration');

    setLoading(true);
    console.log('⏳ Loading state set to true');

    try {
      // Prepare user data
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        studentCode: formData.studentCode.trim(),
        password: formData.password,
      };

      console.log('📤 Calling register with userData:', userData);
      await register(userData);
      console.log('✅ Register completed successfully');
      // Redirect to login page after successful registration
      console.log('➡️ Redirecting to login page...');
      navigate('/login', {
        state: {
          message: 'Registro exitoso. Por favor, inicia sesión con tus credenciales.'
        }
      });
    } catch (error) {
      console.error('❌ Registration error:', error);

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
            <span className="logo-icon">
              <MdAttachMoney size={40} />
            </span>
            <h1>DUNAB</h1>
          </div>
          <p className="auth-subtitle">Sistema de Gestión de Dinero UNAB</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">{t('auth.createAccount')}</h2>

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
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
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
                {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              onClick={(e) => {
                console.log('🖱️ BUTTON CLICKED');
                console.log('Button type:', e.currentTarget.type);
                console.log('Form element:', e.currentTarget.form);
              }}
            >
              {loading ? t('common.loading') : t('auth.register')}
            </button>
          </div>

          <div className="auth-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="auth-link">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </form>

        <div className="auth-info">
          <p className="info-text">
            <MdSchool size={16} /> Solo estudiantes de UNAB pueden registrarse
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
