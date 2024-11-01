import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CustomTabBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabBarItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={26} color="#2B47FC" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarItem} onPress={() => navigation.navigate('Notification')}>
        <Ionicons name="notifications" size={26} color="#3A3A3A" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person" size={26} color="#3A3A3A" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 92,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 }, // Sombra na parte superior
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5, // Para Android
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBarIndicator: {
    position: 'absolute',
    top: -10,
    left: (width / 2) - 67,
    width: 134,
    height: 10,
    backgroundColor: '#000000',
    borderRadius: 5,
  },
  tabBarItem: {
    alignItems: 'center',
  },
});