/**
 * API Configuration
 * Determines the base URL for API requests
 */

export const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://les-ptits-trinquat-api.medhozz007.workers.dev'
    : 'https://les-ptits-trinquat-api.medhozz007.workers.dev'; // Use remote API in dev for now

export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
