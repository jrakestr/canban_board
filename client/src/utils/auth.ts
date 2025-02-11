import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface DecodedToken {
  exp: number;
  id: number;
  username: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface TokenData {
  exp: number;
}

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_CHECK_INTERVAL = 60000; // Check every minute
let tokenCheckInterval: NodeJS.Timeout | null = null;

// Create axios instance
const api = axios.create();

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  startTokenCheck();
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
  }
};

export const startTokenCheck = (): void => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }
  
  tokenCheckInterval = setInterval(() => {
    const token = getToken();
    if (token) {
      const tokenData = parseToken(token);
      if (tokenData && isTokenExpired(tokenData)) {
        removeToken();
        window.location.href = '/login?expired=true';
      }
    }
  }, TOKEN_EXPIRY_CHECK_INTERVAL);
};

export const parseToken = (token: string): TokenData | null => {
  try {
    const decoded = jwtDecode<TokenData>(token);
    return decoded;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export const isTokenExpired = (tokenData: TokenData): boolean => {
  if (!tokenData.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenData.exp < currentTime;
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.id,
      username: decoded.username
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await api.post('/api/auth/login', data);
    const { token } = response.data;
    if (token) {
      setToken(token);
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  const tokenData = parseToken(token);
  return tokenData ? !isTokenExpired(tokenData) : false;
};