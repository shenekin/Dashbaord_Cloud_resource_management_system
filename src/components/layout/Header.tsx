'use client';

import { useState } from 'react';
import { Search, Bell, User, LogOut, Menu, Activity, AlertTriangle, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useActiveAlerts, usePendingApprovals, useSystemHealth } from '@/hooks/useDashboard';
import { cn } from '@/lib/utils';

/**
 * Global Header component
 */
export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  
  const { data: systemHealth } = useSystemHealth();
  const { data: activeAlerts = 0 } = useActiveAlerts();
  const { data: pendingApprovals = 0 } = usePendingApprovals();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search
    console.log('Search:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getGatewayStatus = () => {
    if (!systemHealth) return 'normal';
    return systemHealth.gateway;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <header className="h-16 bg-primary-dark text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Logo and Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-primary/20 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold">
              CR
            </div>
            <span className="font-semibold text-lg hidden md:block">
              Cloud Resource Management
            </span>
          </div>
        </div>

        {/* Center: Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, projects, resources, tasks..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            />
          </div>
        </form>

        {/* Center-Right: System Indicators */}
        <div className="flex items-center gap-4 hidden xl:flex">
          {/* Gateway Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
            <div className={cn('w-2 h-2 rounded-full', getStatusColor(getGatewayStatus()))} />
            <span className="text-sm">Gateway</span>
          </div>

          {/* Active Alerts */}
          {activeAlerts > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{activeAlerts}</span>
            </div>
          )}

          {/* Pending Tasks */}
          {pendingApprovals > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{pendingApprovals}</span>
            </div>
          )}
        </div>

        {/* Right: Notifications and User Menu */}
        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-md hover:bg-primary/20 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {activeAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/20 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <span className="hidden md:block">{user?.username || 'User'}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

