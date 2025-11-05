import React, { useState } from 'react';
import AcademicProgress from '../components/academic/AcademicProgress';
import GraduationPath from '../components/academic/GraduationPath';
import CourseList from '../components/academic/CourseList';
import './Academic.css';

/**
 * Página completa de módulo académico
 * Integra progreso académico, camino a graduación y lista de materias
 */
const Academic = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, path

  return (
    <div className="academic-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">🎓 Módulo Académico</h1>
          <p className="page-subtitle">
            Gestiona tu progreso académico y visualiza tu camino hacia la graduación
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">Resumen</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-label">Materias</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'path' ? 'active' : ''}`}
          onClick={() => setActiveTab('path')}
        >
          <span className="tab-icon">🎯</span>
          <span className="tab-label">Camino a Graduación</span>
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
                  <h3 className="card-title">Materias Actuales</h3>
                  <span className="card-badge in-progress">En Curso</span>
                </div>
                <div className="card-content">
                  <CourseList compact={true} />
                </div>
                <div className="card-footer">
                  <button
                    className="view-all-button"
                    onClick={() => setActiveTab('courses')}
                  >
                    Ver Todas las Materias →
                  </button>
                </div>
              </div>

              {/* Próximos hitos */}
              <div className="overview-card highlights">
                <div className="card-header">
                  <h3 className="card-title">Próximos Hitos</h3>
                  <span className="card-badge pending">Pendientes</span>
                </div>
                <div className="card-content">
                  <div className="milestones-list">
                    <div className="milestone-item">
                      <span className="milestone-icon">📝</span>
                      <div className="milestone-content">
                        <h4 className="milestone-title">Proyecto de Grado</h4>
                        <p className="milestone-description">Completa tu trabajo de investigación</p>
                        <span className="milestone-status in-progress">En Progreso</span>
                      </div>
                    </div>

                    <div className="milestone-item">
                      <span className="milestone-icon">✅</span>
                      <div className="milestone-content">
                        <h4 className="milestone-title">Requisitos Adicionales</h4>
                        <p className="milestone-description">Servicio social y examen de inglés</p>
                        <span className="milestone-status pending">Pendiente</span>
                      </div>
                    </div>

                    <div className="milestone-item">
                      <span className="milestone-icon">🎉</span>
                      <div className="milestone-content">
                        <h4 className="milestone-title">Ceremonia de Graduación</h4>
                        <p className="milestone-description">¡Tu meta final!</p>
                        <span className="milestone-status pending">Pendiente</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="view-all-button"
                    onClick={() => setActiveTab('path')}
                  >
                    Ver Camino Completo →
                  </button>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="info-cards-grid">
              <div className="info-card dunab">
                <div className="info-icon">💰</div>
                <div className="info-content">
                  <h4 className="info-title">Recompensas DUNAB</h4>
                  <p className="info-description">
                    Gana DUNAB por completar materias y alcanzar hitos académicos
                  </p>
                  <span className="info-value">100 DUNAB por crédito</span>
                </div>
              </div>

              <div className="info-card gpa">
                <div className="info-icon">📈</div>
                <div className="info-content">
                  <h4 className="info-title">Promedio Académico</h4>
                  <p className="info-description">
                    Mantén un buen rendimiento para acceder a beneficios
                  </p>
                  <span className="info-value">GPA: 4.2 / 5.0</span>
                </div>
              </div>

              <div className="info-card graduation">
                <div className="info-icon">🎓</div>
                <div className="info-content">
                  <h4 className="info-title">Fecha Estimada</h4>
                  <p className="info-description">
                    Fecha proyectada de graduación según tu avance
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
