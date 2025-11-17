import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import {
  MdSchool, MdMenuBook, MdFlag, MdWork, MdEdit, MdCheckCircle, MdCelebration,
  MdGpsFixed, MdWarning, MdDescription, MdBusinessCenter, MdHandshake,
  MdRecordVoiceOver, MdStar, MdAccessTime, MdRadioButtonUnchecked
} from 'react-icons/md';
import './GraduationPath.css';

/**
 * Mapeo de iconos para hitos
 */
const iconMap = {
  'school': MdSchool,
  'book': MdMenuBook,
  'flag': MdFlag,
  'work': MdWork,
  'edit': MdEdit,
  'check': MdCheckCircle,
  'celebration': MdCelebration,
};

/**
 * Componente que muestra el camino visual hacia la graduación
 * Incluye timeline de semestres, hitos académicos y fecha estimada
 */
const GraduationPath = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar datos del camino a la graduación
   */
  useEffect(() => {
    const fetchGraduationPath = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Intentar obtener datos del backend
        const progress = await studentService.getAcademicProgress(user.id);

        // Calcular datos del camino a la graduación
        const path = calculateGraduationPath(progress);
        setPathData(path);
      } catch (err) {
        console.error('Error fetching graduation path:', err);
        setError(t('academic.pathLoadError'));

        // Datos mock para desarrollo
        setPathData(getMockGraduationPath());
      } finally {
        setLoading(false);
      }
    };

    fetchGraduationPath();
  }, [user]);

  /**
   * Calcular datos del camino a la graduación basado en el progreso actual
   */
  const calculateGraduationPath = (progress) => {
    const currentDate = new Date();
    const currentSemester = progress.currentSemester || 8;
    const remainingSemesters = Math.ceil(progress.remainingCredits / 18); // Promedio 18 créditos/semestre

    // Calcular fecha estimada de graduación
    const monthsToGraduation = remainingSemesters * 6; // 6 meses por semestre
    const estimatedGraduationDate = new Date(currentDate);
    estimatedGraduationDate.setMonth(currentDate.getMonth() + monthsToGraduation);

    return {
      currentSemester,
      totalSemesters: 10, // Típico para programa de 5 años
      remainingSemesters,
      estimatedGraduationDate,
      completionPercentage: progress.completionPercentage || 75,
      milestones: generateMilestones(currentSemester, progress),
      requirements: progress.requirements || {},
    };
  };

  /**
   * Generar hitos académicos
   */
  const generateMilestones = (currentSemester, progress) => {
    const milestones = [
      {
        id: 1,
        semester: 1,
        title: t('academic.milestones.programStart'),
        description: t('academic.milestones.programStartDescription'),
        status: 'completed',
        icon: 'school',
        date: '2021-08',
      },
      {
        id: 2,
        semester: 2,
        title: t('academic.milestones.fundamentalsCompleted'),
        description: t('academic.milestones.fundamentalsDescription'),
        status: 'completed',
        icon: 'book',
        date: '2022-01',
      },
      {
        id: 3,
        semester: 4,
        title: t('academic.milestones.professionalElectives'),
        description: t('academic.milestones.professionalElectivesDescription'),
        status: currentSemester >= 4 ? 'completed' : 'pending',
        icon: 'flag',
        date: '2023-01',
      },
      {
        id: 4,
        semester: 6,
        title: t('academic.milestones.professionalPractice'),
        description: t('academic.milestones.professionalPracticeDescription'),
        status: progress.requirements?.internship ? 'completed' : currentSemester >= 6 ? 'in-progress' : 'pending',
        icon: 'work',
        date: currentSemester >= 6 ? '2024-01' : t('academic.milestones.datePending'),
      },
      {
        id: 5,
        semester: 8,
        title: t('academic.milestones.thesisProject'),
        description: t('academic.milestones.thesisDescription'),
        status: progress.requirements?.thesis ? 'completed' : currentSemester >= 8 ? 'in-progress' : 'pending',
        icon: 'edit',
        date: currentSemester >= 8 ? '2025-01' : t('academic.milestones.datePending'),
      },
      {
        id: 6,
        semester: 9,
        title: t('academic.milestones.additionalRequirements'),
        description: t('academic.milestones.additionalRequirementsDescription'),
        status: (progress.requirements?.socialService && progress.requirements?.englishTest)
          ? 'completed'
          : currentSemester >= 9 ? 'in-progress' : 'pending',
        icon: 'check',
        date: t('academic.milestones.datePending'),
      },
      {
        id: 7,
        semester: 10,
        title: t('academic.milestones.graduation'),
        description: t('academic.milestones.graduationDescription'),
        status: progress.completionPercentage >= 100 ? 'completed' : 'pending',
        icon: 'celebration',
        date: t('academic.milestones.dateToDefine'),
      },
    ];

    return milestones;
  };

  /**
   * Datos mock para desarrollo
   */
  const getMockGraduationPath = () => {
    const currentDate = new Date();
    const estimatedDate = new Date(currentDate);
    estimatedDate.setMonth(currentDate.getMonth() + 12); // 1 año

    return {
      currentSemester: 8,
      totalSemesters: 10,
      remainingSemesters: 2,
      estimatedGraduationDate: estimatedDate,
      completionPercentage: 75,
      milestones: [
        {
          id: 1,
          semester: 1,
          title: t('academic.milestones.programStart'),
          description: t('academic.milestones.programStartDescription'),
          status: 'completed',
          icon: 'school',
          date: '2021-08',
        },
        {
          id: 2,
          semester: 2,
          title: t('academic.milestones.fundamentalsCompleted'),
          description: t('academic.milestones.fundamentalsDescription'),
          status: 'completed',
          icon: 'book',
          date: '2022-01',
        },
        {
          id: 3,
          semester: 4,
          title: t('academic.milestones.professionalElectives'),
          description: t('academic.milestones.professionalElectivesDescription'),
          status: 'completed',
          icon: 'flag',
          date: '2023-01',
        },
        {
          id: 4,
          semester: 6,
          title: t('academic.milestones.professionalPractice'),
          description: t('academic.milestones.professionalPracticeDescription'),
          status: 'completed',
          icon: 'work',
          date: '2024-01',
        },
        {
          id: 5,
          semester: 8,
          title: t('academic.milestones.thesisProject'),
          description: t('academic.milestones.thesisDescription'),
          status: 'in-progress',
          icon: 'edit',
          date: '2025-01',
        },
        {
          id: 6,
          semester: 9,
          title: t('academic.milestones.additionalRequirements'),
          description: t('academic.milestones.additionalRequirementsDescription'),
          status: 'pending',
          icon: 'check',
          date: t('academic.milestones.datePending'),
        },
        {
          id: 7,
          semester: 10,
          title: t('academic.milestones.graduation'),
          description: t('academic.milestones.graduationDescription'),
          status: 'pending',
          icon: 'celebration',
          date: t('academic.milestones.dateToDefine'),
        },
      ],
      requirements: {
        thesis: false,
        internship: true,
        socialService: true,
        englishTest: false,
      },
    };
  };

  /**
   * Obtener clase CSS según estado
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'in-progress':
        return 'in-progress';
      case 'pending':
        return 'pending';
      default:
        return 'pending';
    }
  };

  /**
   * Formatear fecha estimada
   */
  const formatEstimatedDate = (date) => {
    const options = { year: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  };

  /**
   * Calcular meses restantes
   */
  const getMonthsRemaining = (estimatedDate) => {
    const now = new Date();
    const months = (estimatedDate.getFullYear() - now.getFullYear()) * 12 +
                   (estimatedDate.getMonth() - now.getMonth());
    return Math.max(0, months);
  };

  if (loading) {
    return (
      <div className="graduation-path">
        <div className="path-loading">
          <div className="spinner"></div>
          <p>{t('academic.loadingPath')}</p>
        </div>
      </div>
    );
  }

  if (error && !pathData) {
    return (
      <div className="graduation-path">
        <div className="path-error">
          <span className="error-icon"><MdWarning /></span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="graduation-path">
        <div className="path-empty">
          <p>{t('academic.noPathData')}</p>
        </div>
      </div>
    );
  }

  const monthsRemaining = getMonthsRemaining(pathData.estimatedGraduationDate);

  return (
    <div className="graduation-path">
      {/* Header con resumen */}
      <div className="path-header">
        <div className="path-title">
          <h2><MdGpsFixed /> {t('academic.pathToGraduation')}</h2>
          <p className="path-subtitle">{t('academic.pathSubtitle')}</p>
        </div>

        <div className="path-summary">
          <div className="summary-card">
            <span className="summary-label">{t('academic.currentSemesterLabel')}</span>
            <span className="summary-value primary">
              {t('academic.semesterProgress', { current: pathData.currentSemester, total: pathData.totalSemesters })}
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-label">{t('academic.remainingSemesters')}</span>
            <span className="summary-value warning">
              {pathData.remainingSemesters}
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-label">{t('academic.estimatedGraduation')}</span>
            <span className="summary-value success">
              {formatEstimatedDate(pathData.estimatedGraduationDate)}
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-label">{t('academic.timeRemaining')}</span>
            <span className="summary-value info">
              {t('academic.monthsRemaining', { months: monthsRemaining })}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso general */}
      <div className="path-progress-section">
        <div className="progress-info">
          <span className="progress-text">{t('academic.generalProgress')}</span>
          <span className="progress-percentage-text">
            {pathData.completionPercentage}%
          </span>
        </div>
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${pathData.completionPercentage}%` }}
          >
            <span className="progress-glow"></span>
          </div>
        </div>
      </div>

      {/* Timeline de hitos */}
      <div className="milestones-section">
        <h3 className="milestones-title">{t('academic.academicMilestones')}</h3>

        <div className="timeline">
          {pathData.milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`timeline-item ${getStatusClass(milestone.status)}`}
            >
              {/* Línea conectora */}
              {index < pathData.milestones.length - 1 && (
                <div className="timeline-connector"></div>
              )}

              {/* Icono del hito */}
              <div className="timeline-marker">
                <span className="milestone-icon">
                  {React.createElement(iconMap[milestone.icon] || MdSchool, { size: 24 })}
                </span>
                <span className="milestone-pulse"></span>
              </div>

              {/* Contenido del hito */}
              <div className="timeline-content">
                <div className="milestone-header">
                  <h4 className="milestone-title">{milestone.title}</h4>
                  <span className="milestone-semester">
                    {t('academic.semesterNumber', { number: milestone.semester })}
                  </span>
                </div>

                <p className="milestone-description">{milestone.description}</p>

                <div className="milestone-footer">
                  <span className="milestone-date">{milestone.date}</span>
                  <span className={`milestone-badge ${milestone.status}`}>
                    {milestone.status === 'completed' && <><MdCheckCircle /> {t('academic.milestones.statusCompleted')}</>}
                    {milestone.status === 'in-progress' && <><MdAccessTime /> {t('academic.milestones.statusInProgress')}</>}
                    {milestone.status === 'pending' && <><MdRadioButtonUnchecked /> {t('academic.milestones.statusPending')}</>}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos pendientes destacados */}
      <div className="pending-requirements-section">
        <h3 className="requirements-section-title">{t('academic.graduationRequirements')}</h3>
        <div className="requirements-grid">
          <div className={`requirement-card ${pathData.requirements.thesis ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon"><MdDescription /></span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">{t('academic.thesisProject')}</h4>
              <p className="requirement-status">
                {pathData.requirements.thesis ? t('academic.requirementCompleted') : t('academic.requirementPending')}
              </p>
            </div>
          </div>

          <div className={`requirement-card ${pathData.requirements.internship ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon"><MdBusinessCenter /></span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">{t('academic.professionalPractice')}</h4>
              <p className="requirement-status">
                {pathData.requirements.internship ? t('academic.requirementCompleted') : t('academic.requirementPending')}
              </p>
            </div>
          </div>

          <div className={`requirement-card ${pathData.requirements.socialService ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon"><MdHandshake /></span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">{t('academic.socialService')}</h4>
              <p className="requirement-status">
                {pathData.requirements.socialService ? t('academic.requirementCompleted') : t('academic.requirementPending')}
              </p>
            </div>
          </div>

          <div className={`requirement-card ${pathData.requirements.englishTest ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon"><MdRecordVoiceOver /></span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">{t('academic.englishTest')}</h4>
              <p className="requirement-status">
                {pathData.requirements.englishTest ? t('academic.requirementCompleted') : t('academic.requirementPending')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      {pathData.completionPercentage >= 70 && (
        <div className="motivational-message">
          <span className="message-icon"><MdStar /></span>
          <p className="message-text">
            {t('academic.motivationalMessage')}
          </p>
        </div>
      )}
    </div>
  );
};

export default GraduationPath;
