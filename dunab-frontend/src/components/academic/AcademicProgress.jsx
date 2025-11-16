import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { MdCheckCircle, MdSchedule, MdMenuBook, MdAccessTime, MdLibraryBooks } from 'react-icons/md';
import './AcademicProgress.css';

/**
 * Componente que muestra el progreso académico del estudiante
 * Visualiza créditos completados, materias pendientes y requisitos
 */
const AcademicProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar progreso académico del estudiante
   */
  useEffect(() => {
    const fetchAcademicProgress = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Obtener progreso académico
        const progressData = await studentService.getAcademicProgress(user.id);
        setProgress(progressData);
      } catch (err) {
        console.error('Error fetching academic progress:', err);
        setError('No se pudo cargar el progreso académico');

        // Datos de ejemplo para desarrollo
        setProgress({
          totalCredits: 160,
          completedCredits: 120,
          remainingCredits: 40,
          completionPercentage: 75,
          currentSemester: 8,
          coursesCompleted: 32,
          coursesInProgress: 5,
          coursesPending: 8,
          gpa: 4.2,
          requirements: {
            thesis: false,
            internship: true,
            socialService: true,
            englishTest: false
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicProgress();
  }, [user]);

  /**
   * Calcular color del progreso según porcentaje
   */
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <div className="academic-progress">
        <div className="progress-header">
          <h3><MdLibraryBooks size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Progreso Académico</h3>
        </div>
        <div className="progress-loading">
          <div className="spinner"></div>
          <p>Cargando progreso...</p>
        </div>
      </div>
    );
  }

  if (error && !progress) {
    return (
      <div className="academic-progress">
        <div className="progress-header">
          <h3><MdLibraryBooks size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Progreso Académico</h3>
        </div>
        <div className="progress-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="academic-progress">
        <div className="progress-header">
          <h3><MdLibraryBooks size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Progreso Académico</h3>
        </div>
        <div className="progress-empty">
          <p>No hay información académica disponible</p>
        </div>
      </div>
    );
  }

  const progressColor = getProgressColor(progress.completionPercentage);

  return (
    <div className="academic-progress">
      <div className="progress-header">
        <h3><MdLibraryBooks size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Progreso Académico</h3>
        <span className="semester-badge">
          Semestre {progress.currentSemester}
        </span>
      </div>

      {/* Barra de progreso principal */}
      <div className="progress-main">
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-value">{progress.completedCredits}</span>
            <span className="stat-label">Créditos Completados</span>
          </div>
          <div className="stat">
            <span className="stat-value">{progress.remainingCredits}</span>
            <span className="stat-label">Créditos Faltantes</span>
          </div>
          <div className="stat">
            <span className="stat-value">{progress.totalCredits}</span>
            <span className="stat-label">Total Requeridos</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-wrapper">
            <div
              className={`progress-bar progress-bar-${progressColor}`}
              style={{ width: `${progress.completionPercentage}%` }}
            >
              <span className="progress-percentage">
                {progress.completionPercentage}%
              </span>
            </div>
          </div>
          <p className="progress-label">Progreso hacia la graduación</p>
        </div>
      </div>

      {/* Resumen de materias */}
      <div className="courses-summary">
        <div className="course-stat">
          <div className="course-stat-icon completed"><MdCheckCircle size={28} /></div>
          <div className="course-stat-content">
            <span className="course-stat-value">{progress.coursesCompleted}</span>
            <span className="course-stat-label">Completadas</span>
          </div>
        </div>

        <div className="course-stat">
          <div className="course-stat-icon in-progress"><MdMenuBook size={28} /></div>
          <div className="course-stat-content">
            <span className="course-stat-value">{progress.coursesInProgress}</span>
            <span className="course-stat-label">En Curso</span>
          </div>
        </div>

        <div className="course-stat">
          <div className="course-stat-icon pending"><MdAccessTime size={28} /></div>
          <div className="course-stat-content">
            <span className="course-stat-value">{progress.coursesPending}</span>
            <span className="course-stat-label">Pendientes</span>
          </div>
        </div>
      </div>

      {/* GPA */}
      {progress.gpa && (
        <div className="gpa-section">
          <div className="gpa-badge">
            <span className="gpa-label">Promedio (GPA)</span>
            <span className="gpa-value">{progress.gpa.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Requisitos adicionales */}
      {progress.requirements && (
        <div className="requirements-section">
          <h4 className="requirements-title">Requisitos Adicionales</h4>
          <div className="requirements-list">
            <div className={`requirement-item ${progress.requirements.thesis ? 'completed' : 'pending'}`}>
              <span className="requirement-icon">
                {progress.requirements.thesis ? <MdCheckCircle size={20} /> : <MdSchedule size={20} />}
              </span>
              <span className="requirement-label">Proyecto de Grado</span>
            </div>

            <div className={`requirement-item ${progress.requirements.internship ? 'completed' : 'pending'}`}>
              <span className="requirement-icon">
                {progress.requirements.internship ? <MdCheckCircle size={20} /> : <MdSchedule size={20} />}
              </span>
              <span className="requirement-label">Prácticas Profesionales</span>
            </div>

            <div className={`requirement-item ${progress.requirements.socialService ? 'completed' : 'pending'}`}>
              <span className="requirement-icon">
                {progress.requirements.socialService ? <MdCheckCircle size={20} /> : <MdSchedule size={20} />}
              </span>
              <span className="requirement-label">Servicio Social</span>
            </div>

            <div className={`requirement-item ${progress.requirements.englishTest ? 'completed' : 'pending'}`}>
              <span className="requirement-icon">
                {progress.requirements.englishTest ? <MdCheckCircle size={20} /> : <MdSchedule size={20} />}
              </span>
              <span className="requirement-label">Examen de Inglés</span>
            </div>
          </div>
        </div>
      )}

      {/* Botón para ver más detalles */}
      <div className="progress-footer">
        <Link to="/academic" className="view-details-button">
          Ver Detalles Completos
        </Link>
      </div>
    </div>
  );
};

export default AcademicProgress;
