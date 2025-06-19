import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  location: string;
  country: string;
}

interface WeatherWidgetProps {
  city: string;
  country?: string;
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city, country, compact = false }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getWeatherByCity(city, country);
        
        if (response.success) {
          setWeather(response.data);
        } else {
          setError('Failed to fetch weather data');
        }
      } catch (err: any) {
        console.error('Weather fetch error:', err);
        // Don't show detailed error messages for auth issues to prevent info exposure
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Weather data temporarily unavailable');
        } else {
          setError(err.message || 'Unable to fetch weather data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city, country]);

  if (loading) {
    return (
      <div className={`weather-widget loading ${compact ? 'compact' : ''}`}>
        <div className="weather-icon">🌤️</div>
        {!compact && (
          <div className="weather-info">
            <div className="loading-text">Loading weather...</div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`weather-widget error ${compact ? 'compact' : ''}`}>
        <div className="weather-icon">⚠️</div>
        {!compact && (
          <div className="weather-info">
            <div className="error-text">Weather unavailable</div>
            <div className="error-detail">{error}</div>
          </div>
        )}
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  if (compact) {
    return (
      <div className="weather-widget compact">
        <div className="weather-main compact">
          <div className="weather-icon compact">
            <img src={weatherIconUrl} alt={weather.description} />
          </div>
          <div className="weather-temp compact">
            {weather.temperature}°C
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-icon">
          <img src={weatherIconUrl} alt={weather.description} />
        </div>
        <div className="weather-temp">
          {weather.temperature}°C
        </div>
      </div>
      
      <div className="weather-details">
        <div className="weather-location">
          {weather.location}, {weather.country}
        </div>
        <div className="weather-condition">
          {weather.description}
        </div>
        <div className="weather-stats">
          <div className="weather-stat">
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{weather.humidity}%</span>
          </div>
          <div className="weather-stat">
            <span className="stat-label">Wind</span>
            <span className="stat-value">{weather.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;