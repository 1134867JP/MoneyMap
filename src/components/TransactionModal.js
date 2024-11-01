import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TransactionModal = ({ visible, onClose, transactions, searchQuery, setSearchQuery }) => {
  const filteredTransactions = transactions.filter(transaction =>
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.modalContainer, { display: visible ? 'flex' : 'none' }]}>
      <LinearGradient
        colors={['#1937FE', '#4960F9']}
        style={styles.modalBackground}
      >
        <View style={styles.modalHandle} />

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar despesas"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionCategory}>{item.category}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>
                R${item.amount.toFixed(2)}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    width: 375,
    height: 541,
    left: 0,
    top: 655,
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalHandle: {
    width: 47,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchInput: {
    width: 315,
    height: 53,
    backgroundColor: '#051099',
    borderRadius: 16,
    paddingHorizontal: 10,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FFCF87',
    borderRadius: 24,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
  },
  transactionDate: {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 12,
    color: '#80E0FF',
  },
  transactionAmount: {
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  closeButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1937FE',
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default TransactionModal;