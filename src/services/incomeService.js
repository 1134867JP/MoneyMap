import { api, handleApiError } from './api';

export const getIncomes = async () => {
  try {
    const response = await api.get('/incomes');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addIncome = async (incomeData) => {
  try {
    const response = await api.post('/incomes', incomeData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};