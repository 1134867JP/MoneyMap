import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';
import BackButton from '../components/BackButton'
import { API_KEY } from '../config'; // Import the API key from the config file
import { supabase } from '../services/supabaseClient';

const { width, height } = Dimensions.get('window');

Geocoder.init(API_KEY);

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: -28.26547829254501,
    longitude:  -52.39746434586223,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Despesa 1', rating: 4, latitude: -23.55052, longitude: -46.633308 },
    { id: 2, name: 'Despesa 2', rating: 5, latitude: -23.55152, longitude: -46.634308 },
    { id: 3, name: 'Despesa 3', rating: 3, latitude: -23.55252, longitude: -46.635308 },
    { id: 4, name: 'Despesa 4', rating: 2, latitude: -23.55352, longitude: -46.636308 },
    { id: 5, name: 'Despesa 5', rating: 1, latitude: -23.55452, longitude: -46.637308 },
  ]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations') // Your Supabase table name
          .select('id, name, latitude, longitude, rating'); // Fields you need to fetch

        if (error) {
          console.error('Error fetching locations:', error);
        } else {
          setLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locarions:', error);
      }
    };

    fetchLocations();
  }, []);

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
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        {locations.map(expense => (
          <Marker
            key={expense.id}
            coordinate={{ latitude: expense.latitude, longitude: expense.longitude }}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{expense.name}</Text>
                <View style={styles.calloutRating}>
                  {renderStars(expense.rating)}
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
        {/* Remove marker rendering */}
      </MapView>
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
  callout: {
    width: 200, // Aumente a largura do pop-up
    padding: 10, // Aumente o padding para mais espaço interno
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutRating: {
    flexDirection: 'row',
  },
});

export default MapScreen;