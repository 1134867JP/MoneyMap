import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, Text, Alert, FlatList, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../components/BackButton';
import { LocationContext } from '../contexts/LocationContext';
import { API_KEY } from '../config';

const { width, height } = Dimensions.get('window');

Geocoder.init(API_KEY, { language: 'pt' }); // Add language parameter for Portuguese

const MapExpenseScreen = () => {
  const { location: contextLocation, loading } = useContext(LocationContext);
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef(null); // Add a ref for the MapView

  useEffect(() => {
    const initialLocation = route.params?.location || { latitude: -23.55052, longitude: -46.633308 }; // Default location
    setRegion({
      latitude: initialLocation.latitude,
      longitude: initialLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, [route.params?.location]);

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    try {
      const json = await Geocoder.from(latitude, longitude);
      if (json.status === 'ZERO_RESULTS') {
        Alert.alert('Nenhum resultado encontrado', 'Não foi possível encontrar um endereço para esta localização.');
        return;
      }
      const address = json.results[0].formatted_address;
      if (route.params?.fromAddExpense) {
        console.log('Navigating to AddExpenseScreen with address:', address);
        navigation.navigate('AddExpenseScreen', { selectedAddress: address });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSearch = () => {
    fetchSuggestions(searchQuery);
  };

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
      setMarker({
        latitude: location.lat,
        longitude: location.lng,
      });
      setSuggestions([]);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000); // Animate to the new region
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef} // Anexe a referência ao MapView
          style={styles.map}
          initialRegion={region} // Use initialRegion em vez de region
          onRegionChangeComplete={setRegion} // Garanta que o estado da região seja atualizado
          onPress={handleMapPress}
        >
          {marker && (
            <Marker coordinate={marker} />
          )}
        </MapView>
      )}
      <View style={styles.topBar}>
        <BackButton style={styles.backButton} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar no Google"
          value={searchQuery}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSearch} // Mantenha a busca de sugestões ao pressionar Enter
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
      <TouchableOpacity style={styles.floatingButton} onPress={() => {
        if (marker) {
          handleMapPress({ nativeEvent: { coordinate: marker } });
        }
      }}>
        <Text style={styles.floatingButtonText}>Confirmar Localização</Text>
      </TouchableOpacity>
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
  topBar: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MapExpenseScreen;