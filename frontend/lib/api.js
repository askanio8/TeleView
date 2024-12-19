import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      throw error.response?.data?.detail || 'Registration failed';
    }
  },
  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error.response?.data?.detail || 'Login failed';
    }
  },
  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`);
      return response.data;
    } catch (error) {
      console.error('Logout error:', error.response?.data);
      throw error.response?.data?.detail || 'Logout failed';
    }
  },
  getTelegramDialogs: async () => {
    try {
      const response = await axios.get(`${API_URL}/telegram-dialogs`);
      return response.data;
    } catch (error) {
      console.error('Telegram dialogs fetch error:', error.response?.data);
      throw error.response?.data?.detail || 'Failed to fetch Telegram dialogs';
    }
  },
  startTelegramAuth: async (phoneNumber) => {
    try {
      const response = await axios.post(`${API_URL}/start-telegram-auth`, {
        phone_number: phoneNumber,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Start Telegram Auth error:', error);
      throw error.response?.data?.detail || 'Failed to start Telegram authentication';
    }
  },

verifyTelegramCode: async (phoneNumber, code, phoneCodeHash) => {
    try {
        const response = await axios.post(`${API_URL}/verify-telegram-code`, {
            phone_number: phoneNumber,
            code: code,
            phone_code_hash: phoneCodeHash  // Добавляем hash
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Verify Telegram Code error:', error);
        throw error.response?.data?.detail || 'Failed to verify Telegram code';
    }
},
};