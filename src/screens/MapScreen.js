import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { supabase } from '../services/supabaseClient';
import { API_KEY } from '../config';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

Geocoder.init(API_KEY, { language: 'pt' });

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão para acessar a localização foi negada.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('id, name, rating, location');

        if (expensesError) {
          console.error('Error fetching expenses:', expensesError);
          return;
        }

        console.log('Expenses Data:', expensesData); // Debug expenses data

        const geocodedData = await Promise.all(expensesData.map(async expense => {
          if (!expense.location) {
            console.warn(`No location for expense with id ${expense.id}`);
            return null;
          }

          try {
            const geocodeResult = await Geocoder.from(expense.location);
            const { lat, lng } = geocodeResult.results[0].geometry.location;
            return {
              ...expense,
              latitude: lat,
              longitude: lng,
            };
          } catch (error) {
            console.error(`Error geocoding location for expense with id ${expense.id}:`, error);
            return null;
          }
        }));

        const combinedData = geocodedData.filter(expense => expense !== null);

        console.log('Combined Data:', combinedData); // Debug combined data

        setLocations(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [region, locations]);  

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${API_KEY}`);
      const json = await response.json();
      if (json.status === 'OK') {
        setSuggestions(json.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleInputChange = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = async (placeId) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`);
      const json = await response.json();
      if (json.status === 'ZERO_RESULTS' || !json.result) {
        Alert.alert('Nenhum resultado encontrado', 'Não foi possível encontrar um endereço para esta localização.');
        return;
      }
      const location = json.result.geometry.location;
      const newRegion = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      setSuggestions([]);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000); // Animate to the new region
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const handleSearch = () => {
    fetchSuggestions(searchQuery);
  };

  const handleMarkerPress = (expense) => {
    setSelectedMarker(expense);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        {locations.map(expense => {
          if (!expense.latitude || !expense.longitude) {
            console.warn(`Invalid coordinates for expense with id ${expense.id}`);
            return null; // Ensure coordinates are valid
          }
          return (
            <Marker
              key={expense.id}
              coordinate={{ latitude: expense.latitude, longitude: expense.longitude }}
              onPress={() => handleMarkerPress(expense)}
            >
            </Marker>
          );
        })}
      </MapView>
      )}
      {selectedMarker && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipTitle}>{selectedMarker.name}</Text>
          <View style={styles.tooltipRating}>
            {renderStars(selectedMarker.rating)}
          </View>
        </View>
      )}
      <View style={styles.searchContainer}>
        <BackButton style={styles.backButton} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar endereço"
          value={searchQuery}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSearch} // Trigger search on Enter
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item.place_id)}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center', // Centralize verticalmente
  },
  backButton: {
    marginRight: 10,
    alignSelf: 'center', // Centralize horizontalmente
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsList: {
    position: 'absolute',
    top: 100,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  calloutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 15,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutArrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: -32,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutRating: {
    flexDirection: 'row',
  },
  tooltip: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  tooltipRating: {
    flexDirection: 'row',
  },
});

export default MapScreen;