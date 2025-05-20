
import { AdCallback, UserAdStatus } from "@/types/adLogs";

// Generate a random timestamp within the last 7 days
const randomTimestamp = () => {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  return Math.floor(Math.random() * (now - sevenDaysAgo) + sevenDaysAgo);
};

// Generate a random user ID
const randomUserId = () => {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
};

// Ad types
const adTypes = ["premium", "standard", "featured", "video", "interactive"];

// Generate mock ad callbacks
export const mockAdCallbacks: AdCallback[] = Array.from({ length: 50 }, () => ({
  userId: randomUserId(),
  timestamp: randomTimestamp(),
  adType: adTypes[Math.floor(Math.random() * adTypes.length)],
  status: Math.random() > 0.1 ? "completed" : Math.random() > 0.5 ? "started" : "error",
}));

// Generate mock user ad status data
export const mockUserAdStatus: UserAdStatus[] = Array.from({ length: 15 }, () => {
  const now = Date.now();
  return {
    userId: randomUserId(),
    validUntil: now + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in the next 7 days
    adViews: Math.floor(Math.random() * 20),
    lastSeen: now - Math.floor(Math.random() * 24 * 60 * 60 * 1000), // Within the last day
  };
});
