import axios from 'axios';
import { TicketData } from '../interfaces/TicketData';
import { getToken } from '../utils/auth';

const BASE_URL = '/api/tickets';

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

export const getTickets = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const createTicket = async (ticket: Omit<TicketData, 'id'>) => {
  const response = await api.post(BASE_URL, ticket);
  return response.data;
};

export const retrieveTicket = async (id: number) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateTicket = async (ticket: TicketData) => {
  try {
    const response = await api.put(`${BASE_URL}/${ticket.id}`, ticket);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Update ticket error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const updateTicketStatus = async (ticket: TicketData) => {
  try {
    // First get the current ticket to preserve all fields
    const currentTicket = await retrieveTicket(ticket.id);
    
    // Update only the status while preserving other fields
    const updatedTicket = {
      ...currentTicket,
      status: ticket.status
    };
    
    // Use the main update endpoint
    const response = await api.put(`${BASE_URL}/${ticket.id}`, updatedTicket);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Update ticket status error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const deleteTicket = async (id: number) => {
  await api.delete(`${BASE_URL}/${id}`);
};