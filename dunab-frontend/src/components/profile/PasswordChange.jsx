import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import './PasswordChange.css';

const PasswordChange = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert(t('validation.passwordMismatch'));
      return;
    }

    if (formData.newPassword.length < 8) {
      alert(t('validation.minLength', { min: 8 }));
      return;
    }

    try {
      // Llamar al servicio de cambio de contraseña
      await authService.changePassword(formData.currentPassword, formData.newPassword);
      alert(t('profile.passwordChanged'));
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.message || t('errors.serverError');
      alert(errorMessage);
    }
  };

  return (
    <div className="password-change-container">
      <h3>{t('profile.changePassword')}</h3>
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label>{t('profile.currentPassword')}</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('profile.newPassword')}</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label>{t('auth.confirmPassword')}</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            minLength={8}
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={() => setShowPasswords(!showPasswords)}
            />
            <span>{t('profile.showPasswords')}</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          {t('profile.changePassword')}
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;
