import { api, handleApiError } from './api';

export const getExpenses = async () => {
  try {
    const response = await api.get('/expenses');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addExpense = async (expenseData) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};