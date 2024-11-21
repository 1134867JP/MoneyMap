import { request } from './api'; // Import the request function

export const login = async (email, password) => {
  try {
    const response = await request('POST', '/login', { email, password });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await request('POST', '/signup', userData);
    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await request('POST', '/logout');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};