'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import StatusCard from '@/components/dashboard/StatusCard';
import LineChartPanel from '@/components/dashboard/LineChartPanel';
import ResourceUsageTable from '@/components/dashboard/ResourceUsageTable';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  Clock,
  Server,
  Users,
  PieChart,
  TrendingUp,
  DollarSign,
  FileText,
  Bell,
} from 'lucide-react';
import {
  useSystemHealth,
  useActiveAlerts,
  usePendingApprovals,
  useGatewayMetrics,
  useUserStats,
  useECSStatus,
  useProjectResourceUsage,
  useActiveAlarms,
  useAutomationTasks,
  useCostOverview,
  useAuditLogs,
  useRecentNotifications,
} from '@/hooks/useDashboard';

/**
 * Dashboard home page
 */
export default function DashboardPage() {
  const { sidebarCollapsed } = useUIStore();

  const { data: systemHealth } = useSystemHealth();
  const { data: activeAlerts = 0 } = useActiveAlerts();
  const { data: pendingApprovals = 0 } = usePendingApprovals();
  const { data: gatewayMetrics = [] } = useGatewayMetrics();
  const { data: userStats } = useUserStats();
  const { data: ecsStatus } = useECSStatus();
  const { data: projectUsage = [] } = useProjectResourceUsage();
  const { data: activeAlarms = [] } = useActiveAlarms();
  const { data: automationTasks = [] } = useAutomationTasks();
  const { data: costOverview } = useCostOverview();
  const { data: auditLogs = [] } = useAuditLogs(10);
  const { data: notifications = [] } = useRecentNotifications(10);

  // Format gateway metrics for chart
  const gatewayChartData = gatewayMetrics.map((m) => ({
    timestamp: m.timestamp,
    value: m.requestsPerSecond,
  }));

  // Calculate system health status
  const getSystemHealthStatus = () => {
    if (!systemHealth) return 'success';
    const statuses = Object.values(systemHealth);
    if (statuses.some((s) => s === 'down')) return 'error';
    if (statuses.some((s) => s === 'degraded')) return 'warning';
    return 'success';
  };

  const systemHealthValue = systemHealth
    ? Object.values(systemHealth).filter((s) => s === 'normal').length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main
        className={cn(
          'pt-16 pb-12 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {/* Status Summary Cards - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatusCard
              title="System Health"
              icon={Activity}
              mainValue={`${systemHealthValue}/4`}
              description="All services operational"
              status={getSystemHealthStatus()}
            />
            <StatusCard
              title="Active Alerts"
              icon={AlertTriangle}
              mainValue={activeAlerts}
              description="Unresolved alerts"
              status={activeAlerts > 0 ? 'warning' : 'success'}
            />
            <StatusCard
              title="Pending Approvals"
              icon={Clock}
              mainValue={pendingApprovals}
              description="Awaiting approval"
              status={pendingApprovals > 0 ? 'warning' : 'success'}
            />
          </div>

          {/* Core Metrics - Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* API Gateway Overview */}
            <LineChartPanel
              title="API Gateway Overview"
              data={gatewayChartData}
              dataKey="value"
              color="#3B82F6"
            />

            {/* User & Role Management */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User & Role Management</h3>
              {userStats && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-2xl font-bold text-green-600">{userStats.activeUsers}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Role Distribution</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        <span className="text-sm">Admin: {userStats.roleDistribution.admin}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                        <span className="text-sm">User: {userStats.roleDistribution.user}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resource Status - Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* ECS Instance Status */}
            {ecsStatus && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ECS Instance Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Running</span>
                    <span className="text-2xl font-bold text-green-600">{ecsStatus.running}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stopped</span>
                    <span className="text-2xl font-bold text-gray-600">{ecsStatus.stopped}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Availability</span>
                    <span className="text-2xl font-bold text-blue-600">{ecsStatus.availability}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-2xl font-bold text-purple-600">{ecsStatus.cpuUsage}%</span>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Manage Instances
                  </button>
                </div>
              </div>
            )}

            {/* Project Resource Usage */}
            <ResourceUsageTable data={projectUsage} />
          </div>

          {/* Automation & Cost - Row 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Active Alarms */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active Alarms</h3>
              </div>
              <div className="p-6">
                {activeAlarms.length === 0 ? (
                  <p className="text-sm text-gray-500">No active alarms</p>
                ) : (
                  <div className="space-y-3">
                    {activeAlarms.slice(0, 5).map((alarm) => (
                      <div
                        key={alarm.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              alarm.level === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : alarm.level === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {alarm.level}
                          </span>
                          <span className="text-xs text-gray-500">{alarm.type}</span>
                        </div>
                        <p className="text-sm text-gray-700">{alarm.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Task Automation */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Task Automation</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Scheduled Tasks</span>
                  <span className="text-2xl font-bold text-gray-900 ml-2">{automationTasks.length}</span>
                </div>
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-2xl font-bold text-green-600 ml-2">
                    {automationTasks.length > 0
                      ? Math.round(
                          (automationTasks.filter((t) => t.status === 'success').length /
                            automationTasks.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="space-y-2">
                  {['backup', 'scaling', 'cleanup', 'maintenance'].map((type) => {
                    const count = automationTasks.filter((t) => t.type === type).length;
                    return (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 capitalize">{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cost Overview */}
            {costOverview && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Cost Overview</h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Monthly Cost</span>
                    <span className="text-2xl font-bold text-gray-900 ml-2">
                      ${costOverview.monthlyCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Predicted Cost</span>
                    <span className="text-2xl font-bold text-blue-600 ml-2">
                      ${costOverview.predictedCost.toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Info - Row 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audit Logs */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(log.time).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">{log.user}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{log.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
              </div>
              <div className="p-6">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent notifications</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 capitalize">{notification.channel}</span>
                          <span className="text-xs text-gray-500 capitalize">{notification.type}</span>
                        </div>
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

