
import { api } from './config';
import { AppConfig, AppSettingsFormValues } from '@/types/types';

// API Documentation:
/**
 * App Settings API
 * 
 * Endpoints:
 * - GET /app-settings - Get app settings
 * - PUT /app-settings - Update app settings
 * - POST /app-settings/reset - Reset app settings to default
 * - GET /app-settings/versions - Get app versions history
 */

export const appSettingsApi = {
  // Get current app settings
  getSettings: (): Promise<AppConfig> => {
    return api.get('/app-settings');
  },
  
  // Update app settings
  updateSettings: (settings: AppSettingsFormValues): Promise<AppConfig> => {
    return api.put('/app-settings', settings);
  },
  
  // Reset app settings to default
  resetSettings: (): Promise<AppConfig> => {
    return api.post('/app-settings/reset', {});
  },
  
  // Get app versions history
  getVersionHistory: () => {
    return api.get('/app-settings/versions');
  },
};
