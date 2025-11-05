import React, { useState, useEffect } from 'react';
import { useDunab } from '../../context/DunabContext';
import { validateTransactionAmount, validateRequired } from '../../utils/validators';
import './CreateTransaction.css';

const CreateTransaction = ({ onSuccess, onCancel, initialData = null, mode = 'create' }) => {
  const { createTransaction, updateTransaction, categories, loadCategories, students, loadStudents } = useDunab();

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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [studentSearchResults, setStudentSearchResults] = useState([]);

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

  // Cargar categorías y estudiantes al montar
  useEffect(() => {
    if (loadCategories) {
      loadCategories();
    }
    if (loadStudents) {
      loadStudents();
    }
  }, [loadCategories, loadStudents]);

  // Buscar estudiantes cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setStudentSearchResults([]);
      return;
    }

    // Filtrar estudiantes por código o nombre
    if (students && students.length > 0) {
      const results = students.filter(student =>
        student.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5); // Limitar a 5 resultados

      setStudentSearchResults(results);
    }
  }, [searchTerm, students]);

  // Calcular preview del saldo después de la transacción
  const calculateBalancePreview = () => {
    if (!selectedStudent || !formData.monto) {
      return null;
    }

    const currentBalance = selectedStudent.saldoDunab || 0;
    const amount = parseFloat(formData.monto) || 0;
    const isDebit = formData.tipo === 'egreso' || formData.tipo === 'debito';

    const newBalance = isDebit ? currentBalance - amount : currentBalance + amount;

    return {
      current: currentBalance,
      change: isDebit ? -amount : amount,
      new: newBalance,
      insufficient: isDebit && newBalance < 0
    };
  };

  const balancePreview = calculateBalancePreview();

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

  // Manejar selección de estudiante
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setFormData(prev => ({
      ...prev,
      estudianteId: student.id || student.codigo
    }));
    setSearchTerm(student.nombre || student.codigo);
    setShowStudentSearch(false);
    setStudentSearchResults([]);
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

    // Validar saldo suficiente para débitos
    if (balancePreview && balancePreview.insufficient) {
      newErrors.monto = 'Saldo insuficiente para esta transacción';
    }

    if (!validateRequired(formData.descripcion)) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!validateRequired(formData.categoria)) {
      newErrors.categoria = 'La categoría es requerida';
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
          {/* Buscador de Estudiante */}
          <div className="form-field form-field-full">
            <label htmlFor="studentSearch">
              👤 Buscar Estudiante <span className="required">*</span>
            </label>
            <div className="student-search-container">
              <input
                type="text"
                id="studentSearch"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowStudentSearch(true);
                }}
                onFocus={() => setShowStudentSearch(true)}
                placeholder="Buscar por código, nombre o email..."
                className={errors.estudianteId ? 'error' : ''}
                disabled={mode === 'edit'}
                autoComplete="off"
              />

              {/* Resultados de búsqueda */}
              {showStudentSearch && studentSearchResults.length > 0 && (
                <div className="student-search-results">
                  {studentSearchResults.map((student) => (
                    <div
                      key={student.id || student.codigo}
                      className="student-result-item"
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div className="student-info">
                        <span className="student-name">
                          {student.nombre || 'Sin nombre'}
                        </span>
                        <span className="student-code">
                          Código: {student.codigo || 'N/A'}
                        </span>
                      </div>
                      <div className="student-balance">
                        {student.saldoDunab !== undefined ? (
                          <span className="balance-amount">
                            {student.saldoDunab.toFixed(2)} D
                          </span>
                        ) : (
                          <span className="balance-unknown">N/A</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mostrar estudiante seleccionado */}
              {selectedStudent && (
                <div className="selected-student-info">
                  <div className="student-details">
                    <span className="detail-label">Estudiante:</span>
                    <span className="detail-value">
                      {selectedStudent.nombre} ({selectedStudent.codigo})
                    </span>
                  </div>
                  <div className="student-details">
                    <span className="detail-label">Saldo actual:</span>
                    <span className="detail-value balance">
                      {(selectedStudent.saldoDunab || 0).toFixed(2)} DUNAB
                    </span>
                  </div>
                </div>
              )}
            </div>
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
              🏷️ Categoría <span className="required">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={errors.categoria ? 'error' : ''}
            >
              <option value="">Seleccionar categoría...</option>
              {categories && categories.map((cat) => (
                <option key={cat.id || cat} value={cat.nombre || cat}>
                  {cat.nombre || cat}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <span className="field-error">{errors.categoria}</span>
            )}
          </div>

          {/* Preview del saldo después de la transacción */}
          {balancePreview && (
            <div className="form-field form-field-full">
              <div className={`balance-preview ${balancePreview.insufficient ? 'insufficient' : ''}`}>
                <h4 className="preview-title">
                  💡 Preview de Saldo
                </h4>
                <div className="preview-content">
                  <div className="preview-row">
                    <span className="preview-label">Saldo actual:</span>
                    <span className="preview-value">
                      {balancePreview.current.toFixed(2)} DUNAB
                    </span>
                  </div>
                  <div className="preview-row">
                    <span className="preview-label">
                      {balancePreview.change >= 0 ? 'Se agregará:' : 'Se debitará:'}
                    </span>
                    <span className={`preview-value ${balancePreview.change >= 0 ? 'positive' : 'negative'}`}>
                      {balancePreview.change >= 0 ? '+' : ''}
                      {balancePreview.change.toFixed(2)} DUNAB
                    </span>
                  </div>
                  <div className="preview-row preview-total">
                    <span className="preview-label">Nuevo saldo:</span>
                    <span className={`preview-value ${balancePreview.insufficient ? 'error' : 'success'}`}>
                      {balancePreview.new.toFixed(2)} DUNAB
                    </span>
                  </div>
                  {balancePreview.insufficient && (
                    <div className="preview-warning">
                      ⚠️ Saldo insuficiente para realizar esta transacción
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
