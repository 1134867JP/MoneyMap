import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import { wp, hp, scale, verticalScale, moderateScale } from '../utils/dimensions';
import CustomButton from '../components/CustomButton'; // Import CustomButton

const CategoryMaintenance = ({ navigation, route }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('Amarelo'); // Cor padrão
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (route.params?.category) {
      const { category, color } = route.params.category;
      setCategoryName(category);
      setSelectedColor(color);
      setEditingIndex(null);
      setIsAdding(false);
    } else if (route.params?.isAdding) {
      setIsAdding(true);
    }
  }, [route.params]);

  const handleAddCategory = () => {
    if (categoryName.trim() === '') {
      Alert.alert('Erro', 'O nome da categoria não pode estar vazio.');
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
  };

  const handleEditCategory = (index) => {
    setCategoryName(categories[index].name);
    setSelectedColor(categories[index].color);
    setEditingIndex(index);
  };

  const handleDeleteCategory = (index) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir esta categoria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const updatedCategories = categories.filter((_, i) => i !== index);
            setCategories(updatedCategories);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4960F9', '#1937FE']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.backButtonContainer}>
          <BackButton color="white" />
        </View>
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Manutenção de Categorias</Text>
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
              onPress={handleAddCategory}
              style={styles.button}
              gradientColors={["#4960F9", "#4033FF"]}
              textStyle={styles.buttonText}
            />
          )}
          {!isAdding && (
            <CustomButton
              label="Finalizar"
              onPress={() => {
                console.log('Finalizado!');
                navigation.goBack();
              }}
              style={styles.button}
              gradientColors={["#4960F9", "#4033FF"]}
              textStyle={styles.buttonText}
            />
          )}
        </View>
      </LinearGradient>
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
  backButtonContainer: {
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
    marginBottom: 16,
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
    flexDirection: 'row', // Align buttons in a row
    justifyContent: 'space-around', // Space between buttons
    alignItems: 'center',
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
});

export default CategoryMaintenance;
