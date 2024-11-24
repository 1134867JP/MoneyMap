import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import BackButton from '../components/BackButton';
import CheckBox from 'expo-checkbox';
import CustomRating from '../components/CustomRating'; // Add this import
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { wp, hp, moderateScale } from '../utils/dimensions';
import CustomAlert from '../components/CustomAlert'; // Add this import
import { supabase } from '../services/supabaseClient';
import { API_KEY } from '../config'; // Import the API key from the config file
const { width } = Dimensions.get('window');

const AddExpenseScreen = ({ navigation }) => {
  const route = useRoute();
  const { expense, expenseId, tela, onAddExpense } = route.params || {};
  const [name, setName] = useState(expense ? expense.name : '');
  const [category, setCategory] = useState(expense ? expense.category_id : '');
  const [amount, setAmount] = useState(expense ? `R$${Math.abs(expense.amount).toFixed(2)}` : 'R$0,00');
  const [expenseDate, setExpenseDate] = useState(expense ? new Date(expense.expense_date) : new Date('2024-12-20'));
  const [validityDate, setValidityDate] = useState(expense ? new Date(expense.validity_date) : new Date('2024-12-20'));
  const [showExpenseDatePicker, setShowExpenseDatePicker] = useState(false);
  const [showValidityDatePicker, setShowValidityDatePicker] = useState(false);
  const [location, setLocation] = useState(expense ? expense.location : '');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [rating, setRating] = useState(expense ? expense.rating : 0);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // Add this state
  const [alertMessage, setAlertMessage] = useState(''); // Add this state
  const [categories, setCategories] = useState([]);
  const isEditing = route.params?.isEditing || false;
  const fromExpenseStatement = route.params?.fromExpenseStatement || false;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const getCoordinatesFromAddress = async (address) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        return { latitude: lat, longitude: lng }; // Retorna as coordenadas
      } else {
        console.error('Erro ao encontrar o endereço:', data.status);
        return null; // Retorna null em caso de erro
      }
    } catch (err) {
      console.error('Erro ao buscar coordenadas:', err);
      return null; // Retorna null em caso de erro
    }
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (numericValue / 100).toFixed(2).replace('.', ',');
    return `R$${formattedValue}`;
  };

  const handleAmountChange = (value) => {
    setAmount(formatCurrency(value));
  };

  const fetchCategories = async () => {
    try {

      const { data: { user }, error: userError } = await supabase.auth.getUser();
        
      if (userError || !user?.id) {
        console.log('Erro ao obter o usuário');
        setLoading(false);
        return;
      }
      
      const userId = user.id;

      const { data, error } = await supabase
        .from('categoriesExpenses')
        .select('id, name')
        .eq('user_id', userId);
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveExpense = async () => {
    // Validar campos obrigatórios
    if (!name || !category || !amount || !expenseDate) {
      setAlertMessage('Por favor, preencha todos os campos obrigatórios.');
      setAlertVisible(true);
      return;
    }
  
    // Obter o usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.id) {
      setAlertMessage('Erro: usuário não autenticado.');
      setAlertVisible(true);
      return;
    }
  
    const userId = user.id;

    try {
      let latitude = null;
      let longitude = null;

      if (location) {
        // Obter coordenadas antes de inserir a despesa
        const coordinates = await getCoordinatesFromAddress(location);
        if (!coordinates) {
          setAlertMessage('Erro ao obter coordenadas.');
          setAlertVisible(true);
          return;
        }
  
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }
    
      // Inserir na tabela `expenses`
      const { data, error } = await supabase.from('expenses').insert([
        {
          user_id: userId,
          category_id: parseInt(category, 10),
          name: name.trim(),
          amount: parseFloat(amount.replace('R$', '').replace(',', '.')),
          expense_date: expenseDate.toISOString().split('T')[0],
          validity_date: validityDate ? validityDate.toISOString().split('T')[0] : null,
          rating: rating,
          location: location,
          // Não inclua a chave primária (id) aqui, deixe o banco gerar automaticamente
        },
        
        
      ]);

      if (error) {
        console.error('Erro ao salvar despesa:', error);
        setAlertMessage('Erro ao salvar a despesa. Por favor, tente novamente.');
        setAlertVisible(true);
      } else {
        if (location) {
          await supabase.from('locations').insert([
            {
              address: location,
              rating: rating,
              name: name.trim(),
              latitude: latitude,
              longitude: longitude,
            },
          ]);
        }
        console.log('Despesa salva com sucesso:', data);
        setAlertMessage('Despesa salva com sucesso!');
        setAlertVisible(true);
  
        // Redirecionar ou limpar formulário
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setAlertMessage('Ocorreu um erro inesperado. Por favor, tente novamente.');
      setAlertVisible(true);
    }
  };

  const deleteExpense = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expense.id);
  
      if (error) {
        throw error;
      }
  
      console.log('Despesa excluída com sucesso:', data);
      setAlertMessage('Despesa excluída com sucesso!');
      setAlertVisible(true);
      if (onAddExpense) {
        onAddExpense();
      }

      navigation.goBack();
    
    } catch (error) {
      console.error('Erro ao excluir a despesa:', error.message);
    }
  };

  const editExpense = async () => {
    // Validar campos obrigatórios
    if (!name || !category || !amount || !expenseDate) {
      setAlertMessage('Por favor, preencha todos os campos obrigatórios.');
      setAlertVisible(true);
      return;
    }
  
    // Obter o usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.id) {
      setAlertMessage('Erro: usuário não autenticado.');
      setAlertVisible(true);
      return;
    }
  
    if (!expenseId) {
      setAlertMessage('Erro: ID da despesa não encontrado.');
      setAlertVisible(true);
      return;
    }
  
    const userId = user.id;
  
    try {
      // Atualizar a tabela `expenses`
      const { data, error } = await supabase
        .from('expenses')
        .update({
          category_id: parseInt(category, 10),
          name: name.trim(),
          amount: parseFloat(amount.replace('R$', '').replace(',', '.')),
          expense_date: expenseDate.toISOString().split('T')[0],
          validity_date: validityDate ? validityDate.toISOString().split('T')[0] : null,
          rating: rating,
        })
        .eq('id', expenseId); // Atualiza a despesa com o ID correspondente
  
      if (error) {
        console.error('Erro ao editar despesa:', error);
        setAlertMessage('Erro ao editar a despesa. Por favor, tente novamente.');
        setAlertVisible(true);
      } else {
        console.log('Despesa editada com sucesso:', data);
        setAlertMessage('Despesa editada com sucesso!');
        setAlertVisible(true);
  
        if (onAddExpense) {
          onAddExpense();
        }
        
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setAlertMessage('Ocorreu um erro inesperado. Por favor, tente novamente.');
      setAlertVisible(true);
    }
  };

  const handleMapPress = async () => {
    let coordinates = { latitude: null, longitude: null };
  
    if (useCurrentLocation) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAlertMessage('Permissão para acessar a localização foi negada.');
        setAlertVisible(true);
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } else if (location) {
      const fetchedCoordinates = await getCoordinatesFromAddress(location);
      if (fetchedCoordinates) {
        coordinates = fetchedCoordinates;
      } else {
        setAlertMessage('Não foi possível obter a localização do endereço fornecido.');
        setAlertVisible(true);
        return;
      }
    }
  
    navigation.navigate('MapExpenseScreen', { fromAddExpense: true, location: coordinates });
  };

  useEffect(() => {
    if (route.params?.selectedAddress) {
      console.log('Selected address received:', route.params.selectedAddress); // Debugging line
      setLocation(route.params.selectedAddress);
      if (useCurrentLocation) {
        setUseCurrentLocation(false);
      }
    }
  }, [route.params?.selectedAddress]);

  useEffect(() => {
    if (useCurrentLocation) {
      (async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address.length > 0) {
          setLocation(`${address[0].street}, ${address[0].city}, ${address[0].region}, ${address[0].postalCode}`);
        }
        setLoading(false);
      })();
    }
  }, [useCurrentLocation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4960F9', '#1937FE']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
        <View style={styles.headerContainer}>
          <BackButton color="white" />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {isEditing ? "Manutenção de Despesa" : "Adicionar Despesa"}
            </Text>
          </View>
        </View>
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Despesa*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#FFFFFF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria*</Text>
            <View style={styles.categoryPickerContainer}>
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={[styles.picker, { flex: 1 }]}
              >
                <Picker.Item label="Selecione uma categoria" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Picker>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CategoryMaintenance', { isAdding: true, categoryType: 'expenses', onCategoryAdded: fetchCategories })}
              >
                <Icon name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor*</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholderTextColor="#FFFFFF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data da Despesa*</Text>
            <TouchableOpacity onPress={() => setShowExpenseDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={expenseDate.toLocaleDateString()}
                editable={false}
                placeholderTextColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Validade da Despesa</Text>
            <TouchableOpacity onPress={() => setShowValidityDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={validityDate.toLocaleDateString()}
                editable={false}
                placeholderTextColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização da Despesa</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={location}
                onChangeText={setLocation}
                placeholder="Digite o endereço"
                placeholderTextColor="#FFFFFF"
              />
              <TouchableOpacity
                style={styles.mapButton}
                onPress={handleMapPress}
              >
                <Icon name="map" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={useCurrentLocation}
                onValueChange={(newValue) => {
                  setUseCurrentLocation(newValue);
                  if (!newValue) {
                    setLocation('');
                  }
                }}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>Deseja usar sua localização atual?</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Avaliação</Text>
            <CustomRating
              count={5}
              defaultRating={rating}
              size={20}
              onFinishRating={setRating}
              starContainerStyle={styles.rating}
            />
          </View>

          {isEditing && fromExpenseStatement && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteExpense}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          )}
          <CustomButton
            label={isEditing && fromExpenseStatement ? "Salvar" : "Adicionar"}
            onPress={isEditing && fromExpenseStatement ? editExpense : saveExpense}
            gradientColors={['#FFFFFF', '#FFFFFF']}
            textColor="#1937FE"
            iconColor="#1937FE" 
            style={styles.commonButton} // Ensure this line is present
          />
        </ScrollView>

        {showExpenseDatePicker && (
          <DateTimePicker
            value={expenseDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowExpenseDatePicker(false);
              if (selectedDate) setExpenseDate(selectedDate);
            }}
          />
        )}

        {showValidityDatePicker && (
          <DateTimePicker
            value={validityDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowValidityDatePicker(false);
              if (selectedDate) setValidityDate(selectedDate);
            }}
          />
        )}
      </LinearGradient>
      <CustomAlert
        visible={alertVisible}
        title={alertMessage}
        message=""
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingTop: 0,
  },
  statusBarTime: {
    position: 'absolute',
    top: 29.55,
    left: width * 0.08,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: 33,
    marginTop: 120,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: '#B9B9B9',
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingBottom: 8,
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  rating: {
    alignSelf: 'flex-start',
    marginBottom: -10, // Add margin to separate from the checkbox
  },
  checkbox: {
    backgroundColor: '#FFFFFF', // Set a visible background color
    borderWidth: 1,              // Add a border to make it visible
    borderColor: '#FFFFFF',      // Set border color
    // ...existing styles...
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Adjust as needed
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  button: {
    marginBottom: 100,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
  categoryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 40,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: hp(7.5),
    left: wp(5.3),
    right: wp(5.3),
    zIndex: 1,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -wp(5.3), // Adjust margin to center the title
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customButton: {
    width: '90%', // Adjust the width to ensure the button is not cut off
    alignSelf: 'center', // Center the button horizontally
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp(5), // Move the button container lower on the screen
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  commonButton: {
    width: '85%', // Ensure both buttons take up the same width
    alignSelf: 'center',
    marginBottom: hp(2), // Add margin to separate buttons
  },
});

export default AddExpenseScreen;