/**
 * API Configuration
 * Determines the base URL for API requests
 * In development: uses relative URLs (proxied via Vite)
 * In production: uses absolute URL to Cloudflare Worker API
 */

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
  }

  const hostname = window.location.hostname;
  const port = window.location.port;

  // Development environment
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    port === '8081' ||      // Vite dev port
    port === '5173' ||       // Vite default port
    port === '3000' ||       // Common dev port
    hostname.includes('192.168')
  ) {
    return ''; // Use relative paths (proxied via Vite)
  }

  // Production environment
  return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
}

export const API_BASE_URL = getApiBaseUrl();

export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

