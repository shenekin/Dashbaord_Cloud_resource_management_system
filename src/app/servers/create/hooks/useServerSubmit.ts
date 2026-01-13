'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServerFormData } from '@/types/server';
import { serverFormToApi } from '@/mappers/serverFormToApi';
import { apiClient } from '@/services/api';
import { getCredentialsFromLocalStorage, LocalCredential } from '@/lib/utils';
import { createLogger } from '@/lib/logger';

const ecsLogger = createLogger('ecs');

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
   * @returns Promise with success status and response/error
   */
  const submit = async (formData: ServerFormData): Promise<{ success: boolean; response?: ServerCreateResponse; error?: string }> => {
    setLoading(true);
    setError(null);

    ecsLogger.info('ECS server creation started', {
      serverName: formData.basic.name,
      region: formData.basic.region,
      availabilityZone: formData.basic.az,
      instanceCount: formData.basic.count,
    });

    try {
      // Get credentials from local storage if customer and provider are selected
      let credential: LocalCredential | null = null;
      if (formData.basic.credential_id) {
        ecsLogger.debug('Retrieving credentials from local storage', {
          credentialId: formData.basic.credential_id,
        });

        const allCredentials = getCredentialsFromLocalStorage();
        // Find credential by ID (can be string for local credentials or number for API)
        const credentialId = formData.basic.credential_id.toString();
        credential = allCredentials.find(
          cred => cred.id === credentialId || cred.id === `cred-${credentialId}`
        ) || null;

        if (credential) {
          ecsLogger.info('Credentials retrieved successfully', {
            customer: credential.customer,
            provider: credential.provider,
            credentialId: credential.id,
          });
        } else {
          ecsLogger.debug('No matching credential found', {
            credentialId: formData.basic.credential_id,
          });
        }
      }

      // Map form data to API request format
      const apiData = serverFormToApi(formData);
      
      ecsLogger.debug('Form data mapped to API format', {
        region: apiData.region,
        availabilityZone: apiData.availability_zone,
        instanceType: apiData.flavor,
        image: apiData.image,
        systemDisk: apiData.system_disk,
        network: {
          vpcId: apiData.vpc_id,
          subnetId: apiData.subnet_id,
        },
      });
      
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
      
      ecsLogger.info('Sending API request to create server', {
        endpoint,
        serverName: apiData.name,
        instanceCount: apiData.count,
      });

      const response = await apiClient.post<ServerCreateResponse>(endpoint, requestPayload);

      ecsLogger.info('ECS server created successfully', {
        serverId: response.id,
        serverName: response.name,
        status: response.status,
        createdAt: response.created_at,
        submittedData: {
          region: apiData.region,
          availabilityZone: apiData.availability_zone,
          instanceType: apiData.flavor,
          image: apiData.image,
          systemDisk: apiData.system_disk,
          network: {
            vpcId: apiData.vpc_id,
            subnetId: apiData.subnet_id,
          },
          instanceCount: apiData.count,
        },
      });

      // Redirect to server list or detail page on success
      if (response.id) {
        router.push(`/resources/ecs`);
      } else {
        router.push('/resources/ecs');
      }
      
      // Return success to allow form reset
      return { success: true, response };
    } catch (err: any) {
      // Handle API errors with detailed error messages
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.detail
        || err.message 
        || 'Failed to create server. Please check your configuration and try again.';
      setError(errorMessage);
      
      ecsLogger.debug('ECS server creation failed', {
        error: errorMessage,
        statusCode: err.response?.status,
        endpoint: err.config?.url,
      });
      
      console.error('Server creation error:', err);
      
      // Return error to prevent form reset
      return { success: false, error: errorMessage };
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

