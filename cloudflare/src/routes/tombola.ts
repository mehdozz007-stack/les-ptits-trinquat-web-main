// ============================================================
// Routes Tombola - Les P'tits Trinquat API
// ============================================================

import { Hono } from 'hono';
import type {
  Env,
  ApiResponse,
  TombolaParticipant,
  TombolaParticipantPublic,
  TombolaLot,
  TombolaLotWithRelations,
  TombolaParticipantCreateRequest,
  TombolaLotCreateRequest
} from '../types';
import {
  isValidEmail,
  sanitizeString,
  validateInputLength,
  escapeHtml,
  generateId,
  logAudit
} from '../utils/security';
import { rateLimitMiddleware } from '../middleware/rateLimit';
import { requireAuth, requireAdmin, getAuthContext, optionalAuth } from '../middleware/auth';

const tombola = new Hono<{ Bindings: Env }>();

// ============================================================
// GET /tombola/participants - Liste publique (sans emails)
// ============================================================
tombola.get('/participants', async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT id, prenom, role, classes, emoji, created_at
      FROM tombola_participants
      ORDER BY created_at DESC
    `).all<TombolaParticipantPublic>();

    return c.json<ApiResponse>({
      success: true,
      data: result.results
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('Get participants error:', errorMessage);
    console.error('Error stack:', errorStack);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return c.json<ApiResponse>({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});

// ============================================================
// GET /tombola/participants/my - Mes participants (filtrés par user_id du token)
// ============================================================
tombola.get('/participants/my', async (c) => {
  try {
    // Récupérer le token des headers
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Authentification requise'
      }, 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Chercher la session et l'utilisateur
    const session = await c.env.DB.prepare(`
      SELECT s.user_id, s.expires_at
      FROM sessions s
      WHERE s.token = ?
    `).bind(token).first<{
      user_id: string;
      expires_at: string;
    }>();

    if (!session) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Token invalide'
      }, 401);
    }

    // Vérifier l'expiration
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Token expiré'
      }, 401);
    }

    const userId = session.user_id;

    const result = await c.env.DB.prepare(`
      SELECT id, prenom, role, classes, emoji, created_at
      FROM tombola_participants
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all<TombolaParticipantPublic>();

    return c.json<ApiResponse>({
      success: true,
      data: result.results
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Get my participants error:', errorMessage);
    return c.json<ApiResponse>({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});

// ============================================================
// GET /tombola/lots - Liste des lots avec relations
// ============================================================
tombola.get('/lots', async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT 
        l.id,
        l.nom,
        l.description,
        l.icone,
        l.statut,
        l.parent_id,
        l.reserved_by,
        l.created_at,
        p.id as parent_id_full,
        p.prenom as parent_prenom,
        p.emoji as parent_emoji,
        r.id as reserver_id_full,
        r.prenom as reserver_prenom,
        r.emoji as reserver_emoji
      FROM tombola_lots l
      LEFT JOIN tombola_participants p ON l.parent_id = p.id
      LEFT JOIN tombola_participants r ON l.reserved_by = r.id
      ORDER BY l.created_at DESC
    `).all<any>();

    // Transform flat structure into nested structure
    const transformedData = result.results.map((row: any) => ({
      id: row.id,
      nom: row.nom,
      description: row.description,
      icone: row.icone,
      statut: row.statut,
      parent_id: row.parent_id,
      reserved_by: row.reserved_by,
      created_at: row.created_at,
      parent: row.parent_prenom ? {
        id: row.parent_id_full,
        prenom: row.parent_prenom,
        emoji: row.parent_emoji,
      } : undefined,
      reserver: row.reserver_prenom ? {
        id: row.reserver_id_full,
        prenom: row.reserver_prenom,
        emoji: row.reserver_emoji,
      } : undefined,
    }));

    return c.json<ApiResponse>({
      success: true,
      data: transformedData
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('Get lots error:', errorMessage);
    console.error('Error stack:', errorStack);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return c.json<ApiResponse>({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});

// ============================================================
// GET /tombola/lots/my - Mes lots (filtrés par user_id du propriétaire)
// ============================================================
tombola.get('/lots/my', async (c) => {
  try {
    const userId = c.req.query('user_id');

    if (!userId) {
      return c.json<ApiResponse>({
        success: false,
        error: 'user_id query parameter is required'
      }, 400);
    }

    // Récupérer les participants de l'utilisateur
    const myParticipants = await c.env.DB.prepare(`
      SELECT id FROM tombola_participants WHERE user_id = ?
    `).bind(userId).all<{ id: string }>();

    if (myParticipants.results.length === 0) {
      return c.json<ApiResponse>({
        success: true,
        data: []
      });
    }

    const participantIds = myParticipants.results.map(p => p.id);
    const placeholders = participantIds.map(() => '?').join(',');

    // Récupérer les lots créés par ces participants
    const result = await c.env.DB.prepare(`
      SELECT 
        l.id,
        l.nom,
        l.description,
        l.icone,
        l.statut,
        l.parent_id,
        l.reserved_by,
        l.created_at,
        p.id as parent_id_full,
        p.prenom as parent_prenom,
        p.emoji as parent_emoji,
        r.id as reserver_id_full,
        r.prenom as reserver_prenom,
        r.emoji as reserver_emoji
      FROM tombola_lots l
      LEFT JOIN tombola_participants p ON l.parent_id = p.id
      LEFT JOIN tombola_participants r ON l.reserved_by = r.id
      WHERE l.parent_id IN (${placeholders})
      ORDER BY l.created_at DESC
    `).bind(...participantIds).all<any>();

    // Transform flat structure into nested structure
    const transformedData = result.results.map((row: any) => ({
      id: row.id,
      nom: row.nom,
      description: row.description,
      icone: row.icone,
      statut: row.statut,
      parent_id: row.parent_id,
      reserved_by: row.reserved_by,
      created_at: row.created_at,
      parent: row.parent_prenom ? {
        id: row.parent_id_full,
        prenom: row.parent_prenom,
        emoji: row.parent_emoji,
      } : undefined,
      reserver: row.reserver_prenom ? {
        id: row.reserver_id_full,
        prenom: row.reserver_prenom,
        emoji: row.reserver_emoji,
      } : undefined,
    }));

    return c.json<ApiResponse>({
      success: true,
      data: transformedData
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Get my lots error:', errorMessage);
    return c.json<ApiResponse>({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});

// ============================================================
// POST /tombola/participants - Créer un participant (authentification requise)
// ============================================================
tombola.post('/participants', rateLimitMiddleware, async (c) => {
  try {
    // Vérifier l'authentification via header
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Authentification requise'
      }, 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Chercher la session et l'utilisateur
    const session = await c.env.DB.prepare(`
      SELECT s.user_id, u.is_active, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `).bind(token).first<{
      user_id: string;
      is_active: number;
      expires_at: string;
    }>();

    if (!session) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Token invalide'
      }, 401);
    }

    // Vérifier l'expiration
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Token expiré'
      }, 401);
    }

    // Vérifier que l'utilisateur est actif
    if (!session.is_active) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Utilisateur invalide ou désactivé'
      }, 401);
    }

    const userId = session.user_id;

    // ⏸️ VÉRIFIER QUE L'UTILISATEUR N'A PAS DÉJÀ UN PARTICIPANT
    const existingParticipant = await c.env.DB.prepare(
      'SELECT id FROM tombola_participants WHERE user_id = ?'
    ).bind(userId).first<{ id: string }>();

    if (existingParticipant) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Vous avez déjà un participant. Supprimez-le d\'abord si vous voulez en créer un nouveau.'
      }, 400);
    }

    const body = await c.req.json<TombolaParticipantCreateRequest>();

    // Validation prénom
    const prenomValidation = validateInputLength(body.prenom, 'Prénom', 1, 100);
    if (!prenomValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: prenomValidation.error }, 400);
    }

    // Validation email
    const email = sanitizeString(body.email?.toLowerCase() || '', 255);
    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Adresse email invalide'
      }, 400);
    }

    // Validation role (optionnel)
    let role = 'Parent participant';
    if (body.role) {
      const roleValidation = validateInputLength(body.role, 'Role', 1, 50);
      if (!roleValidation.valid) {
        return c.json<ApiResponse>({ success: false, error: roleValidation.error }, 400);
      }
      role = sanitizeString(body.role, 50);
    }

    // Validation classes (optionnel)
    let classes: string | null = null;
    if (body.classes) {
      const classesValidation = validateInputLength(body.classes, 'Classes', 1, 200);
      if (!classesValidation.valid) {
        return c.json<ApiResponse>({ success: false, error: classesValidation.error }, 400);
      }
      classes = sanitizeString(body.classes, 200);
    }

    // Validation emoji (optionnel)
    let emoji = '😊';
    if (body.emoji) {
      emoji = body.emoji.slice(0, 10); // Limiter la longueur de l'emoji
    }

    const id = generateId();

    // Insérer le participant associé à l'user_id authentifié
    await c.env.DB.prepare(`
      INSERT INTO tombola_participants (id, user_id, prenom, email, role, classes, emoji)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, userId, sanitizeString(body.prenom, 100), email, role, classes, emoji).run();

    await logAudit(c.env.DB, userId, 'PARTICIPANT_CREATED', 'participant', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: { id },
      message: 'Participant créé avec succès'
    }, 201);
  } catch (error) {
    console.error('Create participant error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Erreur lors de la création du participant'
    }, 500);
  }
});

// ============================================================
// POST /tombola/lots - Créer un lot (public - pas d'auth requise)
// ============================================================
tombola.post('/lots', rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json<TombolaLotCreateRequest>();

    // Validation nom
    const nomValidation = validateInputLength(body.nom, 'Nom', 1, 200);
    if (!nomValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: nomValidation.error }, 400);
    }

    // Validation parent_id
    if (!body.parent_id) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Parent ID is required'
      }, 400);
    }

    // Vérifier que le parent existe
    const parent = await c.env.DB.prepare(
      'SELECT id, user_id FROM tombola_participants WHERE id = ?'
    ).bind(body.parent_id).first<{ id: string; user_id: string | null }>();

    if (!parent) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Parent participant not found'
      }, 404);
    }

    // Validation description (optionnel)
    let description: string | null = null;
    if (body.description) {
      const descValidation = validateInputLength(body.description, 'Description', 1, 1000);
      if (!descValidation.valid) {
        return c.json<ApiResponse>({ success: false, error: descValidation.error }, 400);
      }
      description = sanitizeString(body.description, 1000);
    }

    // Validation icone (optionnel)
    const icone = body.icone?.slice(0, 10) || '🎁';

    const id = generateId();

    await c.env.DB.prepare(`
      INSERT INTO tombola_lots (id, nom, description, icone, parent_id, statut, created_at)
      VALUES (?, ?, ?, ?, ?, 'disponible', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    `).bind(id, sanitizeString(body.nom, 200), description, icone, body.parent_id).run();

    await logAudit(c.env.DB, body.parent_id || null, 'LOT_CREATED', 'lot', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: { id },
      message: 'Lot created'
    }, 201);
  } catch (error) {
    console.error('Create lot error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMsg);
    return c.json<ApiResponse>({
      success: false,
      error: `An error occurred: ${errorMsg}`
    }, 500);
  }
});

// ============================================================
// PATCH /tombola/lots/:id/reserve - Réserver un lot (système public)
// ============================================================
tombola.patch('/lots/:id/reserve', optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json<{ reserver_id: string }>();

    if (!body.reserver_id) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Reserver ID is required'
      }, 400);
    }

    // Vérifier que le lot existe et est disponible
    const lot = await c.env.DB.prepare(
      'SELECT id, statut, parent_id FROM tombola_lots WHERE id = ?'
    ).bind(id).first<{ id: string; statut: string; parent_id: string }>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot not found' }, 404);
    }

    if (lot.statut !== 'disponible') {
      return c.json<ApiResponse>({
        success: false,
        error: 'Lot is not available for reservation'
      }, 400);
    }

    // Vérifier que le reserver existe
    const reserver = await c.env.DB.prepare(
      'SELECT id FROM tombola_participants WHERE id = ?'
    ).bind(body.reserver_id).first<{ id: string }>();

    if (!reserver) {
      return c.json<ApiResponse>({ success: false, error: 'Reserver not found' }, 404);
    }

    // Ne peut pas réserver son propre lot
    if (lot.parent_id === body.reserver_id) {
      return c.json<ApiResponse>({
        success: false,
        error: 'You cannot reserve your own lot'
      }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'reserve', reserved_by = ? WHERE id = ?
    `).bind(body.reserver_id, id).run();

    await logAudit(c.env.DB, null, 'LOT_RESERVED', 'lot', id, c.req.raw, { reserver_id: body.reserver_id });

    return c.json<ApiResponse>({
      success: true,
      message: 'Lot reserved successfully'
    });
  } catch (error) {
    console.error('Reserve lot error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMsg);
    return c.json<ApiResponse>({
      success: false,
      error: `An error occurred: ${errorMsg}`
    }, 500);
  }
});

// ============================================================
// POST /tombola/lots/:id/mark-remis - Marquer lot comme remis (propriétaire)
// ============================================================
tombola.post('/lots/:id/mark-remis', optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    let body: { user_id?: string } = {};
    try {
      body = await c.req.json<{ user_id?: string }>();
    } catch {
      // Body is optional
    }

    // Récupérer le lot
    const lot = await c.env.DB.prepare(
      'SELECT id, statut, parent_id FROM tombola_lots WHERE id = ?'
    ).bind(id).first<{ id: string; statut: string; parent_id: string }>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot not found' }, 404);
    }

    // Vérifier que le lot est réservé
    if (lot.statut !== 'reserve') {
      return c.json<ApiResponse>({
        success: false,
        error: 'Only reserved lots can be marked as delivered'
      }, 400);
    }

    // Vérifier que l'utilisateur est bien le propriétaire du lot
    if (body.user_id) {
      const participant = await c.env.DB.prepare(
        'SELECT id, user_id FROM tombola_participants WHERE id = ?'
      ).bind(lot.parent_id).first<{ id: string; user_id: string | null }>();

      if (!participant) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Participant not found'
        }, 404);
      }

      // Vérifier l'isolement par user_id
      if (participant.user_id !== body.user_id) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Unauthorized: This lot does not belong to your account'
        }, 403);
      }
    }

    // Mettre à jour le statut à 'remis'
    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'remis' WHERE id = ?
    `).bind(id).run();

    await logAudit(c.env.DB, null, 'LOT_MARKED_REMIS', 'lot', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Lot marked as delivered'
    });
  } catch (error) {
    console.error('Mark remis error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// POST /tombola/lots/:id/mark-available - Remettre lot disponible (propriétaire)
// ============================================================
tombola.post('/lots/:id/mark-available', optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    let body: { user_id?: string } = {};
    try {
      body = await c.req.json<{ user_id?: string }>();
    } catch {
      // Body is optional
    }

    // Récupérer le lot
    const lot = await c.env.DB.prepare(
      'SELECT id, statut, parent_id FROM tombola_lots WHERE id = ?'
    ).bind(id).first<{ id: string; statut: string; parent_id: string }>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot not found' }, 404);
    }

    // Vérifier que le lot est réservé
    if (lot.statut !== 'reserve') {
      return c.json<ApiResponse>({
        success: false,
        error: 'Only reserved lots can be made available again'
      }, 400);
    }

    // Vérifier que l'utilisateur est bien le propriétaire du lot
    if (body.user_id) {
      const participant = await c.env.DB.prepare(
        'SELECT id, user_id FROM tombola_participants WHERE id = ?'
      ).bind(lot.parent_id).first<{ id: string; user_id: string | null }>();

      if (!participant) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Participant not found'
        }, 404);
      }

      // Vérifier l'isolement par user_id
      if (participant.user_id !== body.user_id) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Unauthorized: This lot does not belong to your account'
        }, 403);
      }
    }

    // Mettre à jour le statut à 'disponible' et annuler la réservation
    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'disponible', reserved_by = NULL WHERE id = ?
    `).bind(id).run();

    await logAudit(c.env.DB, null, 'LOT_MARKED_AVAILABLE', 'lot', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Lot made available again'
    });
  } catch (error) {
    console.error('Mark available error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// GET /tombola/contact-link/:lotId - Lien de contact (public)
// ============================================================
tombola.get('/contact-link/:lotId', optionalAuth, async (c) => {
  try {
    const { lotId } = c.req.param();
    const senderName = c.req.query('sender_name') || 'Un parent';

    // Récupérer le lot avec l'email du propriétaire
    const lot = await c.env.DB.prepare(`
      SELECT l.nom, p.email, p.prenom
      FROM tombola_lots l
      JOIN tombola_participants p ON l.parent_id = p.id
      WHERE l.id = ?
    `).bind(lotId).first<{ nom: string; email: string; prenom: string }>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot not found' }, 404);
    }

    // Construire le lien mailto
    const subject = encodeURIComponent(`Tombola - Intérêt pour "${escapeHtml(lot.nom)}"`);
    const body = encodeURIComponent(
      `Bonjour ${escapeHtml(lot.prenom)},\n\n` +
      `Je suis ${escapeHtml(sanitizeString(senderName, 100))} et je suis intéressé(e) par votre lot "${escapeHtml(lot.nom)}" proposé pour la tombola.\n\n` +
      `Pouvons-nous en discuter ?\n\nMerci !`
    );

    const mailtoLink = `mailto:${lot.email}?subject=${subject}&body=${body}`;

    await logAudit(c.env.DB, null, 'CONTACT_LINK_GENERATED', 'lot', lotId, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: { mailto_link: mailtoLink }
    });
  } catch (error) {
    console.error('Get contact link error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// GET /tombola/contact-link/:lotId/reserver - Lien de contact du reserver
// ============================================================
tombola.get('/contact-link/:lotId/reserver', optionalAuth, async (c) => {
  try {
    const { lotId } = c.req.param();
    const senderName = c.req.query('sender_name') || 'Un parent';

    // Récupérer le lot avec l'email du reserver
    const lot = await c.env.DB.prepare(`
      SELECT l.nom, r.email, r.prenom
      FROM tombola_lots l
      JOIN tombola_participants r ON l.reserved_by = r.id
      WHERE l.id = ?
    `).bind(lotId).first<{ nom: string; email: string; prenom: string }>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot or reserver not found' }, 404);
    }

    // Construire le lien mailto au reserver
    const subject = encodeURIComponent(`Tombola - À propos de la réservation "${escapeHtml(lot.nom)}"`);
    const body = encodeURIComponent(
      `Bonjour ${escapeHtml(lot.prenom)},\n\n` +
      `Je suis ${escapeHtml(sanitizeString(senderName, 100))} et vous avez réservé mon lot "${escapeHtml(lot.nom)}" pour la tombola.\n\n` +
      `Pouvons-nous convenir d'un moment pour échanger ?\n\nMerci !`
    );

    const mailtoLink = `mailto:${lot.email}?subject=${subject}&body=${body}`;

    await logAudit(c.env.DB, null, 'CONTACT_RESERVER_LINK_GENERATED', 'lot', lotId, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: { mailto_link: mailtoLink }
    });
  } catch (error) {
    console.error('Get reserver contact link error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// PATCH /tombola/lots/:id/cancel - Annuler réservation (admin)
// ============================================================
tombola.patch('/lots/:id/cancel', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);

    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'disponible', reserved_by = NULL WHERE id = ?
    `).bind(id).run();

    await logAudit(c.env.DB, authContext?.user.id || null, 'LOT_RESERVATION_CANCELLED', 'lot', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Reservation cancelled'
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// PATCH /tombola/lots/:id/remis - Marquer comme remis (admin)
// ============================================================
tombola.patch('/lots/:id/remis', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);

    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'remis' WHERE id = ?
    `).bind(id).run();

    await logAudit(c.env.DB, authContext?.user.id || null, 'LOT_MARKED_REMIS', 'lot', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Lot marked as delivered'
    });
  } catch (error) {
    console.error('Mark remis error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// ============================================================
// DELETE /tombola/lots/:id - Supprimer un lot (propriétaire publiquement)
// ============================================================
tombola.delete('/lots/:id', optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json<{ parent_id: string; user_id?: string }>();

    if (!body.parent_id) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Parent ID is required'
      }, 400);
    }

    // Récupérer le lot pour vérifier la propriété
    const lot = await c.env.DB.prepare(
      'SELECT id, parent_id FROM tombola_lots WHERE id = ?'
    ).bind(id).first<{ id: string; parent_id: string }>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot not found' }, 404);
    }

    // Vérifier que c'est le propriétaire du lot
    if (lot.parent_id !== body.parent_id) {
      return c.json<ApiResponse>({
        success: false,
        error: 'You can only delete your own lots'
      }, 403);
    }

    // Vérifier que le participant (parent) appartient bien au user_id fourni
    if (body.user_id) {
      const participant = await c.env.DB.prepare(
        'SELECT id, user_id FROM tombola_participants WHERE id = ?'
      ).bind(body.parent_id).first<{ id: string; user_id: string | null }>();

      if (!participant) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Participant not found'
        }, 404);
      }

      // Vérifier l'isolement par user_id
      if (participant.user_id !== body.user_id) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Unauthorized: This lot does not belong to your account'
        }, 403);
      }
    }

    await c.env.DB.prepare('DELETE FROM tombola_lots WHERE id = ?').bind(id).run();

    await logAudit(c.env.DB, null, 'LOT_DELETED', 'lot', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Lot deleted'
    });
  } catch (error) {
    console.error('Delete lot error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// GET /tombola/contact-link/:lotId - Lien de contact (public)
// ============================================================
tombola.get('/contact-link/:lotId', optionalAuth, async (c) => {
  try {
    const { lotId } = c.req.param();
    const senderName = c.req.query('sender_name') || 'Un parent';

    // Récupérer le lot avec l'email du propriétaire
    const lot = await c.env.DB.prepare(`
      SELECT l.nom, p.email, p.prenom
      FROM tombola_lots l
      JOIN tombola_participants p ON l.parent_id = p.id
      WHERE l.id = ?
    `).bind(lotId).first<{ nom: string; email: string; prenom: string }>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot not found' }, 404);
    }

    // Construire le lien mailto
    const subject = encodeURIComponent(`Tombola - Intérêt pour "${escapeHtml(lot.nom)}"`);
    const body = encodeURIComponent(
      `Bonjour ${escapeHtml(lot.prenom)},\n\n` +
      `Je suis ${escapeHtml(sanitizeString(senderName, 100))} et je suis intéressé(e) par votre lot "${escapeHtml(lot.nom)}" proposé pour la tombola.\n\n` +
      `Pouvons-nous en discuter ?\n\nMerci !`
    );

    const mailtoLink = `mailto:${lot.email}?subject=${subject}&body=${body}`;

    await logAudit(c.env.DB, null, 'CONTACT_LINK_GENERATED', 'lot', lotId, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: { mailto_link: mailtoLink }
    });
  } catch (error) {
    console.error('Get contact link error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// ROUTES ADMIN
// ============================================================

// GET /tombola/admin/participants - Liste complète (avec emails)
tombola.get('/admin/participants', requireAdmin, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM tombola_participants ORDER BY created_at DESC
    `).all<TombolaParticipant>();

    return c.json<ApiResponse>({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error('Get admin participants error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// DELETE /tombola/admin/participants/:id - Supprimer participant (admin) avec cascade complète
tombola.delete('/admin/participants/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);

    // Récupérer le participant avec son user_id
    const participant = await c.env.DB.prepare(
      'SELECT id, user_id FROM tombola_participants WHERE id = ?'
    ).bind(id).first<{ id: string; user_id: string | null }>();

    if (!participant) {
      return c.json<ApiResponse>({ success: false, error: 'Participant not found' }, 404);
    }

    // Suppression en cascade complète
    // 1. Supprimer les lots du participant
    await c.env.DB.prepare('DELETE FROM tombola_lots WHERE parent_id = ?').bind(id).run();

    // 2. Supprimer la participation
    await c.env.DB.prepare('DELETE FROM tombola_participants WHERE id = ?').bind(id).run();

    // 3. Si un user_id est associé, supprimer complètement l'utilisateur et ses données
    if (participant.user_id) {
      // Supprimer les sessions
      await c.env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(participant.user_id).run();

      // Supprimer les rôles
      await c.env.DB.prepare('DELETE FROM user_roles WHERE user_id = ?').bind(participant.user_id).run();

      // Supprimer les audit logs
      await c.env.DB.prepare('DELETE FROM audit_logs WHERE user_id = ?').bind(participant.user_id).run();

      // Supprimer l'utilisateur (droit à l'oubli)
      await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(participant.user_id).run();
    }

    await logAudit(c.env.DB, authContext?.user.id || null, 'PARTICIPANT_DELETED', 'participant', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Participant et utilisateur supprimés complètement. Les données peuvent être réutilisées.'
    });
  } catch (error) {
    console.error('Delete participant error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// DELETE /tombola/participants/:id - Supprimer sa propre participation (authentification requise)
// ============================================================
tombola.delete('/participants/:id', async (c) => {
  try {
    // Vérifier l'authentification via header
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Authentification requise'
      }, 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Chercher la session et l'utilisateur
    const session = await c.env.DB.prepare(`
      SELECT s.user_id, u.is_active, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `).bind(token).first<{
      user_id: string;
      is_active: number;
      expires_at: string;
    }>();

    if (!session) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Token invalide'
      }, 401);
    }

    // Vérifier l'expiration
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Token expiré'
      }, 401);
    }

    const userId = session.user_id;
    const { id } = c.req.param();

    // Vérifier que le participant existe ET appartient à l'utilisateur courant
    const participant = await c.env.DB.prepare(
      'SELECT id, user_id FROM tombola_participants WHERE id = ?'
    ).bind(id).first<{ id: string; user_id: string }>();

    if (!participant) {
      return c.json<ApiResponse>({ success: false, error: 'Participant not found' }, 404);
    }

    // Vérifier que le participant appartient à l'utilisateur authentifié
    if (participant.user_id !== userId) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Vous ne pouvez supprimer que votre propre participation'
      }, 403);
    }

    // Supprimer les lots du participant d'abord (cascade)
    await c.env.DB.prepare('DELETE FROM tombola_lots WHERE parent_id = ?').bind(id).run();

    // Supprimer la participation
    await c.env.DB.prepare('DELETE FROM tombola_participants WHERE id = ?').bind(id).run();

    // Supprimer toutes les sessions de l'utilisateur
    await c.env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run();

    // Supprimer les rôles de l'utilisateur
    await c.env.DB.prepare('DELETE FROM user_roles WHERE user_id = ?').bind(userId).run();

    // Supprimer aussi les données d'audit
    await c.env.DB.prepare('DELETE FROM audit_logs WHERE user_id = ?').bind(userId).run();

    // Supprimer l'utilisateur lui-même (droit à l'oubli)
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Compte supprimé : toutes les données utilisateur ont été supprimées de la base de données'
    });
  } catch (error) {
    console.error('Delete own participation error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Une erreur est survenue'
    }, 500);
  }
});

export default tombola;
