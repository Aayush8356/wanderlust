import React, { useState, useEffect } from 'react';
import type { JournalEntry, Trip } from '../types';
import apiService from '../services/api';
import JournalCard from '../components/journal/JournalCard';
import JournalForm from '../components/journal/JournalForm';

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
    fetchTrips();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getJournalEntries();
      setEntries(response.entries || []);
    } catch (error: any) {
      console.error('Error fetching journal entries:', error);
      setError('Failed to load journal entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await apiService.getTrips();
      setTrips(response.trips || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleCreateEntry = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormSubmit = async (entryData: any) => {
    try {
      setFormLoading(true);
      setError(null);

      if (editingEntry) {
        await apiService.updateJournalEntry(editingEntry._id, entryData);
      } else {
        await apiService.createJournalEntry(entryData);
      }

      setShowForm(false);
      setEditingEntry(null);
      await fetchEntries();
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      setError('Failed to save journal entry. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEntry = async (entry: JournalEntry) => {
    if (!window.confirm(`Are you sure you want to delete "${entry.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      await apiService.deleteJournalEntry(entry._id);
      await fetchEntries();
    } catch (error: any) {
      console.error('Error deleting journal entry:', error);
      setError('Failed to delete journal entry. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  if (loading) {
    return (
      <div className="journal-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your journal entries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Travel Journal</h1>
            <p>Capture and preserve your travel memories</p>
          </div>
          <button 
            className="btn-primary"
            onClick={handleCreateEntry}
          >
            📝 Write New Entry
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

        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h2>No journal entries yet</h2>
            <p>Start documenting your travel experiences!</p>
            <button 
              className="btn-primary"
              onClick={handleCreateEntry}
            >
              Write Your First Entry
            </button>
          </div>
        ) : (
          <div className="journal-grid">
            {entries.map((entry) => (
              <JournalCard
                key={entry._id}
                entry={entry}
                onClick={() => {/* TODO: Navigate to entry detail */}}
                onEdit={() => handleEditEntry(entry)}
                onDelete={() => handleDeleteEntry(entry)}
              />
            ))}
          </div>
        )}

        {showForm && (
          <JournalForm
            entry={editingEntry}
            trips={trips}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={formLoading}
          />
        )}
      </div>
    </div>
  );
};

export default JournalPage;