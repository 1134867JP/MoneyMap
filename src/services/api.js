import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.32:3000',
  timeout: 10000,
});

const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message);
  } else if (error.request) {
    throw new Error('Erro de rede. Verifique sua conexão.');
  } else {
    throw new Error(error.message);
  }
};

const request = async (method, url, data = null) => {
  try {
    const response = await api({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export { api, handleApiError, request };