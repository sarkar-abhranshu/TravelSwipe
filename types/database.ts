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
}
