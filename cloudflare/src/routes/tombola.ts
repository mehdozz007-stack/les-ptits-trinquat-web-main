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
    console.error('Get participants error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
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
        p.prenom as parent_prenom,
        p.emoji as parent_emoji,
        r.prenom as reserver_prenom,
        r.emoji as reserver_emoji
      FROM tombola_lots l
      LEFT JOIN tombola_participants p ON l.parent_id = p.id
      LEFT JOIN tombola_participants r ON l.reserved_by = r.id
      ORDER BY l.created_at DESC
    `).all<TombolaLotWithRelations>();

    return c.json<ApiResponse>({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error('Get lots error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// POST /tombola/participants - Créer un participant (public)
// ============================================================
tombola.post('/participants', rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json<TombolaParticipantCreateRequest>();
    const authContext = getAuthContext(c);

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
        error: 'Invalid email address'
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
    const userId = authContext?.user.id || null;

    await c.env.DB.prepare(`
      INSERT INTO tombola_participants (id, user_id, prenom, email, role, classes, emoji)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, userId, sanitizeString(body.prenom, 100), email, role, classes, emoji).run();

    await logAudit(c.env.DB, userId, 'PARTICIPANT_CREATED', 'participant', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: { id },
      message: 'Participant created'
    }, 201);
  } catch (error) {
    console.error('Create participant error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
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
// DELETE /tombola/lots/:id - Supprimer un lot (propriétaire publiquement)
// ============================================================
tombola.delete('/lots/:id', optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json<{ parent_id: string }>();

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

// DELETE /tombola/admin/participants/:id - Supprimer participant (admin)
tombola.delete('/admin/participants/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);

    await c.env.DB.prepare('DELETE FROM tombola_participants WHERE id = ?').bind(id).run();

    await logAudit(c.env.DB, authContext?.user.id || null, 'PARTICIPANT_DELETED', 'participant', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Participant deleted'
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
// DELETE /tombola/participants/:id - Supprimer sa propre participation (public)
// ============================================================
tombola.delete('/participants/:id', optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();

    // Vérifier que le participant existe
    const participant = await c.env.DB.prepare(
      'SELECT id FROM tombola_participants WHERE id = ?'
    ).bind(id).first<{ id: string }>();

    if (!participant) {
      return c.json<ApiResponse>({ success: false, error: 'Participant not found' }, 404);
    }

    // Supprimer la participation
    await c.env.DB.prepare('DELETE FROM tombola_participants WHERE id = ?').bind(id).run();

    await logAudit(c.env.DB, null, 'OWN_PARTICIPATION_DELETED', 'participant', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Participant deleted'
    });
  } catch (error) {
    console.error('Delete own participation error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

export default tombola;
