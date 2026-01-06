'use client';

import ECSServerForm from '@/components/server-form/ECSServerForm';

/**
 * Create Server Form Component
 * 
 * Main form component for creating server instances.
 * Uses ECSServerForm which implements:
 * - Form engine with JSON schema support
 * - Controlled components
 * - Dependency management
 * - Required field enforcement
 * - Illegal transition prevention
 * - Review + Submit flow
 * 
 * Context: Identity + Project + Quota
 */
export default function CreateServerForm() {
  return <ECSServerForm />;
}

