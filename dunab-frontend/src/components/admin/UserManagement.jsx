import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../services/adminService';
import LoadingSpinner from '../shared/LoadingSpinner';
import './UserManagement.css';

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentCode: '',
    phone: '',
    program: '',
    semester: '',
    role: 'STUDENT',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.content || data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateUser(selectedUser.id, formData);
        alert(t('admin.userUpdated'));
      } else {
        await createUser(formData);
        alert(t('admin.userCreated'));
      }
      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(t('errors.serverError'));
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm(t('admin.confirmDeleteUser'))) {
      try {
        await deleteUser(userId);
        alert(t('admin.userDeleted'));
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(t('errors.serverError'));
      }
    }
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      studentCode: user.studentCode,
      phone: user.phone || '',
      program: user.program || '',
      semester: user.semester || '',
      role: user.role,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditMode(false);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      studentCode: '',
      phone: '',
      program: '',
      semester: '',
      role: 'STUDENT',
    });
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>{t('admin.users')}</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + {t('admin.createUser')}
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('auth.name')}</th>
              <th>{t('auth.email')}</th>
              <th>{t('auth.studentCode')}</th>
              <th>{t('profile.program')}</th>
              <th>{t('profile.role')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {t('common.noData')}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.studentCode}</td>
                  <td>{user.program || '-'}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon"
                      onClick={() => openEditModal(user)}
                      title={t('common.edit')}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(user.id)}
                      title={t('common.delete')}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editMode ? t('common.edit') : t('admin.createUser')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('profile.firstName')}</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('profile.lastName')}</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('auth.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('auth.studentCode')}</label>
                  <input
                    type="text"
                    name="studentCode"
                    value={formData.studentCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('auth.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('profile.program')}</label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('profile.semester')}</label>
                  <input
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    min="1"
                    max="12"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('profile.role')}</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="COORDINATOR">COORDINATOR</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {t('common.save')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
