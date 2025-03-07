import axiosInstance from './axiosInstance';
import { LoginCredentials, LoginResponse } from '../types/auth';

export const loginApi = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  };

  