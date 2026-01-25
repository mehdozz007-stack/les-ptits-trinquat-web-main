// ============================================================
// Utilitaires de Sécurité - Les P'tits Trinquat API
// ============================================================

import type { Env } from '../types';

// ============================================================
// Protection XSS - Échappement HTML
// ============================================================
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// Validation d'email
// ============================================================
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 255;
}

// ============================================================
// Validation de chaîne sécurisée
// ============================================================
export function sanitizeString(input: string, maxLength: number = 500): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

// ============================================================
// Génération de token sécurisé
// ============================================================
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// Génération d'ID unique
// ============================================================
export function generateId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// Hash de mot de passe (utilisant Web Crypto API)
// ============================================================
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Générer un sel aléatoire
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  
  // Dériver la clé avec PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  // Combiner sel et hash
  const hashArray = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  
  // Encoder en base64
  return btoa(String.fromCharCode(...combined));
}

// ============================================================
// Vérification de mot de passe
// ============================================================
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Décoder le hash stocké
    const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const storedHashBytes = combined.slice(16);
    
    // Dériver la clé avec PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      data,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    const hashArray = new Uint8Array(derivedBits);
    
    // Comparaison en temps constant
    if (hashArray.length !== storedHashBytes.length) return false;
    let result = 0;
    for (let i = 0; i < hashArray.length; i++) {
      result |= hashArray[i] ^ storedHashBytes[i];
    }
    return result === 0;
  } catch {
    return false;
  }
}

// ============================================================
// Rate Limiting
// ============================================================
export async function checkRateLimit(
  db: D1Database,
  identifier: string,
  endpoint: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSeconds * 1000).toISOString();
  
  // Nettoyer les anciennes entrées
  await db.prepare(
    'DELETE FROM rate_limits WHERE window_start < ?'
  ).bind(windowStart).run();
  
  // Vérifier le compteur actuel
  const existing = await db.prepare(
    'SELECT request_count, window_start FROM rate_limits WHERE identifier = ? AND endpoint = ?'
  ).bind(identifier, endpoint).first<{ request_count: number; window_start: string }>();
  
  if (!existing) {
    // Première requête dans la fenêtre
    await db.prepare(
      'INSERT INTO rate_limits (identifier, endpoint, request_count, window_start) VALUES (?, ?, 1, ?)'
    ).bind(identifier, endpoint, now.toISOString()).run();
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: new Date(now.getTime() + windowSeconds * 1000)
    };
  }
  
  const windowStartDate = new Date(existing.window_start);
  const resetAt = new Date(windowStartDate.getTime() + windowSeconds * 1000);
  
  if (existing.request_count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt
    };
  }
  
  // Incrémenter le compteur
  await db.prepare(
    'UPDATE rate_limits SET request_count = request_count + 1 WHERE identifier = ? AND endpoint = ?'
  ).bind(identifier, endpoint).run();
  
  return {
    allowed: true,
    remaining: maxRequests - existing.request_count - 1,
    resetAt
  };
}

// ============================================================
// Journalisation d'audit
// ============================================================
export async function logAudit(
  db: D1Database,
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId: string | null,
  request: Request,
  details?: object
): Promise<void> {
  try {
    const ipAddress = request.headers.get('CF-Connecting-IP') || 
                      request.headers.get('X-Forwarded-For') || 
                      'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';
    
    await db.prepare(`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      action,
      resourceType,
      resourceId,
      sanitizeString(ipAddress, 45),
      sanitizeString(userAgent, 500),
      details ? JSON.stringify(details) : null
    ).run();
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

// ============================================================
// Validation de la longueur d'entrée
// ============================================================
export function validateInputLength(
  input: string,
  fieldName: string,
  minLength: number,
  maxLength: number
): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  return { valid: true };
}
