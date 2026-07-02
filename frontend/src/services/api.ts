import axios from 'axios';

// Instância do Axios apontando para a URL base do backend Express
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para injetar o token JWT de forma automática em todas as chamadas HTTP
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@ProfitPulse:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar expiração de token e deslogar automaticamente no front-end
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Se a API retornar Não Autorizado ou Proibido, limpa o token e força o reload/login
      localStorage.removeItem('@ProfitPulse:token');
      localStorage.removeItem('@ProfitPulse:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
