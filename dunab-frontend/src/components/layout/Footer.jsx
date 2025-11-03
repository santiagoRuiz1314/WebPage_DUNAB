import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="footer-title">DUNAB</p>
          <p className="footer-subtitle">Sistema de Gestión de Dinero UNAB</p>
        </div>

        <div className="footer-section">
          <p className="footer-links">
            <a href="/about" className="footer-link">
              Acerca de
            </a>
            <span className="separator">•</span>
            <a href="/help" className="footer-link">
              Ayuda
            </a>
            <span className="separator">•</span>
            <a href="/privacy" className="footer-link">
              Privacidad
            </a>
            <span className="separator">•</span>
            <a href="/terms" className="footer-link">
              Términos
            </a>
          </p>
        </div>

        <div className="footer-section">
          <p className="footer-copyright">
            © {currentYear} Universidad Autónoma de Bucaramanga. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
