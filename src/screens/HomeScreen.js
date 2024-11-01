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

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { userId } = userAuth();
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

    const fetchProfileImage = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_image, full_name')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error fetching profile image:", error);
        } else {
          setProfileImage(data.profile_image);
          setFullName(data.full_name);
        }
        console.log(data)

      }
    };

    fetchFinancialData();
    fetchProfileImage();
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
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
            onPress={() => navigation.navigate("AddExpense")}
            label="Adicionar Despesa"
            textStyle={styles.smallButtonText}
          />
          <CustomButton
            style={styles.largeButton}
            gradientColors={["#4960F9", "#4033FF"]}
            onPress={() => navigation.navigate("AddIncome")}
            label="Adicionar Receitas"
            textStyle={styles.smallButtonText}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  backgroundGradient: {
    position: "absolute",
    width,
    height: 278,
    top: 0,
    borderBottomLeftRadius: 66,
    borderBottomRightRadius: 66,
  },
  profileImage: {
    position: "absolute",
    width: 50,
    height: 50,
    left: width - 80,
    top: 68,
    borderRadius: 18,
    filter: "drop-shadow(4px 2px 11px rgba(0, 0, 0, 0.25))",
  },
  profileImagePlaceholder: {
    position: "absolute",
    width: 50,
    height: 50,
    left: width - 80,
    top: 68,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    filter: "drop-shadow(4px 2px 11px rgba(0, 0, 0, 0.25))",
  },
  ellipse8: {
    position: "absolute",
    width: 10,
    height: 10,
    left: width - 40,
    top: 108,
    backgroundColor: "#20C968",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  greeting: {
    position: "absolute",
    width: 151,
    height: 48,
    left: 27,
    top: 113,
    fontFamily: "Montserrat",
    fontSize: 20,
    lineHeight: 24,
    color: "#FFFFFF",
  },
  balanceCard: {
    position: "absolute",
    width: 350,
    height: 290,
    left: 27,
    top: 188,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
  },
  balanceTitle: { fontFamily: "Montserrat", fontSize: 16, color: "#000000" },
  balanceAmount: {
    fontFamily: "Montserrat",
    fontSize: 30,
    fontWeight: "700",
    color: "#2D99FF",
    marginTop: 10,
  },
  columns: {
    position: "absolute",
    width: 250,
    height: 150, // Increased height to accommodate the labels
    left: 50, // Centered horizontally within the balance card
    top: 100, // Positioned below the balance amount
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  column: {
    alignItems: "center",
  },
  rectangle18: {
    width: 9,
    height: 85.51,
    backgroundColor: "#2D99FF",
    marginBottom: 2, // Space between the bars
    marginRight: 2, // Space between the bars horizontally
  },
  rectangle19: {
    width: 9,
    height: 22.43,
    backgroundColor: "#A5F3FF",
    transform: [{ scaleY: -1 }],
    marginTop: 2, // Space between the bars
    marginLeft: 20, // Space between the bars horizontally
  },
  columnLabel: {
    marginTop: 15, // Space between the column and the label
    fontSize: 12,
    textAlign: "center",
    transform: [{ rotate: "90deg" }],
  },
  buttonContainer: { marginTop: 550, paddingHorizontal: 29 },
  largeButtonRow: {
    justifyContent: "space-between",
  }, // Espaço entre botões grandes
  largeButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 40,
    height: 40, // Further reduced height
  },
  smallButtonRow: { flexDirection: "row", justifyContent: "space-between" },
  smallButton: {
    width: "48%",
    borderRadius: 40,
    height: 30, // Further reduced height
  },
  buttonText: {
    fontFamily: "Montserrat",
    fontSize: 14, // Further reduced font size
    color: "#FFFFFF",
  },
  smallButtonText: {
    fontFamily: "Montserrat",
    fontSize: 12, // Further reduced font size
    color: "#FFFFFF",
  },
});