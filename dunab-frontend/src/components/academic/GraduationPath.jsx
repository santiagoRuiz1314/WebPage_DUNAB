import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import './GraduationPath.css';

/**
 * Componente que muestra el camino visual hacia la graduación
 * Incluye timeline de semestres, hitos académicos y fecha estimada
 */
const GraduationPath = () => {
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
        setError('No se pudo cargar el camino a la graduación');

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
        title: 'Inicio del Programa',
        description: 'Bienvenida e introducción a la carrera',
        status: 'completed',
        icon: '🎓',
        date: '2021-08',
      },
      {
        id: 2,
        semester: 2,
        title: 'Fundamentos Completados',
        description: 'Materias básicas del programa',
        status: 'completed',
        icon: '📚',
        date: '2022-01',
      },
      {
        id: 3,
        semester: 4,
        title: 'Electivas Profesionales',
        description: 'Inicio de especialización',
        status: currentSemester >= 4 ? 'completed' : 'pending',
        icon: '🎯',
        date: '2023-01',
      },
      {
        id: 4,
        semester: 6,
        title: 'Prácticas Profesionales',
        description: 'Experiencia laboral supervisada',
        status: progress.requirements?.internship ? 'completed' : currentSemester >= 6 ? 'in-progress' : 'pending',
        icon: '💼',
        date: currentSemester >= 6 ? '2024-01' : 'Pendiente',
      },
      {
        id: 5,
        semester: 8,
        title: 'Proyecto de Grado',
        description: 'Trabajo de investigación final',
        status: progress.requirements?.thesis ? 'completed' : currentSemester >= 8 ? 'in-progress' : 'pending',
        icon: '📝',
        date: currentSemester >= 8 ? '2025-01' : 'Pendiente',
      },
      {
        id: 6,
        semester: 9,
        title: 'Requisitos Adicionales',
        description: 'Servicio social, examen de inglés',
        status: (progress.requirements?.socialService && progress.requirements?.englishTest)
          ? 'completed'
          : currentSemester >= 9 ? 'in-progress' : 'pending',
        icon: '✅',
        date: 'Pendiente',
      },
      {
        id: 7,
        semester: 10,
        title: 'Graduación',
        description: 'Ceremonia de grado',
        status: progress.completionPercentage >= 100 ? 'completed' : 'pending',
        icon: '🎉',
        date: 'Por definir',
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
          title: 'Inicio del Programa',
          description: 'Bienvenida e introducción a la carrera',
          status: 'completed',
          icon: '🎓',
          date: '2021-08',
        },
        {
          id: 2,
          semester: 2,
          title: 'Fundamentos Completados',
          description: 'Materias básicas del programa',
          status: 'completed',
          icon: '📚',
          date: '2022-01',
        },
        {
          id: 3,
          semester: 4,
          title: 'Electivas Profesionales',
          description: 'Inicio de especialización',
          status: 'completed',
          icon: '🎯',
          date: '2023-01',
        },
        {
          id: 4,
          semester: 6,
          title: 'Prácticas Profesionales',
          description: 'Experiencia laboral supervisada',
          status: 'completed',
          icon: '💼',
          date: '2024-01',
        },
        {
          id: 5,
          semester: 8,
          title: 'Proyecto de Grado',
          description: 'Trabajo de investigación final',
          status: 'in-progress',
          icon: '📝',
          date: '2025-01',
        },
        {
          id: 6,
          semester: 9,
          title: 'Requisitos Adicionales',
          description: 'Servicio social, examen de inglés',
          status: 'pending',
          icon: '✅',
          date: 'Pendiente',
        },
        {
          id: 7,
          semester: 10,
          title: 'Graduación',
          description: 'Ceremonia de grado',
          status: 'pending',
          icon: '🎉',
          date: 'Por definir',
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
          <p>Cargando camino a la graduación...</p>
        </div>
      </div>
    );
  }

  if (error && !pathData) {
    return (
      <div className="graduation-path">
        <div className="path-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="graduation-path">
        <div className="path-empty">
          <p>No hay datos disponibles del camino a la graduación</p>
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
          <h2>🎯 Camino a la Graduación</h2>
          <p className="path-subtitle">Tu ruta hacia el éxito académico</p>
        </div>

        <div className="path-summary">
          <div className="summary-card">
            <span className="summary-label">Semestre Actual</span>
            <span className="summary-value primary">
              {pathData.currentSemester} / {pathData.totalSemesters}
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-label">Semestres Restantes</span>
            <span className="summary-value warning">
              {pathData.remainingSemesters}
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-label">Fecha Estimada</span>
            <span className="summary-value success">
              {formatEstimatedDate(pathData.estimatedGraduationDate)}
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-label">Tiempo Restante</span>
            <span className="summary-value info">
              {monthsRemaining} meses
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso general */}
      <div className="path-progress-section">
        <div className="progress-info">
          <span className="progress-text">Progreso General</span>
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
        <h3 className="milestones-title">Hitos Académicos</h3>

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
                <span className="milestone-icon">{milestone.icon}</span>
                <span className="milestone-pulse"></span>
              </div>

              {/* Contenido del hito */}
              <div className="timeline-content">
                <div className="milestone-header">
                  <h4 className="milestone-title">{milestone.title}</h4>
                  <span className="milestone-semester">
                    Semestre {milestone.semester}
                  </span>
                </div>

                <p className="milestone-description">{milestone.description}</p>

                <div className="milestone-footer">
                  <span className="milestone-date">{milestone.date}</span>
                  <span className={`milestone-badge ${milestone.status}`}>
                    {milestone.status === 'completed' && '✓ Completado'}
                    {milestone.status === 'in-progress' && '⏳ En Progreso'}
                    {milestone.status === 'pending' && '○ Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos pendientes destacados */}
      <div className="pending-requirements-section">
        <h3 className="requirements-section-title">Requisitos para Graduación</h3>
        <div className="requirements-grid">
          <div className={`requirement-card ${pathData.requirements.thesis ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon">📝</span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">Proyecto de Grado</h4>
              <p className="requirement-status">
                {pathData.requirements.thesis ? 'Completado' : 'Pendiente'}
              </p>
            </div>
          </div>

          <div className={`requirement-card ${pathData.requirements.internship ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon">💼</span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">Prácticas Profesionales</h4>
              <p className="requirement-status">
                {pathData.requirements.internship ? 'Completado' : 'Pendiente'}
              </p>
            </div>
          </div>

          <div className={`requirement-card ${pathData.requirements.socialService ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon">🤝</span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">Servicio Social</h4>
              <p className="requirement-status">
                {pathData.requirements.socialService ? 'Completado' : 'Pendiente'}
              </p>
            </div>
          </div>

          <div className={`requirement-card ${pathData.requirements.englishTest ? 'completed' : 'pending'}`}>
            <div className="requirement-icon-wrapper">
              <span className="requirement-icon">🗣️</span>
            </div>
            <div className="requirement-content">
              <h4 className="requirement-title">Examen de Inglés</h4>
              <p className="requirement-status">
                {pathData.requirements.englishTest ? 'Completado' : 'Pendiente'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      {pathData.completionPercentage >= 70 && (
        <div className="motivational-message">
          <span className="message-icon">🌟</span>
          <p className="message-text">
            ¡Estás muy cerca de tu meta! Sigue adelante, tu esfuerzo está dando frutos.
          </p>
        </div>
      )}
    </div>
  );
};

export default GraduationPath;
