import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AcademicProgress from '../components/academic/AcademicProgress';
import GraduationPath from '../components/academic/GraduationPath';
import CourseList from '../components/academic/CourseList';
import {
  MdSchool,
  MdAssessment,
  MdBook,
  MdFlag,
  MdDescription,
  MdCheckCircle,
  MdCelebration,
  MdAttachMoney,
  MdTrendingUp,
  MdEmojiEvents
} from 'react-icons/md';
import './Academic.css';

/**
 * Página completa de módulo académico
 * Integra progreso académico, camino a graduación y lista de materias
 */
const Academic = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, path

  return (
    <div className="academic-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title"><MdSchool /> {t('academic.moduleTitle')}</h1>
          <p className="page-subtitle">
            {t('academic.moduleSubtitle')}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon"><MdAssessment /></span>
          <span className="tab-label">{t('academic.overview')}</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <span className="tab-icon"><MdBook /></span>
          <span className="tab-label">{t('academic.courses')}</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'path' ? 'active' : ''}`}
          onClick={() => setActiveTab('path')}
        >
          <span className="tab-icon"><MdFlag /></span>
          <span className="tab-label">{t('academic.graduationPath')}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Progreso académico principal */}
            <div className="overview-section">
              <AcademicProgress />
            </div>

            {/* Grid de vista rápida */}
            <div className="overview-grid">
              {/* Quick stats de materias */}
              <div className="overview-card">
                <div className="card-header">
                  <h3 className="card-title">{t('academic.currentCourses')}</h3>
                  <span className="card-badge in-progress">{t('academic.inCourse')}</span>
                </div>
                <div className="card-content">
                  <CourseList compact={true} />
                </div>
                <div className="card-footer">
                  <button
                    className="view-all-button"
                    onClick={() => setActiveTab('courses')}
                  >
                    {t('academic.viewAllCourses')} →
                  </button>
                </div>
              </div>

              {/* Próximos hitos */}
              <div className="overview-card highlights">
                <div className="card-header">
                  <h3 className="card-title">{t('academic.upcomingMilestones')}</h3>
                  <span className="card-badge pending">{t('academic.pendingMilestones')}</span>
                </div>
                <div className="card-content">
                  <div className="milestones-list">
                    <div className="milestone-item">
                      <span className="milestone-icon"><MdDescription size={24} /></span>
                      <div className="milestone-content">
                        <h4 className="milestone-title">{t('academic.thesisProject')}</h4>
                        <p className="milestone-description">{t('academic.thesisDescription')}</p>
                        <span className="milestone-status in-progress">{t('academic.inProgress')}</span>
                      </div>
                    </div>

                    <div className="milestone-item">
                      <span className="milestone-icon"><MdCheckCircle size={24} /></span>
                      <div className="milestone-content">
                        <h4 className="milestone-title">{t('academic.additionalRequirements')}</h4>
                        <p className="milestone-description">{t('academic.additionalRequirementsDescription')}</p>
                        <span className="milestone-status pending">{t('academic.pending')}</span>
                      </div>
                    </div>

                    <div className="milestone-item">
                      <span className="milestone-icon"><MdCelebration size={24} /></span>
                      <div className="milestone-content">
                        <h4 className="milestone-title">{t('academic.graduationCeremony')}</h4>
                        <p className="milestone-description">{t('academic.graduationCeremonyDescription')}</p>
                        <span className="milestone-status pending">{t('academic.pending')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="view-all-button"
                    onClick={() => setActiveTab('path')}
                  >
                    {t('academic.viewFullPath')} →
                  </button>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="info-cards-grid">
              <div className="info-card dunab">
                <div className="info-icon"><MdAttachMoney size={36} /></div>
                <div className="info-content">
                  <h4 className="info-title">{t('academic.dunabRewards')}</h4>
                  <p className="info-description">
                    {t('academic.dunabRewardsDescription')}
                  </p>
                  <span className="info-value">{t('academic.dunabPerCredit', { amount: 100 })}</span>
                </div>
              </div>

              <div className="info-card gpa">
                <div className="info-icon"><MdTrendingUp size={36} /></div>
                <div className="info-content">
                  <h4 className="info-title">{t('academic.academicAverage')}</h4>
                  <p className="info-description">
                    {t('academic.academicAverageDescription')}
                  </p>
                  <span className="info-value">{t('academic.gpaValue', { gpa: 4.2 })}</span>
                </div>
              </div>

              <div className="info-card graduation">
                <div className="info-icon"><MdEmojiEvents size={36} /></div>
                <div className="info-content">
                  <h4 className="info-title">{t('academic.estimatedDate')}</h4>
                  <p className="info-description">
                    {t('academic.estimatedDateDescription')}
                  </p>
                  <span className="info-value">Diciembre 2025</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="courses-tab">
            <CourseList />
          </div>
        )}

        {/* GRADUATION PATH TAB */}
        {activeTab === 'path' && (
          <div className="path-tab">
            <GraduationPath />
          </div>
        )}
      </div>
    </div>
  );
};

export default Academic;
