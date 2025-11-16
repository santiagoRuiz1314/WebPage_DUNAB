import React, { useState, useMemo } from 'react';
import { MdCheckCircle, MdMenuBook, MdSchedule, MdRadioButtonUnchecked } from 'react-icons/md';
import './CourseList.css';

/**
 * Componente que muestra la lista completa de materias
 * Con filtros por estado, semestre y búsqueda
 */
const CourseList = ({ courses = [], compact = false }) => {
  const [filters, setFilters] = useState({
    status: 'all', // all, completed, in-progress, pending
    semester: 'all', // all, 1-10
    search: '',
  });
  const [sortBy, setSortBy] = useState('semester'); // semester, name, credits

  /**
   * Generar datos mock si no se proporcionan cursos
   */
  const mockCourses = [
    // Semestre 1
    { id: 1, name: 'Cálculo Diferencial', code: 'MAT101', credits: 4, semester: 1, status: 'completed', grade: 4.5, dunabReward: 400 },
    { id: 2, name: 'Introducción a la Programación', code: 'CS101', credits: 4, semester: 1, status: 'completed', grade: 5.0, dunabReward: 400 },
    { id: 3, name: 'Física I', code: 'FIS101', credits: 3, semester: 1, status: 'completed', grade: 4.0, dunabReward: 300 },
    { id: 4, name: 'Álgebra Lineal', code: 'MAT102', credits: 4, semester: 1, status: 'completed', grade: 4.8, dunabReward: 400 },

    // Semestre 2
    { id: 5, name: 'Cálculo Integral', code: 'MAT201', credits: 4, semester: 2, status: 'completed', grade: 4.3, dunabReward: 400 },
    { id: 6, name: 'Programación Orientada a Objetos', code: 'CS201', credits: 4, semester: 2, status: 'completed', grade: 4.7, dunabReward: 400 },
    { id: 7, name: 'Física II', code: 'FIS201', credits: 3, semester: 2, status: 'completed', grade: 4.1, dunabReward: 300 },
    { id: 8, name: 'Química General', code: 'QUI101', credits: 3, semester: 2, status: 'completed', grade: 4.2, dunabReward: 300 },

    // Semestre 3
    { id: 9, name: 'Estructuras de Datos', code: 'CS301', credits: 4, semester: 3, status: 'completed', grade: 4.9, dunabReward: 400 },
    { id: 10, name: 'Bases de Datos I', code: 'CS302', credits: 4, semester: 3, status: 'completed', grade: 4.6, dunabReward: 400 },
    { id: 11, name: 'Matemáticas Discretas', code: 'MAT301', credits: 3, semester: 3, status: 'completed', grade: 4.4, dunabReward: 300 },
    { id: 12, name: 'Estadística', code: 'MAT302', credits: 3, semester: 3, status: 'completed', grade: 4.5, dunabReward: 300 },

    // Semestre 4
    { id: 13, name: 'Algoritmos Avanzados', code: 'CS401', credits: 4, semester: 4, status: 'completed', grade: 4.8, dunabReward: 400 },
    { id: 14, name: 'Bases de Datos II', code: 'CS402', credits: 4, semester: 4, status: 'completed', grade: 4.7, dunabReward: 400 },
    { id: 15, name: 'Arquitectura de Computadores', code: 'CS403', credits: 3, semester: 4, status: 'completed', grade: 4.3, dunabReward: 300 },
    { id: 16, name: 'Sistemas Operativos', code: 'CS404', credits: 4, semester: 4, status: 'completed', grade: 4.6, dunabReward: 400 },

    // Semestre 5
    { id: 17, name: 'Redes de Computadores', code: 'CS501', credits: 4, semester: 5, status: 'completed', grade: 4.5, dunabReward: 400 },
    { id: 18, name: 'Desarrollo Web', code: 'CS502', credits: 4, semester: 5, status: 'completed', grade: 5.0, dunabReward: 400 },
    { id: 19, name: 'Ingeniería de Software I', code: 'CS503', credits: 4, semester: 5, status: 'completed', grade: 4.7, dunabReward: 400 },

    // Semestre 6
    { id: 20, name: 'Inteligencia Artificial', code: 'CS601', credits: 4, semester: 6, status: 'completed', grade: 4.9, dunabReward: 400 },
    { id: 21, name: 'Ingeniería de Software II', code: 'CS602', credits: 4, semester: 6, status: 'completed', grade: 4.8, dunabReward: 400 },
    { id: 22, name: 'Seguridad Informática', code: 'CS603', credits: 3, semester: 6, status: 'completed', grade: 4.6, dunabReward: 300 },

    // Semestre 7
    { id: 23, name: 'Machine Learning', code: 'CS701', credits: 4, semester: 7, status: 'completed', grade: 4.7, dunabReward: 400 },
    { id: 24, name: 'Cloud Computing', code: 'CS702', credits: 4, semester: 7, status: 'completed', grade: 4.5, dunabReward: 400 },
    { id: 25, name: 'Desarrollo Móvil', code: 'CS703', credits: 4, semester: 7, status: 'completed', grade: 4.8, dunabReward: 400 },

    // Semestre 8 (Actual - En Progreso)
    { id: 26, name: 'Proyecto de Grado I', code: 'CS801', credits: 4, semester: 8, status: 'in-progress', grade: null, dunabReward: 400 },
    { id: 27, name: 'Big Data', code: 'CS802', credits: 4, semester: 8, status: 'in-progress', grade: null, dunabReward: 400 },
    { id: 28, name: 'DevOps', code: 'CS803', credits: 3, semester: 8, status: 'in-progress', grade: null, dunabReward: 300 },
    { id: 29, name: 'Blockchain', code: 'CS804', credits: 3, semester: 8, status: 'in-progress', grade: null, dunabReward: 300 },
    { id: 30, name: 'Ética Profesional', code: 'GEN801', credits: 2, semester: 8, status: 'in-progress', grade: null, dunabReward: 200 },

    // Semestre 9 (Pendientes)
    { id: 31, name: 'Proyecto de Grado II', code: 'CS901', credits: 6, semester: 9, status: 'pending', grade: null, dunabReward: 600 },
    { id: 32, name: 'Computación Cuántica', code: 'CS902', credits: 4, semester: 9, status: 'pending', grade: null, dunabReward: 400 },
    { id: 33, name: 'Emprendimiento Tecnológico', code: 'GEN901', credits: 3, semester: 9, status: 'pending', grade: null, dunabReward: 300 },

    // Semestre 10 (Pendientes)
    { id: 34, name: 'Práctica Profesional', code: 'PRA1001', credits: 8, semester: 10, status: 'pending', grade: null, dunabReward: 800 },
    { id: 35, name: 'Seminario de Graduación', code: 'GEN1001', credits: 2, semester: 10, status: 'pending', grade: null, dunabReward: 200 },
  ];

  const courseData = courses.length > 0 ? courses : mockCourses;

  /**
   * Filtrar y ordenar cursos
   */
  const filteredCourses = useMemo(() => {
    let filtered = [...courseData];

    // Filtro por estado
    if (filters.status !== 'all') {
      filtered = filtered.filter(course => course.status === filters.status);
    }

    // Filtro por semestre
    if (filters.semester !== 'all') {
      filtered = filtered.filter(course => course.semester === parseInt(filters.semester));
    }

    // Filtro por búsqueda
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchLower) ||
        course.code.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'semester':
          return a.semester - b.semester;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'credits':
          return b.credits - a.credits;
        default:
          return 0;
      }
    });

    return filtered;
  }, [courseData, filters, sortBy]);

  /**
   * Calcular estadísticas
   */
  const stats = useMemo(() => {
    return {
      total: courseData.length,
      completed: courseData.filter(c => c.status === 'completed').length,
      inProgress: courseData.filter(c => c.status === 'in-progress').length,
      pending: courseData.filter(c => c.status === 'pending').length,
      totalCredits: courseData.reduce((sum, c) => sum + c.credits, 0),
      completedCredits: courseData.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.credits, 0),
    };
  }, [courseData]);

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
        return '';
    }
  };

  /**
   * Obtener icono según estado
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle size={20} />;
      case 'in-progress':
        return <MdMenuBook size={20} />;
      case 'pending':
        return <MdSchedule size={20} />;
      default:
        return <MdRadioButtonUnchecked size={20} />;
    }
  };

  /**
   * Obtener texto según estado
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'in-progress':
        return 'En Curso';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className={`course-list ${compact ? 'compact' : ''}`}>
      {/* Header con estadísticas */}
      {!compact && (
        <div className="course-list-header">
          <div className="header-title">
            <h3>📚 Lista de Materias</h3>
            <p className="header-subtitle">
              {stats.completed} de {stats.total} materias completadas
            </p>
          </div>

          <div className="header-stats">
            <div className="stat-badge completed">
              <span className="stat-icon">✅</span>
              <span className="stat-count">{stats.completed}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat-badge in-progress">
              <span className="stat-icon">📖</span>
              <span className="stat-count">{stats.inProgress}</span>
              <span className="stat-label">En Curso</span>
            </div>
            <div className="stat-badge pending">
              <span className="stat-icon">⏳</span>
              <span className="stat-count">{stats.pending}</span>
              <span className="stat-label">Pendientes</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      {!compact && (
        <div className="course-filters">
          {/* Búsqueda */}
          <div className="filter-group search-group">
            <label htmlFor="search">🔍 Buscar</label>
            <input
              id="search"
              type="text"
              placeholder="Nombre o código..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="filter-input"
            />
          </div>

          {/* Filtro por estado */}
          <div className="filter-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="all">Todos</option>
              <option value="completed">Completadas</option>
              <option value="in-progress">En Curso</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>

          {/* Filtro por semestre */}
          <div className="filter-group">
            <label htmlFor="semester">Semestre</label>
            <select
              id="semester"
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="filter-select"
            >
              <option value="all">Todos</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semestre {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar */}
          <div className="filter-group">
            <label htmlFor="sort">Ordenar por</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="semester">Semestre</option>
              <option value="name">Nombre</option>
              <option value="credits">Créditos</option>
            </select>
          </div>

          {/* Limpiar filtros */}
          {(filters.status !== 'all' || filters.semester !== 'all' || filters.search) && (
            <button
              onClick={() => setFilters({ status: 'all', semester: 'all', search: '' })}
              className="clear-filters-btn"
              title="Limpiar filtros"
            >
              ✕ Limpiar
            </button>
          )}
        </div>
      )}

      {/* Contador de resultados */}
      {!compact && (
        <div className="results-count">
          <span>
            Mostrando {filteredCourses.length} de {courseData.length} materias
          </span>
        </div>
      )}

      {/* Lista de cursos */}
      <div className="courses-container">
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p className="empty-message">No se encontraron materias con los filtros aplicados</p>
          </div>
        ) : (
          <div className={`courses-grid ${compact ? 'compact-grid' : ''}`}>
            {filteredCourses.map(course => (
              <div key={course.id} className={`course-card ${getStatusClass(course.status)}`}>
                {/* Header del curso */}
                <div className="course-header">
                  <div className="course-title-group">
                    <span className="course-icon">{getStatusIcon(course.status)}</span>
                    <div className="course-title-content">
                      <h4 className="course-name">{course.name}</h4>
                      <span className="course-code">{course.code}</span>
                    </div>
                  </div>
                  <span className={`course-status-badge ${course.status}`}>
                    {getStatusText(course.status)}
                  </span>
                </div>

                {/* Información del curso */}
                <div className="course-info">
                  <div className="info-item">
                    <span className="info-label">Semestre</span>
                    <span className="info-value">{course.semester}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Créditos</span>
                    <span className="info-value">{course.credits}</span>
                  </div>
                  {course.grade !== null && course.grade !== undefined && (
                    <div className="info-item">
                      <span className="info-label">Nota</span>
                      <span className="info-value grade">{course.grade.toFixed(1)}</span>
                    </div>
                  )}
                  {course.dunabReward && (
                    <div className="info-item dunab">
                      <span className="info-label">DUNAB</span>
                      <span className="info-value dunab-value">
                        {course.status === 'completed' ? '✓' : '+'} {course.dunabReward}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer con progreso */}
                {course.status === 'in-progress' && (
                  <div className="course-footer">
                    <div className="progress-bar-mini">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <span className="progress-text">En progreso</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen de créditos */}
      {!compact && filteredCourses.length > 0 && (
        <div className="credits-summary">
          <div className="summary-item">
            <span className="summary-label">Créditos Completados</span>
            <span className="summary-value">{stats.completedCredits}</span>
          </div>
          <div className="summary-divider">/</div>
          <div className="summary-item">
            <span className="summary-label">Créditos Totales</span>
            <span className="summary-value">{stats.totalCredits}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
