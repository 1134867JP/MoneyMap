import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfileState] = useState(null); // Rename state setter

  const fetchUserProfile = async (user) => {
    if (user) {
      setUserId(user.id);
      try {
        console.log(user.id)
        const response = await api.get(`/profiles/${user.id}`);
        if (response.status === 200) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    }
  };

  const logout = async () => {
    await api.post('/logout');
    setUserId(null);
    setUserProfile(null);
  };

  const setUserProfile = (profile) => {
    setUserProfileState(profile); // Use renamed state setter
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/current_user');
        if (response.data.user) {
          fetchUserProfile(response.data.user);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário atual:', error);
      }
    };

    fetchCurrentUser();

    const authListener = () => {
      // Implement your auth state change listener here
    };

    return () => {
      // Clean up the listener if necessary
    };
  }, []);

  return (
    <UserContext.Provider value={{ userId, userProfile, setUserProfile, fetchUserProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const userAuth = () => useContext(UserContext);