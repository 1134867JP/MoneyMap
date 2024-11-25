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
  Modal, // Add Modal import
  Alert // Add Alert import
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomAlert from '../components/CustomAlert'; // Add CustomAlert import
import { supabase } from '../services/supabaseClient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

const { width } = Dimensions.get('window');

const IncomeStatementScreen = ({ navigation }) => {
  const nav = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false); // Add state for sort modal visibility
  const [sortOption, setSortOption] = useState('date'); // Add state for sort option
  const [alertVisible, setAlertVisible] = useState(false); // Add state for alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // Add state for alert message
  const [totalAmount, setTotalAmount] = useState(0); // Estado para armazenar o total
  const [incomes, setIncomes] = useState([]); // Estado para armazenar as receitas
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [categories, setCategories] = useState([]);

  const screenHeight = Dimensions.get('window').height;
  const minimizedHeight = 200;
  const maximizedHeight = screenHeight * 0.7; // Increased height

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
        .from('incomes')
        .select('amount')
        .eq('user_id', userId); // Filtro pelo user_id
      
      if (error) {
        console.error('Erro ao buscar as receitas:', error);
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

  const [categoryTotals, setCategoryTotals] = useState({});

  // Função para buscar o valor total de amount da tabela incomes com base no category_id
  const fetchCategoryTotal = async (categoryId) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.id) {
        console.log('Erro ao obter o usuário');
        setLoading(false);
        return;
      }
      
      const userId = user.id;


      const { data, error } = await supabase
        .from('incomes')
        .select('amount')
        .eq('user_id', userId)
        .eq('category_id', categoryId);

      if (error) {
        console.error('Erro ao buscar o total de amount:', error);
      } else {
        // Calcula a soma dos valores de amount
        const totalAmount = data.reduce((acc, curr) => acc + curr.amount, 0);
        setCategoryTotals((prevTotals) => ({
          ...prevTotals,
          [categoryId]: totalAmount, // Armazena o total calculado para o category_id
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar o total de amount:', error);
    }
  };

  // Chama a função para buscar os totais ao carregar o componente
  useEffect(() => {
    categories.forEach((category) => {
      fetchCategoryTotal(category.id); // Carrega o total para cada categoria
    });
  }, [categories]);

  useFocusEffect(
    useCallback(() => {
      // Atualize os valores das categorias aqui
      categories.forEach((category) => {
        if (category.id) {
          fetchCategoryTotal(category.id);
        }
      });
    }, [categories]) // Dependências necessárias
  );

  useEffect(() => {
    fetchTotalAmount();
  }, []);

  const fetchIncomes = async () => {
    try {
      // Obter o usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.id) {
        console.log('Erro ao obter o usuário');
        setLoading(false);
        return;
      }
      
      const userId = user.id;

      // Buscar as receitas do usuário
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId) // Filtra as receitas pelo user_id
        .order('income_date', { ascending: false }); // Ordena por data (mais recentes primeiro)

      if (error) {
        console.error('Erro ao buscar receitas:', error);
      } else {
        setIncomes(data); // Atualiza a lista de receitas
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false); // Para de mostrar a tela de carregamento
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

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
        .from('categoriesIncomes')
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


  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchIncomes = async () => {
        // ...existing data fetching logic...
      };

      fetchIncomes();

      // Listener for income updates
      const unsubscribe = nav.addListener('incomeUpdated', () => {
        fetchIncomes();
      });

      return () => {
        unsubscribe();
      };
    }, [nav])
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

  const handleAddCategory = () => {
    if (categoryName.trim() === '') {
      setAlertMessage('O nome da categoria não pode estar vazio.');
      setAlertVisible(true);
      return;
    }
  
    const newCategory = { name: categoryName, color: selectedColor };
  
    if (editingIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[editingIndex] = newCategory;
      setCategories(updatedCategories);
      setEditingIndex(null);
    } else {
      setCategories([...categories, newCategory]);
    }
  
    setCategoryName('');
    setAlertMessage('Categoria adicionada com sucesso!');
    setAlertVisible(true);
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? getGradientColors(category.color)[0] : '#FFCF87'; // Default color if not found
  };

  const formatDateToBrazilian = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
          <Text style={styles.headerTitle}>Extrato de Receitas</Text>
          <Text style={styles.totalExpenses}>Total de Receitas</Text>
          <Text style={styles.totalAmount}>R${totalAmount.toFixed(2)}</Text>
        </View>
      </LinearGradient>
      <Text style={styles.subtitle}>Acompanhe suas receitas</Text>

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
          onPress={() => navigation.navigate('CategoryMaintenance', { category: item, isAdding: false, categoryType: 'incomes', categoryID: item.id,  onCategoryAdded: () => {
            fetchCategories() && fetchIncomes(); // Atualiza os dados da lista
          }  })} 
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
              {categoryTotals[item.id]
                ? `R$ ${categoryTotals[item.id].toFixed(2)}`
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
          bottom: 0,
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
                    placeholder="Pesquisar receitas"
                    placeholderTextColor="#FFFFFF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                    <Icon name="sort" size={24} color="#FFFFFF" style={styles.sortIcon} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={incomes}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddIncomeScreen', { income: item, name: item.name, isEditing: true, title: 'Manutenção de Receita', incomeId: item.id, tela: incomes, onAddIncome: () => {
                        fetchTotalAmount() && fetchIncomes(); // Atualiza os dados da lista
                      } })}
                    >
                      <View style={styles.incomeItem}>
                        <View style={styles.incomeIconContainer}>
                          <View style={[styles.circleIcon, { backgroundColor: getCategoryColor(item.category_id) }]}>
                            <Icon 
                              name="attach-money" 
                              size={24} 
                              color="#FFFFFF" 
                            />
                          </View>
                        </View>
                        <View style={styles.incomeDetails}>
                          <Text style={styles.incomeCategory}>{item.name}</Text>
                          <Text style={styles.incomeDate}>{formatDateToBrazilian(item.income_date)}</Text>
                        </View>
                        <Text style={styles.incomeAmount}>R${Math.abs(item.amount).toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
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
                  data={incomes.slice(0, 2)} // Show first 2 transactions
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.incomeItem}>
                      <View style={styles.incomeIconContainer}>
                        <View style={[styles.circleIcon, { backgroundColor: getCategoryColor(item.category_id) }]}>
                          <Icon 
                            name="attach-money" 
                            size={24} 
                            color="#FFFFFF" 
                          />
                        </View>
                      </View>
                      <View style={styles.incomeDetails}>
                        <Text style={styles.incomeCategory}>{item.name}</Text>
                        <Text style={styles.incomeDate}>{formatDateToBrazilian(item.income_date)}</Text>
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
          navigation.navigate('IncomeStatementScreen');
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
    case 'salario':
      return ['#DAA520', '#DAA520'];
    case 'freelance':
      return ['#0000CD', '#0000CD'];
    case 'investimento':
      return ['#8B0000', '#8B0000'];
    case 'presente':
      return ['#C71585', '#C71585'];
    case 'outros':
      return ['#006400', '#006400'];
    default:
      return ['#FFCF87', '#CA9547']; // Cor padrão
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
  circleIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default IncomeStatementScreen;
