// src/services/axiosConfig.js
import axios from 'axios';

// Configuração básica do Axios
const axiosInstance = axios.create({
  baseURL: '/api',  // URL base para todas as requisições
  timeout: 10000,   // Timeout em milissegundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para lidar com erros (opcional)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Você pode tratar erros comuns aqui, como 401 para redirecionamento de login
    if (error.response && error.response.status === 401) {
      // Redirecionamento para login ou limpar estado de autenticação
      console.log('Sessão expirada. Redirecionando...');
      // Exemplo: window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;