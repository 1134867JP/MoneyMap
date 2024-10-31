import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddIncomeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [receiveDate, setReceiveDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddIncome = async () => {
    const { error } = await supabase
      .from('incomes')
      .insert([{ name, amount: parseFloat(amount), receive_date: receiveDate }]);

    if (error) {
      console.error('Erro ao adicionar receita:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a receita.');
    } else {
      Alert.alert('Sucesso', 'Receita adicionada com sucesso!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4960F9', '#1937FE']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Receita</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Nome da Receita</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Salário"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#B9B9B9"
        />

        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#B9B9B9"
        />

        <Text style={styles.label}>Data de Recebimento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Selecione a data"
            value={receiveDate.toLocaleDateString()}
            editable={false}
            placeholderTextColor="#B9B9B9"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={receiveDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || receiveDate;
              setShowDatePicker(false);
              setReceiveDate(currentDate);
            }}
          />
        )}

        <CustomButton
          label="Adicionar Receita"
          onPress={handleAddIncome}
          gradientColors={['#4960F9', '#1937FE']}
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

export default AddIncomeScreen;

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
    backgroundColor: '#4960F9',
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
});