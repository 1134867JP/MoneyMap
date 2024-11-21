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
import { Ionicons } from '@expo/vector-icons'; // Add this import
import { wp, hp, moderateScale } from '../utils/dimensions';

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { userId, userProfile } = userAuth();
  const [balance, setBalance] = useState(0);
  const [expenseData, setExpenseData] = useState([
    { name: "Alimentação", amount: 50, color: "red", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Transporte", amount: 30, color: "blue", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Lazer", amount: 20, color: "green", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  ]);
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState("");
  const [barChartData, setBarChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  });

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name);
      setProfileImage(userProfile.profile_image);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchFinancialData = async () => {
      const { data: incomes, error: incomesError } = await supabase.from("incomes").select("amount");
      if (incomesError) {
        console.error("Error fetching incomes:", incomesError);
      } else {
        console.log("Incomes:", incomes);
      }

      const { data: expenses, error: expensesError } = await supabase.from("expenses").select("amount");
      if (expensesError) {
        console.error("Error fetching expenses:", expensesError);
      } else {
        console.log("Expenses:", expenses);
      }
    };

    fetchFinancialData();
  }, [userId]);

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

      <Text style={styles.greeting}>Bom dia, {fullName}</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Suas Finanças</Text>
        <Text style={styles.balanceAmount}>{`R$ ${balance.toFixed(2)}`}</Text>
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.rectangle18} />
            <View style={styles.rectangle19} />
            <Text style={styles.columnLabel}>Jan/24</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.rectangle18} />
            <View style={styles.rectangle19} />
            <Text style={styles.columnLabel}>Feb/24</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.rectangle18} />
            <View style={styles.rectangle19} />
            <Text style={styles.columnLabel}>Mar/24</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.rectangle18} />
            <View style={styles.rectangle19} />
            <Text style={styles.columnLabel}>Apr/24</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.rectangle18} />
            <View style={styles.rectangle19} />
            <Text style={styles.columnLabel}>May/24</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.rectangle18} />
            <View style={styles.rectangle19} />
            <Text style={styles.columnLabel}>Jun/24</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.rectangle18} />
            <View style={styles.rectangle19} />
            <Text style={styles.columnLabel}>Jul/24</Text>
          </View>
        </View>
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
    width: wp('40%'),
    height: hp('6%'),
    left: wp('7%'),
    top: hp('14%'),
    fontSize: moderateScale(20),
    lineHeight: moderateScale(24),
    color: "#FFFFFF",
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
    justifyContent: "center",
    alignItems: "flex-end",
  },
  column: {
    alignItems: "center",
  },
  rectangle18: {
    width: wp('2.5%'),
    height: hp('10.5%'),
    backgroundColor: "#2D99FF",
    marginBottom: hp('0.25%'), // Space between the bars
    marginRight: wp('0.5%'), // Space between the bars horizontally
  },
  rectangle19: {
    width: wp('2.5%'),
    height: hp('2.75%'),
    backgroundColor: "#A5F3FF",
    transform: [{ scaleY: -1 }],
    marginTop: hp('0.25%'), // Space between the bars
    marginLeft: wp('5%'), // Space between the bars horizontally
  },
  columnLabel: {
    marginTop: hp('1.5%'), // Space between the column and the label
    fontSize: moderateScale(12),
    textAlign: "center",
    transform: [{ rotate: "90deg" }],
  },
  buttonContainer: { 
    marginTop: hp('60%'), // Adjusted to move buttons up
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
    justifyContent: "space-between" 
  },
  smallButton: {
    width: "48%",
    borderRadius: moderateScale(40),
    height: moderateScale(30), // Further reduced height
  },
});