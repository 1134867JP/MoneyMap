import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapIcon from '../components/mapIcon';

const { width } = Dimensions.get('window');

const ExpenseStatementScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('date');

  const screenHeight = Dimensions.get('window').height;
  const minimizedHeight = 200; // Adjusted height to match income statement screen
  const maximizedHeight = screenHeight * 0.7; // Increased height

  const transactions = [
    { id: '1', category: 'Shopping', amount: -150, date: '15 Mar 2019, 8:20 PM' },
    { id: '2', category: 'Medicine', amount: -76.8, date: '15 Mar 2019, 12:10 AM' },
    { id: '3', category: 'Sport', amount: -98.5, date: '15 Mar 2019, 7:20 PM' },
    { id: '4', category: 'Shopping', amount: -230, date: '5 Mar 2019, 6:20 PM' },
    { id: '5', category: 'Travel', amount: -299, date: '2 Mar 2019, 6:55 PM' },
  ];

  const filteredModalTransactions = transactions.filter(transaction =>
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortTransactions = (option) => {
    switch (option) {
      case 'amount':
        return filteredModalTransactions.sort((a, b) => b.amount - a.amount);
      case 'category':
        return filteredModalTransactions.sort((a, b) => a.category.localeCompare(b.category));
      case 'date':
      default:
        return filteredModalTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4960F9', '#1937FE']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.containerHeader}>
          <Text style={styles.headerTitle}>Extrato de Despesas</Text>
          <Text style={styles.totalExpenses}>Total de Despesas</Text>
          <Text style={styles.totalAmount}>R$1.065,50</Text>
        </View>
      </LinearGradient>
      <MapIcon />

      <Text style={styles.subtitle}>Acompanhe suas despesas</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {transactions.map((transaction, index) => (
          <View key={transaction.id} style={[
            styles.transactionCard,
            index === transactions.length - 1 && { marginRight: 45 } // Add margin to the last item
          ]}>
            <LinearGradient
              colors={getGradientColors(transaction.category)}
              style={styles.transactionBackground}
            >
              <TouchableOpacity onPress={() => navigation.navigate('CategoryMaintenance', { category: transaction })} style={styles.editCategoryButton}>
                <Icon name="edit" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.cardIconContainer}>
                <Icon 
                  name={getCategoryIcon(transaction.category)} 
                  size={30} // Adjusted icon size
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
              <Text style={styles.transactionAmount}>
                R${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      <View style={[
        styles.fixedModalContainer,
        { 
          height: modalVisible ? maximizedHeight : minimizedHeight,
          bottom: 0, // Reset bottom to 0
        }
      ]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => !modalVisible && setModalVisible(true)}
        >
          <LinearGradient
            colors={['#1937FE', '#4960F9']}
            style={[
              styles.modalContent,
              { height: '100%' }
            ]}
          >
            <TouchableOpacity
              style={styles.modalHandleContainer}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <View style={styles.modalHandle} />
            </TouchableOpacity>

            {modalVisible ? (
              <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalInnerContent}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
              >
                <View style={styles.searchContainer}>
                  <Icon name="search" size={24} color="#FFFFFF" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar despesas"
                    placeholderTextColor="#FFFFFF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                    <Icon name="sort" size={24} color="#FFFFFF" style={styles.sortIcon} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={sortTransactions(sortOption)}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddExpenseScreen', { expense: item, isEditing: true })}
                    >
                      <View style={styles.expenseItem}>
                        <View style={styles.expenseIconContainer}>
                          <LinearGradient
                            colors={getGradientColors(item.category)}
                            style={styles.expenseIcon}
                          >
                            <Icon 
                              name={getCategoryIcon(item.category)} 
                              size={24} 
                              color="#FFFFFF" 
                            />
                          </LinearGradient>
                        </View>
                        <View style={styles.expenseDetails}>
                          <Text style={styles.expenseCategory}>{item.category}</Text>
                          <Text style={styles.expenseDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.expenseAmount}>-R${Math.abs(item.amount).toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  style={styles.expenseList}
                  contentContainerStyle={styles.expenseListContent}
                />
              </KeyboardAvoidingView>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.minimizedContent}
                  onPress={() => setModalVisible(true)}
                >
                  <Icon name="search" size={24} color="#FFFFFF" />
                  <Text style={styles.minimizedText}>Pesquisar</Text>
                </TouchableOpacity>
                <FlatList
                  data={transactions.slice(0, 2)}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                      <View style={styles.expenseIconContainer}>
                        <LinearGradient
                          colors={getGradientColors(item.category)}
                          style={styles.expenseIcon}
                        >
                          <Icon 
                            name={getCategoryIcon(item.category)} 
                            size={24} 
                            color="#FFFFFF" 
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.expenseDetails}>
                        <Text style={styles.expenseCategory}>{item.category}</Text>
                        <Text style={styles.expenseDate}>{item.date}</Text>
                      </View>
                      <Text style={styles.expenseAmount}>-R${Math.abs(item.amount).toFixed(2)}</Text>
                    </View>
                  )}
                  style={styles.expenseList}
                  contentContainerStyle={styles.expenseListContent}
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        visible={sortModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.sortModalContainer}>
          <View style={styles.sortModalContent}>
            <Text style={styles.sortModalTitle}>Ordenar por</Text>
            <TouchableOpacity onPress={() => { setSortOption('date'); setSortModalVisible(false); }}>
              <Text style={styles.sortOption}>Data</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortOption('amount'); setSortModalVisible(false); }}>
              <Text style={styles.sortOption}>Valor</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortOption('category'); setSortModalVisible(false); }}>
              <Text style={styles.sortOption}>Categoria</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getGradientColors = (category) => {
  switch (category.toLowerCase()) {
    case 'shopping':
      return ['#FFCF87', '#CA9547'];
    case 'medicine':
      return ['#E09FFF', '#8034A5'];
    case 'sport':
      return ['#87F0FF', '#409AA7'];
    case 'travel':
      return ['#FF8787', '#C16A6A'];
    default:
      return ['#FFCF87', '#CA9547'];
  }
};

const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'shopping':
      return 'shopping-bag';
    case 'medicine':
      return 'local-hospital';
    case 'sport':
      return 'fitness-center';
    case 'travel':
      return 'flight';
    default:
      return 'attach-money';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 245,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  containerHeader: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalExpenses: {
    fontSize: 22,
    color: '#87F0FF',
    marginTop: 70,
  },
  totalAmount: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 24,
    color: '#3A3A3A',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  horizontalScroll: {
    marginTop: 60,
    paddingLeft: 24,
  },
  transactionCard: {
    width: 250, // Further increased width
    height: 200, // Further increased height
    marginTop: 16,
    marginRight: 16,
    borderRadius: 25,
    overflow: 'hidden',
  },
  transactionBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30, // Further adjusted padding
    paddingVertical: 20, // Further adjusted padding
  },
  editCategoryButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60, // Further increased width
    height: 60, // Further increased height
    borderRadius: 30, // Further adjusted border radius
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 10,
  },
  transactionAmount: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  fixedModalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    bottom: 0, // Reset bottom to 0
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#4960F9',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  modalInnerContent: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  modalHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  modalHandle: {
    width: 47,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  minimizedContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  minimizedText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051099',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 53,
    marginBottom: 20,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  expenseList: {
    flex: 1,
    marginBottom: 20,
  },
  expenseListContent: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  expenseIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  expenseIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  expenseDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  expenseCategory: {
    fontSize: 16,
    color: '#FFFFFF', // Adjusted color
  },
  expenseDate: {
    fontSize: 14,
    color: '#FFFFFF', // Adjusted color
    marginTop: 5,
  },
  expenseAmount: {
    fontSize: 16,
    color: '#FFFFFF', // Adjusted color
    fontWeight: 'bold',
  },
  sortIcon: {
    marginLeft: 10,
  },
  sortModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sortModalContent: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sortOption: {
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default ExpenseStatementScreen;