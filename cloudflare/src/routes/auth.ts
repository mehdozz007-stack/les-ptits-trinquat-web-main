// ============================================================
// Routes d'Authentification - Les P'tits Trinquat API
// ============================================================

import { Hono } from 'hono';
import type { Env, LoginRequest, LoginResponse, ApiResponse } from '../types';
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  generateId,
  isValidEmail,
  sanitizeString,
  validateInputLength,
  logAudit
} from '../utils/security';
import { authRateLimitMiddleware } from '../middleware/rateLimit';
import { requireAuth, getAuthContext } from '../middleware/auth';

const auth = new Hono<{ Bindings: Env }>();

// ============================================================
// POST /auth/login - Connexion
// ============================================================
auth.post('/login', authRateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json<LoginRequest>();

    // Validation des entrées
    if (!body.email || !body.password) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Email and password are required'
      }, 400);
    }

    const email = sanitizeString(body.email.toLowerCase(), 255);
    const password = body.password;

    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Invalid email format'
      }, 400);
    }

    const passwordValidation = validateInputLength(password, 'Password', 8, 128);
    if (!passwordValidation.valid) {
      return c.json<ApiResponse>({
        success: false,
        error: passwordValidation.error
      }, 400);
    }

    // Rechercher l'utilisateur
    const user = await c.env.DB.prepare(
      'SELECT id, email, password_hash FROM users WHERE email = ?'
    ).bind(email).first<{ id: string; email: string; password_hash: string }>();

    if (!user) {
      // Log tentative échouée
      await logAudit(c.env.DB, null, 'LOGIN_FAILED', 'user', null, c.req.raw, { email, reason: 'user_not_found' });

      return c.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials'
      }, 401);
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      await logAudit(c.env.DB, user.id, 'LOGIN_FAILED', 'user', user.id, c.req.raw, { reason: 'invalid_password' });

      return c.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials'
      }, 401);
    }

    // Récupérer le rôle
    const roleResult = await c.env.DB.prepare(
      'SELECT role FROM user_roles WHERE user_id = ?'
    ).bind(user.id).first<{ role: 'admin' | 'user' }>();

    // Créer une session
    const token = generateSecureToken();
    const sessionDuration = parseInt(c.env.SESSION_DURATION || '604800', 10);
    const expiresAt = new Date(Date.now() + sessionDuration * 1000).toISOString();

    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(generateId(), user.id, token, expiresAt).run();

    // Log connexion réussie
    await logAudit(c.env.DB, user.id, 'LOGIN_SUCCESS', 'user', user.id, c.req.raw);

    return c.json<ApiResponse<LoginResponse>>({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: roleResult?.role || null
        },
        expires_at: expiresAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred during login'
    }, 500);
  }
});

// ============================================================
// POST /auth/logout - Déconnexion
// ============================================================
auth.post('/logout', requireAuth, async (c) => {
  try {
    const authContext = getAuthContext(c);

    if (authContext) {
      // Supprimer la session
      await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?')
        .bind(authContext.session.id).run();

      await logAudit(c.env.DB, authContext.user.id, 'LOGOUT', 'user', authContext.user.id, c.req.raw);
    }

    return c.json<ApiResponse>({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred during logout'
    }, 500);
  }
});

// ============================================================
// GET /auth/me - Informations utilisateur courant
// ============================================================
auth.get('/me', requireAuth, async (c) => {
  const authContext = getAuthContext(c);

  if (!authContext) {
    return c.json<ApiResponse>({
      success: false,
      error: 'Not authenticated'
    }, 401);
  }

  return c.json<ApiResponse>({
    success: true,
    data: {
      id: authContext.user.id,
      email: authContext.user.email,
      role: authContext.role,
      session_expires_at: authContext.session.expires_at
    }
  });
});

// ============================================================
// POST /auth/register - Inscription (désactivée par défaut)
// ============================================================
auth.post('/register', authRateLimitMiddleware, async (c) => {
  // Inscription désactivée - seuls les admins peuvent créer des comptes
  return c.json<ApiResponse>({
    success: false,
    error: 'Registration is disabled. Please contact an administrator.'
  }, 403);
});

// ============================================================
// GET /auth/seed-admin - Créer un admin en développement
// ============================================================
auth.get('/seed-admin', async (c) => {
  try {
    // Vérifier qu'on est en développement
    if (c.env.ENVIRONMENT !== 'development') {
      return c.json<ApiResponse>({
        success: false,
        error: 'This endpoint is only available in development'
      }, 403);
    }

    // Vérifier s'il existe déjà un admin
    const adminCount = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_roles WHERE role = 'admin'
    `).first<{ count: number }>();

    if (adminCount && adminCount.count > 0) {
      return c.json<ApiResponse>({
        success: false,
        error: 'An admin already exists'
      }, 400);
    }

    // Créer un nouvel admin avec mot de passe "admin123"
    const adminPassword = 'admin123';
    const passwordHash = await hashPassword(adminPassword);
    const adminId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO users (id, email, password_hash)
      VALUES (?, ?, ?)
    `).bind(adminId, 'admin@tombola.fr', passwordHash).run();

    await c.env.DB.prepare(`
      INSERT INTO user_roles (user_id, role)
      VALUES (?, ?)
    `).bind(adminId, 'admin').run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Admin created successfully',
      data: {
        email: 'admin@tombola.fr',
        password: adminPassword,
        note: 'Change this password immediately in production!'
      }
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred while creating admin'
    }, 500);
  }
});

// ============================================================
// GET /auth/reset-admin - Réinitialiser les admins (DEV ONLY)
// ============================================================
auth.get('/reset-admin', async (c) => {
  try {
    // Vérifier qu'on est en développement
    if (c.env.ENVIRONMENT !== 'development') {
      return c.json<ApiResponse>({
        success: false,
        error: 'This endpoint is only available in development'
      }, 403);
    }

    // Récupérer tous les IDs des admins
    const admins = await c.env.DB.prepare(`
      SELECT user_id FROM user_roles WHERE role = 'admin'
    `).all<{ user_id: string }>();

    // Supprimer tous les rôles d'admin
    await c.env.DB.prepare(`
      DELETE FROM user_roles WHERE role = 'admin'
    `).run();

    // Supprimer tous les utilisateurs qui n'ont que le rôle admin
    if (admins.results && admins.results.length > 0) {
      for (const admin of admins.results) {
        const hasOtherRoles = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM user_roles WHERE user_id = ?
        `).bind(admin.user_id).first<{ count: number }>();

        if (!hasOtherRoles || hasOtherRoles.count === 0) {
          await c.env.DB.prepare(`
            DELETE FROM users WHERE id = ?
          `).bind(admin.user_id).run();
        }
      }
    }

    // Créer un nouvel admin avec mot de passe "admin123"
    const adminPassword = 'admin123';
    const passwordHash = await hashPassword(adminPassword);
    const adminId = generateId();

    await c.env.DB.prepare(`
      INSERT INTO users (id, email, password_hash)
      VALUES (?, ?, ?)
    `).bind(adminId, 'admin@tombola.fr', passwordHash).run();

    await c.env.DB.prepare(`
      INSERT INTO user_roles (user_id, role)
      VALUES (?, ?)
    `).bind(adminId, 'admin').run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Admin reset successfully',
      data: {
        email: 'admin@tombola.fr',
        password: adminPassword,
        note: 'Tous les anciens admins ont été supprimés'
      }
    });
  } catch (error) {
    console.error('Reset admin error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred while resetting admin'
    }, 500);
  }
});

// ============================================================
// POST /auth/change-password - Changer mot de passe
// ============================================================
auth.post('/change-password', requireAuth, async (c) => {
  try {
    const authContext = getAuthContext(c);
    if (!authContext) {
      return c.json<ApiResponse>({ success: false, error: 'Not authenticated' }, 401);
    }

    const body = await c.req.json<{ current_password: string; new_password: string }>();

    // Validation
    if (!body.current_password || !body.new_password) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Current and new password are required'
      }, 400);
    }

    const newPasswordValidation = validateInputLength(body.new_password, 'New password', 8, 128);
    if (!newPasswordValidation.valid) {
      return c.json<ApiResponse>({
        success: false,
        error: newPasswordValidation.error
      }, 400);
    }

    // Vérifier l'ancien mot de passe
    const isValid = await verifyPassword(body.current_password, authContext.user.password_hash);
    if (!isValid) {
      await logAudit(c.env.DB, authContext.user.id, 'PASSWORD_CHANGE_FAILED', 'user', authContext.user.id, c.req.raw);
      return c.json<ApiResponse>({
        success: false,
        error: 'Current password is incorrect'
      }, 401);
    }

    // Hasher le nouveau mot de passe
    const newHash = await hashPassword(body.new_password);

    // Mettre à jour
    await c.env.DB.prepare(`
      UPDATE users SET password_hash = ?, updated_at = ?
      WHERE id = ?
    `).bind(newHash, new Date().toISOString(), authContext.user.id).run();

    // Supprimer toutes les autres sessions
    await c.env.DB.prepare(`
      DELETE FROM sessions WHERE user_id = ? AND id != ?
    `).bind(authContext.user.id, authContext.session.id).run();

    await logAudit(c.env.DB, authContext.user.id, 'PASSWORD_CHANGED', 'user', authContext.user.id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

export default auth;
