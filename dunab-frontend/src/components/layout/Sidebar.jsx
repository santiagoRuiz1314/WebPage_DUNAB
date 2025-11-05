import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    {
      path: '/',
      icon: '📊',
      label: 'Dashboard',
      roles: ['STUDENT', 'ADMIN', 'COORDINATOR'],
    },
    {
      path: '/transactions',
      icon: '💳',
      label: 'Transacciones',
      roles: ['STUDENT', 'ADMIN', 'COORDINATOR'],
    },
    {
      path: '/events',
      icon: '🎉',
      label: 'Eventos',
      roles: ['STUDENT', 'ADMIN', 'COORDINATOR'],
    },
    {
      path: '/academic',
      icon: '🎓',
      label: 'Académico',
      roles: ['STUDENT', 'ADMIN', 'COORDINATOR'],
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Mi Perfil',
      roles: ['STUDENT', 'ADMIN', 'COORDINATOR'],
    },
    {
      path: '/admin',
      icon: '⚙️',
      label: 'Panel Admin',
      roles: ['ADMIN'],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {filteredNavItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                end={item.path === '/'}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
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
                <p className="user-role-small">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
