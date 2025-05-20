
import { api } from './config';
import { AdCallback, UserAdStatus, LiveCallback } from '@/types/adLogs';

// API Documentation:
/**
 * Ad Logs API
 * 
 * Endpoints:
 * - GET /ad-logs/callbacks - Get all ad callbacks history
 * - GET /ad-logs/user-status - Get all users ad status
 * - GET /ad-logs/user-status/:userId - Get specific user ad status
 * - POST /ad-logs/callback - Register new ad callback
 * - GET /ad-logs/stats - Get ad statistics
 * - WS /ws/ad-logs - WebSocket connection for real-time ad callbacks
 */

export interface AdLogFilters {
  userId?: string;
  adType?: string;
  status?: "completed" | "started" | "error";
  fromDate?: number;
  toDate?: number;
}

export const adLogsApi = {
  // Get all ad callbacks history, can be filtered
  getCallbacks: (filters?: AdLogFilters): Promise<AdCallback[]> => {
    let endpoint = '/ad-logs/callbacks';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.adType) params.append('adType', filters.adType);
      if (filters.status) params.append('status', filters.status);
      if (filters.fromDate) params.append('fromDate', filters.fromDate.toString());
      if (filters.toDate) params.append('toDate', filters.toDate.toString());
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }
    
    return api.get(endpoint);
  },
  
  // Get all users ad status
  getUserStatuses: (): Promise<UserAdStatus[]> => {
    return api.get('/ad-logs/user-status');
  },
  
  // Get specific user ad status
  getUserStatus: (userId: string): Promise<UserAdStatus> => {
    return api.get(`/ad-logs/user-status/${userId}`);
  },
  
  // Register new ad callback
  registerCallback: (callback: Omit<AdCallback, 'timestamp'>): Promise<AdCallback> => {
    return api.post('/ad-logs/callback', callback);
  },
  
  // Get ad statistics
  getStats: () => {
    return api.get('/ad-logs/stats');
  },
  
  // Setup WebSocket connection for real-time ad callbacks
  setupWebSocket: (onMessage: (callback: LiveCallback) => void): WebSocket => {
    const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
    const socket = new WebSocket(`${wsBaseUrl}/ad-logs`);
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as LiveCallback;
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    return socket;
  },
};
