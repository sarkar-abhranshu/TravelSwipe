export interface Profile {
  user_id: string;
  email: string;
  username?: string;
  created_at?: string;
  onboarding_completed?: boolean;
  preferences_completed?: boolean;
}

export interface Preferences {
  user_id: string;
  location_when_in_use_permission: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  fardest: boolean;
  trip_duration: 'short' | 'long';
  preferred_tags: string[];
}

export interface Destination {
  id: string;
  name: string;
  image_url: string | null;
  short_description: string;
  full_description: string;
  country: string;
  region: string | null;
  tags: string[];
  trip_duration_min: number;
  trip_duration_max: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface DestinationCard {
  id: string;
  name: string;
  image_url: string | null;
  short_description: string;
  tags: string[];
  trip_duration_min: number;
  trip_duration_max: number;
  latitude: number;
  longitude: number;
}

export type DestinationDetail = Destination;
