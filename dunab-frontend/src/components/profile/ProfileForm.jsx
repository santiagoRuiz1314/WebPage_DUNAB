import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './ProfileForm.css';

const ProfileForm = () => {
  const { t } = useTranslation();
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    program: user?.program || '',
    semester: user?.semester || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      alert(t('profile.profileUpdated'));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('errors.serverError'));
    }
  };

  return (
    <div className="profile-form-container">
      <div className="profile-form-header">
        <h3>{t('profile.personalInfo')}</h3>
        {!isEditing && (
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(true)}
          >
            {t('profile.editProfile')}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>{t('profile.firstName')}</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('profile.lastName')}</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>{t('auth.email')}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={true}
          />
          <small className="form-help">{t('profile.emailNotEditable')}</small>
        </div>

        <div className="form-group">
          <label>{t('auth.phone')}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('profile.program')}</label>
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>{t('profile.semester')}</label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="1"
              max="12"
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {t('common.save')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              {t('common.cancel')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
