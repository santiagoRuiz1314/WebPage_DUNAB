import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useDunab } from '../context/DunabContext';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordChange from '../components/profile/PasswordChange';
import PreferencesPanel from '../components/profile/PreferencesPanel';
import StatCard from '../components/shared/StatCard';
import DunabAmount from '../components/shared/DunabAmount';
import { MdAccountBalanceWallet, MdTrendingUp, MdAttachMoney } from 'react-icons/md';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { balance, statistics } = useDunab();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
        </div>
        <div className="profile-header-info">
          <h1>{user?.firstName} {user?.lastName}</h1>
          <p className="user-email">{user?.email}</p>
          <div className="user-badges">
            <span className="badge-role">{user?.role}</span>
            <span className="badge-code">{user?.studentCode}</span>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <StatCard
          title={t('dunab.currentBalance')}
          value={<DunabAmount amount={statistics?.saldoActual || balance || 0} />}
          icon={<MdAccountBalanceWallet size={28} />}
        />
        <StatCard
          title={t('dunab.totalEarned')}
          value={<DunabAmount amount={statistics?.totalGanado || 0} />}
          icon={<MdTrendingUp size={28} />}
        />
        <StatCard
          title={t('dunab.totalSpent')}
          value={<DunabAmount amount={statistics?.totalGastado || 0} />}
          icon={<MdAttachMoney size={28} />}
        />
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <ProfileForm />
        </div>

        <div className="profile-section">
          <PasswordChange />
        </div>

        <div className="profile-section">
          <PreferencesPanel />
        </div>
      </div>
    </div>
  );
};

export default Profile;
