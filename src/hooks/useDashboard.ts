import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';
import type {
  SystemHealth,
  GatewayMetrics,
  UserStats,
  ECSStatus,
  ProjectResourceUsage,
  Alert,
  AutomationTask,
  CostOverview,
  AuditLog,
  Notification,
} from '@/types';

/**
 * TanStack Query hooks for Dashboard data
 */
export function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey: ['dashboard', 'system-health'],
    queryFn: () => dashboardApi.getSystemHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useActiveAlerts() {
  return useQuery<number>({
    queryKey: ['dashboard', 'active-alerts'],
    queryFn: () => dashboardApi.getActiveAlerts(),
    refetchInterval: 10000,
  });
}

export function usePendingApprovals() {
  return useQuery<number>({
    queryKey: ['dashboard', 'pending-approvals'],
    queryFn: () => dashboardApi.getPendingApprovals(),
    refetchInterval: 15000,
  });
}

export function useGatewayMetrics(timeRange: string = '24h') {
  return useQuery<GatewayMetrics[]>({
    queryKey: ['dashboard', 'gateway-metrics', timeRange],
    queryFn: () => dashboardApi.getGatewayMetrics(timeRange),
    refetchInterval: 10000,
  });
}

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ['dashboard', 'user-stats'],
    queryFn: () => dashboardApi.getUserStats(),
    refetchInterval: 60000,
  });
}

export function useECSStatus() {
  return useQuery<ECSStatus>({
    queryKey: ['dashboard', 'ecs-status'],
    queryFn: () => dashboardApi.getECSStatus(),
    refetchInterval: 15000,
  });
}

export function useProjectResourceUsage() {
  return useQuery<ProjectResourceUsage[]>({
    queryKey: ['dashboard', 'project-usage'],
    queryFn: () => dashboardApi.getProjectResourceUsage(),
    refetchInterval: 30000,
  });
}

export function useActiveAlarms() {
  return useQuery<Alert[]>({
    queryKey: ['dashboard', 'active-alarms'],
    queryFn: () => dashboardApi.getActiveAlarms(),
    refetchInterval: 10000,
  });
}

export function useAutomationTasks() {
  return useQuery<AutomationTask[]>({
    queryKey: ['dashboard', 'automation-tasks'],
    queryFn: () => dashboardApi.getAutomationTasks(),
    refetchInterval: 30000,
  });
}

export function useCostOverview() {
  return useQuery<CostOverview>({
    queryKey: ['dashboard', 'cost-overview'],
    queryFn: () => dashboardApi.getCostOverview(),
    refetchInterval: 60000,
  });
}

export function useAuditLogs(limit: number = 10) {
  return useQuery<AuditLog[]>({
    queryKey: ['dashboard', 'audit-logs', limit],
    queryFn: () => dashboardApi.getAuditLogs(limit),
    refetchInterval: 30000,
  });
}

export function useRecentNotifications(limit: number = 10) {
  return useQuery<Notification[]>({
    queryKey: ['dashboard', 'notifications', limit],
    queryFn: () => dashboardApi.getRecentNotifications(limit),
    refetchInterval: 15000,
  });
}

