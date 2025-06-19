import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { AuthResponse, LoginData, RegisterData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Only redirect to login for protected routes, not for optional auth endpoints
          const isProtectedRoute = error.config?.url?.includes('/trips') || 
                                 error.config?.url?.includes('/journal') ||
                                 error.config?.url?.includes('/auth/me') ||
                                 error.config?.url?.includes('/auth/logout');
          
          if (isProtectedRoute) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
    return response.data;
  }

  // Token verification would be implemented when backend supports it
  // async verifyToken(): Promise<{ valid: boolean; user: any }> {
  //   const response = await this.api.get('/auth/verify');
  //   return response.data;
  // }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getTrips(): Promise<any> {
    const response = await this.api.get('/trips');
    return response.data;
  }

  async createTrip(tripData: any): Promise<any> {
    const response = await this.api.post('/trips', tripData);
    return response.data;
  }

  async getTripById(id: string): Promise<any> {
    const response = await this.api.get(`/trips/${id}`);
    return response.data;
  }

  async updateTrip(id: string, tripData: any): Promise<any> {
    const response = await this.api.put(`/trips/${id}`, tripData);
    return response.data;
  }

  async deleteTrip(id: string): Promise<any> {
    const response = await this.api.delete(`/trips/${id}`);
    return response.data;
  }

  // Journal API
  async getJournalEntries(tripId?: string): Promise<any> {
    const params = tripId ? { tripId } : {};
    const response = await this.api.get('/journal', { params });
    return response.data;
  }

  async createJournalEntry(journalData: any): Promise<any> {
    const response = await this.api.post('/journal', journalData);
    return response.data;
  }

  async getJournalEntryById(id: string): Promise<any> {
    const response = await this.api.get(`/journal/${id}`);
    return response.data;
  }

  async updateJournalEntry(id: string, journalData: any): Promise<any> {
    const response = await this.api.put(`/journal/${id}`, journalData);
    return response.data;
  }

  async deleteJournalEntry(id: string): Promise<any> {
    const response = await this.api.delete(`/journal/${id}`);
    return response.data;
  }

  async getJournalStats(): Promise<any> {
    const response = await this.api.get('/journal/stats');
    return response.data;
  }

  async checkHealth(): Promise<any> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Weather API
  async getWeatherByCity(city: string, country?: string): Promise<any> {
    const params: any = { city };
    if (country) params.country = country;
    const response = await this.api.get('/weather/city', { params });
    return response.data;
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<any> {
    const response = await this.api.get('/weather/coordinates', {
      params: { lat, lon }
    });
    return response.data;
  }

  // Image API
  async searchImages(query: string, page?: number, perPage?: number): Promise<any> {
    const response = await this.api.get('/images/search', {
      params: { query, page, per_page: perPage }
    });
    return response.data;
  }

  async getDestinationImages(destination: string, limit?: number): Promise<any> {
    const params = limit ? { limit } : {};
    const response = await this.api.get(`/images/destination/${destination}`, { params });
    return response.data;
  }

  async searchDestinationImages(destination: string, page?: number, perPage?: number): Promise<any> {
    const response = await this.api.get(`/images/destination/${destination}/search`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getRandomImage(query?: string): Promise<any> {
    const params = query ? { query } : {};
    const response = await this.api.get('/images/random', { params });
    return response.data;
  }

  // Maps API
  async geocodeLocation(query: string, limit?: number): Promise<any> {
    const params: any = { query };
    if (limit) params.limit = limit;
    const response = await this.api.get('/maps/geocode', { params });
    return response.data;
  }

  async reverseGeocode(lat: number, lon: number): Promise<any> {
    const response = await this.api.get('/maps/reverse-geocode', {
      params: { lat, lon }
    });
    return response.data;
  }

  async getDirections(coordinates: Array<[number, number]>, profile?: 'driving' | 'walking' | 'cycling'): Promise<any> {
    const response = await this.api.post('/maps/directions', {
      coordinates,
      profile
    });
    return response.data;
  }

  async getStaticMap(lat: number, lon: number, zoom?: number, width?: number, height?: number, style?: string): Promise<any> {
    const params: any = { lat, lon };
    if (zoom) params.zoom = zoom;
    if (width) params.width = width;
    if (height) params.height = height;
    if (style) params.style = style;
    const response = await this.api.get('/maps/static-map', { params });
    return response.data;
  }

  async getMultiPointStaticMap(
    points: Array<{ latitude: number; longitude: number; color?: string; size?: 's' | 'm' | 'l' }>,
    options?: { zoom?: number; width?: number; height?: number; style?: string }
  ): Promise<any> {
    const response = await this.api.post('/maps/static-map-multi', {
      points,
      ...options
    });
    return response.data;
  }
}

export default new ApiService();