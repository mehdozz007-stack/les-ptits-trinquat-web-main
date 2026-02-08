/**
 * API Configuration
 * Determines the base URL for API requests
 * In dev: uses local Wrangler server on port 8787
 * In prod: uses Cloudflare API
 */

export const API_BASE_URL =
  typeof window !== 'undefined' && (
    window.location.port === '8080' ||
    window.location.port === '8081' ||
    window.location.port === '5173'
  )
    ? `http://${window.location.hostname}:8787` // Use server IP/hostname with port 8787 (works on both desktop and mobile)
    : 'https://les-ptits-trinquat-api.workers.dev'; // Use remote API in production

export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

