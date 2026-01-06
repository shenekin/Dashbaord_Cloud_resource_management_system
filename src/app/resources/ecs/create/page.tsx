'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import ECSServerForm from '@/components/server-form/ECSServerForm';
import { useECSServerForm } from '@/app/servers/create/hooks/useECSServerForm';

// Simple icon components
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/**
 * ECS Create Page
 * 
 * Comprehensive page for creating ECS (Elastic Cloud Server) instances.
 * Features:
 * - Step-by-step form with dependency management
 * - Visual progress indicators
 * - Real-time validation
 * - Context-aware field enabling/disabling
 * 
 * Dependencies Flow:
 * Basic (Region, AZ) → Compute, Storage, Network → IP → Review & Submit
 */
export default function ECSCreatePage() {
  const { sidebarCollapsed } = useUIStore();
  const { formData, errors, touched } = useECSServerForm();
  const [activeStep, setActiveStep] = useState<string>('basic');

  // Define form steps with dependencies - synchronized with form sections
  const steps = [
    {
      id: 'basic',
      name: 'Basic Information',
      description: 'Region, Availability Zone, Server Name',
      dependsOn: [],
      icon: CheckCircleIcon,
    },
    {
      id: 'compute',
      name: 'Compute & Image',
      description: 'Flavor, Image, Admin Password',
      dependsOn: ['basic'],
      icon: CheckCircleIcon,
    },
    {
      id: 'storage',
      name: 'Storage',
      description: 'System Disk, Data Disks',
      dependsOn: ['basic'],
      icon: CheckCircleIcon,
    },
    {
      id: 'network',
      name: 'Network',
      description: 'VPC, Subnet',
      dependsOn: ['basic'],
      icon: CheckCircleIcon,
    },
    {
      id: 'ip',
      name: 'IP Configuration',
      description: 'Private IP, IPv6, Public IP',
      dependsOn: ['network'],
      icon: CheckCircleIcon,
    },
    {
      id: 'billing',
      name: 'Billing & Lifecycle',
      description: 'Charging Mode, Auto Terminate',
      dependsOn: [],
      icon: CheckCircleIcon,
    },
  ];

  // Check if step dependencies are met - reactive to formData changes
  const isStepEnabled = (step: typeof steps[0]): boolean => {
    if (step.dependsOn.length === 0) return true;
    
    return step.dependsOn.every(depId => {
      if (depId === 'basic') {
        // Basic is enabled when region and AZ are selected
        return !!(formData.basic.region && formData.basic.az);
      }
      if (depId === 'network') {
        // IP depends on network - VPC and subnet must be selected
        return !!(formData.network.vpc && formData.network.subnet);
      }
      return true;
    });
  };

  // Check if step is completed - reactive to formData and errors changes
  const isStepCompleted = (step: typeof steps[0]): boolean => {
    if (step.id === 'basic') {
      return !!(formData.basic.region && formData.basic.az && formData.basic.name && formData.basic.count > 0 && !errors['basic.region'] && !errors['basic.az'] && !errors['basic.name'] && !errors['basic.count']);
    }
    if (step.id === 'compute') {
      return !!(formData.compute.flavor && formData.compute.image && formData.compute.adminPassword && !errors['compute.flavor'] && !errors['compute.image'] && !errors['compute.adminPassword']);
    }
    if (step.id === 'storage') {
      return !!(formData.storage.systemDisk.type && formData.storage.systemDisk.size > 0 && !errors['storage.systemDisk.type'] && !errors['storage.systemDisk.size']);
    }
    if (step.id === 'network') {
      return !!(formData.network.vpc && formData.network.subnet && !errors['network.vpc'] && !errors['network.subnet']);
    }
    if (step.id === 'ip') {
      // IP is optional - don't mark as completed automatically
      // Only mark as completed if user has explicitly configured IP settings
      // Check if user has set private IP, enabled IPv6, or configured public IP
      const hasPrivateIP = !!formData.ip.privateIP;
      const hasIPv6Enabled = formData.ip.enableIPv6 === true; // Explicitly enabled (not just default false)
      const hasPublicIP = !!(formData.ip.publicIP && formData.ip.publicIP.eipType && formData.ip.publicIP.bandwidthType && formData.ip.publicIP.bandwidthSize);
      
      // Check if user has interacted with IP section
      const ipTouched = Object.keys(touched).some(key => key.startsWith('ip.'));
      if (!ipTouched) {
        return false; // User hasn't interacted with IP section yet
      }
      // If no IP configuration, don't mark as completed
      if (!hasPrivateIP && !hasIPv6Enabled && !hasPublicIP) {
        return false;
      }
      // If IP data exists, check for errors
      return !errors['ip.privateIP'] && !errors['ip.publicIP'];
    }
    if (step.id === 'billing') {
      // Billing has default chargingMode, but don't mark as completed just because of default
      // Only mark as completed if user has explicitly set auto_terminate_time or if chargingMode was changed
      // For simplicity, we'll only mark as completed if auto_terminate_time is set OR if there are no errors
      // Actually, since billing is required, we should mark it as completed if chargingMode is set and no errors
      // But we don't want to show it as completed by default
      // Billing - only mark as completed if user has interacted with it
      const billingTouched = Object.keys(touched).some(key => key.startsWith('billing.'));
      if (!billingTouched) {
        return false; // User hasn't interacted with billing section yet
      }
      // If touched, check if chargingMode is set and no errors
      return !!formData.billing.chargingMode && !errors['billing.chargingMode'];
    }
    return false;
  };

  // Check if step has errors
  const hasStepErrors = (step: typeof steps[0]): boolean => {
    const stepErrorKeys = Object.keys(errors).filter(key => key.startsWith(step.id + '.'));
    return stepErrorKeys.length > 0;
  };

  // Scroll to step
  const scrollToStep = (stepId: string) => {
    const element = document.getElementById(`step-${stepId}`);
    if (element) {
      const offset = 100; // Offset for header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveStep(stepId);
    }
  };

  // Update active step based on scroll position - synchronized with step IDs
  useEffect(() => {
    const handleScroll = () => {
      const stepIds = steps.map(s => s.id); // Use steps array for consistency
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = stepIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(`step-${stepIds[i]}`);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveStep(stepIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <Sidebar />
      <main className={cn('pt-16 pb-12 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64')}>
        <div className="p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Create ECS Server
                </h1>
                <p className="text-gray-500 mt-1">
                  Configure your cloud server instance step by step
                </p>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-8">
            <ECSServerForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

