import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import BackButton from '../components/BackButton';
import { wp, hp, scale, verticalScale, moderateScale } from '../utils/dimensions'; // Import utility functions

const { width } = Dimensions.get('window');

const AddIncomeScreen = ({ navigation }) => {
  const [name, setName] = useState('@Exemplo_teste');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('R$0,00');
  const [incomeDate, setIncomeDate] = useState(new Date('2000-12-20'));
  const [validityDate, setValidityDate] = useState(new Date('2001-12-20'));
  const [showIncomeDatePicker, setShowIncomeDatePicker] = useState(false);
  const [showValidityDatePicker, setShowValidityDatePicker] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4960F9', '#1937FE']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.backButtonContainer}>
          <BackButton color="white" />
        </View>
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Receita*</Text>
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
                <Picker.Item label="Laranja" value="Laranja" />
                <Picker.Item label="Marrom" value="Marrom" />
                <Picker.Item label="Cinza" value="Cinza" />
                <Picker.Item label="Preto" value="Preto" />
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
            <Text style={styles.label}>Data da Receita*</Text>
            <TouchableOpacity onPress={() => setShowIncomeDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={incomeDate.toLocaleDateString()}
                editable={false}
                placeholderTextColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <CustomButton
            label="Finalizar"
            onPress={() => {
              console.log('Finalizado!');
              navigation.goBack();
            }}
            style={[styles.button]}
            gradientColors={['#FFFFFF', '#FFFFFF']} // Set gradient colors to white
            textColor="#1937FE" // Set text color to black for contrast
            iconColor="#1937FE" // Set icon color to black for contrast
          />
        </View>

        {showIncomeDatePicker && (
          <DateTimePicker
            value={incomeDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowIncomeDatePicker(false);
              if (selectedDate) setIncomeDate(selectedDate);
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
    top: verticalScale(29.55),
    left: wp(8),
    fontSize: scale(15),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: wp(8.8),
    marginTop: hp(17),
  },
  scrollContent: {
    paddingBottom: hp(10), // Add padding to the bottom of the ScrollView
    flexGrow: 1, // Ensure the ScrollView takes up the remaining space
  },
  inputGroup: {
    marginBottom: hp(3),
  },
  label: {
    color: '#B9B9B9',
    fontSize: scale(14),
    fontFamily: 'Montserrat',
    fontWeight: '700',
    marginBottom: hp(1),
  },
  input: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontFamily: 'Montserrat',
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingBottom: hp(1),
  },
  categoryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp(5), // Position the button container at the bottom
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: scale(12),
  },
  backButtonContainer: {
    position: 'absolute',
    top: hp(7.5),
    left: wp(5.3),
    zIndex: 1,
  },
});

export default AddIncomeScreen;