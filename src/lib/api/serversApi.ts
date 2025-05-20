
import { api } from './config';
import { Server, ServerFormValues } from '@/types/types';

// API Documentation:
/**
 * Servers API
 * 
 * Endpoints:
 * - GET /servers - Get all servers
 * - GET /servers/:id - Get server by ID
 * - POST /servers - Create new server
 * - PUT /servers/:id - Update server
 * - DELETE /servers/:id - Delete server
 * - GET /servers/stats - Get server statistics
 * - POST /servers/:id/ping - Update server ping status
 * - GET /servers/online-users - Get online users count by server
 */

export interface ServerFilters {
  country?: string;
  premium?: boolean;
  protocols?: ('http' | 'tls' | 'quic' | 'dnstt')[];
}

export const serversApi = {
  // Get all servers, can be filtered
  getAll: (filters?: ServerFilters): Promise<Server[]> => {
    let endpoint = '/servers';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.country) params.append('country', filters.country);
      if (filters.premium !== undefined) params.append('premium', filters.premium.toString());
      if (filters.protocols && filters.protocols.length) {
        filters.protocols.forEach(p => params.append('protocols', p));
      }
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }
    
    return api.get(endpoint);
  },
  
  // Get server by ID
  getById: (id: string): Promise<Server> => {
    return api.get(`/servers/${id}`);
  },
  
  // Create new server
  create: (serverData: ServerFormValues): Promise<Server> => {
    return api.post('/servers', serverData);
  },
  
  // Update existing server
  update: (id: string, serverData: ServerFormValues): Promise<Server> => {
    return api.put(`/servers/${id}`, serverData);
  },
  
  // Delete server
  delete: (id: string): Promise<void> => {
    return api.delete(`/servers/${id}`);
  },
  
  // Get servers statistics
  getStats: () => {
    return api.get('/servers/stats');
  },
  
  // Update server ping status
  updatePing: (id: string) => {
    return api.post(`/servers/${id}/ping`, {});
  },
  
  // Get online users count by server
  getOnlineUsers: () => {
    return api.get('/servers/online-users');
  },
};
