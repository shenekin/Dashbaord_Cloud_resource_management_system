'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  mainValue: string | number;
  description: string;
  status: 'success' | 'warning' | 'error';
}

/**
 * Status Summary Card component
 */
export default function StatusCard({
  title,
  icon: Icon,
  mainValue,
  description,
  status,
}: StatusCardProps) {
  const statusColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md p-6 border-2 transition-all hover:shadow-lg',
        statusColors[status]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className={cn('w-5 h-5', iconColors[status])} />
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold">{mainValue}</p>
      </div>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}

