import React, { useState, useEffect } from 'react';
import { useDunab } from '../../context/DunabContext';
import { useAuth } from '../../context/AuthContext';
import dunabService from '../../services/dunabService';
import { validateTransactionAmount, validateRequired } from '../../utils/validators';
import {
  FiEdit3, FiPlus, FiAlertTriangle, FiUser, FiTrendingUp,
  FiTrendingDown, FiDollarSign, FiTag, FiFileText, FiLink,
  FiSave, FiX, FiAlertCircle
} from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';
import './CreateTransaction.css';

const CreateTransaction = ({ onSuccess, onCancel, initialData = null, mode = 'create' }) => {
  const { createTransaction, updateTransaction, categories, loadCategories, students, loadStudents } = useDunab();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    cuentaId: '',
    tipo: 'CREDITO',
    monto: '',
    categoriaId: '',
    descripcion: '',
    referencia: ''
  });

  const [currentUserAccount, setCurrentUserAccount] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [studentSearchResults, setStudentSearchResults] = useState([]);

  // Cargar la cuenta del usuario actual
  useEffect(() => {
    const fetchCurrentUserAccount = async () => {
      if (user?.id) {
        try {
          const accountResponse = await dunabService.getAccount(`student/${user.id}`);
          const accountData = accountResponse.data || accountResponse;
          setCurrentUserAccount(accountData);
          setFormData(prev => ({
            ...prev,
            cuentaId: accountData.id
          }));
        } catch (error) {
          console.error('Error loading user account:', error);
        }
      }
    };

    fetchCurrentUserAccount();
  }, [user?.id]);

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        cuentaId: initialData.cuentaId || '',
        tipo: initialData.tipo?.toUpperCase() || 'CREDITO',
        monto: initialData.monto || '',
        categoriaId: initialData.categoriaId || '',
        descripcion: initialData.descripcion || '',
        referencia: initialData.referencia || ''
      });
    }
  }, [mode, initialData]);

  // Cargar categorías y estudiantes al montar (solo una vez)
  useEffect(() => {
    if (loadCategories) {
      loadCategories();
    }
    if (loadStudents) {
      loadStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío: solo se ejecuta al montar el componente

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
    if (!currentUserAccount || !formData.monto) {
      return null;
    }

    const currentBalance = parseFloat(currentUserAccount.saldoActual) || 0;
    const amount = parseFloat(formData.monto) || 0;
    const isDebit = formData.tipo === 'DEBITO' || formData.tipo === 'EGRESO';

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

  // Manejar selección de estudiante (solo para admin)
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);

    // Obtener la cuenta del estudiante seleccionado
    try {
      const accountResponse = await dunabService.getAccount(`student/${student.id}`);
      const accountData = accountResponse.data || accountResponse;

      setFormData(prev => ({
        ...prev,
        cuentaId: accountData.id
      }));
      setSearchTerm(student.nombre || student.codigo);
      setShowStudentSearch(false);
      setStudentSearchResults([]);
    } catch (error) {
      console.error('Error loading student account:', error);
      alert('Error al cargar la cuenta del estudiante');
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.cuentaId)) {
      newErrors.cuentaId = 'No se ha cargado la cuenta del usuario';
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

    if (!validateRequired(formData.categoriaId)) {
      newErrors.categoriaId = 'La categoría es requerida';
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

      // Resetear formulario (mantener cuentaId del usuario actual)
      setFormData({
        cuentaId: currentUserAccount?.id || '',
        tipo: 'CREDITO',
        monto: '',
        categoriaId: '',
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
      cuentaId: currentUserAccount?.id || '',
      tipo: 'CREDITO',
      monto: '',
      categoriaId: '',
      descripcion: '',
      referencia: ''
    });
    setErrors({});
    setSearchTerm('');
    setSelectedStudent(null);
  };

  return (
    <div className="create-transaction">
      <div className="form-header">
        <h2>
          {mode === 'edit' ? <><FiEdit3 /> Editar Transacción</> : <><FiPlus /> Crear Nueva Transacción</>}
        </h2>
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
            <FiAlertTriangle /> {errors.submit}
          </div>
        )}

        <div className="form-grid">
          {/* Información de la Cuenta */}
          <div className="form-field form-field-full">
            <label>
              <FiUser /> Cuenta
            </label>
            {currentUserAccount ? (
              <div className="selected-student-info">
                <div className="student-details">
                  <span className="detail-label">Usuario:</span>
                  <span className="detail-value">
                    {user?.nombre} {user?.apellido}
                  </span>
                </div>
                <div className="student-details">
                  <span className="detail-label">Saldo actual:</span>
                  <span className="detail-value balance">
                    {(parseFloat(currentUserAccount.saldoActual) || 0).toFixed(2)} DUNAB
                  </span>
                </div>
              </div>
            ) : (
              <div className="loading-account">
                Cargando información de cuenta...
              </div>
            )}
          </div>

          {/* Buscador de Estudiante (solo visible para admin) */}
          {false && (
            <div className="form-field form-field-full">
              <label htmlFor="studentSearch">
                <FiUser /> Buscar Estudiante <span className="required">*</span>
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
                  className={errors.cuentaId ? 'error' : ''}
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
              {errors.cuentaId && (
                <span className="field-error">{errors.cuentaId}</span>
              )}
            </div>
          )}

          {/* Tipo de Transacción */}
          <div className="form-field">
            <label htmlFor="tipo">
              <BiMoney /> Tipo de Transacción <span className="required">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={errors.tipo ? 'error' : ''}
            >
              <option value="CREDITO">Crédito (Recibir DUNAB)</option>
              <option value="DEBITO">Débito (Gastar DUNAB)</option>
              <option value="INGRESO">Ingreso</option>
              <option value="EGRESO">Egreso</option>
            </select>
            {errors.tipo && (
              <span className="field-error">{errors.tipo}</span>
            )}
          </div>

          {/* Monto */}
          <div className="form-field">
            <label htmlFor="monto">
              <FiDollarSign /> Monto (DUNAB) <span className="required">*</span>
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
            <label htmlFor="categoriaId">
              <FiTag /> Categoría <span className="required">*</span>
            </label>
            <select
              id="categoriaId"
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              className={errors.categoriaId ? 'error' : ''}
            >
              <option value="">Seleccionar categoría...</option>
              {categories && categories.map((cat) => (
                <option key={cat.id || cat} value={cat.id || cat}>
                  {cat.nombre || cat}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <span className="field-error">{errors.categoriaId}</span>
            )}
          </div>

          {/* Preview del saldo después de la transacción */}
          {balancePreview && (
            <div className="form-field form-field-full">
              <div className={`balance-preview ${balancePreview.insufficient ? 'insufficient' : ''}`}>
                <h4 className="preview-title">
                  <FiAlertCircle /> Preview de Saldo
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
                      <FiAlertTriangle /> Saldo insuficiente para realizar esta transacción
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="form-field form-field-full">
            <label htmlFor="descripcion">
              <FiFileText /> Descripción <span className="required">*</span>
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
              <FiLink /> Referencia (Opcional)
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
              mode === 'edit' ? <><FiSave /> Guardar Cambios</> : <><FiPlus /> Crear Transacción</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTransaction;
