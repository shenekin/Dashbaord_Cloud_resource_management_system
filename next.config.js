/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // ============================================
    // Gateway-Service Backend API Configuration
    // ============================================
    // This is the single entry point for all backend API connections
    // All API services should use these environment variables
    
    // Base Gateway Service URL
    NEXT_PUBLIC_API_PROTOCOL: process.env.NEXT_PUBLIC_API_PROTOCOL || 'http',
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
    NEXT_PUBLIC_API_PORT: process.env.NEXT_PUBLIC_API_PORT || '8001',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
    
    // WebSocket URL (if needed)
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001/ws',
    
    // ============================================
    // Gateway Service Routes Configuration
    // ============================================
    // All routes are configured in gateway-service/config/routes.yaml
    // These are the endpoint paths that route through the gateway:
    
    // Auth Service Routes (via gateway)
    NEXT_PUBLIC_AUTH_LOGIN: '/auth/login',
    NEXT_PUBLIC_AUTH_REFRESH: '/auth/refresh',
    NEXT_PUBLIC_AUTH_VERIFY: '/auth/verify',
    NEXT_PUBLIC_AUTH_LOGOUT: '/auth/logout',
    NEXT_PUBLIC_AUTH_REGISTER: '/auth/register',
    
    // User Management Routes (via gateway)
    NEXT_PUBLIC_USERS_BASE: '/users',
    NEXT_PUBLIC_USERS_BY_ID: '/users/{user_id}',
    NEXT_PUBLIC_USERS_RESET_PASSWORD: '/users/{user_id}/reset-password',
    
    // Role Management Routes (via gateway)
    NEXT_PUBLIC_ROLES_BASE: '/roles',
    NEXT_PUBLIC_ROLES_BY_ID: '/roles/{role_id}',
    NEXT_PUBLIC_ROLES_ASSIGN: '/roles/assign',
    
    // Project Service Routes (via gateway)
    NEXT_PUBLIC_PROJECTS_BASE: '/api/v1/projects',
    NEXT_PUBLIC_PROJECTS_BY_ID: '/api/v1/projects/{project_id}',
    
    // Customer Management Routes (via gateway)
    NEXT_PUBLIC_CUSTOMERS_BASE: '/api/v1/customers',
    NEXT_PUBLIC_CUSTOMERS_BY_ID: '/api/v1/customers/{customer_id}',
    
    // Credentials Management Routes (via gateway)
    NEXT_PUBLIC_CREDENTIALS_BASE: '/api/v1/credentials',
    NEXT_PUBLIC_CREDENTIALS_BY_ID: '/api/v1/credentials/{credential_id}',
    
    // Provider/Vendor Routes (via gateway)
    NEXT_PUBLIC_VENDORS_BASE: '/api/v1/vendors',
    NEXT_PUBLIC_VENDORS_BY_ID: '/api/v1/vendors/{vendor_id}',
    
    // ECS Service Routes (via gateway)
    NEXT_PUBLIC_ECS_BASE: '/ecs',
    NEXT_PUBLIC_ECS_BY_ID: '/ecs/{ecs_id}',
    NEXT_PUBLIC_ECS_CREATE: '/ecs',
    
    // Region & Availability Zone Routes (via gateway)
    NEXT_PUBLIC_REGIONS_BASE: '/api/v1/regions',
    NEXT_PUBLIC_REGIONS_AVAILABILITY_ZONES: '/api/v1/regions/{region}/availability-zones',
    
    // Permissions Routes (via gateway)
    NEXT_PUBLIC_PERMISSIONS_BASE: '/api/v1/permissions',
    
    // Audit Routes (via gateway)
    NEXT_PUBLIC_AUDIT_BASE: '/api/v1/audit',
    
    // Dashboard Routes (via gateway)
    NEXT_PUBLIC_DASHBOARD_BASE: '/dashboard',
    
    // ============================================
    // API Configuration Settings
    // ============================================
    // Timeout settings (in milliseconds)
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
    
    // Retry configuration
    NEXT_PUBLIC_API_RETRY_ATTEMPTS: process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3',
    NEXT_PUBLIC_API_RETRY_DELAY: process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000',
    
    // Authentication token storage keys
    NEXT_PUBLIC_AUTH_TOKEN_KEY: 'auth-token',
    NEXT_PUBLIC_REFRESH_TOKEN_KEY: 'refresh-token',
    NEXT_PUBLIC_AUTH_USER_KEY: 'auth-user',
  },
}

module.exports = nextConfig

