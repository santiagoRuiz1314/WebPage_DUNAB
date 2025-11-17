import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DunabBalance from '../dunab/DunabBalance';
import NotificationBell from '../notifications/NotificationBell';
import LanguageSelector from '../shared/LanguageSelector';
import ThemeToggle from '../shared/ThemeToggle';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdPerson, MdAccountBalanceWallet, MdLogout } from 'react-icons/md';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import unabLogo from '../../assets/unab-logo.png';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <span className="hamburger-icon">
            {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </span>
        </button>

        <div className="header-logo">
          <img src={unabLogo} alt="UNAB Logo" className="logo-image" />
          <h1 className="logo-text">DUNAB</h1>
        </div>
      </div>

      <div className="header-center">
        <DunabBalance />
      </div>

      <div className="header-right">
        <ThemeToggle />
        <LanguageSelector />
        <NotificationBell />

        <div className="user-menu">
          <button
            className="user-menu-btn"
            onClick={toggleDropdown}
            aria-label="User Menu"
          >
            <div className="user-avatar">
              {user?.nombre?.[0]}{user?.apellido?.[0]}
            </div>
            <span className="user-name">{user?.nombre} {user?.apellido}</span>
            <span className="dropdown-arrow">
              {dropdownOpen ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
            </span>
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <p className="user-full-name">{user?.nombre} {user?.apellido}</p>
                <p className="user-email">{user?.email}</p>
                <p className="user-role">{user?.rol}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate('/profile');
                  setDropdownOpen(false);
                }}
              >
                <MdPerson size={18} /> Mi Perfil
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate('/transactions');
                  setDropdownOpen(false);
                }}
              >
                <MdAccountBalanceWallet size={18} /> Mis Transacciones
              </button>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item logout-btn"
                onClick={handleLogout}
              >
                <MdLogout size={18} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
