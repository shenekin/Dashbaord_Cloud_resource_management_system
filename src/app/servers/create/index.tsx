'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import ECSServerForm from '@/components/server-form/ECSServerForm';
import { useECSServerForm } from './hooks/useECSServerForm';

// Simple icon components if heroicons is not available
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

const InformationCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/**
 * ECS Create Server Page
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
export default function CreateECSPage() {
  const { sidebarCollapsed } = useUIStore();
  const { formData, errors } = useECSServerForm();
  const [activeStep, setActiveStep] = useState<string>('basic');

  // Define form steps with dependencies
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
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Tags',
      dependsOn: [],
      icon: CheckCircleIcon,
    },
    {
      id: 'review',
      name: 'Review & Submit',
      description: 'Validate and Create',
      dependsOn: ['basic', 'compute', 'storage', 'network'],
      icon: CheckCircleIcon,
    },
  ];

  // Check if step dependencies are met
  const isStepEnabled = (step: typeof steps[0]): boolean => {
    if (step.dependsOn.length === 0) return true;
    
    return step.dependsOn.every(depId => {
      if (depId === 'basic') {
        return !!(formData.basic.region && formData.basic.az && formData.basic.name);
      }
      if (depId === 'network') {
        return !!(formData.network.vpc && formData.network.subnet);
      }
      return true;
    });
  };

  // Check if step is completed
  const isStepCompleted = (step: typeof steps[0]): boolean => {
    if (step.id === 'basic') {
      return !!(formData.basic.region && formData.basic.az && formData.basic.name && !errors['basic.region'] && !errors['basic.az'] && !errors['basic.name']);
    }
    if (step.id === 'compute') {
      return !!(formData.compute.flavor && formData.compute.image && formData.compute.adminPassword && !errors['compute.flavor'] && !errors['compute.image'] && !errors['compute.adminPassword']);
    }
    if (step.id === 'storage') {
      return !!(formData.storage.systemDisk.type && formData.storage.systemDisk.size && !errors['storage.systemDisk.type']);
    }
    if (step.id === 'network') {
      return !!(formData.network.vpc && formData.network.subnet && !errors['network.vpc'] && !errors['network.subnet']);
    }
    if (step.id === 'ip') {
      return true; // IP is optional
    }
    if (step.id === 'billing') {
      return !!formData.billing.chargingMode;
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

  // Update active step based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const steps = ['basic', 'compute', 'storage', 'network', 'ip', 'billing', 'advanced', 'review'];
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = steps.length - 1; i >= 0; i--) {
        const element = document.getElementById(`step-${steps[i]}`);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveStep(steps[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className={cn('pt-16 pb-12 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64')}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create ECS Server</h1>
            <p className="text-gray-600">
              Configure and create a new Elastic Cloud Server instance. Complete each section in order.
            </p>
          </div>

          {/* Progress Steps Indicator */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {steps.map((step, index) => {
                const enabled = isStepEnabled(step);
                const completed = isStepCompleted(step);
                const hasErrors = hasStepErrors(step);
                const isActive = activeStep === step.id;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <button
                      onClick={() => enabled && scrollToStep(step.id)}
                      disabled={!enabled}
                      className={cn(
                        'flex flex-col items-center text-center min-w-[120px]',
                        !enabled && 'opacity-50 cursor-not-allowed',
                        enabled && 'cursor-pointer hover:opacity-80'
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all',
                          completed && !hasErrors && 'bg-green-100 text-green-600',
                          hasErrors && 'bg-red-100 text-red-600',
                          isActive && !completed && !hasErrors && 'bg-blue-100 text-blue-600',
                          !completed && !hasErrors && !isActive && enabled && 'bg-gray-100 text-gray-400',
                          !enabled && 'bg-gray-50 text-gray-300'
                        )}
                      >
                        {completed && !hasErrors ? (
                          <CheckCircleIcon className="w-6 h-6" />
                        ) : hasErrors ? (
                          <ExclamationCircleIcon className="w-6 h-6" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          completed && !hasErrors && 'text-green-600',
                          hasErrors && 'text-red-600',
                          isActive && !completed && 'text-blue-600',
                          !completed && !hasErrors && !isActive && enabled && 'text-gray-600',
                          !enabled && 'text-gray-400'
                        )}
                      >
                        {step.name}
                      </span>
                      {hasErrors && (
                        <span className="text-xs text-red-500 mt-1">Has errors</span>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'w-12 h-0.5 mx-2 transition-all',
                          completed && !hasErrors ? 'bg-green-200' : 'bg-gray-200'
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Dependency Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 mb-1">Dependency Flow:</p>
                  <p>
                    <span className="font-semibold">Basic Info</span> (Region, AZ) must be completed first.
                    Then configure <span className="font-semibold">Compute</span>, <span className="font-semibold">Storage</span>, and{' '}
                    <span className="font-semibold">Network</span> in any order.
                    <span className="font-semibold"> IP Configuration</span> requires Network to be completed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            <ECSServerForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
