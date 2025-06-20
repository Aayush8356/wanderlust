export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateJoined: string;
  lastLogin?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Trip {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  destinations: Destination[];
  packingList: string[];
  checklist: ChecklistItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  _id: string;
  tripId: string;
  country: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  arrivalDate?: string;
  departureDate?: string;
  accommodation?: string;
  activities: string[];
  notes?: string;
  order: number;
}

export interface ChecklistItem {
  item: string;
  completed: boolean;
}

export interface JournalEntry {
  _id: string;
  userId: string;
  tripId?: string;
  title: string;
  content: string;
  location?: {
    country: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  photos: string[];
  date: string;
  mood?: 'excited' | 'happy' | 'neutral' | 'tired' | 'sad';
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface CountryInfo {
  name: string;
  flag: string;
  currency: string;
  languages: string[];
  capital: string;
  population: number;
  region: string;
  timezone: string[];
}

export interface ApiError {
  message: string;
  errors?: string;
}

// ===== BEST TIME TO VISIT INTERFACES =====

export interface BestTimeData {
  cityId: number;
  cityName: string;
  countryName: string;
  latitude: number;
  longitude: number;
  bestMonths: number[];
  bestTimeSummary: string;
  weatherSummary: string;
  touristSummary: string;
  idealTripDuration: number;
  dataConfidence: number;
  notes?: string;
}

export interface MonthlyClimateData {
  month: number;
  avgTempCelsius: number;
  avgHighCelsius: number;
  avgLowCelsius: number;
  avgRainfallMm: number;
  avgHumidityPercent: number;
  avgSunshineHours: number;
  avgRainyDays: number;
  visitorVolumeScore?: number;
  priceIndex?: number;
  tourismSeason?: string;
}

export interface CityActivity {
  activityName: string;
  activityType: string;
  bestMonths: number[];
  availableMonths: number[];
  description: string;
}

export interface LocationSearchResult {
  cityId: number;
  cityName: string;
  countryName: string;
  distance: number;
  bestTimeData?: BestTimeData;
}

export interface BestTimeResponse {
  success: boolean;
  message: string;
  data: BestTimeData | null;
}