import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import BackButton from '../components/BackButton';
import CustomButton from '../components/CustomButton';
import { validateForm } from '../services/helpers';
import { signUpUser } from '../services/userService';
import { wp, hp } from '../utils/dimensions'; // Import utility functions
import { userAuth } from '../contexts/userContext'; // Corrected import statement

const { width } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
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

  const { fetchUserProfile, setUserProfile } = userAuth(); // Use fetchUserProfile and setUserProfile from context

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

    if (valid) {
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('username', username);
        formData.append('fullName', fullName);
        formData.append('birthdate', birthdate);
        if (profileImage) {
          const uriParts = profileImage.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          formData.append('profileImage', {
            uri: profileImage.uri,
            name: `profile.${fileType}`,
            type: `image/${fileType}`,
          });
        }

        const response = await fetch('http://10.0.2.2:3000/signup', { // Use the correct IP for Android emulator
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const result = await response.json();

        if (response.ok) {
          await fetchUserProfile(result.user); // Fetch and store user profile data in context
          setUserProfile(result.profile); // Store profile data in context
          Alert.alert('Sucesso', 'Conta criada com sucesso!');
          navigation.navigate('HomeTabs'); // Navigate to Home screen
        } else {
          let errorMessage = result.error || 'Ocorreu um erro. Por favor, tente novamente.';
          if (result.error === 'Usuário já registrado. Por favor, faça login.') {
            errorMessage = 'Usuário já registrado. Por favor, faça login.';
            navigation.navigate('Login'); // Navigate to Login screen
          }
          Alert.alert('Erro', errorMessage);
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
      setShowDatePicker(false);
      setBirthdate(currentDate.toLocaleDateString('pt-BR'));
    } else {
      setShowDatePicker(false);
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Image selected:', result.assets[0].uri);
        setProfileImage({ uri: result.assets[0].uri });
      } else {
        console.log('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            colors={['#4960F9', '#1937FE']}
            style={styles.backgroundGradient}
          >
            <View style={styles.container}>
              <View style={styles.backButtonContainer}>
                <BackButton color="white" />
              </View>
              <View style={styles.purpleCircle} />
              <View style={styles.blueCircle} />
              <TouchableOpacity style={styles.profileImageContainer} onPress={selectImage}>
                {profileImage ? (
                  <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Icon name="camera-alt" size={40} color="#3A3A3A" />
                  </View>
                )}
              </TouchableOpacity>
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
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: hp(7.5), // Adjusted to match AddIncomeScreen
    left: wp(5.3), // Adjusted to match AddIncomeScreen
    zIndex: 1,
  },
  purpleCircle: {
    position: 'absolute',
    width: 106,
    height: 106,
    left: width / 2 - 53,
    top: 84,
    backgroundColor: '#B52FF8',
    borderRadius: 36,
    transform: [{ rotate: '33deg' }],
  },
  blueCircle: {
    position: 'absolute',
    width: 104,
    height: 104,
    left: width / 2 - 52,
    top: 85,
    backgroundColor: '#40CEF2',
    borderRadius: 36,
    transform: [{ rotate: '57deg' }],
  },
  button: {
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12, // Reduced font size
  },
  profileImageContainer: {
    position: 'absolute',
    width: 146.63,
    height: 146.63,
    left: Dimensions.get('window').width / 2 - 73.315,
    top: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 36,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 8, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 22,
  },
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
  imagePickerText: {
    color: 'blue',
    marginBottom: 20,
  },
});