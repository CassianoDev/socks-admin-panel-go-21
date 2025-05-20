
import { Server, Config, PremiumUser, AppConfig, ServerStats, ConfigStats, UserStats } from '../types/types';

// Mock data for servers
export const servers: Server[] = [
  {
    _id: "6399bbfaad77622b6661a085",
    cloudFlareDomain: "server-br1.vpnapp.cloud",
    dnsttDomain: "dns.vpnapp.cloud",
    country: "BR",
    city: "São Paulo",
    state: "SP",
    ipv4: "123.45.67.89",
    ipv6: "",
    portHTTP: "80",
    portTLS: "443",
    portUDP: "0",
    portDNSTT: "53",
    flag: "brflag.png",
    premium: true,
    invisible: false,
    usersAdsed: 0,
    tls: true,
    quic: false,
    http: true,
    dnstt: false,
    lastPing: 1747740165,
    UniSkip: true,
    usage: 1,
    onlineUsers: 31,
    capacity: 600,
    cdnNumber: 0,
    cdnName: "",
    cdn: true,
    cdns: {
      cloudflare: ["cf.vpnapp.cloud"],
      googlecloud: ["gcloud.vpnapp.net"],
      cloudfront: ["cdn.vpnapp.net"]
    }
  },
  {
    _id: "6399bbfaad77622b6661a086",
    cloudFlareDomain: "server-us1.vpnapp.cloud",
    dnsttDomain: "dns-us.vpnapp.cloud",
    country: "US",
    city: "New York",
    state: "NY",
    ipv4: "123.45.67.90",
    ipv6: "2001:db8::1",
    portHTTP: "80",
    portTLS: "443",
    portUDP: "4444",
    portDNSTT: "53",
    flag: "usflag.png",
    premium: true,
    invisible: false,
    usersAdsed: 0,
    tls: true,
    quic: true,
    http: true,
    dnstt: true,
    lastPing: 1747740000,
    UniSkip: false,
    usage: 2,
    onlineUsers: 124,
    capacity: 800,
    cdnNumber: 1,
    cdnName: "cloudflare",
    cdn: true,
    cdns: {
      cloudflare: ["cf-us.vpnapp.cloud"],
      googlecloud: ["gcloud-us.vpnapp.net"],
      cloudfront: ["cdn-us.vpnapp.net"]
    }
  },
  {
    _id: "6399bbfaad77622b6661a087",
    cloudFlareDomain: "server-jp1.vpnapp.cloud",
    dnsttDomain: "dns-jp.vpnapp.cloud",
    country: "JP",
    city: "Tokyo",
    state: "TK",
    ipv4: "123.45.67.91",
    ipv6: "",
    portHTTP: "80",
    portTLS: "443",
    portUDP: "0",
    portDNSTT: "53",
    flag: "jpflag.png",
    premium: false,
    invisible: false,
    usersAdsed: 5,
    tls: true,
    quic: false,
    http: true,
    dnstt: false,
    lastPing: 1747739000,
    UniSkip: true,
    usage: 3,
    onlineUsers: 87,
    capacity: 400,
    cdnNumber: 0,
    cdnName: "",
    cdn: false,
    cdns: {
      cloudflare: [],
      googlecloud: [],
      cloudfront: []
    }
  },
];

// Mock data for configs
export const configs: Config[] = [
  {
    _id: "66b3f5ee2b9bf13db95abdcc",
    name: "INTERNET OPTIMIZER",
    host: "141.193.213.11",
    dnsHost: "",
    sni: "same",
    payload: "",
    type: "tls",
    default: false,
    downloaded: 1256,
    cdn: true,
    cdnName: "cloudflare",
    cdnNumber: 1,
    notes: true,
    noteMsg: "cloudflare CDN.",
    testPriority: 1,
    operator: "UNIVERSAL BYPASS",
    onlines: 542,
    votesPositive: 321,
    votesNegative: 12,
    multiproxy: false,
    forpremium: false
  },
  {
    _id: "66b3f5ee2b9bf13db95abdcd",
    name: "GAMING BOOST",
    host: "185.72.49.13",
    dnsHost: "8.8.8.8",
    sni: "custom",
    payload: "GET / HTTP/1.1[crlf]Host: games.example.com[crlf][crlf]",
    type: "http",
    default: true,
    downloaded: 3210,
    cdn: false,
    cdnName: "",
    cdnNumber: 0,
    notes: true,
    noteMsg: "Optimized for gaming.",
    testPriority: 2,
    operator: "GAMING PRO",
    onlines: 895,
    votesPositive: 740,
    votesNegative: 35,
    multiproxy: true,
    forpremium: true
  },
  {
    _id: "66b3f5ee2b9bf13db95abdce",
    name: "STREAMING CONFIG",
    host: "104.17.49.74",
    dnsHost: "",
    sni: "streaming.example.com",
    payload: "",
    type: "tls",
    default: false,
    downloaded: 2456,
    cdn: true,
    cdnName: "cloudflare",
    cdnNumber: 2,
    notes: true,
    noteMsg: "Best for streaming services.",
    testPriority: 2,
    operator: "STREAM MASTER",
    onlines: 1204,
    votesPositive: 962,
    votesNegative: 78,
    multiproxy: false,
    forpremium: true
  }
];

// Mock data for premium users
export const premiumUsers: PremiumUser[] = [
  {
    _id: "64e7f9b28bf3efeef5b5d9a5",
    e2id: "E00416968202308250045NOvc52xxLFN",
    txid: "9f02c8f6538e4032a3798213331c110c",
    date: "2023-08-25T00:45:35.000Z",
    dateStart: 1692924338,
    dateEnd: 1708821938,
    pricePayed: "0.06",
    months: 6,
    emaiL: "user1@example.com",
    suspicious: false,
    used: true,
    expired: false
  },
  {
    _id: "64e7f9b28bf3efeef5b5d9a6",
    e2id: "E00416968202308250046NOvc52xxXYZ",
    txid: "9f02c8f6538e4032a3798213331c111d",
    date: "2023-09-10T12:30:22.000Z",
    dateStart: 1694350222,
    dateEnd: 1725886222,
    pricePayed: "0.12",
    months: 12,
    emaiL: "user2@example.com",
    suspicious: false,
    used: true,
    expired: false
  },
  {
    _id: "64e7f9b28bf3efeef5b5d9a7",
    e2id: "E00416968202308250047NOvc52xxABC",
    txid: "9f02c8f6538e4032a3798213331c112e",
    date: "2023-07-05T08:15:10.000Z",
    dateStart: 1688545510,
    dateEnd: 1696321510,
    pricePayed: "0.03",
    months: 3,
    emaiL: "user3@example.com",
    suspicious: true,
    used: true,
    expired: true
  }
];

// Mock data for app config
export const appConfig: AppConfig = {
  _id: "app_config_1",
  adsMediation: true,
  maintenenceMode: false,
  deviceLocked: false,
  versionNow: 4.2,
  buildNow: 103,
  appBg: "",
  curveBg: "",
  default: true,
  timeMaxHour: 36,
  timeStepHour: 1,
  serversUpdated: "2023-11-15",
  configsUpdated: "2023-11-20",
  AgentInstructions: "Process user requests efficiently",
  AgentApiKeyGemini: "API_KEY_REMOVED",
  AgentModel: "gemini-pro"
};

// Mock data for analytics/dashboard
export const serverStats: ServerStats = {
  totalServers: 3,
  activeServers: 3,
  premiumServers: 2,
  totalCapacity: 1800,
  totalOnlineUsers: 242
};

export const configStats: ConfigStats = {
  totalConfigs: 3,
  downloadedTotal: 6922,
  positiveVotes: 2023,
  negativeVotes: 125
};

export const userStats: UserStats = {
  totalPremiumUsers: 3,
  activeUsers: 2,
  expiredUsers: 1,
  revenueTotal: 0.21
};

// Users for login
export const users = [
  {
    id: "1",
    email: "admin@vpnapp.com",
    name: "Admin User",
    password: "admin123", // In a real app, this would be hashed
    role: "admin" as const
  },
  {
    id: "2",
    email: "user@vpnapp.com",
    name: "Regular User",
    password: "user123", // In a real app, this would be hashed
    role: "user" as const
  }
];

// Chart data
export const userActivityData = [
  { name: 'Jan', users: 340 },
  { name: 'Feb', users: 420 },
  { name: 'Mar', users: 380 },
  { name: 'Apr', users: 520 },
  { name: 'May', users: 480 },
  { name: 'Jun', users: 650 },
  { name: 'Jul', users: 700 },
  { name: 'Aug', users: 720 },
  { name: 'Sep', users: 800 },
  { name: 'Oct', users: 850 },
  { name: 'Nov', users: 920 },
  { name: 'Dec', users: 980 },
];

export const premiumSalesData = [
  { name: 'Jan', sales: 10 },
  { name: 'Feb', sales: 15 },
  { name: 'Mar', sales: 12 },
  { name: 'Apr', sales: 18 },
  { name: 'May', sales: 22 },
  { name: 'Jun', sales: 28 },
  { name: 'Jul', sales: 32 },
  { name: 'Aug', sales: 38 },
  { name: 'Sep', sales: 42 },
  { name: 'Oct', sales: 48 },
  { name: 'Nov', sales: 52 },
  { name: 'Dec', sales: 60 },
];

export const serverUsageData = [
  { name: 'Brazil', value: 35 },
  { name: 'USA', value: 45 },
  { name: 'Japan', value: 20 },
];
