import axios from 'axios';
import { UserData } from '../interfaces/UserData';
import { getToken } from '../utils/auth';

const BASE_URL = '/api/users';

// Create axios instance with auth interceptor
const api = axios.create();

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = async (): Promise<UserData[]> => {
  try {
    const response = await api.get(BASE_URL);
    return response.data;
  } catch (error: any) {
    console.error('Get users error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};