import React from 'react';
import type { Trip } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClick, onEdit, onDelete }) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  const getDaysUntilTrip = (startDate: string) => {
    const today = new Date();
    const tripStart = new Date(startDate);
    const diffTime = tripStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} days to go`;
    } else if (diffDays === 0) {
      return 'Today!';
    } else {
      return 'Past trip';
    }
  };

  const getTripStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const tripStart = new Date(startDate);
    const tripEnd = new Date(endDate);
    
    if (today < tripStart) return 'upcoming';
    if (today >= tripStart && today <= tripEnd) return 'ongoing';
    return 'completed';
  };

  const status = getTripStatus(trip.startDate, trip.endDate);

  return (
    <div className="trip-card" onClick={onClick}>
      <div className="trip-card-header">
        <div className="trip-title-section">
          <h3 className="trip-title">{trip.title}</h3>
          <span className={`trip-status ${status}`}>
            {status === 'upcoming' && '🗓️'}
            {status === 'ongoing' && '✈️'}
            {status === 'completed' && '✅'}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="trip-actions">
          <button 
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            title="Edit Trip"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Delete Trip"
          >
            🗑️
          </button>
        </div>
      </div>

      {trip.description && (
        <p className="trip-description">{trip.description}</p>
      )}

      <div className="trip-dates">
        <span className="date-range">{formatDateRange(trip.startDate, trip.endDate)}</span>
        {status === 'upcoming' && (
          <span className="countdown">{getDaysUntilTrip(trip.startDate)}</span>
        )}
      </div>

      <div className="trip-destinations">
        <h4>📍 Destinations</h4>
        <div className="destination-list">
          {trip.destinations.slice(0, 3).map((destination, index) => (
            <span key={index} className="destination-tag">
              {destination.city}, {destination.country}
            </span>
          ))}
          {trip.destinations.length > 3 && (
            <span className="destination-more">
              +{trip.destinations.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="trip-stats">
        <div className="stat">
          <span className="stat-number">{trip.destinations.length}</span>
          <span className="stat-label">Destinations</span>
        </div>
        <div className="stat">
          <span className="stat-number">{trip.packingList.length}</span>
          <span className="stat-label">Pack Items</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {trip.checklist.filter(item => item.completed).length}/{trip.checklist.length}
          </span>
          <span className="stat-label">Tasks Done</span>
        </div>
      </div>

      <div className="trip-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(trip.checklist.filter(item => item.completed).length / Math.max(trip.checklist.length, 1)) * 100}%` 
            }}
          />
        </div>
        <span className="progress-text">
          {Math.round((trip.checklist.filter(item => item.completed).length / Math.max(trip.checklist.length, 1)) * 100)}% Complete
        </span>
      </div>
    </div>
  );
};

export default TripCard;