
export * from './config';
export * from './authApi';
export * from './serversApi';
export * from './configsApi';
export * from './usersApi';
export * from './adLogsApi';
export * from './appSettingsApi';

// Main API object that combines all API modules
import { api } from './config';
import { authApi } from './authApi';
import { serversApi } from './serversApi';
import { configsApi } from './configsApi';
import { premiumUsersApi } from './usersApi';
import { adLogsApi } from './adLogsApi';
import { appSettingsApi } from './appSettingsApi';

// Export a combined API object
export const API = {
  auth: authApi,
  servers: serversApi,
  configs: configsApi,
  premiumUsers: premiumUsersApi,
  adLogs: adLogsApi,
  appSettings: appSettingsApi,
  raw: api // Access to raw API methods
};

export default API;
