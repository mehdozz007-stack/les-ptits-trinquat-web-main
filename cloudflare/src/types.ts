// ============================================================
// Types TypeScript - Les P'tits Trinquat API
// ============================================================

export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  JWT_SECRET: string;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  SESSION_DURATION: string;
  RATE_LIMIT_MAX: string;
  RATE_LIMIT_WINDOW: string;
}

// ============================================================
// Modèles de données
// ============================================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  consent: number; // SQLite boolean: 0 or 1
  is_active: number;
  created_at: string;
}

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'failed';
  sent_at: string | null;
  recipients_count: number;
  created_at: string;
  updated_at: string;
}

export interface TombolaParticipant {
  id: string;
  user_id: string | null;
  prenom: string;
  email: string;
  role: string;
  classes: string | null;
  emoji: string;
  created_at: string;
}

export interface TombolaParticipantPublic {
  id: string;
  prenom: string;
  role: string;
  classes: string | null;
  emoji: string;
  created_at: string;
}

export interface TombolaLot {
  id: string;
  nom: string;
  description: string | null;
  icone: string;
  statut: 'disponible' | 'reserve' | 'remis';
  parent_id: string;
  reserved_by: string | null;
  created_at: string;
}

export interface TombolaLotWithRelations extends TombolaLot {
  parent_prenom?: string;
  parent_emoji?: string;
  reserver_prenom?: string;
  reserver_emoji?: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: string | null;
  created_at: string;
}

// ============================================================
// Types de requête/réponse API
// ============================================================

export interface AuthenticatedContext {
  user: User;
  session: Session;
  role: 'admin' | 'user' | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'user' | null;
  };
  expires_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  message: string;
}

export interface SendCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface NewsletterSubscribeRequest {
  email: string;
  first_name?: string;
  consent: boolean;
}

export interface SendNewsletterRequest {
  subject: string;
  content: string;
}

export interface TombolaParticipantCreateRequest {
  prenom: string;
  email: string;
  role?: string;
  classes?: string;
  emoji?: string;
  user_id?: string; // Optional user ID for client-side isolation
}

export interface TombolaLotCreateRequest {
  nom: string;
  description?: string;
  icone?: string;
  parent_id: string;
}
