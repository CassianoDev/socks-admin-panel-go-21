
import { api } from './config';
import { User } from '@/types/types';

// API Documentation:
/**
 * Authentication API
 * 
 * Endpoints:
 * - POST /auth/login - Login user with credentials
 * - POST /auth/register - Register new admin user
 * - POST /auth/logout - Revoke token
 * - GET /auth/me - Get current user profile
 * - PUT /auth/me - Update current user profile
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Authenticate user with email and password
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post('/auth/login', credentials);
  },
  
  // Register new admin user
  register: (userData: RegisterData): Promise<AuthResponse> => {
    return api.post('/auth/register', userData);
  },
  
  // Invalidate current token
  logout: () => {
    return api.post('/auth/logout', {});
  },
  
  // Get current authenticated user profile
  getCurrentUser: (): Promise<User> => {
    return api.get('/auth/me');
  },
  
  // Update current user profile
  updateProfile: (data: Partial<User>): Promise<User> => {
    return api.put('/auth/me', data);
  },
};
