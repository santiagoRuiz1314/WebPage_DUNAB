import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import unabLogo from '../../assets/unab-logo.png';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main Footer Sections */}
        <div className="footer-main">
          {/* About Section */}
          <div className="footer-column">
            <div className="footer-logo">
              <img src={unabLogo} alt="UNAB Logo" className="footer-logo-image" />
              <h3 className="footer-column-title">DUNAB</h3>
            </div>
            <p className="footer-description">
              Sistema de Gestión de Dinero UNAB - Plataforma integral para administrar
              tus finanzas universitarias de manera eficiente y segura.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/UNABoficial" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com/UNABoficial" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/unaboficial" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/school/universidad-autonoma-de-bucaramanga" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://www.youtube.com/user/UNABoficial" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-column">
            <h3 className="footer-column-title">Acceso Rápido</h3>
            <ul className="footer-links-list">
              <li>
                <Link to="/" className="footer-link">
                  <i className="fas fa-home"></i>
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="footer-link">
                  <i className="fas fa-exchange-alt"></i>
                  <span>Transacciones</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="footer-link">
                  <i className="fas fa-calendar"></i>
                  <span>Eventos</span>
                </Link>
              </li>
              <li>
                <Link to="/academic" className="footer-link">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Académico</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">
                  <i className="fas fa-user"></i>
                  <span>Perfil</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="footer-column">
            <h3 className="footer-column-title">Recursos UNAB</h3>
            <ul className="footer-links-list">
              <li>
                <a href="https://www.unab.edu.co" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <i className="fas fa-university"></i>
                  <span>Portal UNAB</span>
                </a>
              </li>
              <li>
                <a href="https://canvas.unab.edu.co" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Canvas LMS</span>
                </a>
              </li>
              <li>
                <a href="https://biblioteca.unab.edu.co" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <i className="fas fa-book"></i>
                  <span>Biblioteca</span>
                </a>
              </li>
              <li>
                <a href="https://www.unab.edu.co/estudiantes" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <i className="fas fa-user-graduate"></i>
                  <span>Portal Estudiantes</span>
                </a>
              </li>
              <li>
                <a href="https://www.unab.edu.co/servicios" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <i className="fas fa-life-ring"></i>
                  <span>Servicios</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-column">
            <h3 className="footer-column-title">Contacto</h3>
            <ul className="footer-contact-list">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Avenida 42 No. 48-11<br/>Bucaramanga, Colombia</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+57 (7) 643 6111</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:dunab@unab.edu.co">dunab@unab.edu.co</a>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span>Lun - Vie: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <p className="footer-copyright">
              © {currentYear} Universidad Autónoma de Bucaramanga. Todos los derechos reservados.
            </p>
            <div className="footer-legal-links">
              <a href="/privacy" className="footer-legal-link">Política de Privacidad</a>
              <span className="separator">•</span>
              <a href="/terms" className="footer-legal-link">Términos de Servicio</a>
              <span className="separator">•</span>
              <a href="/cookies" className="footer-legal-link">Política de Cookies</a>
              <span className="separator">•</span>
              <a href="/accessibility" className="footer-legal-link">Accesibilidad</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
