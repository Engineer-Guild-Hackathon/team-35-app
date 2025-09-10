import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const error = (error: GeolocationPositionError) => {
      setLocation(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  const isNearHome = (homeLocation: { latitude: number; longitude: number }) => {
    if (!location.latitude || !location.longitude) return false;
    
    // Calculate distance between current location and home (simplified)
    const distance = Math.sqrt(
      Math.pow(location.latitude - homeLocation.latitude, 2) +
      Math.pow(location.longitude - homeLocation.longitude, 2)
    );
    
    // Return true if within ~100 meters (rough approximation)
    return distance < 0.001;
  };

  return {
    ...location,
    isNearHome,
  };
};