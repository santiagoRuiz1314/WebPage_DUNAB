import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import TransactionManagement from '../components/admin/TransactionManagement';
import UserManagement from '../components/admin/UserManagement';
import EventManagement from '../components/admin/EventManagement';
import ReportsGenerator from '../components/admin/ReportsGenerator';
import CategoryManagement from '../components/dunab/CategoryManagement';
import './AdminPanel.css';

const AdminPanel = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: t('navigation.dashboard'), icon: '📊' },
    { id: 'transactions', label: t('admin.transactions'), icon: '💳' },
    { id: 'users', label: t('admin.users'), icon: '👥' },
    { id: 'events', label: t('admin.events'), icon: '📅' },
    { id: 'categories', label: t('admin.categories'), icon: '🏷️' },
    { id: 'reports', label: t('admin.reports'), icon: '📈' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'transactions':
        return <TransactionManagement />;
      case 'users':
        return <UserManagement />;
      case 'events':
        return <EventManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'reports':
        return <ReportsGenerator />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-panel-page">
      <div className="admin-header">
        <h1>⚙️ {t('admin.title')}</h1>
        <p className="welcome-text">
          {t('dashboard.welcome', { name: user?.firstName })}
        </p>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
