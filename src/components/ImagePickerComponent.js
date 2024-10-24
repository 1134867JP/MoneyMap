import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ImagePickerComponent = ({ profileImage, setProfileImage }) => {
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Image selected:', result.assets[0].uri); // Log para depuração
        setProfileImage({ uri: result.assets[0].uri });
      } else {
        console.log('Image selection cancelled'); // Log para depuração
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.profileImageContainer} onPress={selectImage}>
      {profileImage ? (
        <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
      ) : (
        <View style={styles.profileImagePlaceholder}>
          <Icon name="camera-alt" size={40} color="#3A3A3A" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
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
});