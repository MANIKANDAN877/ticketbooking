import axios from 'axios';
import { Bus, Booking, BookingRequest, SearchParams, Route } from '../types';

const API_BASE_URL = 'https://ticketbooking-sgcd.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const busService = {
  // Get all buses
  getAllBuses: async (): Promise<Bus[]> => {
    const response = await api.get('/buses');
    return response.data;
  },

  // Search buses
  searchBuses: async (params: SearchParams): Promise<Bus[]> => {
    const response = await api.get('/buses/search', { params });
    return response.data;
  },

  // Get bus details
  getBusDetails: async (busId: string): Promise<Bus> => {
    const response = await api.get(`/buses/${busId}`);
    return response.data;
  },

  // Get seat availability
  getSeatAvailability: async (busId: string): Promise<{ availableSeats: string[], totalSeats: number, availableCount: number }> => {
    const response = await api.get(`/buses/${busId}/seats`);
    return response.data;
  },
};

export const bookingService = {
  // Create booking
  createBooking: async (bookingData: BookingRequest): Promise<{ success: boolean, booking: Booking }> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get booking by ID
  getBooking: async (bookingId: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<{ success: boolean, booking: Booking }> => {
    const response = await api.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};

export const routeService = {
  // Get all routes
  getAllRoutes: async (): Promise<Route[]> => {
    const response = await api.get('/routes');
    return response.data;
  },

  // Get popular routes
  getPopularRoutes: async (): Promise<Route[]> => {
    const response = await api.get('/routes/popular');
    return response.data;
  },

  // Search routes
  searchRoutes: async (query: string): Promise<Route[]> => {
    const response = await api.get('/routes/search', { params: { query } });
    return response.data;
  },
};

export const healthService = {
  // Health check
  checkHealth: async (): Promise<{ status: string, timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};
