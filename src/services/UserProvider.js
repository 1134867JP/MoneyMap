import React, { useEffect, useState } from 'react';
import { AuthContext } from '../contexts/userContext'; // Adjusted import
import { supabase } from '../services/supabaseClient'; // Adjusted import

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };

    fetchCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const fetchIncomes = async (userId) => {
    if (!userId) {
      throw new Error('User ID is null');
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
      throw new Error('User ID is null');
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

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserProvider;