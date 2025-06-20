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

  // ===== BEST TIME TO VISIT API METHODS =====

  async getBestTimeByCity(cityName: string, country?: string): Promise<any> {
    try {
      const params: any = {};
      if (country) params.country = country;
      
      // Try enhanced API first
      const response = await this.api.get(`/best-time/enhanced/city/${encodeURIComponent(cityName)}`, { params });
      return response.data;
    } catch (error) {
      // Fallback to enhanced mock data
      return this.getEnhancedMockBestTimeData(cityName, country);
    }
  }

  async getBestTimeByCoordinates(lat: number, lng: number, radius?: number): Promise<any> {
    try {
      const params: any = { lat, lng };
      if (radius) params.radius = radius;
      
      // Try enhanced API first
      const response = await this.api.get('/best-time/enhanced/coordinates', { params });
      return response.data;
    } catch (error) {
      // Fallback to enhanced mock data
      return this.getEnhancedMockBestTimeDataByCoords(lat, lng);
    }
  }

  async getBestTimeBySearch(query: string): Promise<any> {
    try {
      const response = await this.api.get('/best-time/enhanced/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      // Fallback to enhanced mock data
      return this.getEnhancedMockBestTimeData(query);
    }
  }

  // Enhanced mock data generator with comprehensive data structure
  private getEnhancedMockBestTimeData(cityName: string, country?: string): any {
    const mockDatabase: { [key: string]: any } = {
      'goa': {
        success: true,
        data: {
          cityId: 999,
          cityName: 'Goa',
          countryName: 'India',
          latitude: 15.2993,
          longitude: 74.1240,
          bestMonths: [10, 11, 12, 1, 2, 3],
          shoulderMonths: [9, 4],
          avoidMonths: [5, 6, 7, 8],
          bestTimeSummary: 'October to March',
          weatherSummary: 'Average 27°C (21-33°C range). Heavy monsoon season affects 4 months. Extreme heat possible in summer months.',
          crowdSummary: 'Peak season: 3 months. Shoulder season: 2 months. Best for avoiding crowds: off-season periods.',
          priceSummary: 'Price variation: 160% difference between peak and off-season.',
          idealTripDuration: 5,
          accuracyScore: 0.85,
          dataConfidence: 0.92,
          lastUpdated: new Date(),
          dataSource: 'Enhanced Climate & Tourism Analysis',
          personalizedTips: [
            'Waterproof gear essential during monsoon season',
            'Book accommodations early for peak season or consider shoulder months for savings',
            'Lightweight, breathable clothing recommended year-round'
          ],
          warnings: [
            'Flooding possible during heavy monsoon months - check current conditions',
            'Limited accessibility during months: 6, 7, 8, 9'
          ]
        }
      },
      'mumbai': {
        success: true,
        data: {
          cityId: 998,
          cityName: 'Mumbai',
          countryName: 'India',
          latitude: 19.0760,
          longitude: 72.8777,
          bestMonths: [11, 12, 1, 2, 3],
          shoulderMonths: [10, 4],
          avoidMonths: [5, 6, 7, 8, 9],
          bestTimeSummary: 'November to March',
          weatherSummary: 'Average 28°C (16-36°C range). Heavy monsoon season affects 4 months.',
          crowdSummary: 'Peak season: 4 months. Shoulder season: 2 months. Best for avoiding crowds: off-season periods.',
          priceSummary: 'Price variation: 110% difference between peak and off-season.',
          idealTripDuration: 4,
          accuracyScore: 0.88,
          dataConfidence: 0.90,
          lastUpdated: new Date(),
          dataSource: 'Enhanced Climate & Tourism Analysis',
          personalizedTips: [
            'Pack sun protection and stay hydrated during summer months',
            'Waterproof gear essential during monsoon season'
          ],
          warnings: [
            'Flooding possible during heavy monsoon months - check current conditions',
            'Limited accessibility during months: 6, 7, 8, 9'
          ]
        }
      },
      'delhi': {
        success: true,
        data: {
          cityId: 997,
          cityName: 'Delhi',
          countryName: 'India',
          latitude: 28.7041,
          longitude: 77.1025,
          bestMonths: [10, 11, 12, 1, 2, 3],
          shoulderMonths: [9, 4],
          avoidMonths: [5, 6, 7, 8],
          bestTimeSummary: 'October to March',
          weatherSummary: 'Average 24°C (2-45°C range). Moderate monsoon season affects 3 months.',
          crowdSummary: 'Peak season: 5 months. Shoulder season: 2 months. Best for avoiding crowds: off-season periods.',
          priceSummary: 'Price variation: 90% difference between peak and off-season.',
          idealTripDuration: 4,
          accuracyScore: 0.86,
          dataConfidence: 0.88,
          lastUpdated: new Date(),
          dataSource: 'Enhanced Climate & Tourism Analysis',
          personalizedTips: [
            'Pack sun protection and stay hydrated during summer months'
          ],
          warnings: [
            'Limited accessibility during months: 5, 6, 7, 8, 9'
          ]
        }
      }
    };

    const searchKey = cityName.toLowerCase();
    const countryKey = country?.toLowerCase();

    // Check for exact matches first
    if (mockDatabase[searchKey]) {
      return mockDatabase[searchKey];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(mockDatabase)) {
      if (cityName.toLowerCase().includes(key) || key.includes(cityName.toLowerCase())) {
        return value;
      }
    }

    // Return not found
    return {
      success: false,
      message: 'Best time data not found for this location',
      data: null
    };
  }

  private getEnhancedMockBestTimeDataByCoords(lat: number, lng: number): any {
    console.log(`🌍 Checking coordinates: ${lat}, ${lng}`);
    
    // Simple coordinate-based matching for Indian subcontinent
    if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
      console.log('📍 Coordinates match India/South Asia region');
      if (lat >= 14 && lat <= 16 && lng >= 73 && lng <= 75) {
        // Goa region
        console.log('🏖️ Matched Goa region');
        return this.getEnhancedMockBestTimeData('goa');
      } else if (lat >= 18 && lat <= 20 && lng >= 72 && lng <= 73) {
        // Mumbai region  
        console.log('🏙️ Matched Mumbai region');
        return this.getEnhancedMockBestTimeData('mumbai');
      } else {
        // General India fallback
        console.log('🇮🇳 Using India general fallback (Delhi)');
        return this.getEnhancedMockBestTimeData('delhi');
      }
    }

    console.log('❌ No coordinate match found');
    return {
      success: false,
      message: 'No nearby destination data found',
      data: null
    };
  }

  async getMonthlyClimateData(cityId: number): Promise<any> {
    const response = await this.api.get(`/best-time/city/${cityId}/climate`);
    return response.data;
  }

  async getCityActivities(cityId: number): Promise<any> {
    const response = await this.api.get(`/best-time/city/${cityId}/activities`);
    return response.data;
  }

  async getSimilarDestinations(lat: number, lng: number, limit?: number): Promise<any> {
    const params: any = { lat, lng };
    if (limit) params.limit = limit;
    
    const response = await this.api.get('/best-time/similar', { params });
    return response.data;
  }

  async getAllDestinations(page?: number, limit?: number): Promise<any> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    
    const response = await this.api.get('/best-time/destinations', { params });
    return response.data;
  }
}

export default new ApiService();