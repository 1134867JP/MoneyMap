import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { userAuth } from '../contexts/userContext';
import { wp, moderateScale } from '../utils/dimensions'; // Import wp and moderateScale

const { width, height } = Dimensions.get('window'); // Get the width and height of the screen

const ProfileScreen = ({ navigation }) => {
  const { userId, userProfile, setUserProfile, logout } = userAuth(); // Get logout from userAuth
  const [username, setUsername] = useState('@Exemplo');
  const [fullName, setFullName] = useState('Exemplo Teste');
  const [birthdate, setBirthdate] = useState('20/09/2000');
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = (`0${d.getDate()}`).slice(-2);
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '@Exemplo');
      setFullName(userProfile.full_name || 'Exemplo Teste');
      setBirthdate(userProfile.birthdate ? formatDate(userProfile.birthdate) : '20/09/2000');
      setProfileImage(userProfile.profile_image || null);
    }
  }, [userProfile]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Launch');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleUpdateProfile = async () => {
    if (userId) {
      const updates = {
        username,
        full_name: fullName,
        birthdate: new Date(birthdate.split('/').reverse().join('-')).toISOString(), // Convert to ISO format
        profile_image: profileImage,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.log(error)
        Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      } else {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
        setUserProfile(updates);
      }
    } else {
      Alert.alert('Erro', 'ID do usuário é nulo.');
    }
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permissão Necessária', 'É necessária permissão para acessar a galeria.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!pickerResult.cancelled) {
      const { uri } = pickerResult;
      const fileName = uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      });

      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(`public/${userId}/${fileName}`, formData, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        Alert.alert('Erro', 'Não foi possível fazer upload da imagem.');
      } else {
        const imageUrl = supabase.storage
          .from('profile-images')
          .getPublicUrl(`public/${userId}/${fileName}`).publicURL;
        setProfileImage(imageUrl);
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(formatDate(selectedDate));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundColors}>
        <View style={styles.purpleCircle} />
        <View style={styles.blueCircle} />
      </View>

      <Text style={styles.title}>Perfil</Text>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={selectImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: '#e1e1e1' }]}>
              <Icon name="camera-alt" size={30} color="#3A3A3A" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.statusDot} />
      </View>

      <View style={[styles.inputContainer, styles.usernameInput]}>
        <Text style={styles.label}>Nome do Usuário</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#B9B9B9"
        />
        <View style={styles.inputBorder} />
      </View>

      <View style={[styles.inputContainer, styles.fullNameInput]}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#B9B9B9"
        />
        <View style={styles.inputBorder} />
      </View>

      <View style={[styles.inputContainer, styles.birthdateInput]}>
        <Text style={styles.label}>Data de nascimento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.input}>{birthdate}</Text>
        </TouchableOpacity>
        <View style={styles.inputBorder} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.updateText}>Atualizar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
        <Icon name="logout" size={21} color="#2743FD" />
      </TouchableOpacity>

      <View style={styles.tabBar}>
        <View style={styles.tabContent}>
          <Icon name="account-balance-wallet" size={26} color="#3A3A3A" />
          <Icon name="notifications" size={24} color="#3A3A3A" />
          <Icon name="person" size={24} color="#2B47FC" />
        </View>
        <View style={styles.tabBarIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: width, // Adjust to screen width
    height: height, // Adjust to screen height
    backgroundColor: '#FFFFFF',
  },
  backgroundColors: {
    position: 'absolute',
    width: width * 1.3, // Adjust to screen width
    height: height * 0.6, // Adjust to screen height
    right: 0,
    top: -height * 0.2, // Adjust to screen height
  },
  purpleCircle: {
    position: 'absolute',
    width: width * 0.7, // Adjust to screen width
    height: width * 0.7, // Adjust to screen width
    left: width * 0.4, // Adjust to screen width
    top: -height * 0.15, // Adjust to screen height
    backgroundColor: '#B52FF8',
    borderRadius: width * 0.35, // Adjust to screen width
    transform: [{ rotate: '52.94deg' }],
  },
  blueCircle: {
    position: 'absolute',
    width: width * 0.68, // Adjust to screen width
    height: width * 0.68, // Adjust to screen width
    left: width * 0.5, // Adjust to screen width
    top: -height * 0.15, // Adjust to screen height
    backgroundColor: '#40CEF2',
    borderRadius: width * 0.34, // Adjust to screen width
    transform: [{ rotate: '65.8deg' }],
  },
  title: {
    position: 'absolute',
    width: width * 0.3, // Adjust to screen width
    height: height * 0.07, // Adjust to screen height
    left: width * 0.08, // Adjust to screen width
    top: height * 0.1, // Adjust to screen height
    fontWeight: '700',
    fontSize: width * 0.1, // Adjust to screen width
    lineHeight: height * 0.07, // Adjust to screen height
    color: '#3A3A3A',
  },
  profileImageContainer: {
    alignSelf: 'center', // Center the profile image container horizontally
    marginTop: height * 0.17, // Keep the same height
    width: width * 0.3, // Adjust to screen width
    height: width * 0.3, // Adjust to screen width
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.15, // Adjust to screen width
    shadowColor: '#000',
    shadowOffset: { width: width * 0.012, height: height * 0.006 }, // Adjust to screen width and height
    shadowOpacity: 0.25,
    shadowRadius: width * 0.035, // Adjust to screen width
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  statusDot: {
    position: 'absolute',
    width: width * 0.03, // Adjust to screen width
    height: width * 0.03, // Adjust to screen width
    right: 0, // Position it to the right of the profile image
    bottom: 0, // Position it to the bottom of the profile image
    backgroundColor: '#20C968',
    borderWidth: width * 0.003, // Adjust to screen width
    borderColor: '#FFFFFF',
    borderRadius: width * 0.015, // Adjust to screen width
  },
  username: {
    fontWeight: '500',
    fontSize: width * 0.05, // Adjust to screen width
    lineHeight: height * 0.03, // Adjust to screen height
    color: '#2743FD',
  },
  onlineStatus: {
    fontWeight: '300',
    fontSize: width * 0.04, // Adjust to screen width
    lineHeight: height * 0.025, // Adjust to screen height
    color: '#2743FD',
    marginTop: height * 0.01, // Adjust to screen height
  },
  inputContainer: {
    position: 'absolute',
    width: width - 60, // Adjust to screen width with padding
    left: 30,
  },
  usernameInput: {
    top: height * 0.35, // Adjust to screen height
  },
  fullNameInput: {
    top: height * 0.45, // Adjust to screen height
  },
  birthdateInput: {
    top: height * 0.55, // Adjust to screen height
  },
  label: {
    fontWeight: '400',
    fontSize: width * 0.035, // Adjust to screen width
    lineHeight: height * 0.02, // Adjust to screen height
    color: '#3A3A3A',
    marginBottom: height * 0.02, // Adjust to screen height
  },
  input: {
    fontWeight: '400',
    fontSize: width * 0.035, // Adjust to screen width
    lineHeight: height * 0.02, // Adjust to screen height
    color: '#2743FD',
    marginBottom: height * 0.01, // Adjust to screen height
  },
  inputBorder: {
    borderBottomWidth: 1,
    borderColor: '#DEE1EF',
  },
  logoutButton: {
    position: 'absolute',
    width: wp('85%'), // Match the width of the larger buttons on HomeScreen
    height: height * 0.06, // Reduce the height
    left: wp('7%'), // Adjust to center the button
    bottom: height * 0.12, // Reduce the distance from the bottom
    borderWidth: 1,
    borderColor: '#2743FD',
    borderRadius: moderateScale(40), // Match the border radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6%'), // Adjust to screen width
  },
  updateButton: {
    position: 'absolute',
    width: wp('85%'), // Match the width of the larger buttons on HomeScreen
    height: height * 0.06, // Reduce the height
    left: wp('7%'), // Adjust to center the button
    bottom: height * 0.20, // Reduce the distance from the bottom
    backgroundColor: '#2743FD',
    borderRadius: moderateScale(40), // Match the border radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('6%'), // Adjust to screen width
  },
  updateText: {
    fontWeight: '400',
    fontSize: width * 0.04, // Adjust to screen width
    lineHeight: height * 0.03, // Adjust to screen height
    color: '#FFFFFF',
  },
  tabBar: {
    position: 'absolute',
    width: width, // Adjust to screen width
    height: height * 0.1, // Adjust to screen height
    left: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.01 }, // Adjust to screen height
    shadowOpacity: 0.1,
    shadowRadius: width * 0.05, // Adjust to screen width
  },
  tabContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabBarIndicator: {
    position: 'absolute',
    width: width * 0.34, // Adjust to screen width
    height: height * 0.01, // Adjust to screen height
    left: width * 0.3, // Adjust to screen width
    bottom: height * 0.01, // Adjust to screen height
    backgroundColor: '#000000',
    borderRadius: width * 0.025, // Adjust to screen width
  },
});

export default ProfileScreen;