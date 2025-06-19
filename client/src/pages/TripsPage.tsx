import React, { useState, useEffect } from 'react';
import type { Trip } from '../types';
import apiService from '../services/api';
import TripCard from '../components/trip/TripCard';
import TripForm from '../components/trip/TripForm';

const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTrips();
      setTrips(response.trips || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      setError('Failed to load trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    setEditingTrip(null);
    setShowForm(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleFormSubmit = async (tripData: any) => {
    try {
      setFormLoading(true);
      setError(null);

      if (editingTrip) {
        await apiService.updateTrip(editingTrip._id, tripData);
      } else {
        await apiService.createTrip(tripData);
      }

      setShowForm(false);
      setEditingTrip(null);
      await fetchTrips();
    } catch (error: any) {
      console.error('Error saving trip:', error);
      setError('Failed to save trip. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTrip = async (trip: Trip) => {
    if (!window.confirm(`Are you sure you want to delete "${trip.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      await apiService.deleteTrip(trip._id);
      await fetchTrips();
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  if (loading) {
    return (
      <div className="trips-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trips-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>My Trips</h1>
            <p>Plan and manage your travel adventures</p>
          </div>
          <button 
            className="btn-primary"
            onClick={handleCreateTrip}
          >
            📅 Create New Trip
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              className="error-dismiss"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧳</div>
            <h2>No trips yet</h2>
            <p>Start planning your first adventure!</p>
            <button 
              className="btn-primary"
              onClick={handleCreateTrip}
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onClick={() => {/* TODO: Navigate to trip detail */}}
                onEdit={() => handleEditTrip(trip)}
                onDelete={() => handleDeleteTrip(trip)}
              />
            ))}
          </div>
        )}

        {showForm && (
          <TripForm
            trip={editingTrip}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={formLoading}
          />
        )}
      </div>
    </div>
  );
};

export default TripsPage;