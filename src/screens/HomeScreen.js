import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/CustomButton";
import { PieChart, BarChart } from "react-native-chart-kit";
import { supabase } from "../services/supabaseClient";
import { userAuth } from '../contexts/userContext';
import { wp, hp, moderateScale } from '../utils/dimensions';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { userId, userProfile } = userAuth();
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState("");
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchTotalExpenses = async () => {
    try {
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
      setTotalExpenses(total);
    } catch (error) {
      console.error('Erro ao calcular o total:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalIncomes = async () => {
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
      setTotalIncomes(total);
    } catch (error) {
      console.error('Erro ao calcular o total:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalExpenses();
    fetchTotalIncomes();
    setTotalAmount(totalIncomes - totalExpenses);
    console.log(totalAmount);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Chama as funções quando a tela ganha foco
      fetchTotalExpenses();
      fetchTotalIncomes();
      const total = totalIncomes - totalExpenses;
      setTotalAmount(total);
  
      // Função de limpeza opcional (se necessário)
      return () => {
      };
    }, [totalIncomes, totalExpenses]) // Dependências que podem mudar
  );

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name);
      setProfileImage(userProfile.profile_image);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!userId) {
        console.error("User ID is null");
        return;
      }
      try {
        const { data: incomes, error: incomesError } = await supabase
          .from("incomes")
          .select("amount, income_date")
          .eq("user_id", userId);
        if (incomesError) {
          console.error("Error fetching incomes:", incomesError);
        }

        const { data: expenses, error: expensesError } = await supabase
          .from("expenses")
          .select("amount, expense_date")
          .eq("user_id", userId);
        if (expensesError) {
          console.error("Error fetching expenses:", expensesError);
        }

        const incomeByMonth = {};
        const expenseByMonth = {};

        if (incomes) {
          incomes.forEach((income) => {
            const month = new Date(income.income_date).getMonth();
            incomeByMonth[month] = (incomeByMonth[month] || 0) + income.amount;
          });
        }

        if (expenses) {
          expenses.forEach((expense) => {
            const month = new Date(expense.expense_date).getMonth();
            expenseByMonth[month] = (expenseByMonth[month] || 0) + expense.amount;
          });
        }

        const data = [];
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        for (let i = 0; i < 12; i++) {
          data.push({
            month: months[i],
            income: incomeByMonth[i] || 0,
            expenses: expenseByMonth[i] || 0,
          });
        }

        setMonthlyData(data);
      } catch (error) {
        console.error("Error in fetchFinancialData:", error);
      }
    };

    if (userId) {
      fetchFinancialData();

      const incomeSubscription = supabase
        .channel('public:incomes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'incomes', filter: `user_id=eq.${userId}` }, payload => {
          fetchFinancialData();
        })
        .subscribe();

      const expenseSubscription = supabase
        .channel('public:expenses')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${userId}` }, payload => {
          fetchFinancialData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(incomeSubscription);
        supabase.removeChannel(expenseSubscription);
      };
    }
  }, [userId]);

  useEffect(() => {
    fetchTotalExpenses();
    fetchTotalIncomes();
    setTotalAmount(totalIncomes - totalExpenses);
    console.log(totalAmount);
  }, [totalIncomes, totalExpenses]);

  const maxAmount = Math.max(...monthlyData.map(item => item.income + item.expenses), 1); // Ensure maxAmount is at least 1

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4960F9", "#1937FE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Image
          source={{ uri: profileImage || "https://example.com/profile.jpg" }}
          style={styles.profileImage}
        />
        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>No Image</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.greeting}>Bem vindo,{"\n"}{fullName}</Text>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Suas Finanças</Text>
        <Text style={[styles.balanceAmount, { color: totalAmount < 0 ? 'red' : '#2D99FF' }]}>{`R$ ${totalAmount.toFixed(2)}`}</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.columns}>
            {monthlyData.map((item, index) => {
              const incomeHeight = (item.income / maxAmount) * hp("20%");
              const expensesHeight = (item.expenses / maxAmount) * hp("20%");
              return (
                <View key={index} style={styles.monthColumn}>
                  <View style={styles.barsContainer}>
                    <View
                      style={[
                        styles.rectangle18,
                        { height: expensesHeight }
                      ]}
                    />
                    <View
                      style={[
                        styles.rectangle19,
                        { height: incomeHeight }
                      ]}
                    />
                  </View>
                  <Text style={styles.columnLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        {/* Botões Maiores */}
        <View style={styles.largeButtonRow}>
          <CustomButton
            style={styles.smallButton}
            gradientColors={["#4960F9", "#4033FF"]}
            onPress={() => navigation.navigate("ExpenseStatement")}
            label="Confira suas Despesas"
            textStyle={styles.buttonText}
          />
          <CustomButton
            style={styles.smallButton}
            gradientColors={["#4960F9", "#4033FF"]}
            onPress={() => navigation.navigate("IncomeStatement")}
            label="Confira suas Receitas"
            textStyle={styles.buttonText}
          />
        </View>

        {/* Botões Menores */}
        <View style={styles.smallButtonRow}>
          <CustomButton
            style={styles.largeButton}
            gradientColors={["#4960F9", "#4033FF"]}
            onPress={() => navigation.navigate("AddExpenseScreen")}
            label="Adicionar Despesa"
            textStyle={styles.smallButtonText}
          />
          <CustomButton
            style={styles.largeButton}
            gradientColors={["#4960F9", "#4033FF"]}
            onPress={() => navigation.navigate("AddIncomeScreen")}
            label="Adicionar Receitas"
            textStyle={styles.smallButtonText}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  backgroundGradient: {
    position: "absolute",
    width: '100%',
    height: hp('35%'),
    top: 0,
    borderBottomLeftRadius: moderateScale(66),
    borderBottomRightRadius: moderateScale(66),
  },
  backButtonContainer: {
    position: 'absolute',
    top: hp('8%'),
    left: wp('5%'),
    zIndex: 1,
  },
  profileImage: {
    position: "absolute",
    width: wp('12%'),
    height: wp('12%'),
    left: wp('80%'),
    top: hp('8%'),
    borderRadius: moderateScale(18),
    filter: "drop-shadow(4px 2px 11px rgba(0, 0, 0, 0.25))",
  },
  profileImagePlaceholder: {
    position: "absolute",
    width: wp('12%'),
    height: wp('12%'),
    left: wp('80%'),
    top: hp('8%'),
    borderRadius: moderateScale(18),
    backgroundColor: "#FFFFFF",
    filter: "drop-shadow(4px 2px 11px rgba(0, 0, 0, 0.25))",
  },
  ellipse8: {
    position: "absolute",
    width: wp('2.5%'),
    height: wp('2.5%'),
    left: wp('90%'),
    top: hp('13%'),
    backgroundColor: "#20C968",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  greeting: {
    position: "absolute",
    width: wp('90%'),
    height: hp('6%'),
    left: wp('7%'),
    top: hp('14%'),
    fontSize: moderateScale(20),
    lineHeight: moderateScale(24),
    color: "#FFFFFF",
    textAlign: 'left',
  },
  balanceCard: {
    position: "absolute",
    width: wp('85%'),
    height: hp('36%'),
    left: wp('7%'),
    top: hp('23%'),
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(40),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(30) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(10),
    elevation: 5,
    padding: moderateScale(20),
    alignItems: 'center', // Center the contents horizontally
  },
  balanceTitle: { 
    fontSize: moderateScale(16), 
    color: "#000000",
    alignSelf: 'flex-start', // Align to the left
  },
  balanceAmount: {
    fontSize: moderateScale(30),
    fontWeight: "700",
    color: "#2D99FF",
    marginTop: hp('1%'),
    textAlign: 'left', // Align to the left
    alignSelf: 'flex-start', // Align to the left
  },
  columns: {
    width: '100%', // Ensure the columns take full width
    height: hp('20%'), // Increased height to accommodate the labels
    flexDirection: "row",
    justifyContent: "space-around", // Distribute columns evenly
    alignItems: "flex-end",
  },
  monthColumn: {
    alignItems: "center",
    flexDirection: "column",
    width: wp("6%"),
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: hp("20%"),
  },
  columnLabel: {
    marginTop: hp('1.5%'), // Space between the column and the label
    fontSize: moderateScale(12),
    textAlign: "center",
    transform: [{ rotate: "90deg" }],
  },
  buttonContainer: { 
    marginTop: hp('62%'), // Adjusted to move buttons up
    paddingHorizontal: wp('7%'),
    paddingBottom: hp('10%'), // Adjust padding to account for the tab bar
  },
  largeButtonRow: {
    justifyContent: "space-between",
  },
  largeButton: {
    flex: 1,
    marginRight: wp('1.0%'),
    borderRadius: moderateScale(40),
    height: moderateScale(30),
  },
  smallButtonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" ,
  },
  smallButton: {
    width: "48%",
    borderRadius: moderateScale(40),
    height: moderateScale(30), // Further reduced height
  },
  rectangle18: {
    width: wp('2.5%'),
    height: hp('10.5%'),
    backgroundColor: "#2D99FF",
    marginBottom: hp('0.25%'), // Space between the bars
    marginRight: wp('0.5%'), // Space between the bars horizontally
    borderRadius: moderateScale(4),
  },
  rectangle19: {
    width: wp('2.5%'),
    height: hp('2.75%'),
    backgroundColor: "#A5F3FF",
    transform: [{ scaleY: -1 }],
    marginTop: hp('0.25%'), // Space between the bars
    marginLeft: wp('0.5%'), // Space between the bars horizontally
    borderRadius: moderateScale(4),
  },
});