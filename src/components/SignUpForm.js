import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';
import { validateForm, uploadImage } from '../services/helpers';
import { supabase } from '../services/supabaseClient';

const { width } = Dimensions.get('window'); // Defina a variável width corretamente

const SignUpForm = ({ navigation, profileImage }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');

  const handleSignUp = async () => {
    const { valid, errors } = validateForm({
      username,
      fullName,
      email,
      password,
      confirmPassword,
      birthdate,
    });

    setUsernameError(errors.usernameError);
    setFullNameError(errors.fullNameError);
    setEmailError(errors.emailError);
    setPasswordError(errors.passwordError);
    setConfirmPasswordError(errors.confirmPasswordError);
    setBirthdateError(errors.birthdateError);

    if (valid) {
      try {
        const profileImageUrl = await uploadImage(profileImage, username);

        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            username,
            fullName,
            birthdate,
            profileImage: profileImageUrl, // Enviar a URL da imagem ou null
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Sucesso', 'Conta criada com sucesso!');
          navigation.navigate('Login');
        } else {
          Alert.alert('Erro', data.error);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Erro', 'Ocorreu um erro. Por favor, tente novamente.');
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      setShowDatePicker(false); // Fechar o DateTimePicker após a seleção
      setBirthdate(currentDate.toLocaleDateString('pt-BR')); // Formate a data para o formato desejado
      setBirthdateError('');
    } else {
      setShowDatePicker(false); // Fechar o DateTimePicker se a seleção for cancelada
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputErrorContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome de usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome de usuário"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError('');
            }}
            onFocus={() => setUsernameError('')}
            autoCapitalize="none"
            placeholderTextColor="#B9B9B9"
          />
        </View>
        {usernameError ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color="red" />
            <Text style={styles.errorText}>{usernameError}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.inputErrorContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setFullNameError('');
            }}
            onFocus={() => setFullNameError('')}
            autoCapitalize="words"
            placeholderTextColor="#B9B9B9"
          />
        </View>
        {fullNameError ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color="red" />
            <Text style={styles.errorText}>{fullNameError}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.inputErrorContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            onFocus={() => setEmailError('')}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#B9B9B9"
          />
        </View>
        {emailError ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color="red" />
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.inputErrorContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            onFocus={() => setPasswordError('')}
            secureTextEntry
            placeholderTextColor="#B9B9B9"
          />
        </View>
        {passwordError ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color="red" />
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.inputErrorContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError('');
            }}
            onFocus={() => setConfirmPasswordError('')}
            secureTextEntry
            placeholderTextColor="#B9B9B9"
          />
        </View>
        {confirmPasswordError ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color="red" />
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.inputErrorContainer}>
        <Text style={styles.label}>Data de nascimento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua data de nascimento"
            value={birthdate}
            editable={false}
            placeholderTextColor="#B9B9B9"
          />
        </TouchableOpacity>
        <View style={styles.inputContainer}/>
      </View>
      {birthdateError ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={16} color="red" />
          <Text style={styles.errorText}>{birthdateError}</Text>
        </View>
      ) : null}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <CustomButton
          label="Finalizar"
          onPress={handleSignUp}
          gradientColors={['#FFFFFF', '#FFFFFF']}
          textColor="#4960F9"
          iconColor="#4960F9"
      />
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 220,
    paddingHorizontal: 30,
  },
  inputErrorContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'column', // Alterado para coluna para acomodar o label acima do TextInput
    alignItems: 'flex-start', // Alinhar os itens à esquerda
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    paddingBottom: 5,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 2, // Ajuste o espaçamento entre o label e o TextInput
  },
  input: {
    flex: 1,
    paddingTop: 5, // Ajuste o espaçamento vertical do TextInput
    fontSize: 16,
    color: '#FFFFFF',
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#4960F9',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});