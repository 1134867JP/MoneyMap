import React, { useEffect } from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CameraPermissionScreen = () => {
  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    let permission;

    if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.CAMERA;
    } else {
      permission = PERMISSIONS.IOS.CAMERA;
    }

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      Alert.alert('Permissão concedida', 'Você pode usar a câmera');
    } else {
      Alert.alert('Permissão negada', 'Você não pode usar a câmera');
    }
  };

  return (
    <View>
      <Text>Solicitação de Permissão de Câmera</Text>
      <Button title="Solicitar Permissão" onPress={requestCameraPermission} />
    </View>
  );
};

export default CameraPermissionScreen;