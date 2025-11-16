import React, { useState, useEffect } from 'react';
import { useDunab } from '../../context/DunabContext';
import {
  FiTag, FiPlus, FiEdit3, FiTrash2, FiAlertTriangle,
  FiSave, FiX
} from 'react-icons/fi';
import { MdCategory } from 'react-icons/md';
import './CategoryManagement.css';

/**
 * Componente de gestión de categorías de transacciones DUNAB (CRUD)
 *
 * Funcionalidades:
 * - Crear nueva categoría con nombre, icono y color
 * - Listar todas las categorías existentes
 * - Editar categoría existente
 * - Eliminar categoría (con validación de transacciones asociadas)
 *
 * Validaciones:
 * - No permitir nombres duplicados
 * - No permitir eliminar categoría si tiene transacciones
 * - Nombre requerido (mínimo 3 caracteres)
 */
const CategoryManagement = () => {
  const { categories, loadCategories, createCategory, updateCategory, deleteCategory } = useDunab();

  const [formData, setFormData] = useState({
    nombre: '',
    icono: '📁',
    color: '#3B82F6'
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Cargar categorías al montar (solo una vez)
  useEffect(() => {
    if (loadCategories) {
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío: solo se ejecuta al montar el componente

  // Iconos predefinidos
  const availableIcons = [
    '📁', '📚', '🎉', '🔧', '🎁', '🛒', '💰', '📊',
    '🏆', '🎓', '🎨', '🏃', '🍔', '🚗', '🏠', '💻'
  ];

  // Colores predefinidos
  const availableColors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Amarillo', value: '#F59E0B' },
    { name: 'Morado', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Naranja', value: '#F97316' }
  ];

  // Categorías predefinidas del sistema (no se pueden eliminar)
  const systemCategories = ['Académico', 'Evento', 'Servicio', 'Recompensa'];

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Verificar nombre duplicado
    if (categories) {
      const isDuplicate = categories.some(cat =>
        cat.nombre?.toLowerCase() === formData.nombre.toLowerCase() &&
        cat.id !== editingCategory?.id
      );
      if (isDuplicate) {
        newErrors.nombre = 'Ya existe una categoría con este nombre';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Crear o actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }

      // Resetear formulario
      setFormData({ nombre: '', icono: '📁', color: '#3B82F6' });
      setEditingCategory(null);
      setShowForm(false);
      setErrors({});

      // Recargar categorías
      if (loadCategories) {
        loadCategories();
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Error al guardar la categoría'
      });
    } finally {
      setLoading(false);
    }
  };

  // Editar categoría
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre || '',
      icono: category.icono || '📁',
      color: category.color || '#3B82F6'
    });
    setShowForm(true);
  };

  // Eliminar categoría
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    // Verificar si es categoría del sistema
    if (systemCategories.includes(deleteConfirm.nombre)) {
      setErrors({ delete: 'No se pueden eliminar categorías del sistema' });
      return;
    }

    setLoading(true);

    try {
      await deleteCategory(deleteConfirm.id);
      setDeleteConfirm(null);

      // Recargar categorías
      if (loadCategories) {
        loadCategories();
      }
    } catch (error) {
      setErrors({
        delete: error.response?.data?.message || 'Esta categoría tiene transacciones asociadas y no se puede eliminar'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancelar formulario
  const handleCancel = () => {
    setFormData({ nombre: '', icono: '📁', color: '#3B82F6' });
    setEditingCategory(null);
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="category-management">
      {/* Header */}
      <div className="category-header">
        <div className="header-info">
          <h3><MdCategory /> Categorías de Transacciones</h3>
          <p className="header-subtitle">
            {categories?.length || 0} categorías registradas
          </p>
        </div>
        {!showForm && (
          <button
            className="btn-add-category"
            onClick={() => setShowForm(true)}
          >
            <FiPlus /> Nueva Categoría
          </button>
        )}
      </div>

      {/* Formulario de crear/editar */}
      {showForm && (
        <div className="category-form-container">
          <form onSubmit={handleSubmit} className="category-form">
            <h4>{editingCategory ? <><FiEdit3 /> Editar Categoría</> : <><FiPlus /> Nueva Categoría</>}</h4>

            {errors.submit && (
              <div className="form-error">{errors.submit}</div>
            )}

            <div className="form-row">
              {/* Nombre */}
              <div className="form-field">
                <label htmlFor="nombre">
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Material de estudio"
                  className={errors.nombre ? 'error' : ''}
                />
                {errors.nombre && (
                  <span className="field-error">{errors.nombre}</span>
                )}
              </div>

              {/* Icono */}
              <div className="form-field">
                <label htmlFor="icono">Icono</label>
                <div className="icon-selector">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icono === icon ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, icono: icon }))}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="form-field">
                <label htmlFor="color">Color</label>
                <div className="color-selector">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-option ${formData.color === color.value ? 'selected' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="category-preview">
              <span className="preview-label">Vista previa:</span>
              <div className="preview-category" style={{ backgroundColor: `${formData.color}20`, borderColor: formData.color }}>
                <span className="preview-icon">{formData.icono}</span>
                <span className="preview-name">{formData.nombre || 'Nombre de la categoría'}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Guardando...' : editingCategory ? <><FiSave /> Guardar Cambios</> : <><FiPlus /> Crear Categoría</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="categories-list">
        {categories && categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id || category.nombre}
                className="category-card"
                style={{
                  backgroundColor: `${category.color || '#3B82F6'}20`,
                  borderColor: category.color || '#3B82F6'
                }}
              >
                <div className="category-info">
                  <span className="category-icon">{category.icono || '📁'}</span>
                  <div className="category-details">
                    <h4 className="category-name">{category.nombre}</h4>
                    {systemCategories.includes(category.nombre) && (
                      <span className="system-badge">Sistema</span>
                    )}
                  </div>
                </div>

                <div className="category-actions">
                  <button
                    className="btn-edit-small"
                    onClick={() => handleEdit(category)}
                    title="Editar"
                  >
                    <FiEdit3 />
                  </button>
                  {!systemCategories.includes(category.nombre) && (
                    <button
                      className="btn-delete-small"
                      onClick={() => setDeleteConfirm(category)}
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="categories-empty">
            <p>📭 No hay categorías registradas</p>
            <button className="btn-add-first" onClick={() => setShowForm(true)}>
              Crear primera categoría
            </button>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3><FiAlertTriangle /> Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar esta categoría?</p>
            <div className="category-to-delete">
              <span className="icon">{deleteConfirm.icono}</span>
              <strong>{deleteConfirm.nombre}</strong>
            </div>
            {errors.delete && (
              <div className="delete-error"><FiAlertTriangle /> {errors.delete}</div>
            )}
            <p className="warning-text">
              Esta acción no se puede deshacer. Solo se pueden eliminar categorías sin transacciones asociadas.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setDeleteConfirm(null);
                  setErrors({});
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-delete"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Categoría'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
