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
import { CheckBox } from 'react-native-elements';
import { AirbnbRating } from 'react-native-ratings';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { wp, hp, moderateScale } from '../utils/dimensions';
import CustomAlert from '../components/CustomAlert'; // Add this import

const { width } = Dimensions.get('window');

const AddExpenseScreen = ({ navigation }) => {
  const route = useRoute();
  const [name, setName] = useState(route.params?.expense?.category);
  const [category, setCategory] = useState(route.params?.expense?.category || '');
  const [amount, setAmount] = useState(route.params?.expense ? `R$${Math.abs(route.params.expense.amount).toFixed(2)}` : 'R$0,00');
  const [expenseDate, setExpenseDate] = useState(route.params?.expense ? new Date(route.params.expense.date) : new Date('2000-12-20'));
  const [validityDate, setValidityDate] = useState(new Date('2001-12-20'));
  const [showExpenseDatePicker, setShowExpenseDatePicker] = useState(false);
  const [showValidityDatePicker, setShowValidityDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // Add this state
  const [alertMessage, setAlertMessage] = useState(''); // Add this state
  const nav = useNavigation();
  const isEditing = route.params?.isEditing || false;
  const fromExpenseStatement = route.params?.fromExpenseStatement || false;

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
                <Picker.Item label="Own data" value="own_data" />
                <Picker.Item label="Employee reporting to him" value="employee_reporting" />
                <Picker.Item label="All employees" value="all_employees" />
              </Picker>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CategoryMaintenance', { isAdding: true })}
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
              onChangeText={setAmount}
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
                onPress={() => nav.navigate('MapExpenseScreen', { fromAddExpense: true })}
              >
                <Icon name="map" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <CheckBox
              title="Usar localização atual"
              checked={useCurrentLocation}
              onPress={() => {
                setUseCurrentLocation(!useCurrentLocation);
                if (useCurrentLocation) {
                  setLocation('');
                }
              }}
              containerStyle={styles.checkbox}
              textStyle={styles.checkboxText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Avaliação</Text>
            <AirbnbRating
              count={5}
              reviews={[]}
              defaultRating={0}
              size={20}
              onFinishRating={setRating}
              starContainerStyle={styles.rating}
            />
          </View>

          {isEditing && fromExpenseStatement && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                console.log('Despesa excluída:', { name, category, amount, expenseDate, validityDate });
                setAlertMessage('Despesa excluída com sucesso!');
                setAlertVisible(true); // Show the custom alert
              }}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          )}
          <CustomButton
            label={isEditing && fromExpenseStatement ? "Salvar" : "Adicionar"}
            onPress={() => {
              if (isEditing && fromExpenseStatement) {
                console.log('Despesa salva:', { name, category, amount, expenseDate, validityDate });
                setAlertMessage('Despesa salva com sucesso!');
              } else {
                console.log('Despesa adicionada:', { name, category, amount, expenseDate, validityDate });
                setAlertMessage('Despesa adicionada com sucesso!');
              }
              setAlertVisible(true); // Show the custom alert
            }}
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
    marginTop: -40,
    alignSelf: 'flex-start',
    marginBottom: -40
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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