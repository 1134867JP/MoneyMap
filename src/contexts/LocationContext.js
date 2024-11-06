import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLoading(false);
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading }}>
      {children}
    </LocationContext.Provider>
  );
};