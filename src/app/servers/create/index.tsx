'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import CreateServerForm from './CreateServerForm';

/**
 * Create Server Page
 * Main page for creating a new server instance
 */
export default function CreateServerPage() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className={cn('pt-16 pb-12 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64')}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Server</h1>
          <CreateServerForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

