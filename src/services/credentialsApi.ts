import { apiClient } from './api';

export interface Credential {
  id: string;
  customer: string;
  provider: string;
  access_key: string;
  secret_key: string;
  created_at: string;
  updated_at: string;
}

export interface CredentialResponse {
  items: Credential[];
  total: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

/**
 * Credentials API Service
 * Handles all credential-related API calls through gateway-service
 */
export const credentialsApi = {
  /**
   * Get all credentials (with optional filters)
   * GET /api/v1/credentials
   */
  getCredentials: async (filters?: {
    customer?: string;
    provider?: string;
  }): Promise<CredentialResponse> => {
    const params: any = {};
    if (filters?.customer) {
      params.customer = filters.customer;
    }
    if (filters?.provider) {
      params.provider = filters.provider;
    }
    
    const endpoint = process.env.NEXT_PUBLIC_CREDENTIALS_BASE!;
    
    return apiClient.get<CredentialResponse>(endpoint, params);
  },

  /**
   * Get credential by ID
   * GET /api/v1/credentials/{credential_id}
   */
  getCredential: async (id: string): Promise<Credential> => {
    const endpoint = process.env.NEXT_PUBLIC_CREDENTIALS_BY_ID!.replace('{credential_id}', id);
    
    return apiClient.get<Credential>(endpoint);
  },

  /**
   * Create new credential
   * POST /api/v1/credentials
   */
  createCredential: async (data: {
    customer: string;
    provider: string;
    access_key: string;
    secret_key: string;
  }): Promise<Credential> => {
    const endpoint = process.env.NEXT_PUBLIC_CREDENTIALS_BASE!;
    
    return apiClient.post<Credential>(endpoint, data);
  },

  /**
   * Update credential
   * PUT /api/v1/credentials/{credential_id}
   */
  updateCredential: async (
    id: string,
    data: Partial<{
      customer: string;
      provider: string;
      access_key: string;
      secret_key: string;
    }>
  ): Promise<Credential> => {
    const endpoint = process.env.NEXT_PUBLIC_CREDENTIALS_BY_ID!.replace('{credential_id}', id);
    
    return apiClient.put<Credential>(endpoint, data);
  },

  /**
   * Delete credential
   * DELETE /api/v1/credentials/{credential_id}
   */
  deleteCredential: async (id: string): Promise<void> => {
    const endpoint = process.env.NEXT_PUBLIC_CREDENTIALS_BY_ID!.replace('{credential_id}', id);
    
    return apiClient.delete<void>(endpoint);
  },
};

