
import { api } from './config';
import { PremiumUser, UserFormValues } from '@/types/types';

// API Documentation:
/**
 * Premium Users API
 * 
 * Endpoints:
 * - GET /premium-users - Get all premium users
 * - GET /premium-users/:id - Get premium user by ID
 * - POST /premium-users - Create new premium user
 * - PUT /premium-users/:id - Update premium user
 * - DELETE /premium-users/:id - Delete premium user
 * - GET /premium-users/stats - Get premium user statistics
 * - GET /premium-users/verify/:e2id - Verify premium status by e2id
 */

export interface UserFilters {
  expired?: boolean;
  suspicious?: boolean;
  email?: string;
}

export const premiumUsersApi = {
  // Get all premium users, can be filtered
  getAll: (filters?: UserFilters): Promise<PremiumUser[]> => {
    let endpoint = '/premium-users';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.expired !== undefined) params.append('expired', filters.expired.toString());
      if (filters.suspicious !== undefined) params.append('suspicious', filters.suspicious.toString());
      if (filters.email) params.append('email', filters.email);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }
    
    return api.get(endpoint);
  },
  
  // Get premium user by ID
  getById: (id: string): Promise<PremiumUser> => {
    return api.get(`/premium-users/${id}`);
  },
  
  // Create new premium user
  create: (userData: UserFormValues): Promise<PremiumUser> => {
    return api.post('/premium-users', userData);
  },
  
  // Update existing premium user
  update: (id: string, userData: UserFormValues): Promise<PremiumUser> => {
    return api.put(`/premium-users/${id}`, userData);
  },
  
  // Delete premium user
  delete: (id: string): Promise<void> => {
    return api.delete(`/premium-users/${id}`);
  },
  
  // Get premium users statistics
  getStats: () => {
    return api.get('/premium-users/stats');
  },
  
  // Verify premium status by e2id (device ID)
  verifyPremiumStatus: (e2id: string) => {
    return api.get(`/premium-users/verify/${e2id}`);
  },
};
