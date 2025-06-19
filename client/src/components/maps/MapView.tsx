import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  width?: number;
  height?: number;
  style?: string;
  locationName?: string;
  showLocationSearch?: boolean;
}

interface LocationResult {
  id: string;
  name: string;
  displayName: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  placeType: string[];
  context: {
    country?: string;
    region?: string;
    district?: string;
    locality?: string;
  };
}

const MapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  zoom = 12,
  width = 600,
  height = 400,
  style = 'streets-v11',
  locationName,
  showLocationSearch = false
}) => {
  const [mapUrl, setMapUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude,
    longitude,
    name: locationName || 'Selected Location'
  });

  useEffect(() => {
    fetchStaticMap();
  }, [currentLocation.latitude, currentLocation.longitude, zoom, width, height, style]);

  const fetchStaticMap = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getStaticMap(
        currentLocation.latitude,
        currentLocation.longitude,
        zoom,
        width,
        height,
        style
      );
      
      if (response.success) {
        setMapUrl(response.data.mapUrl);
      } else {
        setError('Failed to load map');
      }
    } catch (err: any) {
      console.error('Map fetch error:', err);
      // Don't show detailed error messages for auth issues to prevent info exposure
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Map temporarily unavailable');
      } else {
        setError(err.message || 'Unable to load map');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await apiService.geocodeLocation(searchQuery, 5);
      
      if (response.success) {
        setSearchResults(response.data.locations);
      } else {
        setSearchResults([]);
      }
    } catch (err: any) {
      console.error('Location search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const selectLocation = (location: LocationResult) => {
    setCurrentLocation({
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      name: location.displayName
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="map-view loading" style={{ width, height }}>
        <div className="map-placeholder">
          <div className="loading-shimmer"></div>
          <div className="loading-text">Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-view error" style={{ width, height }}>
        <div className="error-message">
          <span className="error-icon">🗺️</span>
          <p>Unable to load map</p>
          <small>{error}</small>
          <button onClick={fetchStaticMap} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view">
      {showLocationSearch && (
        <div className="map-search-container">
          <form onSubmit={handleLocationSearch} className="map-search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                className="form-input"
              />
              <button 
                type="submit" 
                disabled={searchLoading}
                className="btn-primary"
              >
                {searchLoading ? '🔄' : '🔍'}
              </button>
            </div>
          </form>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((location) => (
                <div
                  key={location.id}
                  className="search-result-item"
                  onClick={() => selectLocation(location)}
                >
                  <div className="result-name">{location.displayName}</div>
                  <div className="result-details">
                    {location.placeType.join(', ')} • {location.context.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="map-container" style={{ width, height }}>
        <div className="map-header">
          <h4 className="map-title">{currentLocation.name}</h4>
          <div className="map-coordinates">
            {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </div>
        </div>
        
        <div className="map-image-container">
          <img
            src={mapUrl}
            alt={`Map of ${currentLocation.name}`}
            className="map-image"
            width={width}
            height={height}
          />
          
          <div className="map-overlay">
            <div className="map-controls">
              <button 
                className="map-control-btn"
                onClick={() => window.open(`https://www.google.com/maps/@${currentLocation.latitude},${currentLocation.longitude},${zoom}z`, '_blank')}
                title="Open in Google Maps"
              >
                🗺️
              </button>
              <button 
                className="map-control-btn"
                onClick={fetchStaticMap}
                title="Refresh map"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;