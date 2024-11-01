import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Svg, { Path, G, ClipPath, Defs, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CustomTabBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [currentRoute, setCurrentRoute] = useState(route.name);

  useEffect(() => {
    setCurrentRoute(route.name);
  }, [route]);

  const getIconColor = (routeName) => {
    return currentRoute === routeName ? '#2B47FC' : '#3A3A3A';
  };

  const getIconName = (routeName) => {
    switch (routeName) {
      case 'Home':
        return currentRoute === 'Home' ? 'home' : 'home-outline';
      case 'Notification':
        return currentRoute === 'Notification' ? 'notifications' : 'notifications-outline';
      case 'Profile':
        return currentRoute === 'Profile' ? 'person' : 'person-outline';
      default:
        return 'circle';
    }
  };

  const renderIndicator = () => (
    <Svg width="26" height="38" viewBox="0 0 26 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#clip0_1_2054)">
        <Path d="M22.6 12.2V5.79999H17.8H7.4H3.4C2.0744 5.79999 1 4.72559 1 3.39999V20.2C1 21.9672 2.4328 23.4 4.2 23.4H22.6V17" stroke="#2B47FC" strokeWidth="1.05" strokeLinecap="square"/>
        <Path fillRule="evenodd" clipRule="evenodd" d="M25 17H19.4C18.0744 17 17 15.9256 17 14.6C17 13.2744 18.0744 12.2 19.4 12.2H25V17Z" stroke="#2B47FC" strokeWidth="1.05" strokeLinecap="square"/>
        <Path d="M17.8 2.6V1H3.4C2.0744 1 1 2.0744 1 3.4C1 4.7256 2.0744 5.8 3.4 5.8" stroke="#2B47FC" strokeWidth="1.05" strokeLinecap="square"/>
      </G>
      <Path d="M16 35.5C16 36.8807 14.8807 38 13.5 38C12.1193 38 11 36.8807 11 35.5C11 34.1193 12.1193 33 13.5 33C14.8807 33 16 34.1193 16 35.5Z" fill="#2B47FC"/>
      <Defs>
        <ClipPath id="clip0_1_2054">
          <Rect width="26" height="24" fill="white"/>
        </ClipPath>
      </Defs>
    </Svg>
  );

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabBarItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name={getIconName('Home')} size={26} color={getIconColor('Home')} />
        {currentRoute === 'Home' && renderIndicator()}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarItem} onPress={() => navigation.navigate('Notification')}>
        <Ionicons name={getIconName('Notification')} size={26} color={getIconColor('Notification')} />
        {currentRoute === 'Notification' && renderIndicator()}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBarItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name={getIconName('Profile')} size={26} color={getIconColor('Profile')} />
        {currentRoute === 'Profile' && renderIndicator()}
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
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});