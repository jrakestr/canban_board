import axios from 'axios';
import { UserLogin } from '../interfaces/UserLogin';
import { setToken, removeToken } from '../utils/auth';

const BASE_URL = '/api/auth';

const debug = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Debug]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Auth Error]', ...args);
    }
  }
};

export const login = async (credentials: UserLogin) => {
  try {
    debug.log('Login Request:', {
      url: `${BASE_URL}/login`,
      credentials: { ...credentials, password: '[REDACTED]' }
    });
    
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    debug.log('Server Response:', {
      status: response.status,
      headers: response.headers,
      data: { ...response.data, token: '[REDACTED]' }
    });
    
    const { token, user } = response.data;
    
    if (!token) {
      debug.error('Token Missing in Response');
      throw new Error('No token received from server');
    }
    
    debug.log('Login successful', { 
      user,
      tokenReceived: !!token,
      tokenLength: token.length
    });
    
    // Store the token
    setToken(token);
    
    // Configure axios to use the token for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    debug.log('Axios headers configured with token');
    
    return { user, success: true };
  } catch (error: any) {
    debug.error('Login Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        baseURL: error.config?.baseURL,
      }
    });
    
    // Clean up any existing tokens
    removeToken();
    delete axios.defaults.headers.common['Authorization'];
    
    // Throw a user-friendly error with detailed debug info
    if (error.response?.status === 401) {
      throw new Error('Invalid username or password');
    } else if (error.response?.status === 500) {
      debug.error('Server Error:', error.response.data);
      throw new Error('Server error occurred. Please try again.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Login failed. Please try again.');
    }
  }
};