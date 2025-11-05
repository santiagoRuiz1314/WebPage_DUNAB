import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSystemStatistics, getSystemBalance } from '../../services/reportService';
import { getAllUsers } from '../../services/adminService';
import StatCard from '../shared/StatCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [balance, setBalance] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, balanceData, usersData] = await Promise.all([
        getSystemStatistics(),
        getSystemBalance(),
        getAllUsers(),
      ]);
      setStats(statsData);
      setBalance(balanceData);
      setUserCount(usersData.totalElements || usersData.length || 0);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-dashboard">
      <h2>{t('admin.title')}</h2>

      <div className="stats-grid">
        <StatCard
          title={t('admin.totalUsers')}
          value={userCount}
          icon="👥"
          trend="+5%"
          trendType="up"
        />
        <StatCard
          title={t('admin.totalTransactions')}
          value={stats?.totalTransactions || 0}
          icon="💳"
          trend="+12%"
          trendType="up"
        />
        <StatCard
          title={t('admin.totalEvents')}
          value={stats?.totalEvents || 0}
          icon="📅"
          trend="+3"
          trendType="up"
        />
        <StatCard
          title={t('dunab.balance')}
          value={`${balance?.totalBalance || 0} DUNAB`}
          icon="💰"
          trend="Stable"
          trendType="neutral"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>{t('dashboard.recentActivity')}</h3>
          <p className="placeholder-text">
            {t('admin.recentActivityPlaceholder')}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>{t('admin.systemHealth')}</h3>
          <div className="health-indicator">
            <div className="health-item">
              <span className="health-label">API Status:</span>
              <span className="health-status healthy">● Healthy</span>
            </div>
            <div className="health-item">
              <span className="health-label">Database:</span>
              <span className="health-status healthy">● Connected</span>
            </div>
            <div className="health-item">
              <span className="health-label">Cache:</span>
              <span className="health-status healthy">● Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>{t('admin.quickActions')}</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span>{t('admin.createUser')}</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">💳</span>
            <span>{t('transactions.create')}</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📅</span>
            <span>{t('admin.createEvent')}</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>{t('admin.generateReport')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
