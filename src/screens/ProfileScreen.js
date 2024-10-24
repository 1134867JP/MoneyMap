import React from 'react';
import { View, Text, Button } from 'react-native';
import { globalStyles } from '../styles';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Perfil</Text>

      <View style={globalStyles.card}>
        <Text style={globalStyles.cardText}>Nome de Usuário</Text>
        <Text>@Exemplo_teste</Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.cardText}>Nome Completo</Text>
        <Text>Exemplo Teste</Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.cardText}>Data de Nascimento</Text>
        <Text>20/09/2000</Text>
      </View>

      <Button title="Sair" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default ProfileScreen;
