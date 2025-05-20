
import { api } from './config';
import { Config, ConfigFormValues } from '@/types/types';

// API Documentation:
/**
 * Configurations API
 * 
 * Endpoints:
 * - GET /configs - Get all configs
 * - GET /configs/:id - Get config by ID
 * - POST /configs - Create new config
 * - PUT /configs/:id - Update config
 * - DELETE /configs/:id - Delete config
 * - GET /configs/stats - Get config statistics
 * - POST /configs/:id/download - Register config download
 * - POST /configs/:id/vote - Vote (positive/negative) on config
 */

export interface ConfigFilters {
  type?: string;
  premium?: boolean;
  operator?: string;
}

export interface VoteData {
  positive: boolean;
}

export const configsApi = {
  // Get all configs, can be filtered
  getAll: (filters?: ConfigFilters): Promise<Config[]> => {
    let endpoint = '/configs';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.premium !== undefined) params.append('forpremium', filters.premium.toString());
      if (filters.operator) params.append('operator', filters.operator);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }
    
    return api.get(endpoint);
  },
  
  // Get config by ID
  getById: (id: string): Promise<Config> => {
    return api.get(`/configs/${id}`);
  },
  
  // Create new config
  create: (configData: ConfigFormValues): Promise<Config> => {
    return api.post('/configs', configData);
  },
  
  // Update existing config
  update: (id: string, configData: ConfigFormValues): Promise<Config> => {
    return api.put(`/configs/${id}`, configData);
  },
  
  // Delete config
  delete: (id: string): Promise<void> => {
    return api.delete(`/configs/${id}`);
  },
  
  // Get configs statistics
  getStats: () => {
    return api.get('/configs/stats');
  },
  
  // Register a config download
  registerDownload: (id: string) => {
    return api.post(`/configs/${id}/download`, {});
  },
  
  // Vote on a config (positive or negative)
  vote: (id: string, voteData: VoteData) => {
    return api.post(`/configs/${id}/vote`, voteData);
  },
};
