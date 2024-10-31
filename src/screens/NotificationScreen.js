// src/screens/NotificationsScreen.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function NotificationsScreen({ user_id }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar notificações:', error);
    } else {
      setNotifications(data);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text>{item.message}</Text>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  notification: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  date: { fontSize: 12, color: '#666' },
});
