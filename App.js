import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './src/components/CustomTabBar';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LaunchScreen from './src/screens/LaunchScreen';
import Login from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPassword from './src/screens/ForgotPasswordScreen';
import NotificationsScreen from './src/screens/NotificationScreen';
import AddExpense from './src/screens/AddExpenseScreen';
import AddIncome from './src/screens/AddIncomeScreen';
import ExpenseStatementScreen from './src/screens/ExpenseStatementScreen';
import { UserProvider } from './src/contexts/userContext';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator tabBar={() => <CustomTabBar />}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Notification" component={NotificationsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // await loadResources();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Launch">
          <Stack.Screen
            name="Launch"
            component={LaunchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpense}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddIncome"
            component={AddIncome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ExpenseStatement"
            component={ExpenseStatementScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;