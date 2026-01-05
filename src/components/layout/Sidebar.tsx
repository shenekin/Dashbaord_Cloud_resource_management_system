'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Users,
  FolderKanban,
  Server,
  Activity,
  Zap,
  DollarSign,
  FileText,
  Bell,
  Network,
  HardDrive,
  Lock,
  ChevronDown,
  Cloud,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  children?: MenuItem[];
}

/**
 * Sidebar Navigation component
 */
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(['resources', 'hwpc']);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { id: 'gateway', label: 'Gateway', path: '/gateway', icon: Shield },
    { id: 'identity', label: 'User & Auth', path: '/identity', icon: Users },
    { id: 'projects', label: 'Projects', path: '/projects', icon: FolderKanban },
    {
      id: 'resources',
      label: 'Resources',
      path: '/resources',
      icon: Server,
      children: [
        // Added: HWPC menu item with sub-items (ECS, Network, Storage, Security Groups)
        // Updated: Changed icon to Cloud to represent Huawei Cloud
        {
          id: 'hwpc',
          label: 'HWPC',
          path: '/resources/hwpc',
          icon: Cloud,
          children: [
            { id: 'ecs', label: 'ECS', path: '/resources/ecs', icon: Server },
            { id: 'network', label: 'Network', path: '/resources/network', icon: Network },
            { id: 'storage', label: 'Storage / Images', path: '/resources/storage', icon: HardDrive },
            { id: 'security-groups', label: 'Security Groups', path: '/resources/security-groups', icon: Lock },
          ],
        },
      ],
    },
    { id: 'quotas', label: 'Quotas', path: '/quotas', icon: Activity },
    { id: 'tasks', label: 'Tasks', path: '/tasks', icon: Zap },
    { id: 'monitoring', label: 'Monitoring', path: '/monitoring', icon: Activity },
    { id: 'billing', label: 'Billing', path: '/billing', icon: DollarSign },
    { id: 'audit', label: 'Audit Logs', path: '/audit', icon: FileText },
    { id: 'notifications', label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 bg-gray-800 text-white transition-all duration-300 z-40 overflow-y-auto',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);

            return (
              <li key={item.id}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        active
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        sidebarCollapsed && 'justify-center'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isExpanded && 'transform rotate-180'
                            )}
                          />
                        </>
                      )}
                    </button>
                    {isExpanded && !sidebarCollapsed && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.path);
                          const hasGrandChildren = child.children && child.children.length > 0;
                          const isChildExpanded = expandedItems.includes(child.id);
                          
                          return (
                            <li key={child.id}>
                              {hasGrandChildren ? (
                                <>
                                  <button
                                    onClick={() => toggleExpand(child.id)}
                                    className={cn(
                                      'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                                      childActive
                                        ? 'bg-primary/50 text-white'
                                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    )}
                                  >
                                    <ChildIcon className="w-4 h-4" />
                                    <span className="flex-1 text-left">{child.label}</span>
                                    <ChevronDown
                                      className={cn(
                                        'w-3 h-3 transition-transform',
                                        isChildExpanded && 'transform rotate-180'
                                      )}
                                    />
                                  </button>
                                  {isChildExpanded && (
                                    <ul className="ml-6 mt-1 space-y-1">
                                      {child.children?.map((grandChild) => {
                                        const GrandChildIcon = grandChild.icon;
                                        const grandChildActive = isActive(grandChild.path);
                                        return (
                                          <li key={grandChild.id}>
                                            <button
                                              onClick={() => handleMenuClick(grandChild.path)}
                                              className={cn(
                                                'w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors',
                                                grandChildActive
                                                  ? 'bg-primary/50 text-white'
                                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                              )}
                                            >
                                              <GrandChildIcon className="w-3.5 h-3.5" />
                                              <span>{grandChild.label}</span>
                                            </button>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </>
                              ) : (
                                <button
                                  onClick={() => handleMenuClick(child.path)}
                                  className={cn(
                                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                                    childActive
                                      ? 'bg-primary/50 text-white'
                                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                  )}
                                >
                                  <ChildIcon className="w-4 h-4" />
                                  <span>{child.label}</span>
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      active
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      sidebarCollapsed && 'justify-center'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

