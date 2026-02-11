/**
 * API Configuration
 * Determines the base URL for API requests
 * Detects dev environment by hostname (localhost) or port (8081, 5173 = Vite dev ports)
 */

export const API_BASE_URL =
  typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port === '8081' || // Vite dev port
    window.location.port === '5173' ||  // Vite default port
    window.location.hostname.includes('192.168') // Local network IP
  )
    ? '' // Use relative paths in development (proxied via Vite)
    : 'https://les-ptits-trinquat-api-production.medhozz007.workers.dev'; // Production API URL

export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

