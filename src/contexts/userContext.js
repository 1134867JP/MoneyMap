import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const UserContext = createContext();

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
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{ userId, userProfile, setUserProfile, fetchUserProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const userAuth = () => useContext(UserContext);