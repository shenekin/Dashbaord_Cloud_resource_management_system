/**
 * Credentials API Service
 * 
 * Service for managing credentials (AK/SK) through the gateway-service.
 * All API calls go through the gateway-service configured in next.config.js
 */

import { apiClient } from './api';

// Credential types
export interface Credential {
  id: number;
  customer_id: number;
  project_id: number;
  vendor_id: number;
  customer_name: string;
  project_name: string;
  vendor_name: string;
  vendor_display_name: string;
  access_key: string; // Masked: only first 4 characters visible
  resource_user?: string;
  labels?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CredentialCreate {
  customer_id: number;
  project_id: number;
  vendor_id: number;
  access_key: string;
  secret_key: string;
  resource_user?: string;
  labels?: string;
  status?: string;
}

export interface CredentialUpdate {
  access_key?: string;
  secret_key?: string;
  resource_user?: string;
  labels?: string;
  status?: string;
}

export interface CredentialListParams {
  customer_id?: number;
  project_id?: number;
  page?: number;
  page_size?: number;
}

export interface PaginatedCredentialResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Credential[];
}

/**
 * Credentials API Service Class
 * Provides methods for credential management operations
 */
class CredentialsApi {
  private baseUrl = process.env.NEXT_PUBLIC_CREDENTIALS_BASE || '/api/v1/credentials';

  /**
   * Get list of credentials with optional filters
   * 
   * @param params - Optional filters (customer_id, project_id, pagination)
   * @returns Paginated list of credentials with masked access keys
   */
  async getCredentials(params?: CredentialListParams): Promise<PaginatedCredentialResponse> {
    return apiClient.get<PaginatedCredentialResponse>(this.baseUrl, params);
  }

  /**
   * Get credential by ID
   * 
   * @param credentialId - Credential ID
   * @returns Credential details (access_key is masked)
   */
  async getCredential(credentialId: number): Promise<Credential> {
    const url = `${this.baseUrl}/${credentialId}`;
    return apiClient.get<Credential>(url);
  }

  /**
   * Get credential context for internal services
   * Returns full access_key and vault_path (for backend use)
   * 
   * @param credentialId - Credential ID
   * @returns Credential context with full access_key
   */
  async getCredentialContext(credentialId: number): Promise<any> {
    const url = `${this.baseUrl}/context/${credentialId}`;
    return apiClient.get(url);
  }

  /**
   * Create a new credential
   * 
   * @param credentialData - Credential creation data
   * @returns Created credential
   */
  async createCredential(credentialData: CredentialCreate): Promise<Credential> {
    return apiClient.post<Credential>(this.baseUrl, credentialData);
  }

  /**
   * Update an existing credential
   * Supports updating access_key and secret_key
   * 
   * @param credentialId - Credential ID
   * @param credentialData - Credential update data
   * @returns Updated credential
   */
  async updateCredential(credentialId: number, credentialData: CredentialUpdate): Promise<Credential> {
    const url = `${this.baseUrl}/${credentialId}`;
    return apiClient.put<Credential>(url, credentialData);
  }

  /**
   * Delete a credential (soft delete)
   * 
   * @param credentialId - Credential ID
   */
  async deleteCredential(credentialId: number): Promise<void> {
    const url = `${this.baseUrl}/${credentialId}`;
    return apiClient.delete(url);
  }
}

export const credentialsApi = new CredentialsApi();

