
export interface AdCallback {
  userId: string;
  timestamp: number;
  adType: string;
  status: "completed" | "started" | "error";
}

export interface UserAdStatus {
  userId: string;
  validUntil: number;
  adViews: number;
  lastSeen: number;
}

export type LiveCallback = {
  userId: string;
  adType: string;
  status: "completed" | "started" | "error";
  timestamp: number;
}
