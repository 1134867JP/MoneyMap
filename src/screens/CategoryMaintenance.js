import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import { wp, hp, scale, verticalScale, moderateScale } from '../utils/dimensions';
import CustomButton from '../components/CustomButton'; // Import CustomButton
import CustomAlert from '../components/CustomAlert'; // Add CustomAlert import
import { supabase } from '../services/supabaseClient';

const CategoryMaintenance = ({ navigation, route }) => {
  const { category, isAdding, categoryType, onCategoryAdded, categoryID } = route.params || {};
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(category ? category.name : '');
  const [selectedColor, setSelectedColor] = useState(category ? category.color : 'Amarelo'); // Cor padrão
  const [editingIndex, setEditingIndex] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false); // Add state for alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // Add state for alert message

  const saveCategory = async () => {
    // Validar campos obrigatórios
    if (!categoryName || !selectedColor) {
      setAlertMessage('Todos os campos são obrigatórios.');
      setAlertVisible(true);
      return;
    }
  
    // Obter o usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.id) {
      setAlertMessage('Erro: usuário não autenticado.');
      setAlertVisible(true);
      return;
    }
  
    const userId = user.id;
  
    try {
      let tableName = '';
  
      // Verifique de qual tela a função foi chamada
      if (categoryType === 'expenses') {
        tableName = 'categoriesExpenses'; // Tabela de despesas
      } else if (categoryType === 'incomes') {
        tableName = 'categoriesIncomes'; // Tabela de receitas
      }
  
      // Inserir na tabela correta
      const { data, error } = await supabase.from(tableName).insert([
        {
          user_id: userId,
          name: categoryName.trim(),
          color: selectedColor,
          // Não inclua a chave primária (id) aqui, deixe o banco gerar automaticamente
        },
      ]);
  
      if (error) {
        console.error('Erro ao salvar categoria:', error);
        setAlertMessage('Erro ao salvar a categoria. Por favor, tente novamente.');
        setAlertVisible(true);
      } else {
        console.log('Categoria salva com sucesso:', data);
        setAlertMessage('Categoria salva com sucesso!');
        setAlertVisible(true);
  
        // Redirecionar ou limpar formulário
        if (onCategoryAdded) {
          onCategoryAdded();
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setAlertMessage('Ocorreu um erro inesperado. Por favor, tente novamente.');
      setAlertVisible(true);
    }
  };

  const editCategory = async () => {
    // Validar campos obrigatórios
    if (!categoryName || !selectedColor) {
      setAlertMessage('Todos os campos são obrigatórios.');
      setAlertVisible(true);
      return;
    }
  
    // Obter o usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.id) {
      setAlertMessage('Erro: usuário não autenticado.');
      setAlertVisible(true);
      return;
    }
  
    const userId = user.id;
  
    try {
      let tableName = '';
  
      // Verifique de qual tela a função foi chamada
      if (categoryType === 'expenses') {
        tableName = 'categoriesExpenses'; // Tabela de despesas
      } else if (categoryType === 'incomes') {
        tableName = 'categoriesIncomes'; // Tabela de receitas
      }
  
      // Inserir na tabela correta
      const { data, error } = await supabase.from(tableName).update([
        {
          name: categoryName.trim(),
          color: selectedColor,
          // Não inclua a chave primária (id) aqui, deixe o banco gerar automaticamente
        },
      ])
      .eq('id', categoryID);
  
      if (error) {
        console.error('Erro ao salvar categoria:', error);
        setAlertMessage('Erro ao salvar a categoria. Por favor, tente novamente.');
        setAlertVisible(true);
      } else {
        console.log('Categoria salva com sucesso:', data);
        setAlertMessage('Categoria salva com sucesso!');
        setAlertVisible(true);
  
        // Redirecionar ou limpar formulário
        if (onCategoryAdded) {
          onCategoryAdded();
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setAlertMessage('Ocorreu um erro inesperado. Por favor, tente novamente.');
      setAlertVisible(true);
    }
  };

  const deleteCategory = async () => {
    try {
      const { categoryType } = route.params;

      let tableName = '';
  
      // Verifique de qual tela a função foi chamada
      if (categoryType === 'expenses') {
        tableName = 'categoriesExpenses'; // Tabela de despesas
      } else if (categoryType === 'incomes') {
        tableName = 'categoriesIncomes'; // Tabela de receitas
      }

      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', category.id);
  
      if (error) {
        throw error;
      }
  
      console.log('Categoria excluída com sucesso:', data);
      setAlertMessage('Categoria excluída com sucesso!');
      setAlertVisible(true);
      navigation.goBack();
    
    } catch (error) {
      console.error('Erro ao excluir a Categoria:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4960F9', '#1937FE']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContainer}>
          <BackButton color="white" />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {isAdding ? 'Adicionar Categoria' : 'Manutenção de Categorias'}
            </Text>
          </View>
        </View>
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome da Categoria"
              value={categoryName}
              onChangeText={setCategoryName}
              placeholderTextColor="#FFFFFF"
            />
          </View>

          <Text style={styles.label}>Selecione a cor da etiqueta*</Text>
          <Picker
            selectedValue={selectedColor}
            onValueChange={(itemValue) => setSelectedColor(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Amarelo" value="Amarelo" />
            <Picker.Item label="Azul" value="Azul" />
            <Picker.Item label="Vermelho" value="Vermelho" />
            <Picker.Item label="Rosa" value="Rosa" />
            <Picker.Item label="Verde" value="Verde" />
            <Picker.Item label="Roxo" value="Roxo" />
            <Picker.Item label="Laranja" value="Laranja" />
            <Picker.Item label="Marrom" value="Marrom" />
            <Picker.Item label="Cinza" value="Cinza" />
            <Picker.Item label="Preto" value="Preto" />
          </Picker>

        </ScrollView>
        <View style={styles.buttonContainer}>
          {isAdding && (
            <CustomButton
              label="Adicionar Categoria"
              onPress={saveCategory}
              style={styles.button}
              gradientColors={["#4960F9", "#4033FF"]}
              textStyle={styles.buttonText}
            />
          )}
          {!isAdding &&  (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteCategory}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          )}
          {!isAdding && (
            <CustomButton
              label="Finalizar"
              onPress={editCategory}
              style={styles.button}
              gradientColors={["#4960F9", "#4033FF"]}
              textStyle={styles.buttonText}
            />
          )}
        </View>
      </LinearGradient>
      <CustomAlert
        visible={alertVisible}
        title="Sucesso"
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingTop: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: hp(7.5),
    left: wp(5.3),
    zIndex: 1,
  },
  formContainer: {
    paddingHorizontal: wp(8.8),
    marginTop: hp(17),
  },
  scrollContent: {
    paddingBottom: hp(10),
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    color: '#FFFFFF',
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp(5),
    left: 0,
    right: 0,
    flexDirection: 'column', // Align buttons in a row
    justifyContent: 'space-around', // Space between buttons
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 40,
    paddingHorizontal: 150,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    flex: 1,
    marginHorizontal: wp('2%'),
    borderRadius: moderateScale(40),
    height: moderateScale(30),
  },
  buttonText: {
    fontSize: moderateScale(14),
    color: '#FFFFFF',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -wp(5.3), // Adjust margin to center the title
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CategoryMaintenance;
