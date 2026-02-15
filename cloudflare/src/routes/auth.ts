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
        error: 'Veuillez entrer votre email et votre mot de passe'
      }, 400);
    }

    const email = sanitizeString(body.email.toLowerCase(), 255);
    const password = body.password;

    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Veuillez entrer une adresse email valide'
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
        error: 'Email non trouvé. Créez un compte pour commencer'
      }, 401);
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      await logAudit(c.env.DB, user.id, 'LOGIN_FAILED', 'user', user.id, c.req.raw, { reason: 'invalid_password' });

      return c.json<ApiResponse>({
        success: false,
        error: 'Identifiants invalides. Veuillez vérifier votre email et votre mot de passe'
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
      error: 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer'
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
      message: 'Vous avez été déconnecté avec succès'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Une erreur s\'est produite. Veuillez réessayer'
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
      error: 'Vous devez être connecté pour accéder à cette ressource'
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
// POST /auth/register - Inscription (enregistrement utilisateur)
// ============================================================
auth.post('/register', authRateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json<{ email: string; password: string; password_confirm: string }>();

    // Validation
    if (!body.email || !body.password || !body.password_confirm) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Veuillez remplir tous les champs: email, mot de passe et confirmation'
      }, 400);
    }

    const email = sanitizeString(body.email.toLowerCase(), 255);

    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Veuillez entrer une adresse email valide'
      }, 400);
    }

    // Validation mot de passe
    const passwordValidation = validateInputLength(body.password, 'Password', 8, 128);
    if (!passwordValidation.valid) {
      return c.json<ApiResponse>({
        success: false,
        error: passwordValidation.error
      }, 400);
    }

    // Vérifier les mots de passe correspondent
    if (body.password !== body.password_confirm) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Les mots de passe ne correspondent pas'
      }, 400);
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Cet email est déjà utilisé. Connectez-vous ou utilisez une autre adresse'
      }, 400);
    }

    // Hasher le mot de passe
    const passwordHash = await hashPassword(body.password);

    // Créer l'utilisateur
    const userId = generateId();
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, password_hash, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(userId, email, passwordHash).run();

    // Log audit
    await logAudit(c.env.DB, userId, 'USER_REGISTERED', 'user', userId, c.req.raw);

    // Créer automatiquement une session (auto-login)
    const token = generateSecureToken();
    const sessionDuration = parseInt(c.env.SESSION_DURATION || '604800', 10);
    const expiresAt = new Date(Date.now() + sessionDuration * 1000).toISOString();

    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(generateId(), userId, token, expiresAt).run();

    // Log auto-login après registration
    await logAudit(c.env.DB, userId, 'AUTO_LOGIN_AFTER_REGISTER', 'user', userId, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: userId,
          email: email
        },
        token: token
      },
      message: 'Compte créé et authentification réussie !'
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Impossible de créer votre compte. Veuillez réessayer'
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
      return c.json<ApiResponse>({ success: false, error: 'Vous devez être connecté pour changer votre mot de passe' }, 401);
    }

    const body = await c.req.json<{ current_password: string; new_password: string }>();

    // Validation
    if (!body.current_password || !body.new_password) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Veuillez entrer votre mot de passe actuel et votre nouveau mot de passe'
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
        error: 'Votre mot de passe actuel est incorrect'
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
      message: 'Votre mot de passe a été changé avec succès'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Une erreur s\'est produite. Veuillez réessayer'
    }, 500);
  }
});

// ============================================================
// POST /auth/forgot-password - Demander une réinitialisation
// ============================================================
auth.post('/forgot-password', authRateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json<{ email: string }>();

    if (!body.email) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Veuillez entrer votre adresse email'
      }, 400);
    }

    const email = sanitizeString(body.email.toLowerCase(), 255);

    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Veuillez entrer une adresse email valide'
      }, 400);
    }

    // Vérifier si l'utilisateur existe
    const userResult = await c.env.DB.prepare(`
      SELECT id, email FROM users WHERE email = ?
    `).bind(email).first<{ id: string; email: string }>();

    if (!userResult) {
      // Pour des raisons de sécurité, ne pas révéler si l'email existe
      await logAudit(c.env.DB, 'UNKNOWN', 'PASSWORD_RESET_UNKNOWN_EMAIL', 'email', email, c.req.raw);
      return c.json<ApiResponse>({
        success: true,
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation'
      });
    }

    // Importer les utilitaires de reset
    const { generateResetToken, hashResetToken, calculateResetTokenExpiration, generateResetTokenId } = await import('../utils/passwordReset');
    const { sendPasswordResetEmail } = await import('../services/passwordResetEmailService');

    // Générer le token
    const plainToken = generateResetToken();
    const tokenHash = await hashResetToken(plainToken);
    const tokenId = generateResetTokenId();
    const expiresAt = calculateResetTokenExpiration();

    // Stocker le token dans la base de données
    await c.env.DB.prepare(`
      INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(tokenId, userResult.id, tokenHash, expiresAt).run();

    // Récupérer l'URL frontend depuis l'en-tête host ou utiliser une par défaut
    const host = c.req.header('host') || 'lespetitstrinquat.fr';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    // Mapper les ports locaux: backend 8787 -> frontend 8082
    let frontendUrl = `${protocol}://${host}`;
    if (host.includes('127.0.0.1:8787') || host.includes('localhost:8787')) {
      frontendUrl = 'http://localhost:8082';
    } else if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      // Production
      frontendUrl = `https://lespetitstrinquat.fr`;
    }

    // Envoyer l'email
    const emailResult = await sendPasswordResetEmail(c.env, userResult.email, plainToken, frontendUrl);

    if (!emailResult.success) {
      await logAudit(c.env.DB, userResult.id, 'PASSWORD_RESET_EMAIL_FAILED', 'email', userResult.email, c.req.raw);
      return c.json<ApiResponse>({
        success: false,
        error: emailResult.error || 'Impossible d\'envoyer l\'email de réinitialisation'
      }, 500);
    }

    await logAudit(c.env.DB, userResult.id, 'PASSWORD_RESET_REQUESTED', 'email', userResult.email, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Si cet email existe, vous recevrez un lien de réinitialisation'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Une erreur s\'est produite. Veuillez réessayer'
    }, 500);
  }
});

// ============================================================
// POST /auth/reset-password - Réinitialiser le mot de passe
// ============================================================
auth.post('/reset-password', async (c) => {
  try {
    const body = await c.req.json<{ token: string; newPassword: string; confirmPassword: string }>();

    if (!body.token || !body.newPassword || !body.confirmPassword) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Veuillez fournir tous les champs requis'
      }, 400);
    }

    if (body.newPassword !== body.confirmPassword) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Les mots de passe ne correspondent pas'
      }, 400);
    }

    const passwordValidation = validateInputLength(body.newPassword, 'Password', 8, 128);
    if (!passwordValidation.valid) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Le mot de passe doit faire entre 8 et 128 caractères'
      }, 400);
    }

    // Importer les utilitaires
    const { hashResetToken, verifyResetToken } = await import('../utils/passwordReset');

    // Hasher le token fourni pour comparaison
    const tokenHash = await hashResetToken(body.token);

    // Chercher le token dans la base de données
    const now = Math.floor(Date.now() / 1000);
    const resetTokenResult = await c.env.DB.prepare(`
      SELECT id, user_id FROM password_reset_tokens
      WHERE token_hash = ? AND expires_at > ? AND used_at IS NULL
      LIMIT 1
    `).bind(tokenHash, now).first<{ id: string; user_id: string }>();

    if (!resetTokenResult) {
      await logAudit(c.env.DB, 'UNKNOWN', 'PASSWORD_RESET_INVALID_TOKEN', 'token', 'INVALID', c.req.raw);
      return c.json<ApiResponse>({
        success: false,
        error: 'Le lien de réinitialisation est invalide ou a expiré'
      }, 400);
    }

    // Hasher le nouveau mot de passe
    const newPasswordHash = await hashPassword(body.newPassword);

    // Mettre à jour le mot de passe
    await c.env.DB.prepare(`
      UPDATE users SET password_hash = ?, updated_at = ?
      WHERE id = ?
    `).bind(newPasswordHash, new Date().toISOString(), resetTokenResult.user_id).run();

    // Marquer le token comme utilisé
    await c.env.DB.prepare(`
      UPDATE password_reset_tokens SET used_at = ?
      WHERE id = ?
    `).bind(now, resetTokenResult.id).run();

    // Supprimer toutes les sessions existantes (force reconnexion)
    await c.env.DB.prepare(`
      DELETE FROM sessions WHERE user_id = ?
    `).bind(resetTokenResult.user_id).run();

    await logAudit(c.env.DB, resetTokenResult.user_id, 'PASSWORD_RESET_COMPLETED', 'user', resetTokenResult.user_id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès. Veuillez vous reconnecter.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Une erreur s\'est produite. Veuillez réessayer'
    }, 500);
  }
});

export default auth;
