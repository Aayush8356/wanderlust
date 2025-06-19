export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateJoined: string;
  lastLogin?: string;
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

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface JournalEntry {
  id: string;
  tripId: string;
  title: string;
  content: string;
  photos: string[];
  location?: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}