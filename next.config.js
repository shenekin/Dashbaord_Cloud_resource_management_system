/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // API configuration - supports http/https
    NEXT_PUBLIC_API_PROTOCOL: process.env.NEXT_PUBLIC_API_PROTOCOL || 'http',
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
    NEXT_PUBLIC_API_PORT: process.env.NEXT_PUBLIC_API_PORT || '8000',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  },
}

module.exports = nextConfig

