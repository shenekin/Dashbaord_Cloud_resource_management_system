'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PlusIcon, ServerIcon } from 'lucide-react';

/**
 * ECS Resources List Page
 * Main page for viewing and managing ECS instances
 */
export default function ECSListPage() {
  const { sidebarCollapsed } = useUIStore();
  const router = useRouter();
  const [ecsInstances] = useState<any[]>([]); // TODO: Fetch from API

  const handleCreateECS = () => {
    router.push('/resources/ecs/create');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className={cn('pt-16 pb-12 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64')}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ECS Instances</h1>
              <p className="text-gray-600">
                Manage your Elastic Cloud Server instances
              </p>
            </div>
            <button
              onClick={handleCreateECS}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create ECS
            </button>
          </div>

          {/* ECS Instances List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {ecsInstances.length === 0 ? (
              <div className="p-12 text-center">
                <ServerIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No ECS Instances</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first ECS instance
                </p>
                <button
                  onClick={handleCreateECS}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Create ECS Instance
                </button>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-gray-600">ECS instances list will be displayed here</p>
                {/* TODO: Implement ECS instances table/list */}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

