/**
 * Customers API Service
 * 
 * Service for managing customers through the gateway-service.
 */

import { apiClient } from './api';

export interface Customer {
  id: number;
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface CustomerUpdate {
  name?: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
}

class CustomersApi {
  private baseUrl = process.env.NEXT_PUBLIC_CUSTOMERS_BASE || '/api/v1/customers';

  async getCustomers(): Promise<Customer[]> {
    try {
      const data = await apiClient.get<Customer[]>(this.baseUrl);
      // Ensure we always return an array, even if API returns undefined/null
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Return empty array on error to prevent undefined state
      return [];
    }
  }

  async getCustomer(customerId: number): Promise<Customer> {
    const url = `${this.baseUrl}/${customerId}`;
    return apiClient.get<Customer>(url);
  }

  async createCustomer(customerData: CustomerCreate): Promise<Customer> {
    return apiClient.post<Customer>(this.baseUrl, customerData);
  }

  async updateCustomer(customerId: number, customerData: CustomerUpdate): Promise<Customer> {
    const url = `${this.baseUrl}/${customerId}`;
    return apiClient.put<Customer>(url, customerData);
  }

  async deleteCustomer(customerId: number): Promise<void> {
    const url = `${this.baseUrl}/${customerId}`;
    return apiClient.delete(url);
  }
}

export const customersApi = new CustomersApi();

