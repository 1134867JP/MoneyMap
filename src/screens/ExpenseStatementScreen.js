import React, { useState, useEffect } from 'react';
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
  Modal,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapIcon from '../components/mapIcon';
import CustomAlert from '../components/CustomAlert'; // Add CustomAlert import
import { supabase } from '../services/supabaseClient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // Add this import

const { width } = Dimensions.get('window');

const ExpenseStatementScreen = ({ navigation }) => {
  const nav = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('date');
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false); 
  const [alertMessage, setAlertMessage] = useState('');
  const [totalAmount, setTotalAmount] = useState(0); // Estado para armazenar o total
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [currentLocation, setCurrentLocation] = useState(null); // Add this state

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        // Obter o usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user?.id) {
          console.log('Erro ao obter o usuário');
          setLoading(false);
          return;
        }
        
        const userId = user.id;

        // Buscar as despesas do usuário
        const { data, error } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', userId); // Filtro pelo user_id
        
        if (error) {
          console.error('Erro ao buscar as despesas:', error);
          setLoading(false);
          return;
        }

        // Somar os valores de "amount"
        const total = data.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Atualizar o estado com o total
        setTotalAmount(total);
      } catch (error) {
        console.error('Erro ao calcular o total:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalAmount();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Obter o usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user?.id) {
          console.log('Erro ao obter o usuário');
          setLoading(false);
          return;
        }
        
        const userId = user.id;
  
        // Buscar as despesas do usuário
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId) // Filtra as receitas pelo user_id
          .order('expense_date', { ascending: false }); // Ordena por data (mais recentes primeiro)
  
        if (error) {
          console.error('Erro ao buscar despesas:', error);
        } else {
          setExpenses(data); // Atualiza a lista de receitas
        }
      } catch (error) {
        console.error('Erro ao carregar despesas:', error);
      } finally {
        setLoading(false); // Para de mostrar a tela de carregamento
      }
    };
  
    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Obter o usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user?.id) {
          console.log('Erro ao obter o usuário');
          setLoading(false);
          return;
        }
        
        const userId = user.id;
  
        // Buscar as despesas do usuário
        const { data, error } = await supabase
          .from('categoriesExpenses')
          .select('*')
          .eq('user_id', userId) // Filtra as receitas pelo user_id
  
        if (error) {
          console.error('Erro ao buscar categorias:', error);
        } else {
          setCategories(data); // Atualiza a lista de receitas
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false); // Para de mostrar a tela de carregamento
      }
    };
  
    fetchCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        try {
          // Obter o usuário autenticado
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user?.id) {
            console.log('Erro ao obter o usuário');
            return;
          }
        
          const userId = user.id;
  
          // Buscar as despesas do usuário
          const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('expense_date', { ascending: false });
  
          if (error) {
            console.error('Erro ao buscar despesas:', error);
          } else {
            setExpenses(data); // Atualiza a lista de despesas
          }
        } catch (error) {
          console.error('Erro ao carregar despesas:', error);
        }
      };
  
      fetchExpenses();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      // Function to fetch and set expenses
      const fetchExpenses = async () => {
        // ...existing data fetching logic...
      };

      fetchExpenses();

      // Listener for expense updates
      const unsubscribe = nav.addListener('expenseUpdated', () => {
        fetchExpenses();
      });

      return () => {
        unsubscribe();
      };
    }, [nav])
  );

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    fetchCurrentLocation();
  }, []);

  const screenHeight = Dimensions.get('window').height;
  const minimizedHeight = 200; 
  const maximizedHeight = screenHeight * 0.7;

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
          <Text style={styles.totalAmount}>R${totalAmount.toFixed(2)}</Text>
        </View>
      </LinearGradient>
      <MapIcon onPress={() => {
        if (currentLocation) {
          navigation.navigate('MapExpenseScreen', { location: currentLocation });
        } else {
          Alert.alert('Erro', 'Não foi possível obter a localização atual.');
        }
      }} />

      <Text style={styles.subtitle}>Acompanhe suas despesas</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
  {categories.map((item, index) => (
    <View 
      key={item.id} 
      style={[
        styles.transactionCard,
        index === categories.length - 1 && { marginRight: 45 } // Adiciona margem ao último item
      ]}
    >
      <LinearGradient
        colors={getGradientColors(item.color)} // Use o nome da categoria para o gradiente
        style={styles.transactionBackground}
      >
        <TouchableOpacity 
          onPress={() => navigation.navigate('CategoryMaintenance', { category: item, isAdding: false, categoryType: 'expenses' })} 
          style={styles.editCategoryButton}
        >
          <Icon name="edit" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.cardIconContainer}>
          <Icon 
            name={getCategoryIcon(item.name)} // Use o nome da categoria para obter o ícone
            size={30} 
            color="#FFFFFF" 
          />
        </View>
        <Text style={styles.transactionCategory}>{item.name}</Text>
        <Text style={styles.transactionAmount}>
          {item.budget 
            ? `R$00` 
            : 'Sem orçamento'}
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
                  data={expenses}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddExpenseScreen', { expense: item, isEditing: true, fromExpenseStatement: true, expenseId: item.id, tela: 'expenses' })}
                    >
                      <View style={styles.expenseItem}>
                        <View style={styles.expenseIconContainer}>
                        <LinearGradient
                          colors={getGradientColorsCat(item.name)}
                          style={styles.expenseIcon}
                        >
                          <Icon 
                            name={getCategoryIcon(item.name)} 
                            size={36} 
                            color="#FFFFFF" 
                          />
                        </LinearGradient>
                        </View>
                        <View style={styles.expenseDetails}>
                          <Text style={styles.expenseCategory}>{item.name}</Text>
                          <Text style={styles.expenseDate}>{item.expense_date}</Text>
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
                  data={expenses.slice(0, 2)}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                      <View style={styles.expenseIconContainer}>
                      <LinearGradient
                          colors={getGradientColorsCat(item.name)}
                          style={styles.expenseIcon}
                        >
                          <Icon 
                            name={getCategoryIcon(item.name)} 
                            size={36} 
                            color="#FFFFFF" 
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.expenseDetails}>
                        <Text style={styles.expenseCategory}>{item.name}</Text>
                        <Text style={styles.expenseDate}>{item.expense_date}</Text>
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

      <CustomAlert
        visible={alertVisible}
        title="Sucesso"
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          navigation.navigate('ExpenseStatementScreen');
        }}
      />
    </View>
  );
};

const getGradientColors = (category) => {
  switch (category.toLowerCase()) {
    case 'amarelo':
      return ['#DAA520', '#DAA520'];
    case 'azul':
      return ['#0000CD', '#0000CD'];
    case 'vermelho':
      return ['#8B0000', '#8B0000'];
    case 'rosa':
      return ['#C71585', '#C71585'];
    case 'verde':
      return ['#006400', '#006400'];
    case 'roxo':
      return ['#6A5ACD', '#6A5ACD'];
    case 'laranja':
      return ['#FF4500', '#FF4500'];
    case 'marrom':
      return ['#5D3C29', '#5D3C29'];
    case 'cinza':
      return ['#6E6E6E', '#6E6E6E'];
    case 'preto':
      return ['#1C1C1C', '#1C1C1C'];
    default:
      return ['#FFCF87', '#CA9547']; // Cor padrão
  }
};

const getGradientColorsCat = (category) => {
  switch (category.toLowerCase()) {
    case 'amarelo':
      return ['#DAA520', '#DAA520'];
    case 'azul':
      return ['#0000CD', '#0000CD'];
    case 'vermelho':
      return ['#8B0000', '#8B0000'];
    case 'rosa':
      return ['#C71585', '#C71585'];
    case 'verde':
      return ['#006400', '#006400'];
    case 'roxo':
      return ['#6A5ACD', '#6A5ACD'];
    case 'laranja':
      return ['#FF4500', '#FF4500'];
    case 'marrom':
      return ['#5D3C29', '#5D3C29'];
    case 'cinza':
      return ['#6E6E6E', '#6E6E6E'];
    case 'preto':
      return ['#1C1C1C', '#1C1C1C'];
    default:
      return ['transparent', 'transparent']; // Cor padrão
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
  expenseDetails: {
    flex: 1,    justifyContent: 'center',  },  expenseCategory: {    fontSize: 16,    color: '#FFFFFF', // Adjusted color  },  expenseDate: {    fontSize: 14,    color: '#FFFFFF', // Adjusted color
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