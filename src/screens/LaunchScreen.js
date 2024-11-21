import React from 'react';
import { Text, StyleSheet, Dimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg'; 
import AuthScreenLayout from '../components/AuthScreenLayout'; 
import CustomButton from '../components/CustomButton'; 

const { width } = Dimensions.get('window');

const LaunchScreen = ({ navigation }) => {
  return (
    <AuthScreenLayout logoSource={require('../../assets/logo.png')}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao</Text>
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
              x="53%"
              y="50%"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              MONEYMAP
            </SvgText>
          </Svg>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            label="Já tenho conta"
            onPress={() => navigation.navigate('Login')}
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
    fontSize: 30,
    fontWeight: '400',
    color: '#000',
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  subtitleContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    position: 'absolute',
    bottom: 0,
  },
  button: {
    marginBottom: 20,
  },
});
