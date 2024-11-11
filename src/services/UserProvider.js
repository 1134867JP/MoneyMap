import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getAuth } from 'firebase/auth'; // Adjusted import

const auth = getAuth(); // Initialize auth

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authListener = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    if (typeof authListener.unsubscribe === 'function') {
      return () => authListener.unsubscribe();
    } else if (typeof authListener === 'function') {
      return authListener;
    } else {
      console.warn('authListener does not have an unsubscribe function');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserProvider;