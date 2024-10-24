import React from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AuthScreenLayout = ({ children, title, logoSource }) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Elipses de fundo */}
        <View style={styles.shapes}>
          <LinearGradient
            colors={['rgba(248, 47, 216, 0.52)', '#F82FD8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ellipse, styles.ellipse5]}
          />
          <LinearGradient
            colors={['rgba(248, 47, 216, 0.52)', '#2F56F8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ellipse, styles.ellipse4]}
          />
          <LinearGradient
            colors={['#5264F9', '#3AF9EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ellipse, styles.ellipse3]}
          />
        </View>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={logoSource}  // Substituir pelo logo da aplicação
            style={styles.logo}
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>{title}</Text>

        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreenLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 150, // Ajuste conforme necessário para posicionar a logo corretamente
  },
  shapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  ellipse: {
    position: 'absolute',
    borderRadius: 200,
  },
  ellipse5: {
    width: 352,
    height: 352,
    left: -12,
    top: -106,
  },
  ellipse4: {
    width: 352,
    height: 352,
    left: -43,
    top: -56,
  },
  ellipse3: {
    width: 352,
    height: 352,
    left: -74,
    top: -84,
  },
  logoContainer: {
    position: 'absolute',
    top: 150,
    left: width * 0.085,
    alignItems: 'left',
    width: '100%',
  },
  logo: {
    width: 60, 
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    alignSelf: 'flex-start',
    paddingLeft: width * 0.075,
  },
});