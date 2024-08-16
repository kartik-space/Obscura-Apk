import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Booking } from '../types/booking';
import { DriverProfile } from '../types/DriverProfile';
import { DriverData } from '../types/driverTypes'; // Adjust import path

const apiClient = axios.create({
  baseURL: 'https://agobackend-test.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerDriver = async (driverData: DriverData) => {
  try {
    const response = await apiClient.post('/driver/register', driverData);
    return response.data;
  } catch (error : any) {
    if (error.response) {
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};

interface LoginData {
  phone: string;
  password: string;
}

export const loginDriver = async (loginData: LoginData) => {
  try {
    const response = await apiClient.post('/driver/login', loginData);
    const { driver, token } = response.data;

    await AsyncStorage.setItem('driverId', driver.id);
    await AsyncStorage.setItem('token', token);

    return response.data;

  } catch (error: any) {
    if (error.response) {
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};


export const updateDriverStatus = async (driverId: string, status: boolean) => {
  try {
    const response = await apiClient.put(`/driver/${driverId}/status`, { status });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};


export const fetchDriverBookings = async (driverId: string): Promise<Booking[]> => {
  if (!driverId) {
    throw new Error('Driver ID is required');
  }
  try {
    const response = await apiClient.get(`/driver/bookings/all/${driverId}`);
    return response.data.bookings;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};


// Updated fetchDriverProfile to use apiClient
export const fetchDriverProfile = async (id: string): Promise<DriverProfile> => {
  const response = await apiClient.get(`/driver/drivers/${id}`); // Corrected endpoint
  return response.data;
};