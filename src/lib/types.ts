// Shared types for Tombola application

export interface Parent {
  id: string;
  first_name: string;
  email: string;
  emoji?: string;
  classes?: string;
  created_at?: string;
}

export interface Lot {
  id: string;
  parent_id: string;
  title: string;
  description?: string;
  status: "available" | "reserved" | "delivered";
  reserved_by?: string;
  created_at?: string;
}

export interface ValidationError {
  field: string;
  title: string;
  message: string;
}
