import React, { useState, useEffect } from 'react';
import './FilterBar.css';

const FilterBar = ({
  filters: externalFilters,
  onFilterChange,
  onClearFilters,
  resultCount = 0,
  categories = [],
  showCategoryFilter = true,
  showTypeFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  showSearchFilter = true
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Usar filtros externos si se proporcionan
  const filters = externalFilters || {
    searchTerm: '',
    type: 'all',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  };

  // Tipos de transacción
  const tipos = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'ingreso', label: 'Ingresos' },
    { value: 'egreso', label: 'Egresos' }
  ];

  // Estados de transacción
  const estados = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'activa', label: 'Activa' },
    { value: 'completada', label: 'Completada' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'anulada', label: 'Anulada' }
  ];

  // Categorías predefinidas si no se proporcionan
  const defaultCategories = [
    'Académico',
    'Evento',
    'Servicio',
    'Recompensa',
    'Compra',
    'Otro'
  ];

  const availableCategories = categories.length > 0 ? categories : defaultCategories;

  // Manejar cambios en los filtros
  const handleFilterChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange({ [field]: value });
    }
  };

  // Limpiar todos los filtros
  const handleClearAll = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    (filters.searchTerm && filters.searchTerm !== '') ||
    (filters.type && filters.type !== 'all') ||
    (filters.category && filters.category !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.dateFrom && filters.dateFrom !== '') ||
    (filters.dateTo && filters.dateTo !== '');

  const activeFiltersCount = [
    filters.searchTerm,
    filters.type !== 'all' ? filters.type : '',
    filters.category !== 'all' ? filters.category : '',
    filters.status !== 'all' ? filters.status : '',
    filters.dateFrom,
    filters.dateTo
  ].filter(v => v && v !== '' && v !== 'all').length;

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <div className="filter-title-section">
          <h3 className="filter-title">
            🔍 Filtros
            {hasActiveFilters && (
              <span className="active-filters-badge">
                {activeFiltersCount}
              </span>
            )}
          </h3>
          {resultCount !== undefined && (
            <span className="result-count">
              {resultCount} resultado{resultCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="filter-header-actions">
          {hasActiveFilters && (
            <button
              className="btn-clear-filters"
              onClick={handleClearAll}
              title="Limpiar filtros"
            >
              ✕ Limpiar
            </button>
          )}
          <button
            className="btn-toggle-filters"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filter-content">
          <div className="filter-grid">
            {/* Búsqueda por texto */}
            {showSearchFilter && (
              <div className="filter-field filter-field-full">
                <label htmlFor="searchTerm">🔎 Buscar</label>
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Buscar por descripción, ID, monto..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="filter-input"
                />
              </div>
            )}

            {/* Filtro por tipo */}
            {showTypeFilter && (
              <div className="filter-field">
                <label htmlFor="type">📊 Tipo</label>
                <select
                  id="type"
                  value={filters.type || 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="filter-select"
                >
                  {tipos.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por categoría */}
            {showCategoryFilter && (
              <div className="filter-field">
                <label htmlFor="category">🏷️ Categoría</label>
                <select
                  id="category"
                  value={filters.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todas las categorías</option>
                  {availableCategories.map(cat => (
                    <option key={cat.id || cat} value={cat.nombre || cat}>
                      {cat.nombre || cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por estado */}
            {showStatusFilter && (
              <div className="filter-field">
                <label htmlFor="status">✅ Estado</label>
                <select
                  id="status"
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="filter-select"
                >
                  {estados.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por fecha de inicio */}
            {showDateFilter && (
              <div className="filter-field">
                <label htmlFor="dateFrom">📅 Desde</label>
                <input
                  type="date"
                  id="dateFrom"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="filter-input"
                />
              </div>
            )}

            {/* Filtro por fecha fin */}
            {showDateFilter && (
              <div className="filter-field">
                <label htmlFor="dateTo">📅 Hasta</label>
                <input
                  type="date"
                  id="dateTo"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="filter-input"
                  min={filters.dateFrom}
                />
              </div>
            )}
          </div>

          {/* Resumen de filtros activos */}
          {hasActiveFilters && (
            <div className="active-filters-summary">
              <span className="summary-label">Filtros activos:</span>
              <div className="filter-tags">
                {filters.searchTerm && (
                  <span className="filter-tag">
                    Búsqueda: "{filters.searchTerm}"
                    <button
                      onClick={() => handleFilterChange('searchTerm', '')}
                      className="remove-filter"
                      title="Quitar este filtro"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.type && filters.type !== 'all' && (
                  <span className="filter-tag">
                    Tipo: {tipos.find(t => t.value === filters.type)?.label}
                    <button
                      onClick={() => handleFilterChange('type', 'all')}
                      className="remove-filter"
                      title="Quitar este filtro"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.category && filters.category !== 'all' && (
                  <span className="filter-tag">
                    Categoría: {filters.category}
                    <button
                      onClick={() => handleFilterChange('category', 'all')}
                      className="remove-filter"
                      title="Quitar este filtro"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.status && filters.status !== 'all' && (
                  <span className="filter-tag">
                    Estado: {estados.find(e => e.value === filters.status)?.label}
                    <button
                      onClick={() => handleFilterChange('status', 'all')}
                      className="remove-filter"
                      title="Quitar este filtro"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="filter-tag">
                    Desde: {filters.dateFrom}
                    <button
                      onClick={() => handleFilterChange('dateFrom', '')}
                      className="remove-filter"
                      title="Quitar este filtro"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.dateTo && (
                  <span className="filter-tag">
                    Hasta: {filters.dateTo}
                    <button
                      onClick={() => handleFilterChange('dateTo', '')}
                      className="remove-filter"
                      title="Quitar este filtro"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
