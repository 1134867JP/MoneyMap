import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../components/CustomButton';
import { userAuth } from '../contexts/userContext';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { userId } = userAuth(); // Certifique-se de que está obtendo o userId corretamente

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        console.log('userId não está disponível ainda');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, birthdate, profile_image') // Selecione os campos necessários
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        Alert.alert('Erro', 'Não foi possível carregar o perfil.');
      } else if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
        setBirthdate(data.birthdate || '');
        setProfileImage(data.profile_image || null);
      }
    };

    fetchProfile();
  }, [userId]);

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
      const fileExt = uri.substring(uri.lastIndexOf('.') + 1);
      const fileName = `${userId}.${fileExt}`;
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: fileName,
        type: `image/${fileExt}`,
      });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData);

      if (uploadError) {
        Alert.alert('Erro', 'Não foi possível fazer upload da imagem.');
      } else {
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        setProfileImage(data.publicURL);
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = selectedDate.toISOString().split('T')[0];
      setBirthdate(date);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <TouchableOpacity style={styles.profileImageContainer} onPress={selectImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Icon name="camera-alt" size={40} color="#3A3A3A" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.inputErrorContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome de usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome de usuário"
            value={username}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize="none"
            placeholderTextColor="#B9B9B9"
          />
        </View>
      </View>

      <View style={styles.inputErrorContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            autoCapitalize="words"
            placeholderTextColor="#B9B9B9"
          />
        </View>
      </View>

      <View style={styles.inputErrorContainer}>
        <Text style={styles.label}>Data de nascimento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua data de nascimento"
            value={birthdate}
            editable={false}
            placeholderTextColor="#B9B9B9"
          />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={birthdate ? new Date(birthdate) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <View style={styles.buttonContainer}>
        <CustomButton
          label="Atualizar Perfil"
          onPress={handleUpdateProfile}
          gradientColors={['#FFFFFF', '#FFFFFF']}
          textColor="#4960F9"
          iconColor="#4960F9"
        />

        <CustomButton
          label="Sair"
          onPress={() => navigation.navigate('Login')}
          gradientColors={['#FFFFFF', '#FFFFFF']}
          textColor="#4960F9"
          iconColor="#4960F9"
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4960F9',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e1e1e1',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputErrorContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    paddingBottom: 5,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    width: '100%',
  },
  buttonContainer: {
    marginTop: 100,
  }
});