import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const UserContext = createContext();

const fetchIncomes = async (userId) => {
  if (!userId) {
    console.error('User ID is null');
    return [];
  }

  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching incomes: ${error.message}`);
  }

  return data;
};

const fetchExpenses = async (userId) => {
  if (!userId) {
    console.error('User ID is null');
    return [];
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching expenses: ${error.message}`);
  }

  return data;
};

const fetchNotifications = async (userId) => {
  if (!userId) {
    console.error('User ID is null');
    return [];
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }

  return data;
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = async (user) => {
    if (user) {
      setUserId(user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, birthdate, profile_image')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
      } else {
        setUserProfile(data);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setUserProfile(null);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        fetchUserProfile(user);
      } else {
        console.log('Usuário não autenticado');
      }
    };

    fetchCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setUserProfile(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userId, userProfile, setUserProfile, fetchUserProfile, fetchIncomes, fetchExpenses, fetchNotifications, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const userAuth = () => useContext(UserContext);