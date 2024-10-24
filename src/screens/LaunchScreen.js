import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg'; // Importando SVG para gradiente no texto
import AuthScreenLayout from '../components/AuthScreenLayout'; 
import CustomButton from '../components/CustomButton'; 

const { width } = Dimensions.get('window');

const LaunchScreen = ({ navigation }) => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'MONEYMAP'; // Texto completo

  useEffect(() => {
    let currentIndex = 0;
    const typeWriter = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        currentIndex++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          setDisplayedText('');
          currentIndex = 0;
          setTimeout(typeWriter, 300); // Reinicia o efeito
        }, 10000); // Pausa antes de reiniciar a animação
      }
    };

    const timeoutId = setTimeout(typeWriter, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AuthScreenLayout logoSource={require('../../assets/logo.png')}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem Vindo ao</Text>
        <View style={styles.subtitleContainer}>
          <Svg height="100" width={width * 0.9}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FF73D8" stopOpacity="1" />
                <Stop offset="1" stopColor="#4E95FF" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <SvgText
              fill="url(#grad)"
              fontSize="55"
              fontWeight="bold"
              x="55%" // Centraliza horizontalmente
              y="50%" // Centraliza verticalmente
              textAnchor="middle" // Ancora o texto ao centro
              alignmentBaseline="middle" // Alinha o texto verticalmente ao meio
            >
              {displayedText}
            </SvgText>
          </Svg>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            label="Já tenho conta"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
          <CustomButton
            label="Crie sua conta"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.button}
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
};

export default LaunchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: -200,
    textAlign: 'left',
    fontSize: 30,
    fontWeight: '400',
    lineHeight: 36,
    background: 'linear-gradient(146.2deg, #FF73D8 9.38%, #8712CE 47.4%, #4E95FF 84.91%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  subtitleContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    position: 'absolute',
    bottom: 0,
  },
  button: {
    marginVertical: 10,
    width: 315,
    height: 72,
  },
});