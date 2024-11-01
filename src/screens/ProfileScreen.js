import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions, // Import Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { userAuth } from '../contexts/userContext';

const { width } = Dimensions.get('window'); // Get the width of the screen

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('@Exemplo');
  const [fullName, setFullName] = useState('Exemplo Teste');
  const [birthdate, setBirthdate] = useState('20/09/2000');
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { userId, userProfile, setUserProfile } = userAuth();

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '@Exemplo');
      setFullName(userProfile.full_name || 'Exemplo Teste');
      setBirthdate(userProfile.birthdate || '20/09/2000');
      setProfileImage(userProfile.profile_image || null);
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (userId) {
      const updates = {
        username,
        full_name: fullName,
        birthdate,
        profile_image: profileImage,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      } else {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
        setUserProfile(updates);
      }
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
      setProfileImage(uri);
      // Aqui você implementaria o upload da imagem para seu servidor
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate.toLocaleDateString('pt-BR'));
    }
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
              <Icon name="camera-alt" size={24} color="#3A3A3A" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.statusDot} />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.username}>Exemplo</Text>
        <Text style={styles.onlineStatus}>Online</Text>
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

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
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
    width: '100%', // Adjust to screen width
    height: '100%', // Adjust to screen height
    backgroundColor: '#FFFFFF',
  },
  backgroundColors: {
    position: 'absolute',
    width: 518.24,
    height: 507.06,
    left: 93,
    top: -163.15,
  },
  purpleCircle: {
    position: 'absolute',
    width: 356.91,
    height: 356.91,
    left: 377.83,
    top: -156,
    backgroundColor: '#B52FF8',
    borderRadius: 102.625,
    transform: [{ rotate: '52.94deg' }],
  },
  blueCircle: {
    position: 'absolute',
    width: 350.18,
    height: 350.18,
    left: 467.68,
    top: -163.15,
    backgroundColor: '#40CEF2',
    borderRadius: 102.625,
    transform: [{ rotate: '65.8deg' }],
  },
  title: {
    position: 'absolute',
    width: 112,
    height: 49,
    left: 30,
    top: 90,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 40,
    lineHeight: 49,
    color: '#3A3A3A',
  },
  profileImageContainer: {
    position: 'absolute',
    width: 64,
    height: 64,
    left: 30,
    top: 171,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 23.04,
    shadowColor: '#000',
    shadowOffset: { width: 5.12, height: 2.56 },
    shadowOpacity: 0.25,
    shadowRadius: 14.08,
  },
  statusDot: {
    position: 'absolute',
    width: 12.8,
    height: 12.8,
    left: 51.2,
    top: 51.2,
    backgroundColor: '#20C968',
    borderWidth: 1.28,
    borderColor: '#FFFFFF',
    borderRadius: 6.4,
  },
  userInfo: {
    position: 'absolute',
    left: 102,
    top: 177,
  },
  username: {
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 24,
    color: '#2743FD',
  },
  onlineStatus: {
    fontFamily: 'Montserrat',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 20,
    color: '#2743FD',
    marginTop: 8,
  },
  inputContainer: {
    position: 'absolute',
    width: width - 60, // Adjust to screen width with padding
    left: 30,
  },
  usernameInput: {
    top: 272,
  },
  fullNameInput: {
    top: 354,
  },
  birthdateInput: {
    top: 436,
  },
  label: {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: '#3A3A3A',
    marginBottom: 16,
  },
  input: {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: '#2743FD',
    marginBottom: 8,
  },
  inputBorder: {
    borderBottomWidth: 1,
    borderColor: '#DEE1EF',
  },
  logoutButton: {
    position: 'absolute',
    width: width - 60, // Adjust to screen width with padding
    height: 60, // Reduced height
    left: 30,
    bottom: 122,
    borderWidth: 1,
    borderColor: '#2743FD',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  updateButton: {
    position: 'absolute',
    width: width - 60, // Adjust to screen width with padding
    height: 60, // Same height as logout button
    left: 30,
    bottom: 200, // Positioned above the logout button
    backgroundColor: '#2743FD',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  updateText: {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  logoutText: {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 24,
    color: '#2743FD',
  },
  tabBar: {
    position: 'absolute',
    width: '100%', // Adjust to screen width
    height: 92,
    left: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  tabContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabBarIndicator: {
    position: 'absolute',
    width: 134,
    height: 10,
    left: 121,
    bottom: 10,
    backgroundColor: '#000000',
    borderRadius: 5,
  },
});

export default ProfileScreen;