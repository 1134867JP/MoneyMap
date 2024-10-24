import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, Alert, Keyboard, Animated } from 'react-native';
import AuthScreenLayout from '../components/AuthScreenLayout';
import { supabase } from '../services/supabaseClient'; // Importar o cliente do Supabase
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [footerBottom, setFooterBottom] = useState(new Animated.Value(20)); // Estado para controlar a posição do botão

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

  const handleSendEmail = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setAlertVisible(true);
    }
  };

  return (
    <AuthScreenLayout title="Recuperação de Senha" logoSource={require('../../assets/logo.png')}>
      <Text style={styles.description}>Insira o e-mail para recebimento do link de redefinição de senha</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#AAA"
        />
        <Icon name="check-circle" size={20} color="#6200ee" style={styles.iconRight} />
      </View>
      <Animated.View style={[styles.buttonContainer, { bottom: footerBottom }]}>
        <CustomButton label="Enviar Email" onPress={handleSendEmail} style={styles.button}/>
      </Animated.View>

      <CustomAlert
        visible={alertVisible}
        title="Sucesso"
        message="E-mail de recuperação enviado!"
        onClose={() => {
          setAlertVisible(false);
          navigation.navigate('Login');
        }}
      />
    </AuthScreenLayout>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20, // Adiciona padding horizontal para garantir que o texto não ultrapasse a margem
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#0072ff',
    paddingBottom: 5,
    marginBottom: 20,
    width: width * 0.85,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    width: '100%',
  },
  iconRight: {
    alignSelf: 'flex-end',
    marginTop: -30,
    marginRight: 10,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    width: 315,
    height: 72,
  },
});