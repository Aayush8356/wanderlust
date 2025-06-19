import axios from 'axios';

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  location: string;
  country: string;
}

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenWeather API key not configured');
    }
  }

  async getWeatherByCity(city: string, country?: string): Promise<WeatherData> {
    try {
      const query = country ? `${city},${country}` : city;
      const response = await axios.get<OpenWeatherResponse>(
        `${this.baseUrl}/weather`,
        {
          params: {
            q: query,
            appid: this.apiKey,
            units: 'metric', // Celsius
          },
        }
      );

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        location: data.name,
        country: data.sys.country,
      };
    } catch (error: any) {
      console.error('Weather API error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch weather data'
      );
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenWeatherResponse>(
        `${this.baseUrl}/weather`,
        {
          params: {
            lat,
            lon,
            appid: this.apiKey,
            units: 'metric',
          },
        }
      );

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        location: data.name,
        country: data.sys.country,
      };
    } catch (error: any) {
      console.error('Weather API error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch weather data'
      );
    }
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

export default new WeatherService();