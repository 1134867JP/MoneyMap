import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationScreen = () => {
  const notifications = [
    { id: 1, name: 'Maria Clara', message: 'Maria Clara enviou R$20,00', status: '#20C968' },
    { id: 2, name: 'Maria Clara', message: 'Maria Clara enviou R$50,00', status: '#F7A700' },
    { id: 3, name: 'Maria Clara', message: 'Maria Clara enviou R$30,00', status: '#CECECE' },
    { id: 4, name: 'Maria Clara', message: 'Maria Clara enviou R$25,00', status: '#F7A700' },
    { id: 5, name: 'Maria Clara', message: 'Maria Clara enviou R$40,00', status: '#20C968' },
    { id: 6, name: 'Maria Clara', message: 'Maria Clara enviou R$60,00', status: '#CECECE' },
    { id: 7, name: 'Julio César', message: 'Julio César enviou R$20,00', status: '#F7A700' },
    { id: 8, name: 'Maria Clara', message: 'Maria Clara enviou R$35,00', status: '#20C968' },
    { id: 9, name: 'Maria Clara', message: 'Maria Clara enviou R$45,00', status: '#CECECE' },
    { id: 10, name: 'Maria Clara', message: 'Maria Clara enviou R$55,00', status: '#F7A700' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      <ScrollView style={styles.scrollView}>
        {notifications.map((notification, index) => (
          <View key={notification.id} style={styles.messageContainer}>
            <View style={styles.messageContent}>
              <View style={[styles.profileImage, { backgroundColor: notification.status }]}>
                <View style={[styles.statusDot, { backgroundColor: notification.status }]} />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.name}>{notification.name}</Text>
                <Text style={styles.message}>{notification.message}</Text>
              </View>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="#224477" 
                style={styles.arrow}
              />
            </View>
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.tabBar}>
        <View style={styles.tabBarContent}>
          <MaterialIcons name="account-balance-wallet" size={26} color="#3A3A3A" />
          <MaterialIcons name="notifications" size={24} color="#2B47FC" />
          <MaterialIcons name="person" size={24} color="#3A3A3A" />
        </View>
        <View style={styles.tabBarIndicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%', // Changed from 375 to '100%'
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  title: {
    position: 'absolute',
    width: 279,
    height: 49,
    left: 30,
    top: 92,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 40,
    lineHeight: 49,
    color: '#3A3A3A',
  },
  scrollView: {
    marginTop: 160,
    marginBottom: 92,
  },
  messageContainer: {
    width: '100%', // Changed from 315 to '100%'
    height: 76,
    paddingHorizontal: 30, // Added padding to maintain the same left margin
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 14.359,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 3.2,
      height: 1.6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.8,
    elevation: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0.923077,
    borderColor: '#FFFFFF',
    position: 'absolute',
    right: -2,
    top: -2,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
    marginBottom: 5,
  },
  message: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    lineHeight: 20,
    color: '#2743FD',
  },
  arrow: {
    transform: [{ rotate: '180deg' }],
  },
  separator: {
    height: 1,
    backgroundColor: '#DEE1EF',
    marginTop: 15,
  },
  tabBar: {
    position: 'absolute',
    width: 375,
    height: 92,
    left: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 15,
  },
  tabBarIndicator: {
    position: 'absolute',
    width: 134,
    height: 10,
    left: 120,
    bottom: 9,
    backgroundColor: '#000000',
    borderRadius: 5,
  },
});

export default NotificationScreen;