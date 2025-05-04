import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

// Default location (Jakarta)
const DEFAULT_LOCATION = {
  latitude: -6.166267,
  longitude: 106.876645,
};

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        } else {
          setLocation(DEFAULT_LOCATION);
          setError('Location permission denied. Using default location.');
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setLocation(DEFAULT_LOCATION);
        setError('Could not determine location. Using default location.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, loading, error, DEFAULT_LOCATION };
};