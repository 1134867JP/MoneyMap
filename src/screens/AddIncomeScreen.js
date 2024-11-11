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
import CustomAlert from '../components/CustomAlert'; // Add this import
import { wp, hp, scale, verticalScale, moderateScale } from '../utils/dimensions';

const AddIncomeScreen = ({ navigation, route }) => {
  const { income, isEditing, title } = route.params || {};
  const [name, setName] = useState(income?.category || '@Exemplo_teste');
  const [category, setCategory] = useState(income?.category || '');
  const [amount, setAmount] = useState(income ? `R$${Math.abs(income.amount).toFixed(2)}` : 'R$0,00');
  const [incomeDate, setIncomeDate] = useState(income ? new Date(income.date) : new Date('2000-12-20'));
  const [validityDate, setValidityDate] = useState(new Date('2001-12-20'));
  const [showIncomeDatePicker, setShowIncomeDatePicker] = useState(false);
  const [showValidityDatePicker, setShowValidityDatePicker] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // Add this state
  const [alertMessage, setAlertMessage] = useState(''); // Add this state

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
        <Text style={styles.title}>{isEditing ? title : 'Adicionar Receita'}</Text>
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
          {isEditing && (
            <TouchableOpacity
              style={[styles.deleteButton, styles.commonButton]}
              onPress={() => {
                console.log('Receita excluída:', { name, category, amount, incomeDate, validityDate });
                setAlertMessage('Receita excluída com sucesso!');
                setAlertVisible(true); // Show the custom alert
              }}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          )}
          <CustomButton
            label={isEditing ? "Salvar" : "Adicionar"}
            onPress={() => {
              if (isEditing) {
                console.log('Receita salva:', { name, category, amount, incomeDate, validityDate });
                setAlertMessage('Receita salva com sucesso!');
              } else {
                console.log('Receita adicionada:', { name, category, amount, incomeDate, validityDate });
                setAlertMessage('Receita adicionada com sucesso!');
              }
              setAlertVisible(true); // Show the custom alert
              navigation.goBack();
            }}
            style={styles.customButton} // Ensure this line is present
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
        <CustomAlert
          visible={alertVisible}
          title={alertMessage}
          message=""
          onClose={() => setAlertVisible(false)}
        />
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
  formContainer: {
    paddingHorizontal: wp(8),
    marginTop: hp(8),
  },
  scrollContent: {
    paddingBottom: hp(10),
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: hp(3),
  },
  label: {
    color: '#B9B9B9',
    fontSize: scale(14),
    fontWeight: '700',
    marginBottom: hp(1),
  },
  input: {
    color: '#FFFFFF',
    fontSize: scale(14),
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
    bottom: hp(5), // Move the button container lower on the screen
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  commonButton: {
    width: '85%', // Ensure both buttons take up the same width
    alignSelf: 'center',
    marginBottom: hp(2), // Add magin to separate buttons
  },
  customButton: {
    width: '90%', // Adjust the width to ensure the button is not cut off
    alignSelf: 'center', // Center the button horizontally
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
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: hp(8), // Add marginTop to move the title down
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: hp(16),
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddIncomeScreen;