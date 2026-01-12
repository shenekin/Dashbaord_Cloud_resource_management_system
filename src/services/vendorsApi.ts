/**
 * Vendors API Service
 * 
 * Service for managing vendors/providers through the gateway-service.
 */

import { apiClient } from './api';

export interface Vendor {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorCreate {
  name: string;
  display_name: string;
  description?: string;
}

export interface VendorUpdate {
  display_name?: string;
  description?: string;
}

class VendorsApi {
  private baseUrl = process.env.NEXT_PUBLIC_VENDORS_BASE || '/api/v1/vendors';

  async getVendors(): Promise<Vendor[]> {
    try {
      const data = await apiClient.get<Vendor[]>(this.baseUrl);
      // Ensure we always return an array, even if API returns undefined/null
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      // Return empty array on error to prevent undefined state
      return [];
    }
  }

  async getVendor(vendorId: number): Promise<Vendor> {
    const url = `${this.baseUrl}/${vendorId}`;
    return apiClient.get<Vendor>(url);
  }

  async createVendor(vendorData: VendorCreate): Promise<Vendor> {
    return apiClient.post<Vendor>(this.baseUrl, vendorData);
  }

  async updateVendor(vendorId: number, vendorData: VendorUpdate): Promise<Vendor> {
    const url = `${this.baseUrl}/${vendorId}`;
    return apiClient.put<Vendor>(url, vendorData);
  }

  async deleteVendor(vendorId: number): Promise<void> {
    const url = `${this.baseUrl}/${vendorId}`;
    return apiClient.delete(url);
  }
}

export const vendorsApi = new VendorsApi();

