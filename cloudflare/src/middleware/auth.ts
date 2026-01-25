// ============================================================
// Middleware d'Authentification - Les P'tits Trinquat API
// ============================================================

import { Context, Next } from 'hono';
import type { Env, AuthenticatedContext, User, Session } from '../types';

// ============================================================
// Extraction et validation du token
// ============================================================
async function extractAndValidateToken(
  c: Context<{ Bindings: Env }>,
): Promise<AuthenticatedContext | null> {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.slice(7).trim();
  
  if (!token || token.length < 32) {
    return null;
  }
  
  // Rechercher la session avec l'utilisateur et le rôle
  const result = await c.env.DB.prepare(`
    SELECT 
      s.id as session_id,
      s.user_id,
      s.token,
      s.expires_at,
      s.created_at as session_created_at,
      u.id as user_id,
      u.email,
      u.password_hash,
      u.created_at as user_created_at,
      u.updated_at as user_updated_at,
      ur.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    WHERE s.token = ?
  `).bind(token).first<{
    session_id: string;
    user_id: string;
    token: string;
    expires_at: string;
    session_created_at: string;
    email: string;
    password_hash: string;
    user_created_at: string;
    user_updated_at: string;
    role: 'admin' | 'user' | null;
  }>();
  
  if (!result) {
    return null;
  }
  
  // Vérifier l'expiration
  const expiresAt = new Date(result.expires_at);
  if (expiresAt < new Date()) {
    // Supprimer la session expirée
    await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?')
      .bind(result.session_id).run();
    return null;
  }
  
  const user: User = {
    id: result.user_id,
    email: result.email,
    password_hash: result.password_hash,
    created_at: result.user_created_at,
    updated_at: result.user_updated_at
  };
  
  const session: Session = {
    id: result.session_id,
    user_id: result.user_id,
    token: result.token,
    expires_at: result.expires_at,
    created_at: result.session_created_at
  };
  
  return {
    user,
    session,
    role: result.role
  };
}

// ============================================================
// Middleware: Authentification optionnelle
// ============================================================
export async function optionalAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const authContext = await extractAndValidateToken(c);
  c.set('auth', authContext);
  await next();
}

// ============================================================
// Middleware: Authentification requise
// ============================================================
export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const authContext = await extractAndValidateToken(c);
  
  if (!authContext) {
    return c.json({
      success: false,
      error: 'Authentication required'
    }, 401);
  }
  
  c.set('auth', authContext);
  await next();
}

// ============================================================
// Middleware: Authentification Admin requise
// ============================================================
export async function requireAdmin(c: Context<{ Bindings: Env }>, next: Next) {
  const authContext = await extractAndValidateToken(c);
  
  if (!authContext) {
    return c.json({
      success: false,
      error: 'Authentication required'
    }, 401);
  }
  
  if (authContext.role !== 'admin') {
    return c.json({
      success: false,
      error: 'Admin access required'
    }, 403);
  }
  
  c.set('auth', authContext);
  await next();
}

// ============================================================
// Helper: Obtenir le contexte auth
// ============================================================
export function getAuthContext(c: Context): AuthenticatedContext | null {
  return c.get('auth') as AuthenticatedContext | null;
}
