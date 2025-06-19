import React, { useState, useEffect } from 'react';
import { Trip } from '../../types';

interface TripFormProps {
  trip?: Trip | null;
  onSubmit: (tripData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    destinations: [] as Array<{ country: string; city: string; coordinates: { lat: number; lng: number } }>,
    packingList: [] as string[],
    checklist: [] as Array<{ item: string; completed: boolean }>,
    notes: ''
  });

  const [newDestination, setNewDestination] = useState({ country: '', city: '' });
  const [newPackingItem, setNewPackingItem] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title,
        description: trip.description || '',
        startDate: trip.startDate.split('T')[0],
        endDate: trip.endDate.split('T')[0],
        destinations: trip.destinations,
        packingList: trip.packingList,
        checklist: trip.checklist,
        notes: trip.notes || ''
      });
    }
  }, [trip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date');
      return;
    }

    onSubmit(formData);
  };

  const addDestination = () => {
    if (newDestination.country && newDestination.city) {
      setFormData(prev => ({
        ...prev,
        destinations: [...prev.destinations, {
          ...newDestination,
          coordinates: { lat: 0, lng: 0 } // Will be geocoded later
        }]
      }));
      setNewDestination({ country: '', city: '' });
    }
  };

  const removeDestination = (index: number) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index)
    }));
  };

  const addPackingItem = () => {
    if (newPackingItem.trim()) {
      setFormData(prev => ({
        ...prev,
        packingList: [...prev.packingList, newPackingItem.trim()]
      }));
      setNewPackingItem('');
    }
  };

  const removePackingItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packingList: prev.packingList.filter((_, i) => i !== index)
    }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, { item: newChecklistItem.trim(), completed: false }]
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const toggleChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map((item, i) => 
        i === index ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  return (
    <div className="trip-form-overlay">
      <div className="trip-form-container">
        <div className="trip-form-header">
          <h2>{trip ? 'Edit Trip' : 'Create New Trip'}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="trip-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Trip Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter trip title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your trip..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Destinations</h3>
            
            <div className="add-item-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newDestination.country}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Country"
                />
                <input
                  type="text"
                  value={newDestination.city}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                />
                <button type="button" onClick={addDestination} className="add-btn">
                  Add
                </button>
              </div>
            </div>

            <div className="item-list">
              {formData.destinations.map((destination, index) => (
                <div key={index} className="item">
                  <span>{destination.city}, {destination.country}</span>
                  <button 
                    type="button" 
                    onClick={() => removeDestination(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Packing List</h3>
            
            <div className="add-item-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newPackingItem}
                  onChange={(e) => setNewPackingItem(e.target.value)}
                  placeholder="Add packing item..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPackingItem())}
                />
                <button type="button" onClick={addPackingItem} className="add-btn">
                  Add
                </button>
              </div>
            </div>

            <div className="item-list">
              {formData.packingList.map((item, index) => (
                <div key={index} className="item">
                  <span>{item}</span>
                  <button 
                    type="button" 
                    onClick={() => removePackingItem(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Checklist</h3>
            
            <div className="add-item-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                />
                <button type="button" onClick={addChecklistItem} className="add-btn">
                  Add
                </button>
              </div>
            </div>

            <div className="item-list">
              {formData.checklist.map((item, index) => (
                <div key={index} className="item checklist-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(index)}
                    />
                    <span className={item.completed ? 'completed' : ''}>{item.item}</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => removeChecklistItem(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Notes</h3>
            <div className="form-group">
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about your trip..."
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (trip ? 'Update Trip' : 'Create Trip')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;