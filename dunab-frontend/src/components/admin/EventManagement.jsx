import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createEvent, updateEvent, deleteEvent } from '../../services/adminService';
import eventService from '../../services/eventService';
import LoadingSpinner from '../shared/LoadingSpinner';
import './EventManagement.css';

const EventManagement = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    costDunab: 0,
    rewardDunab: 0,
    totalSpots: 0,
    category: 'ACADEMIC',
    status: 'UPCOMING',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data.content || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateEvent(selectedEvent.id, formData);
        alert(t('events.eventUpdated'));
      } else {
        await createEvent(formData);
        alert(t('events.eventCreated'));
      }
      setShowModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(t('errors.serverError'));
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm(t('events.confirmDelete'))) {
      try {
        await deleteEvent(eventId);
        alert(t('events.eventDeleted'));
        loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert(t('errors.serverError'));
      }
    }
  };

  const openEditModal = (event) => {
    setEditMode(true);
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date?.split('T')[0] || '',
      time: event.time || '',
      location: event.location,
      costDunab: event.costDunab,
      rewardDunab: event.rewardDunab,
      totalSpots: event.totalSpots,
      category: event.category,
      status: event.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      costDunab: 0,
      rewardDunab: 0,
      totalSpots: 0,
      category: 'ACADEMIC',
      status: 'UPCOMING',
    });
    setSelectedEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="event-management">
      <div className="management-header">
        <h2>{t('admin.events')}</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); setEditMode(false); }}>
          + {t('admin.createEvent')}
        </button>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card-admin">
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <div className="event-details">
              <div><strong>{t('events.date')}:</strong> {new Date(event.date).toLocaleDateString()}</div>
              <div><strong>{t('events.location')}:</strong> {event.location}</div>
              <div><strong>{t('events.cost')}:</strong> {event.costDunab} DUNAB</div>
              <div><strong>{t('events.reward')}:</strong> {event.rewardDunab} DUNAB</div>
              <div><strong>{t('events.availableSpots')}:</strong> {event.availableSpots}/{event.totalSpots}</div>
            </div>
            <div className="event-actions">
              <button className="btn-small btn-primary" onClick={() => openEditModal(event)}>
                {t('common.edit')}
              </button>
              <button className="btn-small btn-danger" onClick={() => handleDelete(event.id)}>
                {t('common.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <h3>{editMode ? t('common.edit') : t('admin.createEvent')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('events.name')}*</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>{t('events.description')}*</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('events.date')}*</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>{t('events.time')}</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>{t('events.location')}*</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('events.cost')} (DUNAB)</label>
                  <input type="number" name="costDunab" value={formData.costDunab} onChange={handleInputChange} min="0" />
                </div>
                <div className="form-group">
                  <label>{t('events.reward')} (DUNAB)</label>
                  <input type="number" name="rewardDunab" value={formData.rewardDunab} onChange={handleInputChange} min="0" />
                </div>
                <div className="form-group">
                  <label>{t('events.totalSpots')}*</label>
                  <input type="number" name="totalSpots" value={formData.totalSpots} onChange={handleInputChange} min="1" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('events.category')}</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="ACADEMIC">Academic</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="SPORTS">Sports</option>
                    <option value="SOCIAL">Social</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('events.status')}</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">{t('common.save')}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
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

export default EventManagement;
