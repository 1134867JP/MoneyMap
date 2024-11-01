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

const { width } = Dimensions.get('window');

const AddExpenseScreen = ({ navigation }) => {
  const [name, setName] = useState('@Exemplo_teste');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('R$0,00');
  const [expenseDate, setExpenseDate] = useState(new Date('2000-12-20'));
  const [validityDate, setValidityDate] = useState(new Date('2001-12-20'));
  const [showExpenseDatePicker, setShowExpenseDatePicker] = useState(false);
  const [showValidityDatePicker, setShowValidityDatePicker] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4960F9', '#1937FE']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.statusBarTime}>9:41</Text>

        <BackButton/>
        
        <ScrollView style={styles.formContainer}>
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
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma categoria" value="" />
              <Picker.Item label="Own data" value="own_data" />
              <Picker.Item label="Employee reporting to him" value="employee_reporting" />
              <Picker.Item label="All employees" value="all_employees" />
            </Picker>
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

          <CustomButton
            label="Adicionar"
            onPress={() => {
              console.log('Despesa adicionada:', { name, category, amount, expenseDate, validityDate });
            }}
            style={styles.button}
          />

          <CustomButton
            label="Finalizar"
            onPress={() => {
              console.log('Finalizado!');
              navigation.goBack();
            }}
            style={styles.button}
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
    marginTop: 138,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: '#B9B9B9',
    fontSize: 14,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingBottom: 8,
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    marginBottom: 20,
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12, // Reduced font size
  },
});

export default AddExpenseScreen;