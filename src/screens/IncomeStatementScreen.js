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
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const IncomeStatementScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const screenHeight = Dimensions.get('window').height;
  const minimizedHeight = 200;
  const maximizedHeight = screenHeight * 0.7; // Increased height

  const transactions = [
    { id: '1', category: 'Salary', amount: 1500, date: '15 Mar 2019, 8:20 PM' },
    { id: '2', category: 'Freelance', amount: 800, date: '15 Mar 2019, 12:10 AM' },
    { id: '3', category: 'Investment', amount: 500, date: '15 Mar 2019, 7:20 PM' },
    { id: '4', category: 'Gift', amount: 200, date: '5 Mar 2019, 6:20 PM' },
    { id: '5', category: 'Other', amount: 300, date: '2 Mar 2019, 6:55 PM' },
  ];

  const filteredModalTransactions = transactions.filter(transaction =>
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Text style={styles.headerTitle}>Extrato de Receitas</Text>
          <Text style={styles.totalExpenses}>Total de Receitas</Text>
          <Text style={styles.totalAmount}>R$3.300,00</Text>
        </View>
      </LinearGradient>
      <Text style={styles.subtitle}>Acompanhe suas receitas</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <LinearGradient
              colors={getGradientColors(transaction.category)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.transactionBackground}
            >
              <TouchableOpacity onPress={() => navigation.navigate('CategoryMaintenance', { category: transaction })} style={styles.editCategoryButton}>
                <Icon name="edit" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.cardIconContainer}>
                <Icon 
                  name={getCategoryIcon(transaction.category)} 
                  size={30} 
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
          bottom: 0,
        }
      ]}>
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
                  placeholder="Pesquisar receitas"
                  placeholderTextColor="#FFFFFF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <FlatList
                data={filteredModalTransactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.incomeItem}>
                    <View style={styles.incomeIconContainer}>
                      <LinearGradient
                        colors={getGradientColors(item.category)}
                        style={styles.incomeIcon}
                      >
                        <Icon 
                          name={getCategoryIcon(item.category)} 
                          size={24} 
                          color="#FFFFFF" 
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.incomeDetails}>
                      <Text style={styles.incomeCategory}>{item.category}</Text>
                      <Text style={styles.incomeDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.incomeAmount}>R${Math.abs(item.amount).toFixed(2)}</Text>
                  </View>
                )}
                style={styles.incomeList}
                contentContainerStyle={styles.incomeListContent}
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
                data={transactions.slice(0, 2)} // Show first 2 transactions
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.incomeItem}>
                    <View style={styles.incomeIconContainer}>
                      <LinearGradient
                        colors={getGradientColors(item.category)}
                        style={styles.incomeIcon}
                      >
                        <Icon 
                          name={getCategoryIcon(item.category)} 
                          size={24} 
                          color="#FFFFFF" 
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.incomeDetails}>
                      <Text style={styles.incomeCategory}>{item.category}</Text>
                      <Text style={styles.incomeDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.incomeAmount}>R${Math.abs(item.amount).toFixed(2)}</Text>
                  </View>
                )}
                style={styles.incomeList}
                contentContainerStyle={styles.incomeListContent}
              />
            </>
          )}
        </LinearGradient>
      </View>
    </View>
  );
};

const getGradientColors = (category) => {
  switch (category.toLowerCase()) {
    case 'salary':
      return ['#FFCF87', '#CA9547'];
    case 'freelance':
      return ['#E09FFF', '#8034A5'];
    case 'investment':
      return ['#87F0FF', '#409AA7'];
    case 'gift':
      return ['#FF8787', '#C16A6A'];
    case 'other':
      return ['#FFCF87', '#CA9547'];
    default:
      return ['#FFCF87', '#CA9547'];
  }
};

const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'salary':
      return 'attach-money';
    case 'freelance':
      return 'work';
    case 'investment':
      return 'trending-up';
    case 'gift':
      return 'card-giftcard';
    case 'other':
      return 'more-horiz';
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
    paddingLeft: 20,
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
    shadowColor: '#000', // Ensure this line is present
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    bottom: 0, // Reset bottom to 0
    zIndex: 2, // Ensure this line is present to bring the modal to the front
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
  incomeList: {
    flex: 1,
    marginBottom: 5,
  
  },
  incomeListContent: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  incomeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  incomeIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  incomeDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  incomeCategory: {
    fontSize: 16,
    color: '#ffff',
  },
  incomeDate: {
    fontSize: 14,
    color: '#ffff',
    marginTop: 5,
  },
  incomeAmount: {
    fontSize: 16,
    color: '#ffff',
    fontWeight: 'bold',
  },
});

export default IncomeStatementScreen;
