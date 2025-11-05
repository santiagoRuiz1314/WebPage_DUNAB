import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../shared/ThemeToggle';
import LanguageSelector from '../shared/LanguageSelector';
import './PreferencesPanel.css';

const PreferencesPanel = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="preferences-panel">
      <h3>{t('profile.preferences')}</h3>

      <div className="preference-item">
        <div className="preference-info">
          <h4>{t('profile.theme')}</h4>
          <p>{t('profile.themeDescription')}</p>
          <p className="current-value">
            {t('common.current')}: {theme === 'dark' ? t('profile.darkMode') : t('profile.lightMode')}
          </p>
        </div>
        <div className="preference-control">
          <ThemeToggle />
        </div>
      </div>

      <div className="preference-item">
        <div className="preference-info">
          <h4>{t('profile.language')}</h4>
          <p>{t('profile.languageDescription')}</p>
        </div>
        <div className="preference-control">
          <LanguageSelector />
        </div>
      </div>

      <div className="preference-item">
        <div className="preference-info">
          <h4>{t('profile.notifications')}</h4>
          <p>{t('profile.notificationsDescription')}</p>
        </div>
        <div className="preference-control">
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="preference-item">
        <div className="preference-info">
          <h4>{t('profile.emailNotifications')}</h4>
          <p>{t('profile.emailNotificationsDescription')}</p>
        </div>
        <div className="preference-control">
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPanel;
