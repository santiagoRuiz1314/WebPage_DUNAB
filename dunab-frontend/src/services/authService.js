import api from './api';

const authService = {
  // TODO: Implementar login
  login: async (email, password) => {
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
  },

  // TODO: Implementar registro
  register: async (userData) => {
    // const response = await api.post('/auth/register', userData);
    // return response.data;
  },

  // TODO: Implementar logout
  logout: async () => {
    // const response = await api.post('/auth/logout');
    // return response.data;
  },

  // TODO: Implementar refresh token
  refreshToken: async () => {
    // const response = await api.post('/auth/refresh');
    // return response.data;
  },

  // TODO: Implementar verificación de token
  verifyToken: async () => {
    // const response = await api.get('/auth/verify');
    // return response.data;
  },
};

export default authService;
