/**
 * Common types
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Dashboard types
 */
export interface SystemHealth {
  gateway: 'normal' | 'degraded' | 'down';
  auth: 'normal' | 'degraded' | 'down';
  project: 'normal' | 'degraded' | 'down';
  ecs: 'normal' | 'degraded' | 'down';
}

export interface StatusCard {
  title: string;
  icon: string;
  mainValue: string | number;
  description: string;
  status: 'success' | 'warning' | 'error';
}

export interface GatewayMetrics {
  timestamp: string;
  requestsPerSecond: number;
  successRate: number;
  errorRate: number;
  avgResponseTime: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  roleDistribution: {
    admin: number;
    user: number;
  };
}

export interface ECSStatus {
  running: number;
  stopped: number;
  availability: number;
  cpuUsage: number;
}

export interface ProjectResourceUsage {
  projectId: string;
  projectName: string;
  cpu: number;
  ram: number;
  storage: number;
}

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'alert';
  type: string;
  message: string;
  status: 'open' | 'acknowledged' | 'resolved';
  timestamp: string;
}

export interface AutomationTask {
  id: string;
  type: 'backup' | 'scaling' | 'cleanup' | 'maintenance';
  status: 'success' | 'failed' | 'pending';
  scheduledAt: string;
}

export interface CostOverview {
  monthlyCost: number;
  predictedCost: number;
  breakdown: {
    byResource: Record<string, number>;
    byProject: Record<string, number>;
  };
}

export interface AuditLog {
  id: string;
  time: string;
  user: string;
  action: string;
  details: string;
}

export interface Notification {
  id: string;
  channel: 'email' | 'sms' | 'wechat';
  type: 'alert' | 'approval' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

