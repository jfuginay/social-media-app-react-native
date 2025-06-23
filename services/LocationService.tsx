import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface LocationContextType {
  location: LocationData | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  startLocationUpdates: () => Promise<void>;
  stopLocationUpdates: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkPermissions();
    return () => {
      stopLocationUpdates();
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (err) {
      console.error('Error checking location permissions:', err);
      setError('Failed to check location permissions');
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      
      setHasPermission(granted);
      
      if (granted) {
        await getCurrentLocation();
      } else {
        setError('Location permission denied');
      }
      
      setIsLoading(false);
      return granted;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Failed to request location permission');
      setIsLoading(false);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || undefined,
        timestamp: currentLocation.timestamp,
      };

      setLocation(locationData);
      setError(null);
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  };

  const startLocationUpdates = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      // Stop existing subscription if any
      if (locationSubscription) {
        locationSubscription.remove();
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          const locationData: LocationData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy || undefined,
            timestamp: newLocation.timestamp,
          };
          setLocation(locationData);
        }
      );

      setLocationSubscription(subscription);
    } catch (err) {
      console.error('Error starting location updates:', err);
      setError('Failed to start location updates');
    }
  };

  const stopLocationUpdates = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        hasPermission,
        isLoading,
        error,
        requestPermission,
        startLocationUpdates,
        stopLocationUpdates,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 