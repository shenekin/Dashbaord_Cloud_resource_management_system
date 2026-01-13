'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServerFormData } from '@/types/server';
import { serverFormToApi } from '@/mappers/serverFormToApi';
import { apiClient } from '@/services/api';
import { getCredentialsFromLocalStorage, LocalCredential } from '@/lib/utils';

export interface ServerCreateResponse {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

/**
 * Hook for handling ECS server creation submission
 * Integrates with backend API to create server instances
 * Includes error handling, loading states, and credential management
 */
export function useServerSubmit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit server creation form to backend API
   * Includes credentials from local storage in the request
   * 
   * @param formData - Complete server form data
   */
  const submit = async (formData: ServerFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Get credentials from local storage if customer and provider are selected
      let credential: LocalCredential | null = null;
      if (formData.basic.credential_id) {
        const allCredentials = getCredentialsFromLocalStorage();
        // Find credential by ID (can be string for local credentials or number for API)
        const credentialId = formData.basic.credential_id.toString();
        credential = allCredentials.find(
          cred => cred.id === credentialId || cred.id === `cred-${credentialId}`
        ) || null;
      }

      // Map form data to API request format
      const apiData = serverFormToApi(formData);
      
      // Add credentials to API request if available
      const requestPayload = {
        ...apiData,
        ...(credential && {
          access_key: credential.accessKey,
          secret_key: credential.secretKey,
          customer: credential.customer,
          provider: credential.provider,
        }),
      };

      // Make API call to create server
      const endpoint = process.env.NEXT_PUBLIC_ECS_CREATE || '/ecs';
      const response = await apiClient.post<ServerCreateResponse>(endpoint, requestPayload);

      // Redirect to server list or detail page on success
      if (response.id) {
        router.push(`/resources/ecs`);
      } else {
        router.push('/resources/ecs');
      }
    } catch (err: any) {
      // Handle API errors with detailed error messages
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.detail
        || err.message 
        || 'Failed to create server. Please check your configuration and try again.';
      setError(errorMessage);
      console.error('Server creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submit,
  };
}

