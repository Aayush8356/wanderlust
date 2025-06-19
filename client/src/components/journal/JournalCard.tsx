import React from 'react';
import type { JournalEntry } from '../../types';
import { formatDate, formatRelativeDate } from '../../utils/dateUtils';

interface JournalCardProps {
  entry: JournalEntry;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry, onClick, onEdit, onDelete }) => {
  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'excited': return '🤩';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'tired': return '😴';
      case 'sad': return '😢';
      default: return '📝';
    }
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'excited': return '#ff6b6b';
      case 'happy': return '#4ecdc4';
      case 'neutral': return '#95a5a6';
      case 'tired': return '#f39c12';
      case 'sad': return '#3498db';
      default: return '#6c757d';
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="journal-card" onClick={onClick}>
      <div className="journal-card-header">
        <div className="journal-title-section">
          <h3 className="journal-title">{entry.title}</h3>
          <div className="journal-meta">
            <span className="journal-date">{formatDate(entry.date)}</span>
            <span className="journal-relative-date">
              {formatRelativeDate(entry.createdAt)}
            </span>
          </div>
        </div>
        <div className="journal-actions">
          <button 
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            title="Edit Entry"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Delete Entry"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="journal-content">
        <p className="journal-text">{truncateContent(entry.content)}</p>
      </div>

      <div className="journal-details">
        {entry.location && (
          <div className="journal-location">
            <span className="location-icon">📍</span>
            <span className="location-text">
              {entry.location.city}, {entry.location.country}
            </span>
          </div>
        )}

        {entry.mood && (
          <div className="journal-mood">
            <span 
              className="mood-indicator"
              style={{ color: getMoodColor(entry.mood) }}
            >
              {getMoodEmoji(entry.mood)}
            </span>
            <span className="mood-text">
              {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
            </span>
          </div>
        )}

        {entry.weather && (
          <div className="journal-weather">
            <span className="weather-icon">
              {entry.weather.icon ? (
                <img 
                  src={`https://openweathermap.org/img/wn/${entry.weather.icon}@2x.png`}
                  alt={entry.weather.condition}
                  className="weather-icon-img"
                />
              ) : (
                '🌤️'
              )}
            </span>
            <span className="weather-text">
              {entry.weather.temperature}°C, {entry.weather.condition}
            </span>
          </div>
        )}
      </div>

      {entry.photos && entry.photos.length > 0 && (
        <div className="journal-photos">
          <div className="photos-preview">
            {entry.photos.slice(0, 3).map((photo, index) => (
              <div key={index} className="photo-thumbnail">
                <img src={photo} alt={`Photo ${index + 1}`} />
              </div>
            ))}
            {entry.photos.length > 3 && (
              <div className="photos-count">
                +{entry.photos.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="journal-card-footer">
        <div className="journal-stats">
          {entry.photos && entry.photos.length > 0 && (
            <span className="stat">
              📷 {entry.photos.length} photo{entry.photos.length !== 1 ? 's' : ''}
            </span>
          )}
          <span className="stat">
            📝 {entry.content.length} characters
          </span>
        </div>
        
        {entry.tripId && (
          <div className="linked-trip">
            <span className="trip-link-icon">🧳</span>
            <span className="trip-link-text">Linked to trip</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalCard;