import React, { useState, useEffect } from 'react';
import type { JournalEntry, Trip } from '../../types';

interface JournalFormProps {
  entry?: JournalEntry | null;
  trips?: Trip[];
  onSubmit: (entryData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const JournalForm: React.FC<JournalFormProps> = ({ 
  entry, 
  trips = [], 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    tripId: '',
    location: {
      country: '',
      city: '',
      coordinates: { lat: 0, lng: 0 }
    },
    mood: '' as 'excited' | 'happy' | 'neutral' | 'tired' | 'sad' | '',
    weather: {
      temperature: 0,
      condition: '',
      icon: ''
    },
    photos: [] as string[]
  });

  const [hasLocation, setHasLocation] = useState(false);
  const [hasWeather, setHasWeather] = useState(false);
  const [newPhoto, setNewPhoto] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        content: entry.content,
        date: entry.date.split('T')[0],
        tripId: entry.tripId || '',
        location: entry.location || { country: '', city: '', coordinates: { lat: 0, lng: 0 } },
        mood: entry.mood || '',
        weather: entry.weather || { temperature: 0, condition: '', icon: '' },
        photos: entry.photos || []
      });
      setHasLocation(!!entry.location);
      setHasWeather(!!entry.weather);
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    const submitData = {
      ...formData,
      location: hasLocation && formData.location.country && formData.location.city 
        ? formData.location 
        : undefined,
      weather: hasWeather && formData.weather.condition 
        ? formData.weather 
        : undefined,
      tripId: formData.tripId || undefined
    };

    onSubmit(submitData);
  };

  const addPhoto = () => {
    if (newPhoto.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, newPhoto.trim()]
      }));
      setNewPhoto('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const moodOptions = [
    { value: 'excited', label: '🤩 Excited', color: '#ff6b6b' },
    { value: 'happy', label: '😊 Happy', color: '#4ecdc4' },
    { value: 'neutral', label: '😐 Neutral', color: '#95a5a6' },
    { value: 'tired', label: '😴 Tired', color: '#f39c12' },
    { value: 'sad', label: '😢 Sad', color: '#3498db' }
  ];

  return (
    <div className="journal-form-overlay">
      <div className="journal-form-container">
        <div className="journal-form-header">
          <h2>{entry ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="journal-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter entry title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write about your experience..."
                rows={8}
                required
              />
              <div className="character-count">
                {formData.content.length} characters
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Trip Association</h3>
            <div className="form-group">
              <label htmlFor="tripId">Link to Trip (Optional)</label>
              <select
                id="tripId"
                value={formData.tripId}
                onChange={(e) => setFormData(prev => ({ ...prev, tripId: e.target.value }))}
              >
                <option value="">No trip selected</option>
                {trips.map(trip => (
                  <option key={trip._id} value={trip._id}>
                    {trip.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Mood & Feelings</h3>
            <div className="mood-selector">
              {moodOptions.map(option => (
                <label key={option.value} className="mood-option">
                  <input
                    type="radio"
                    name="mood"
                    value={option.value}
                    checked={formData.mood === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value as any }))}
                  />
                  <span 
                    className="mood-button"
                    style={{ borderColor: formData.mood === option.value ? option.color : 'transparent' }}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
              <label className="mood-option">
                <input
                  type="radio"
                  name="mood"
                  value=""
                  checked={formData.mood === ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: '' }))}
                />
                <span className="mood-button">No mood</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={hasLocation}
                  onChange={(e) => setHasLocation(e.target.checked)}
                />
                Add location information
              </label>
            </div>
            
            {hasLocation && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    value={formData.location.country}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, country: e.target.value }
                    }))}
                    placeholder="Country"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    placeholder="City"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Weather</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={hasWeather}
                  onChange={(e) => setHasWeather(e.target.checked)}
                />
                Add weather information
              </label>
            </div>
            
            {hasWeather && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="temperature">Temperature (°C)</label>
                  <input
                    type="number"
                    id="temperature"
                    value={formData.weather.temperature || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      weather: { ...prev.weather, temperature: Number(e.target.value) }
                    }))}
                    placeholder="25"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <input
                    type="text"
                    id="condition"
                    value={formData.weather.condition}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      weather: { ...prev.weather, condition: e.target.value }
                    }))}
                    placeholder="Sunny, Rainy, etc."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Photos</h3>
            
            <div className="add-item-form">
              <div className="form-row">
                <input
                  type="url"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder="Add photo URL..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
                />
                <button type="button" onClick={addPhoto} className="add-btn">
                  Add Photo
                </button>
              </div>
            </div>

            <div className="photos-list">
              {formData.photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Photo ${index + 1}`} className="photo-preview" />
                  <button 
                    type="button" 
                    onClick={() => removePhoto(index)}
                    className="remove-photo-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (entry ? 'Update Entry' : 'Create Entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalForm;