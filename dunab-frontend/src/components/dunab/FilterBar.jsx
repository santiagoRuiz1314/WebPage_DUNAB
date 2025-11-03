import React, { useState, useEffect } from 'react';
import './FilterBar.css';

const FilterBar = ({
  onFilter,
  categories = [],
  showCategoryFilter = true,
  showTypeFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  showSearchFilter = true
}) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    tipo: '',
    categoria: '',
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // Tipos de transacción
  const tipos = [
    { value: '', label: 'Todos los tipos' },
    { value: 'ingreso', label: 'Ingresos' },
    { value: 'credito', label: 'Créditos' },
    { value: 'egreso', label: 'Egresos' },
    { value: 'debito', label: 'Débitos' }
  ];

  // Estados de transacción
  const estados = [
    { value: '', label: 'Todos los estados' },
    { value: 'activa', label: 'Activa' },
    { value: 'completada', label: 'Completada' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'anulada', label: 'Anulada' }
  ];

  // Manejar cambios en los filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (onFilter) {
      onFilter(filters);
    }
  }, [filters, onFilter]);

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      tipo: '',
      categoria: '',
      estado: '',
      fechaInicio: '',
      fechaFin: ''
    };
    setFilters(clearedFilters);
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h3 className="filter-title">
          🔍 Filtros
          {hasActiveFilters && (
            <span className="active-filters-badge">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          )}
        </h3>
        <div className="filter-header-actions">
          {hasActiveFilters && (
            <button
              className="btn-clear-filters"
              onClick={handleClearFilters}
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
                <label htmlFor="tipo">📊 Tipo</label>
                <select
                  id="tipo"
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
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
                <label htmlFor="categoria">🏷️ Categoría</label>
                <select
                  id="categoria"
                  value={filters.categoria}
                  onChange={(e) => handleFilterChange('categoria', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
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
                <label htmlFor="estado">✅ Estado</label>
                <select
                  id="estado"
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
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
                <label htmlFor="fechaInicio">📅 Desde</label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                  className="filter-input"
                />
              </div>
            )}

            {/* Filtro por fecha fin */}
            {showDateFilter && (
              <div className="filter-field">
                <label htmlFor="fechaFin">📅 Hasta</label>
                <input
                  type="date"
                  id="fechaFin"
                  value={filters.fechaFin}
                  onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                  className="filter-input"
                  min={filters.fechaInicio}
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
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.tipo && (
                  <span className="filter-tag">
                    Tipo: {tipos.find(t => t.value === filters.tipo)?.label}
                    <button
                      onClick={() => handleFilterChange('tipo', '')}
                      className="remove-filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.categoria && (
                  <span className="filter-tag">
                    Categoría: {filters.categoria}
                    <button
                      onClick={() => handleFilterChange('categoria', '')}
                      className="remove-filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.estado && (
                  <span className="filter-tag">
                    Estado: {estados.find(e => e.value === filters.estado)?.label}
                    <button
                      onClick={() => handleFilterChange('estado', '')}
                      className="remove-filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.fechaInicio && (
                  <span className="filter-tag">
                    Desde: {filters.fechaInicio}
                    <button
                      onClick={() => handleFilterChange('fechaInicio', '')}
                      className="remove-filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.fechaFin && (
                  <span className="filter-tag">
                    Hasta: {filters.fechaFin}
                    <button
                      onClick={() => handleFilterChange('fechaFin', '')}
                      className="remove-filter"
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
