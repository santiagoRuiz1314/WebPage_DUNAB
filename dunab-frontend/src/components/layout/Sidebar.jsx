import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { MdDashboard, MdAccountBalanceWallet, MdEvent, MdSchool, MdPerson } from 'react-icons/md';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    {
      path: '/',
      icon: MdDashboard,
      label: t('navigation.dashboard'),
    },
    {
      path: '/transactions',
      icon: MdAccountBalanceWallet,
      label: t('navigation.transactions'),
    },
    {
      path: '/events',
      icon: MdEvent,
      label: t('navigation.events'),
    },
    {
      path: '/academic',
      icon: MdSchool,
      label: t('navigation.academic'),
    },
    {
      path: '/profile',
      icon: MdPerson,
      label: t('navigation.profile'),
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  end={item.path === '/'}
                >
                  <span className="nav-icon">
                    <IconComponent size={20} />
                  </span>
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {isOpen && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar-small">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="user-details">
                <p className="user-name-small">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="user-role-small">{t('common.user')}</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
