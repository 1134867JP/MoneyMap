import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const AddExpenseScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [validityDate, setValidityDate] = useState(new Date());
  const [showExpenseDatePicker, setShowExpenseDatePicker] = useState(false);
  const [showValidityDatePicker, setShowValidityDatePicker] = useState(false);
  const [addLocation, setAddLocation] = useState(false);

  const handleAddExpense = async () => {
    if (!name || !category || !amount || !expenseDate) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const expenseData = {
      name,
      category,
      amount: parseFloat(amount),
      expense_date: expenseDate,
      validity_date: validityDate,
      add_location: addLocation,
    };

    const { error } = await supabase
      .from('expenses')
      .insert([expenseData]);

    if (error) {
      console.error('Erro ao adicionar despesa:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a despesa.');
    } else {
      Alert.alert('Sucesso', 'Despesa adicionada com sucesso!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4960F9', '#1937FE']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Despesa</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Nome da Despesa*</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Conta de Luz"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#B9B9B9"
        />

        <Text style={styles.label}>Categoria*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            <Picker.Item label="Alimentação" value="Alimentação" />
            <Picker.Item label="Transporte" value="Transporte" />
            <Picker.Item label="Habitação" value="Habitação" />
            {/* Adicione outras categorias conforme necessário */}
          </Picker>
        </View>

        <Text style={styles.label}>Valor*</Text>
        <TextInput
          style={styles.input}
          placeholder="R$0,00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#B9B9B9"
        />

        <Text style={styles.label}>Data da Despesa*</Text>
        <TouchableOpacity onPress={() => setShowExpenseDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="20/12/2000"
            value={expenseDate.toLocaleDateString()}
            editable={false}
            placeholderTextColor="#B9B9B9"
          />
        </TouchableOpacity>
        {showExpenseDatePicker && (
          <DateTimePicker
            value={expenseDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || expenseDate;
              setShowExpenseDatePicker(Platform.OS === 'ios');
              setExpenseDate(currentDate);
            }}
          />
        )}

        <Text style={styles.label}>Validade da Despesa</Text>
        <TouchableOpacity onPress={() => setShowValidityDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="20/12/2001"
            value={validityDate.toLocaleDateString()}
            editable={false}
            placeholderTextColor="#B9B9B9"
          />
        </TouchableOpacity>
        {showValidityDatePicker && (
          <DateTimePicker
            value={validityDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || validityDate;
              setShowValidityDatePicker(Platform.OS === 'ios');
              setValidityDate(currentDate);
            }}
          />
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Deseja adicionar local de Despesa?</Text>
          <Switch
            value={addLocation}
            onValueChange={(value) => setAddLocation(value)}
          />
        </View>

        <CustomButton
          label="Adicionar"
          onPress={handleAddExpense}
          gradientColors={['#4960F9', '#1937FE']}
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
        />

        <CustomButton
          label="Finalizar"
          onPress={() => navigation.goBack()}
          gradientColors={['#FFFFFF', '#FFFFFF']}
          textColor="#4960F9"
          iconColor="#4960F9"
        />
      </View>
    </View>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 20,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: '#4960F9',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B9B9B9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    color: '#000000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#B9B9B9',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    color: '#000000',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});