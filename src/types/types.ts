
// Server types
export interface Server {
  _id: string;
  cloudFlareDomain: string;
  dnsttDomain: string;
  country: string;
  city: string;
  state: string;
  ipv4: string;
  ipv6: string;
  portHTTP: string;
  portTLS: string;
  portUDP: string;
  portDNSTT: string;
  flag: string;
  premium: boolean;
  invisible: boolean;
  usersAdsed: number;
  tls: boolean;
  quic: boolean;
  http: boolean;
  dnstt: boolean;
  lastPing: number;
  UniSkip: boolean;
  usage: number;
  onlineUsers: number;
  capacity: number;
  cdnNumber: number;
  cdnName: string;
  cdn: boolean;
  cdns: {
    cloudflare: string[];
    googlecloud: string[];
    cloudfront: string[];
  };
}

// Config types
export interface Config {
  _id: string;
  name: string;
  host: string;
  dnsHost: string;
  sni: string;
  payload: string;
  type: string;
  default: boolean;
  downloaded: number;
  cdn: boolean;
  cdnName: string;
  cdnNumber: number;
  notes: boolean;
  noteMsg: string;
  testPriority: number;
  operator: string;
  onlines: number;
  votesPositive: number;
  votesNegative: number;
  multiproxy: boolean;
  forpremium: boolean;
}

// Premium user types
export interface PremiumUser {
  _id: string;
  e2id: string;
  txid: string;
  date: string;
  dateStart: number;
  dateEnd: number;
  pricePayed: string;
  months: number;
  emaiL: string;
  suspicious: boolean;
  used: boolean;
  expired: boolean;
}

// App config types
export interface AppConfig {
  _id: string;
  adsMediation: boolean;
  maintenenceMode: boolean;
  deviceLocked: boolean;
  versionNow: number;
  buildNow: number;
  appBg: string;
  curveBg: string;
  default: boolean;
  timeMaxHour: number;
  timeStepHour: number;
  serversUpdated: string;
  configsUpdated: string;
  AgentInstructions: string;
  AgentApiKeyGemini: string;
  AgentModel: string;
}

// Dashboard analytics types
export interface ServerStats {
  totalServers: number;
  activeServers: number;
  premiumServers: number;
  totalCapacity: number;
  totalOnlineUsers: number;
}

export interface ConfigStats {
  totalConfigs: number;
  downloadedTotal: number;
  positiveVotes: number;
  negativeVotes: number;
}

export interface UserStats {
  totalPremiumUsers: number;
  activeUsers: number;
  expiredUsers: number;
  revenueTotal: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

