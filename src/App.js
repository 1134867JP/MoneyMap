import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import MapScreen from './src/screens/MapScreen';
import LoginScreen from './src/screens/LoginScreen'; // Assuming you have a LoginScreen
import LoadingScreen from './src/screens/LoadingScreen'; // Create a LoadingScreen component

const Stack = createStackNavigator();

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };

    fetchLocation();
  }, []);

  if (!location && !errorMsg) {
    return <LoadingScreen />; // Show loading screen while fetching location
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Map">
          {props => <MapScreen {...props} location={location} errorMsg={errorMsg} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
