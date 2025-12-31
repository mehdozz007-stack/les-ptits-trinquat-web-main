// Type definitions for Tombola application

export interface Parent {
  id: string;
  first_name: string;
  email: string;
  emoji: string;
  classes?: string;
  created_at: string;
}

export interface Lot {
  id: string;
  parent_id: string;
  title: string;
  description?: string;
  status: 'available' | 'reserved' | 'delivered';
  reserved_by?: string | null;
  created_at: string;
}

export interface Reservation {
  id: string;
  lot_id: string;
  requester_id: string;
  created_at: string;
}

export interface Env {
  DB: D1Database;
  ENVIRONMENT?: 'development' | 'production';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthContext {
  parentId?: string;
  email?: string;
}
