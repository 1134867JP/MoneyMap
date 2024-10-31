import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import ImagePickerComponent from '../components/ImagePickerComponent';
import SignUpForm from '../components/SignUpForm';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Você não pode usar a câmera');
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
              <BackButton />
              <View style={styles.purpleCircle} />
              <View style={styles.blueCircle} />
              <ImagePickerComponent profileImage={profileImage} setProfileImage={setProfileImage} />
              <SignUpForm navigation={navigation} profileImage={profileImage} />
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
});