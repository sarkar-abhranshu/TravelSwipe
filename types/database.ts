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
  locationWhenInUsePermission: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  closeDest: boolean;
  tripDuration: number;
  preferredTags: string[];
}

export interface Destination {
  id: string;
  name: string;
  image_url: string;
  short_description: string;
  full_description: string;
  country: string;
  tags: string[];
  trip_duration_min: number;
  trip_duration_max: number;
  latitude: number;
  longitude: number;
}
