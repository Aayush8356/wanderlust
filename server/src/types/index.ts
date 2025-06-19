import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export interface UserPayload {
  userId: string;
  email: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TripData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  destinations: string[];
  packingList: string[];
  checklist: { item: string; completed: boolean }[];
  notes?: string;
}

export interface DestinationData {
  country: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  arrivalDate?: Date;
  departureDate?: Date;
  accommodation?: string;
  activities: string[];
  notes?: string;
  order: number;
}

export interface JournalEntryData {
  title: string;
  content: string;
  location?: {
    country: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  photos: string[];
  date: Date;
  mood?: 'excited' | 'happy' | 'neutral' | 'tired' | 'sad';
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
}