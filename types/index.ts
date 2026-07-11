export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertCategory = 'DUST' | 'TEMPERATURE' | 'SHADING' | 'INVERTER' | 'WIRING' | 'NORMAL';
export type FaultType = 'NONE' | 'DUST' | 'TEMPERATURE_SPIKE' | 'PARTIAL_SHADING' | 'INVERTER_FAULT' | 'WIRING_ISSUE';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  currentPlan: Plan;
  planExpiresAt?: string;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  systemConfig?: SystemConfig;
}

export interface SystemConfig {
  id: string;
  userId: string;
  systemName: string;
  totalCapacity: number;
  location: string;
  tariffRate: number;
  installDate: string;
}

export interface Panel {
  id: string;
  userId: string;
  name: string;
  location: string;
  ratedPower: number;
  installDate: string;
  warrantyYears: number;
  isActive: boolean;
  currentFault: FaultType;
  createdAt: string;
  updatedAt: string;
  readings?: PanelReading[];
  alerts?: Alert[];
}

export interface PanelReading {
  id: string;
  panelId: string;
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
  temperature: number;
  irradiance: number;
  humidity: number;
  efficiency: number;
}

export interface Alert {
  id: string;
  panelId: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  actionRequired: string;
  estimatedLoss?: number;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  panel?: { id: string; name: string; location?: string };
}

export interface DashboardStats {
  totalPower: number;
  systemEfficiency: number;
  totalEnergyToday: number;
  moneySavedToday: number;
  systemHealthScore: number;
  activeAlerts: number;
  panelCount?: number;
}

export interface AIAnalysis {
  severity: string;
  category: string;
  title: string;
  message: string;
  actionRequired: string;
  estimatedDailyLoss: number;
  confidence: number;
  updatedAt?: string;
}

export interface DailySummary {
  id: string;
  panelId: string;
  date: string;
  totalEnergy: number;
  avgEfficiency: number;
  moneySaved: number;
  co2Offset: number;
  peakPower: number;
  peakTime: string;
}

export interface Degradation {
  yearsElapsed: number;
  totalDegradationPercent: number;
  currentEfficiency: number;
}

export interface LifespanProjection {
  year: number;
  efficiency: number;
  powerOutput: number;
}

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
export type PaymentStatus = 'PENDING' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountPaid: number;
  createdAt: string;
}

export interface PaymentHistoryItem {
  id: string;
  userId: string;
  subscriptionId?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  plan: Plan;
  status: PaymentStatus;
  failureReason?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}
