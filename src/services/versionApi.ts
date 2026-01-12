/**
 * Version API Service
 * 
 * Service for retrieving version information from backend services.
 * This enables software iteration tracking and version management.
 * All API calls go through the gateway-service configured in next.config.js
 */

import { apiClient } from './api';

/**
 * Version information interface
 * Represents service version details returned by the version API
 */
export interface VersionInfo {
  service_name: string;      // Name of the service (e.g., "project-service")
  version: string;            // Semantic version (e.g., "1.0.0")
  api_version: string;        // API version (e.g., "v1")
  build_date: string;         // Build timestamp (ISO 8601 format)
  description?: string;       // Optional service description
  git_commit?: string;        // Optional git commit hash
  git_branch?: string;        // Optional git branch name
}

/**
 * Version API Service Class
 * Provides methods for retrieving version information from backend services
 */
class VersionApi {
  private baseUrl = process.env.NEXT_PUBLIC_VERSION_BASE || '/version';

  /**
   * Get version information from the service
   * 
   * This endpoint returns service version details including:
   * - Service name
   * - Version number (semantic versioning)
   * - API version
   * - Build date
   * - Optional description and git information
   * 
   * @returns Version information object
   * @throws Error if the API call fails
   * 
   * Example response:
   * {
   *   service_name: "project-service",
   *   version: "1.0.0",
   *   api_version: "v1",
   *   build_date: "2024-01-15T10:30:00Z",
   *   description: "Project management service",
   *   git_commit: "abc123",
   *   git_branch: "main"
   * }
   */
  async getVersion(): Promise<VersionInfo> {
    try {
      const data = await apiClient.get<VersionInfo>(this.baseUrl);
      return data;
    } catch (error) {
      console.error('Error fetching version information:', error);
      throw error;
    }
  }

  /**
   * Get version information from a specific service
   * 
   * @param serviceName - Name of the service to query
   * @returns Version information for the specified service
   * 
   * Note: This method assumes the backend supports service-specific version endpoints.
   * If not available, use getVersion() instead.
   */
  async getServiceVersion(serviceName: string): Promise<VersionInfo> {
    const url = `${this.baseUrl}/${serviceName}`;
    try {
      const data = await apiClient.get<VersionInfo>(url);
      return data;
    } catch (error) {
      console.error(`Error fetching version for service ${serviceName}:`, error);
      throw error;
    }
  }
}

export const versionApi = new VersionApi();

