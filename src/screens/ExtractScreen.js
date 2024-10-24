import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const DespesaExtrato = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.time}>9:41</Text>
      <Text style={styles.title}>Extrato</Text>
      <Text style={styles.subtitle}>Total de Despesas</Text>
      <Text style={styles.amount}>R$1.065,50</Text>
      <Text style={styles.subtitle}>Acompanhe suas despesas</Text>
      <View style={styles.transaction}>
        <Text style={styles.transactionTitle}>Shopping</Text>
        <Text style={styles.transactionAmount}>-R$150</Text>
        <Text style={styles.transactionDate}>15 Mar 2019, 8:20 PM</Text>
      </View>
      <View style={styles.transaction}>
        <Text style={styles.transactionTitle}>Medicine</Text>
        <Text style={styles.transactionAmount}>-R$76.80</Text>
        <Text style={styles.transactionDate}>15 Mar 2019, 12:10 AM</Text>
      </View>
      <View style={styles.transaction}>
        <Text style={styles.transactionTitle}>Sport</Text>
        <Text style={styles.transactionAmount}>-R$98.50</Text>
        <Text style={styles.transactionDate}>15 Mar 2019, 7:20 PM</Text>
      </View>
      <View style={styles.transaction}>
        <Text style={styles.transactionTitle}>Shopping</Text>
        <Text style={styles.transactionAmount}>-R$230</Text>
        <Text style={styles.transactionDate}>5 Mar 2019, 6:20 PM</Text>
      </View>
      <View style={styles.transaction}>
        <Text style={styles.transactionTitle}>Travel</Text>
        <Text style={styles.transactionAmount}>-R$299</Text>
        <Text style={styles.transactionDate}>2 Mar 2019, 6:55 PM</Text>
      </View>
      <View style={styles.transaction}>
        <Text style={styles.transactionTitle}>Sport</Text>
        <Text style={styles.transactionAmount}>-R$98.50</Text>
        <Text style={styles.transactionDate}>7 Mar 2019, 3:45 PM</Text>
      </View>
    </ScrollView>
  );
};

export default DespesaExtrato;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  time: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2D99FF',
    marginBottom: 20,
  },
  transaction: {
    marginBottom: 20,
  },
  transactionTitle: {
    fontSize: 16,
    color: '#000000',
  },
  transactionAmount: {
    fontSize: 16,
    color: '#FF0000',
  },
  transactionDate: {
    fontSize: 14,
    color: '#AAAAAA',
  },
});