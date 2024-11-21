import { api, handleApiError } from './api';

export const getMonthlyFinanceData = async () => {
  try {
    const response = await api.get('/finance/monthly');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};