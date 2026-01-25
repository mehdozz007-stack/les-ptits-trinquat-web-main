/**
 * API Configuration
 * Determines the base URL for API requests
 */

export const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '' // Use relative paths in development (proxied via Vite)
    : 'https://les-ptits-trinquat-api.medhozz007.workers.dev'; // Use remote API in production

export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

