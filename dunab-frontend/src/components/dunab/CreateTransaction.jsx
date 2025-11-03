import React, { useState, useEffect } from 'react';
import { useDunab } from '../../context/DunabContext';
import { validateTransactionAmount, validateRequired } from '../../utils/validators';
import './CreateTransaction.css';

const CreateTransaction = ({ onSuccess, onCancel, initialData = null, mode = 'create' }) => {
  const { createTransaction, updateTransaction, categories, loadCategories } = useDunab();

  const [formData, setFormData] = useState({
    estudianteId: '',
    tipo: 'ingreso',
    monto: '',
    categoria: '',
    descripcion: '',
    referencia: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        estudianteId: initialData.estudianteId || '',
        tipo: initialData.tipo || 'ingreso',
        monto: initialData.monto || '',
        categoria: initialData.categoria || '',
        descripcion: initialData.descripcion || '',
        referencia: initialData.referencia || ''
      });
    }
  }, [mode, initialData]);

  // Cargar categorías al montar
  useEffect(() => {
    if (loadCategories) {
      loadCategories();
    }
  }, [loadCategories]);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.estudianteId)) {
      newErrors.estudianteId = 'El ID del estudiante es requerido';
    }

    if (!validateRequired(formData.tipo)) {
      newErrors.tipo = 'El tipo de transacción es requerido';
    }

    if (!validateRequired(formData.monto)) {
      newErrors.monto = 'El monto es requerido';
    } else if (!validateTransactionAmount(formData.monto)) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    if (!validateRequired(formData.descripcion)) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        ...formData,
        monto: parseFloat(formData.monto)
      };

      if (mode === 'edit' && initialData) {
        await updateTransaction(initialData.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      // Resetear formulario
      setFormData({
        estudianteId: '',
        tipo: 'ingreso',
        monto: '',
        categoria: '',
        descripcion: '',
        referencia: ''
      });

      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Error al procesar la transacción'
      });
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const handleReset = () => {
    setFormData({
      estudianteId: '',
      tipo: 'ingreso',
      monto: '',
      categoria: '',
      descripcion: '',
      referencia: ''
    });
    setErrors({});
    setSearchTerm('');
  };

  return (
    <div className="create-transaction">
      <div className="form-header">
        <h2>{mode === 'edit' ? '✏️ Editar Transacción' : '➕ Crear Nueva Transacción'}</h2>
        <p className="form-subtitle">
          {mode === 'edit'
            ? 'Modifica los detalles de la transacción'
            : 'Registra una nueva transacción DUNAB para un estudiante'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Error general */}
        {errors.submit && (
          <div className="form-error-banner">
            ⚠️ {errors.submit}
          </div>
        )}

        <div className="form-grid">
          {/* ID del Estudiante */}
          <div className="form-field">
            <label htmlFor="estudianteId">
              👤 ID del Estudiante <span className="required">*</span>
            </label>
            <input
              type="text"
              id="estudianteId"
              name="estudianteId"
              value={formData.estudianteId}
              onChange={handleChange}
              placeholder="Ej: 123456"
              className={errors.estudianteId ? 'error' : ''}
              disabled={mode === 'edit'}
            />
            {errors.estudianteId && (
              <span className="field-error">{errors.estudianteId}</span>
            )}
          </div>

          {/* Tipo de Transacción */}
          <div className="form-field">
            <label htmlFor="tipo">
              📊 Tipo de Transacción <span className="required">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={errors.tipo ? 'error' : ''}
            >
              <option value="ingreso">💰 Ingreso</option>
              <option value="credito">⬆️ Crédito</option>
              <option value="egreso">💸 Egreso</option>
              <option value="debito">⬇️ Débito</option>
            </select>
            {errors.tipo && (
              <span className="field-error">{errors.tipo}</span>
            )}
          </div>

          {/* Monto */}
          <div className="form-field">
            <label htmlFor="monto">
              💵 Monto (DUNAB) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              placeholder="Ej: 100"
              min="0"
              step="0.01"
              className={errors.monto ? 'error' : ''}
            />
            {errors.monto && (
              <span className="field-error">{errors.monto}</span>
            )}
          </div>

          {/* Categoría */}
          <div className="form-field">
            <label htmlFor="categoria">
              🏷️ Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              <option value="">Seleccionar categoría...</option>
              {categories && categories.map((cat) => (
                <option key={cat.id || cat} value={cat.nombre || cat}>
                  {cat.nombre || cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div className="form-field form-field-full">
            <label htmlFor="descripcion">
              📝 Descripción <span className="required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe el motivo de la transacción..."
              rows="3"
              className={errors.descripcion ? 'error' : ''}
            />
            {errors.descripcion && (
              <span className="field-error">{errors.descripcion}</span>
            )}
          </div>

          {/* Referencia */}
          <div className="form-field form-field-full">
            <label htmlFor="referencia">
              🔗 Referencia (Opcional)
            </label>
            <input
              type="text"
              id="referencia"
              name="referencia"
              value={formData.referencia}
              onChange={handleChange}
              placeholder="Código de referencia o ID relacionado..."
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel || handleReset}
            className="btn-secondary"
            disabled={loading}
          >
            {onCancel ? 'Cancelar' : 'Limpiar'}
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              mode === 'edit' ? '💾 Guardar Cambios' : '➕ Crear Transacción'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTransaction;
