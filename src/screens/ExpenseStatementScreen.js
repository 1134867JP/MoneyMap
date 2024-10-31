import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const expenses = [
  { id: '1', category: 'Shopping', amount: -150, date: '15 Mar 2019, 8:20 PM' },
  { id: '2', category: 'Medicine', amount: -76.8, date: '15 Mar 2019, 12:10 AM' },
  { id: '3', category: 'Sport', amount: -98.5, date: '15 Mar 2019, 7:20 PM' },
  { id: '4', category: 'Shopping', amount: -230, date: '5 Mar 2019, 6:20 PM' },
  { id: '5', category: 'Travel', amount: -299, date: '2 Mar 2019, 6:55 PM' },
  { id: '6', category: 'Sport', amount: -98.5, date: '7 Mar 2019, 3:45 PM' },
];

const ExpenseStatementScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter(expense =>
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4960F9', '#1937FE']} style={styles.header}>
        <Text style={styles.headerTitle}>Extrato</Text>
        <Text style={styles.totalExpenses}>Total de Despesas</Text>
        <Text style={styles.totalAmount}>R$1.065,50</Text>
        <Text style={styles.subtitle}>Acompanhe suas despesas</Text>
      </LinearGradient>

      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseCategory}>{item.category}</Text>
            <Text style={styles.expenseAmount}>R${item.amount.toFixed(2)}</Text>
            <Text style={styles.expenseDate}>{item.date}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="search" size={24} color="#FFFFFF" />
        <Text style={styles.searchButtonText}>Pesquisar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#1937FE', '#4960F9']}
            style={styles.modalContent}
          >
            <View style={styles.modalHandle} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar despesas"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredExpenses}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.expenseItem}>
                  <Text style={styles.expenseCategory}>{item.category}</Text>
                  <Text style={styles.expenseAmount}>R${item.amount.toFixed(2)}</Text>
                  <Text style={styles.expenseDate}>{item.date}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Modal handle to show a part of the modal */}
      <TouchableOpacity
        style={styles.modalHandleContainer}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.modalHandle} />
      </TouchableOpacity>
    </View>
  );
};

export default ExpenseStatementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalExpenses: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
  },
  totalAmount: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  expenseCategory: {
    fontSize: 16,
    color: '#000000',
  },
  expenseAmount: {
    fontSize: 16,
    color: '#FF0000',
  },
  expenseDate: {
    fontSize: 14,
    color: '#B9B9B9',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#4960F9',
    borderRadius: 8,
    margin: 20,
  },
  searchButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '70%', // Ajuste a altura conforme necessário
    backgroundColor: '#4960F9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
  modalHandle: {
    width: 47,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalHandleContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#B9B9B9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    color: '#000000',
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
  frame3: {
    position: 'absolute',
    width: 883,
    height: 142,
    left: -17,
    top: 358,
    overflowX: 'scroll',
  },
  component11Default: {
    position: 'absolute',
    width: 883,
    height: 142,
    left: 0,
    top: 0,
  },
  unsplashA3RhaDGPNM: {
    position: 'absolute',
    left: '17.02%',
    right: '67.64%',
    top: '0.9%',
    bottom: '0%',
    borderRadius: 10,
  },
  shopping: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 24,
    top: 18,
  },
  rectangle30: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 24,
    top: 18,
    background: 'linear-gradient(119.22deg, #FFCF87 -7.96%, #CA9547 105.03%)',
    borderRadius: 25,
  },
  maskGroup: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 24,
    top: 18,
  },
  rectangle31: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 24,
    top: 18,
    background: 'linear-gradient(119.22deg, #FF8787 -7.96%, #C16A6A 105.03%)',
    borderRadius: 25,
  },
  ellipse10: {
    position: 'absolute',
    width: 112,
    height: 112,
    left: 6,
    top: 3,
    background: 'linear-gradient(134deg, rgba(246, 197, 122, 0) 0.4%, #F6C57A 102.66%)',
  },
  shoppingText: {
    position: 'absolute',
    width: 92,
    height: 22,
    left: 40,
    top: 42,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  price: {
    position: 'absolute',
    width: 115,
    height: 29,
    left: 40,
    top: 76,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    color: '#FFFFFF',
  },
  component10: {
    position: 'absolute',
    left: '79.5%',
    right: '3.51%',
    top: '15.49%',
    bottom: '13.38%',
    border: '1px solid rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  arrowLeft: {
    position: 'absolute',
    visibility: 'hidden',
    left: '64.01%',
    right: '3.79%',
    top: '66.91%',
    bottom: '-0.18%',
    transform: 'rotate(180deg)',
  },
  add: {
    position: 'absolute',
    width: 43,
    height: 39,
    left: 755,
    top: 56,
  },
  icon: {
    position: 'absolute',
    left: '20.83%',
    right: '20.83%',
    top: '20.83%',
    bottom: '20.83%',
    background: '#1D1B20',
  },
  medicine: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 192,
    top: 20,
  },
  rectangle30Medicine: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 192,
    top: 20,
    background: 'linear-gradient(119.22deg, #E09FFF -7.96%, #8034A5 105.03%)',
    borderRadius: 25,
  },
  maskGroupMedicine: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 192,
    top: 20,
  },
  rectangle31Medicine: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 192,
    top: 20,
    background: 'linear-gradient(119.22deg, #87F0FF -7.96%, #C16A6A 105.03%)',
    borderRadius: 25,
  },
  ellipse10Medicine: {
    position: 'absolute',
    width: 112,
    height: 112,
    left: 174,
    top: 5,
    background: 'linear-gradient(134deg, rgba(224, 159, 255, 0) 0.4%, #BB77DB 102.66%)',
  },
  hospital: {
    position: 'absolute',
    width: 75,
    height: 22,
    left: 208,
    top: 44,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 22,
    color: '#9137BC',
  },
  priceMedicine: {
    position: 'absolute',
    width: 117,
    height: 29,
    left: 208,
    top: 78,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    color: '#9137BC',
  },
  sport: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 360,
    top: 18,
  },
  rectangle30Sport: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 360,
    top: 18,
    background: 'linear-gradient(119.22deg, #87F0FF -7.96%, #409AA7 105.03%)',
    borderRadius: 25,
  },
  maskGroupSport: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 360,
    top: 18,
  },
  rectangle31Sport: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 360,
    top: 18,
    background: 'linear-gradient(119.22deg, #87F0FF -7.96%, #C16A6A 105.03%)',
    borderRadius: 25,
  },
  ellipse10Sport: {
    position: 'absolute',
    width: 112,
    height: 112,
    left: 342,
    top: 3,
    background: 'linear-gradient(134deg, rgba(118, 231, 248, 0) 0.4%, #00DFFF 102.66%)',
  },
  academia: {
    position: 'absolute',
    width: 95,
    height: 22,
    left: 376,
    top: 42,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  priceSport: {
    position: 'absolute',
    width: 113,
    height: 29,
    left: 376,
    top: 76,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    color: '#FFFFFF',
  },
  medicine2: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 531,
    top: 20,
  },
  rectangle30Medicine2: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 531,
    top: 20,
    background: 'linear-gradient(119.22deg, #E09FFF -7.96%, #8034A5 105.03%)',
    borderRadius: 25,
  },
  maskGroupMedicine2: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 531,
    top: 20,
  },
  rectangle31Medicine2: {
    position: 'absolute',
    width: 153,
    height: 103,
    left: 531,
    top: 20,
    background: 'linear-gradient(119.22deg, #87F0FF -7.96%, #C16A6A 105.03%)',
    borderRadius: 25,
  },
  ellipse10Medicine2: {
    position: 'absolute',
    width: 112,
    height: 112,
    left: 513,
    top: 5,
    background: 'linear-gradient(134deg, rgba(224, 159, 255, 0) 0.4%, rgba(212, 146, 243, 0.32) 33.12%, rgba(192, 125, 224, 0.85) 88.35%, #BB77DB 102.66%)',
  },
  hospital2: {
    position: 'absolute',
    width: 79,
    height: 22,
    left: 547,
    top: 44,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  priceMedicine2: {
    position: 'absolute',
    width: 117,
    height: 29,
    left: 547,
    top: 78,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    color: '#FFFFFF',
  },
});