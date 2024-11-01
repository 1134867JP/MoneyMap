import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import AuthScreenLayout from '../components/AuthScreenLayout';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../components/BackButton';
import { supabase } from '../services/supabaseClient'; // Importar o cliente do Supabase
import CustomAlert from '../components/CustomAlert'; // Certifique-se de que o caminho está correto
import { userAuth } from '../contexts/userContext';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [footerBottom, setFooterBottom] = useState(new Animated.Value(20));
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { fetchUserProfile } = userAuth();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(footerBottom, {
        toValue: 5,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(footerBottom, {
        toValue: 20,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [footerBottom]);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage('Por favor, preencha todos os campos.');
      setAlertVisible(true);
      return;
    }

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log(error);
      let errorMessage = 'Ocorreu um erro. Por favor, tente novamente.';
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
          break;
        case 'Email not confirmed':
          errorMessage = 'O email fornecido não foi confirmado. Verifique sua caixa de entrada.';
          break;
        default:
          errorMessage = 'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.';
          break;
      }
      setAlertMessage(errorMessage);
      setAlertVisible(true);
    } else {
      const userData = data.user;
      await fetchUserProfile(userData); // Fetch and store user profile data in context
      navigation.navigate('HomeTabs');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <AuthScreenLayout title="Login" logoSource={require('../../assets/logo.png')}>
              <BackButton />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Exemplo@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#AAA"
                />
                <Icon name="check-circle" size={20} color="#6200ee" style={styles.iconRight} />
              </View>

              {/* Campo de Senha */}
              <View style={[styles.inputContainer, styles.passwordContainer]}>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#AAA"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin} // Adiciona a funcionalidade de login ao pressionar "OK"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#6200ee"
                    style={styles.iconRight}
                  />
                </TouchableOpacity>
              </View>

              {/* Link para recuperação de senha ou cadastro */}
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>
                  Esqueceu sua senha? Clique aqui!
                </Text>
              </TouchableOpacity>
            </AuthScreenLayout>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Botão de login fixo na parte inferior */}
      <Animated.View style={[styles.footer, { bottom: footerBottom }]}>
        <CustomButton label="Entrar" onPress={handleLogin} />
      </Animated.View>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={'Atenção'}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#0072ff',
    paddingBottom: 5,
    marginBottom: 20,
    width: width * 0.85,
  },
  passwordContainer: {
    marginBottom: 10, // Reduz a margem inferior do campo de senha
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'left', // Alinha o texto à esquerda
  },
  iconRight: {
    marginLeft: 10,
  },
  forgotPasswordButton: {
    marginLeft: 30,
    paddingVertical: 10,
    alignSelf: 'flex-start', // Alinha o botão à esquerda
  },
  forgotPasswordText: {
    color: '#0072ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent', // Remove o fundo para evitar divisória
  },
  button: {
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12, // Reduced font size
  },
});