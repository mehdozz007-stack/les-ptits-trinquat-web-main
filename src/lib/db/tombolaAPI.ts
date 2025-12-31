/**
 * Tombola D1 API Client
 * Handles communication with Cloudflare Workers + D1
 */

import { Parent, Lot } from '../types';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.tombola.example.com' 
  : 'http://localhost:8787';

export interface AuthToken {
  parentId: string;
  email: string;
}

// API Response interface
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Load auth token from localStorage
function getAuthToken(): AuthToken | null {
  try {
    const token = localStorage.getItem('tombola_auth');
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error('Failed to parse auth token:', error);
    return null;
  }
}

// Set auth token in localStorage
function setAuthToken(token: AuthToken | null) {
  if (token) {
    localStorage.setItem('tombola_auth', JSON.stringify(token));
  } else {
    localStorage.removeItem('tombola_auth');
  }
}

// Create authorization header
function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};

  return {
    'X-Parent-Auth': btoa(JSON.stringify(token)),
  };
}

interface ApiOptions extends RequestInit {
  body?: any;
}

async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}/api${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const TombolaAPI = {
  // Auth
  setAuth(token: AuthToken | null) {
    setAuthToken(token);
  },

  getAuth(): AuthToken | null {
    return getAuthToken();
  },

  // Parents
  async createParent(data: {
    first_name: string;
    email: string;
    emoji: string;
    classes?: string;
  }): Promise<Parent> {
    const result = await apiCall<Parent>('/parents', {
      method: 'POST',
      body: data,
    });
    if (!result.data) throw new Error('Failed to create parent');
    return result.data;
  },

  async getParents(): Promise<Parent[]> {
    const result = await apiCall<Parent[]>('/parents');
    return result.data || [];
  },

  async deleteParent(id: string): Promise<boolean> {
    const result = await apiCall<null>(`/parents/${id}`, {
      method: 'DELETE',
    });
    return result.success;
  },

  // Lots
  async createLot(data: {
    title: string;
    description?: string;
  }): Promise<Lot> {
    const result = await apiCall<Lot>('/lots', {
      method: 'POST',
      body: data,
    });
    if (!result.data) throw new Error('Failed to create lot');
    return result.data;
  },

  async getLots(): Promise<Lot[]> {
    const result = await apiCall<Lot[]>('/lots');
    return result.data || [];
  },

  async deleteLot(id: string): Promise<boolean> {
    const result = await apiCall<null>(`/lots/${id}`, {
      method: 'DELETE',
    });
    return result.success;
  },

  async reserveLot(id: string): Promise<Lot> {
    const result = await apiCall<Lot>(`/lots/${id}/reserve`, {
      method: 'POST',
    });
    if (!result.data) throw new Error('Failed to reserve lot');
    return result.data;
  },
};
