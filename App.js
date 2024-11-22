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
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import AddIncomeScreen from './src/screens/AddIncomeScreen';
import ExpenseStatementScreen from './src/screens/ExpenseStatementScreen';
import IncomeStatementScreen from './src/screens/IncomeStatementScreen';
import { UserProvider } from './src/contexts/userContext';
import MapExpenseScreen from './src/screens/MapExpenseScreen';
import MapScreen from './src/screens/MapScreen';
import CategoryMaintenance from './src/screens/CategoryMaintenance';
import { LocationProvider } from './src/contexts/LocationContext';
import { supabase } from './src/services/supabaseClient';


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
    // Ouvir mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        console.log('Usuário logado:', session.user);
      } else {
        console.log('Usuário não autenticado');
      }
    });

    return () => {
      authListener?.unsubscribe();  // Desinscrever o ouvinte quando o componente for desmontado
    };
  }, []);

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
      <LocationProvider>
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
              name="AddExpenseScreen" // Certifique-se de que o nome está correto
              component={AddExpenseScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddIncomeScreen"
              component={AddIncomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExpenseStatement"
              component={ExpenseStatementScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="IncomeStatement"
              component={IncomeStatementScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="MapExpenseScreen" 
              component={MapExpenseScreen}
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="MapScreen" 
              component={MapScreen}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="CategoryMaintenance"
              component={CategoryMaintenance}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </UserProvider>
  );
};

export default App;