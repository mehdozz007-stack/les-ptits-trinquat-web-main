// ============================================================
// Routes Newsletter - Les P'tits Trinquat API
// ============================================================

import { Hono } from 'hono';
import type {
  Env,
  ApiResponse,
  NewsletterSubscriber,
  Newsletter,
  NewsletterSubscribeRequest,
  SendNewsletterRequest
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
import { requireAdmin, getAuthContext } from '../middleware/auth';
import { renderNewsletterEmail, generateUnsubscribeUrl } from '../lib/emailTemplate';

const newsletter = new Hono<{ Bindings: Env }>();

// ============================================================
// POST /newsletter/subscribe - Inscription publique
// ============================================================
newsletter.post('/subscribe', rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json<NewsletterSubscribeRequest>();

    // Validation du consentement RGPD
    if (!body.consent) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Consent is required to subscribe'
      }, 400);
    }

    // Validation de l'email
    const email = sanitizeString(body.email?.toLowerCase() || '', 255);
    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Invalid email address'
      }, 400);
    }

    // Validation du prénom (optionnel)
    let firstName: string | null = null;
    if (body.first_name) {
      const nameValidation = validateInputLength(body.first_name, 'First name', 1, 100);
      if (!nameValidation.valid) {
        return c.json<ApiResponse>({
          success: false,
          error: nameValidation.error
        }, 400);
      }
      firstName = sanitizeString(body.first_name, 100);
    }

    // Vérifier si déjà inscrit
    const existing = await c.env.DB.prepare(
      'SELECT id, is_active FROM newsletter_subscribers WHERE email = ?'
    ).bind(email).first<{ id: string; is_active: number }>();

    if (existing) {
      if (existing.is_active) {
        return c.json<ApiResponse>({
          success: false,
          error: 'This email is already subscribed'
        }, 409);
      }

      // Réactiver l'abonnement
      await c.env.DB.prepare(`
        UPDATE newsletter_subscribers 
        SET is_active = 1, first_name = ?, consent = 1
        WHERE id = ?
      `).bind(firstName, existing.id).run();

      await logAudit(c.env.DB, null, 'NEWSLETTER_RESUBSCRIBE', 'subscriber', existing.id, c.req.raw);

      return c.json<ApiResponse>({
        success: true,
        message: 'Successfully resubscribed to newsletter'
      });
    }

    // Créer l'abonnement
    const id = generateId();
    await c.env.DB.prepare(`
      INSERT INTO newsletter_subscribers (id, email, first_name, consent, is_active)
      VALUES (?, ?, ?, 1, 1)
    `).bind(id, email, firstName).run();

    await logAudit(c.env.DB, null, 'NEWSLETTER_SUBSCRIBE', 'subscriber', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Successfully subscribed to newsletter'
    }, 201);
  } catch (error) {
    console.error('Subscribe error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred during subscription'
    }, 500);
  }
});

// ============================================================
// POST /newsletter/unsubscribe - Désinscription
// ============================================================
newsletter.post('/unsubscribe', rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json<{ email: string }>();

    const email = sanitizeString(body.email?.toLowerCase() || '', 255);
    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Invalid email address'
      }, 400);
    }

    const result = await c.env.DB.prepare(`
      UPDATE newsletter_subscribers SET is_active = 0 WHERE email = ?
    `).bind(email).run();

    if (result.meta.changes === 0) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Email not found'
      }, 404);
    }

    await logAudit(c.env.DB, null, 'NEWSLETTER_UNSUBSCRIBE', 'subscriber', null, c.req.raw, { email });

    return c.json<ApiResponse>({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// ============================================================
// ROUTES ADMIN
// ============================================================

// GET /newsletter/admin/subscribers - Liste des abonnés
newsletter.get('/admin/subscribers', requireAdmin, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT id, email, first_name, consent, is_active, created_at
      FROM newsletter_subscribers
      ORDER BY created_at DESC
    `).all<NewsletterSubscriber>();

    return c.json<ApiResponse>({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// PATCH /newsletter/admin/subscribers/:id - Modifier un abonné
newsletter.patch('/admin/subscribers/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json<{ is_active?: boolean }>();
    const authContext = getAuthContext(c);

    if (typeof body.is_active === 'boolean') {
      await c.env.DB.prepare(`
        UPDATE newsletter_subscribers SET is_active = ? WHERE id = ?
      `).bind(body.is_active ? 1 : 0, id).run();

      await logAudit(c.env.DB, authContext?.user.id || null, 'SUBSCRIBER_STATUS_CHANGED', 'subscriber', id, c.req.raw, { is_active: body.is_active });
    }

    return c.json<ApiResponse>({
      success: true,
      message: 'Subscriber updated'
    });
  } catch (error) {
    console.error('Update subscriber error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// DELETE /newsletter/admin/subscribers/:id - Supprimer un abonné
newsletter.delete('/admin/subscribers/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);

    await c.env.DB.prepare('DELETE FROM newsletter_subscribers WHERE id = ?')
      .bind(id).run();

    await logAudit(c.env.DB, authContext?.user.id || null, 'SUBSCRIBER_DELETED', 'subscriber', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Subscriber deleted'
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// GET /newsletter/admin/newsletters - Liste des newsletters
newsletter.get('/admin/newsletters', requireAdmin, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM newsletters ORDER BY created_at DESC
    `).all<Newsletter>();

    return c.json<ApiResponse>({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error('Get newsletters error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// POST /newsletter/admin/newsletters - Créer une newsletter
newsletter.post('/admin/newsletters', requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{ title: string; subject: string; content: string }>();
    const authContext = getAuthContext(c);

    // Validation
    const titleValidation = validateInputLength(body.title, 'Title', 1, 200);
    if (!titleValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: titleValidation.error }, 400);
    }

    const subjectValidation = validateInputLength(body.subject, 'Subject', 1, 200);
    if (!subjectValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: subjectValidation.error }, 400);
    }

    const contentValidation = validateInputLength(body.content, 'Content', 1, 50000);
    if (!contentValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: contentValidation.error }, 400);
    }

    const id = generateId();
    await c.env.DB.prepare(`
      INSERT INTO newsletters (id, title, subject, content, status)
      VALUES (?, ?, ?, ?, 'draft')
    `).bind(id, sanitizeString(body.title, 200), sanitizeString(body.subject, 200), body.content).run();

    await logAudit(c.env.DB, authContext?.user.id || null, 'NEWSLETTER_CREATED', 'newsletter', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      data: { id },
      message: 'Newsletter created'
    }, 201);
  } catch (error) {
    console.error('Create newsletter error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

// POST /newsletter/admin/send - Envoyer une newsletter
newsletter.post('/admin/send', requireAdmin, async (c) => {
  try {
    const body = await c.req.json<SendNewsletterRequest & { title: string; preview_text?: string }>();
    const authContext = getAuthContext(c);

    // Validation du titre
    const titleValidation = validateInputLength(body.title, 'Title', 1, 200);
    if (!titleValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: titleValidation.error }, 400);
    }

    // Validation du sujet
    const subjectValidation = validateInputLength(body.subject, 'Subject', 1, 200);
    if (!subjectValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: subjectValidation.error }, 400);
    }

    // Validation du contenu
    const contentValidation = validateInputLength(body.content, 'Content', 1, 50000);
    if (!contentValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: contentValidation.error }, 400);
    }

    // Récupérer les abonnés actifs
    const subscribers = await c.env.DB.prepare(`
      SELECT id, email, first_name 
      FROM newsletter_subscribers 
      WHERE is_active = 1 AND consent = 1
    `).all<{ id: string; email: string; first_name: string | null }>();

    if (!subscribers.results || subscribers.results.length === 0) {
      return c.json<ApiResponse>({
        success: false,
        error: 'No active subscribers'
      }, 400);
    }

    // Préparer les contenus sécurisés
    const safeSubject = escapeHtml(body.subject);
    const safeTitle = escapeHtml(body.title);
    const previewText = body.preview_text ? sanitizeString(body.preview_text, 500) : body.content.substring(0, 100);

    // Envoyer les emails
    const results: { email: string; success: boolean; error?: string }[] = [];
    const senderId = authContext?.user?.id || 'system';

    for (const subscriber of subscribers.results) {
      try {
        // Générer l'URL de désinscription pour ce subscriber
        const unsubscribeUrl = generateUnsubscribeUrl(subscriber.email, 'https://lespetitstrinquat.fr');

        // Rendre l'email HTML avec le template
        // En dev, utiliser le logo de production comme fallback (accessible publiquement)
        const logoUrl = c.env.ENVIRONMENT === 'development'
          ? 'https://lespetitstrinquat.fr/logoAsso.png'
          : `${c.env.SITE_URL}/logoAsso.png`;

        const emailHtml = renderNewsletterEmail({
          firstName: subscriber.first_name || 'Cher parent',
          title: safeTitle,
          previewText: previewText,
          content: body.content,
          unsubscribeUrl: unsubscribeUrl,
          siteUrl: c.env.SITE_URL,
          logoUrl: logoUrl
        });

        // Envoyer via Resend
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: c.env.NEWSLETTER_FROM_EMAIL,
            to: subscriber.email,
            subject: safeSubject,
            html: emailHtml,
          }),
        });

        const sendSuccess = response.ok;
        results.push({
          email: subscriber.email,
          success: sendSuccess,
          error: sendSuccess ? undefined : `HTTP ${response.status}`
        });

        // Log l'événement d'envoi
        if (sendSuccess) {
          try {
            await c.env.DB.prepare(`
              INSERT INTO newsletter_email_events (newsletter_id, subscriber_id, event_type)
              VALUES (?, ?, 'sent')
            `).bind('pending-id', subscriber.id).run();
          } catch (e) {
            // Silently fail event logging - doesn't block sending
            console.error('Failed to log email event:', e);
          }
        }
      } catch (error) {
        console.error('Error sending to', subscriber.email, error);
        results.push({
          email: subscriber.email,
          success: false,
          error: error instanceof Error ? error.message : 'Send failed'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const newsletterId = generateId();

    // Sauvegarder la newsletter avec le template HTML
    await c.env.DB.prepare(`
      INSERT INTO newsletters 
      (id, title, subject, content, preview_text, status, sent_at, recipients_count, sent_by, created_by)
      VALUES (?, ?, ?, ?, ?, 'sent', ?, ?, ?, ?)
    `).bind(
      newsletterId,
      safeTitle,
      safeSubject,
      body.content,
      previewText,
      new Date().toISOString(),
      successCount,
      senderId,
      senderId
    ).run();

    await logAudit(c.env.DB, authContext?.user.id || null, 'NEWSLETTER_SENT', 'newsletter', newsletterId, c.req.raw, {
      total: results.length,
      success: successCount,
      failed: results.length - successCount
    });

    return c.json<ApiResponse>({
      success: true,
      data: {
        id: newsletterId,
        sent: successCount,
        total: results.length,
        failed: results.filter(r => !r.success)
      },
      message: `Newsletter sent to ${successCount}/${results.length} subscribers`
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred while sending newsletter'
    }, 500);
  }
});

// POST /newsletter/admin/test-email - Envoyer un email test
newsletter.post('/admin/test-email', requireAdmin, async (c) => {
  try {
    const body = await c.req.json<{
      title: string;
      subject: string;
      content: string;
      preview_text?: string;
      recipient_email?: string;
    }>();
    const authContext = getAuthContext(c);

    // Validation du titre
    const titleValidation = validateInputLength(body.title, 'Title', 1, 200);
    if (!titleValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: titleValidation.error }, 400);
    }

    // Validation du sujet
    const subjectValidation = validateInputLength(body.subject, 'Subject', 1, 200);
    if (!subjectValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: subjectValidation.error }, 400);
    }

    // Validation du contenu
    const contentValidation = validateInputLength(body.content, 'Content', 1, 50000);
    if (!contentValidation.valid) {
      return c.json<ApiResponse>({ success: false, error: contentValidation.error }, 400);
    }

    // Récupérer l'email du destinataire test
    // Si pas fourni, envoyer à l'admin qui fait la demande
    let testEmail = body.recipient_email;
    if (!testEmail && authContext?.user?.email) {
      testEmail = authContext.user.email;
    }

    if (!testEmail || !isValidEmail(testEmail)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'No valid test email address provided'
      }, 400);
    }

    // Préparer les contenus sécurisés
    const safeSubject = escapeHtml(body.subject);
    const safeTitle = escapeHtml(body.title);
    const previewText = body.preview_text ? sanitizeString(body.preview_text, 500) : body.content.substring(0, 100);

    // Générer l'URL de désinscription
    const unsubscribeUrl = generateUnsubscribeUrl(testEmail, 'https://lespetitstrinquat.fr');

    // Rendre l'email HTML avec le template
    // En dev, utiliser le logo de production comme fallback (accessible publiquement)
    const logoUrl = c.env.ENVIRONMENT === 'development'
      ? 'https://lespetitstrinquat.fr/logoAsso.png'
      : `${c.env.SITE_URL}/logoAsso.png`;

    const emailHtml = renderNewsletterEmail({
      firstName: 'Test Admin',
      title: safeTitle,
      previewText: previewText,
      content: body.content,
      unsubscribeUrl: unsubscribeUrl,
      siteUrl: c.env.SITE_URL,
      logoUrl: logoUrl
    });

    // Envoyer via Resend avec mention que c'est un test
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: c.env.NEWSLETTER_FROM_EMAIL,
        to: testEmail,
        subject: `[TEST] ${safeSubject}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      return c.json<ApiResponse>({
        success: false,
        error: `Failed to send test email: HTTP ${response.status}`
      }, 500);
    }

    await logAudit(c.env.DB, authContext?.user.id || null, 'NEWSLETTER_TEST_SENT', 'newsletter', null, c.req.raw, {
      recipient: testEmail
    });

    return c.json<ApiResponse>({
      success: true,
      message: `Test email sent to ${testEmail}`,
      data: { testEmail, subject: `[TEST] ${safeSubject}` }
    });
  } catch (error) {
    console.error('Test email error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred while sending test email'
    }, 500);
  }
});

// DELETE /newsletter/admin/newsletters/:id - Supprimer une newsletter
newsletter.delete('/admin/newsletters/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);

    // Vérifier que la newsletter existe
    const newsletter = await c.env.DB.prepare(
      'SELECT id FROM newsletters WHERE id = ?'
    ).bind(id).first<{ id: string }>();

    if (!newsletter) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Newsletter not found'
      }, 404);
    }

    // Supprimer la newsletter
    await c.env.DB.prepare('DELETE FROM newsletters WHERE id = ?')
      .bind(id).run();

    await logAudit(c.env.DB, authContext?.user.id || null, 'NEWSLETTER_DELETED', 'newsletter', id, c.req.raw);

    return c.json<ApiResponse>({
      success: true,
      message: 'Newsletter deleted'
    });
  } catch (error) {
    console.error('Delete newsletter error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'An error occurred while deleting newsletter'
    }, 500);
  }
});

export default newsletter;
