import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton'; // Certifique-se de que o caminho está correto

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#4960F9', '#1937FE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <View style={styles.onlineIndicator} />
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Bom dia Exemplo Teste!</Text>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Suas Finanças</Text>
        <Text style={styles.balanceAmount}>R$8.500,00</Text>
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={[styles.columnBar, { height: 85.51 }]} />
            <View style={[styles.columnBar, styles.columnBarSecondary, { height: 22.43 }]} />
          </View>
          <View style={styles.column}>
            <View style={[styles.columnBar, { height: 70.09 }]} />
            <View style={[styles.columnBar, styles.columnBarSecondary, { height: 16.12 }]} />
          </View>
          <View style={styles.column}>
            <View style={[styles.columnBar, { height: 62.38 }]} />
            <View style={[styles.columnBar, styles.columnBarSecondary, { height: 10.51 }]} />
          </View>
          <View style={styles.column}>
            <View style={[styles.columnBar, { height: 42.76 }]} />
            <View style={[styles.columnBar, styles.columnBarSecondary, { height: 4.91 }]} />
          </View>
          <View style={styles.column}>
            <View style={[styles.columnBar, { height: 30.84 }]} />
            <View style={[styles.columnBar, styles.columnBarSecondary, { height: 18.93 }]} />
          </View>
          <View style={styles.column}>
            <View style={[styles.columnBar, { height: 10.51 }]} />
            <View style={[styles.columnBar, styles.columnBarSecondary, { height: 49.07 }]} />
          </View>
          <View style={styles.column}>
            <View style={[styles.columnBar, { height: 7.01 }]} />
            <View style={[styles.columnBar, styles.columnBarSecondary, { height: 75.7 }]} />
          </View>
        </View>
      </View>

      {/* Expense Card */}
      <CustomButton
        style={styles.expenseCard}
        gradientColors={['#4960F9', '#4033FF']}
        onPress={() => navigation.navigate('Expenses')}
        text="Confira suas Despesas"
        textStyle={styles.expenseText}
      />

      {/* Income Card */}
      <CustomButton
        style={styles.incomeCard}
        gradientColors={['#4960F9', '#4033FF']}
        onPress={() => navigation.navigate('Income')}
        text="Confira suas Receitas"
        textStyle={styles.incomeText}
      />

      {/* Add Expense Button */}
      <CustomButton
        style={styles.addExpenseButton}
        gradientColors={['#4960F9', '#4033FF']}
        onPress={() => navigation.navigate('AddExpense')}
        text="Adicionar Despesa"
        textStyle={styles.addExpenseText}
      />

      {/* Add Income Button */}
      <CustomButton
        style={styles.addIncomeButton}
        gradientColors={['#4960F9', '#4033FF']}
        onPress={() => navigation.navigate('AddIncome')}
        text="Adicionar Receita"
        textStyle={styles.addIncomeText}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: 278,
    top: 0,
    borderBottomLeftRadius: 66,
    borderBottomRightRadius: 66,
  },
  profileContainer: {
    position: 'absolute',
    top: 68,
    right: 20,
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#20C968',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    top: 40,
    right: 5,
  },
  greeting: {
    position: 'absolute',
    top: 124,
    left: 60,
    fontFamily: 'Montserrat',
    fontSize: 20,
    color: '#FFFFFF',
  },
  balanceCard: {
    position: 'absolute',
    top: 188,
    left: 27,
    width: 321,
    height: 225,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 9, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    padding: 20,
  },
  balanceTitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#000000',
  },
  balanceAmount: {
    fontFamily: 'Montserrat',
    fontSize: 30,
    fontWeight: '700',
    color: '#2D99FF',
    marginTop: 10,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  column: {
    alignItems: 'center',
  },
  columnBar: {
    width: 9,
    backgroundColor: '#2D99FF',
  },
  columnBarSecondary: {
    backgroundColor: '#A5F3FF',
  },
  expenseCard: {
    position: 'absolute',
    top: 534,
    left: 23,
    width: 321,
    height: 55,
    borderRadius: 40,
  },
  expenseText: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    color: '#FFFFFF',
  },
  incomeCard: {
    position: 'absolute',
    top: 467,
    left: 24,
    width: 319,
    height: 55,
    borderRadius: 40,
  },
  incomeText: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    color: '#FFFFFF',
  },
  addExpenseButton: {
    position: 'absolute',
    top: 644,
    left: 22,
    width: 160,
    height: 61.83,
    borderRadius: 40,
  },
  addExpenseText: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    color: '#FFFFFF',
  },
  addIncomeButton: {
    position: 'absolute',
    top: 644,
    left: 190,
    width: 160,
    height: 61.83,
    borderRadius: 40,
  },
  addIncomeText: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    color: '#FFFFFF',
  },
});