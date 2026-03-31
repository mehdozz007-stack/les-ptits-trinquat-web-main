// ============================================================
// Routes API - Gestion des Actualités (News)
// ============================================================

import { Hono } from 'hono';
import type { Env } from '../types';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: 'evenement' | 'annonce' | 'presse' | 'information' | 'document';
  image_url?: string;
  created_at: string;
  updated_at: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  is_published: number;
  is_archived: number;
  created_by?: string;
}

interface CreateNewsRequest {
  title: string;
  content: string;
  type: 'evenement' | 'annonce' | 'presse' | 'information' | 'document';
  image_url?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  is_published?: boolean;
}

const news = new Hono<{ Bindings: Env }>();

// ============================================================
// GET /api/news - Récupérer toutes les actualités
// ============================================================

news.get('/', async (c) => {
  try {
    const query = `
      SELECT 
        id, title, content, type, image_url,
        created_at, updated_at, event_date, event_time, event_location,
        is_published, is_archived
      FROM news
      WHERE is_archived = 0 AND is_published = 1
      ORDER BY 
        CASE
          WHEN type = 'evenement' THEN 1
          ELSE 0
        END,
        CASE
          WHEN type = 'evenement' AND event_date IS NOT NULL THEN event_date
          ELSE created_at
        END DESC
    `;

    const result = await c.env.DB.prepare(query).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================
// GET /api/news/all - Récupérer toutes les actualités (admin uniquement)
// ============================================================

news.get('/all', async (c) => {
  try {
    const query = `
      SELECT 
        id, title, content, type, image_url,
        created_at, updated_at, event_date, event_time, event_location,
        is_published, is_archived, created_by
      FROM news
      ORDER BY created_at DESC
    `;

    const result = await c.env.DB.prepare(query).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error: any) {
    console.error('Error fetching all news:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================
// GET /api/news/:id - Récupérer une actualité spécifique
// ============================================================

news.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!id) {
      return c.json({
        success: false,
        error: 'ID is required'
      }, 400);
    }

    const result = await c.env.DB.prepare(
      `SELECT * FROM news WHERE id = ?`
    ).bind(id).first();

    if (!result) {
      return c.json({
        success: false,
        error: 'News item not found'
      }, 404);
    }

    return c.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error fetching news item:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================
// POST /api/news - Créer une nouvelle actualité
// ============================================================

news.post('/', async (c) => {
  try {
    const body = await c.req.json() as CreateNewsRequest;

    // Validation
    if (!body.title || !body.content || !body.type) {
      return c.json({
        success: false,
        error: 'title, content, and type are required'
      }, 400);
    }

    if (!['evenement', 'annonce', 'presse', 'information', 'document'].includes(body.type)) {
      return c.json({
        success: false,
        error: 'Invalid type'
      }, 400);
    }

    const id = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const query = `
      INSERT INTO news (
        id, title, content, type, image_url,
        event_date, event_time, event_location,
        is_published, is_archived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await c.env.DB.prepare(query).bind(
      id,
      body.title,
      body.content,
      body.type,
      body.image_url || null,
      body.event_date || null,
      body.event_time || null,
      body.event_location || null,
      body.is_published !== false ? 1 : 0,
      0
    ).run();

    return c.json({
      success: true,
      message: 'News item created successfully',
      data: { id }
    }, 201);
  } catch (error: any) {
    console.error('Error creating news:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================
// PUT /api/news/:id - Modifier une actualité
// ============================================================

news.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json() as Partial<CreateNewsRequest>;

    if (!id) {
      return c.json({
        success: false,
        error: 'ID is required'
      }, 400);
    }

    // Vérifier que l'actualité existe
    const existing = await c.env.DB.prepare(
      `SELECT id FROM news WHERE id = ?`
    ).bind(id).first();

    if (!existing) {
      return c.json({
        success: false,
        error: 'News item not found'
      }, 404);
    }

    const updates: string[] = ['updated_at = strftime(\'%Y-%m-%dT%H:%M:%SZ\', \'now\')'];
    const values: any[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      values.push(body.title);
    }

    if (body.content !== undefined) {
      updates.push('content = ?');
      values.push(body.content);
    }

    if (body.type !== undefined) {
      updates.push('type = ?');
      values.push(body.type);
    }

    if (body.image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(body.image_url || null);
    }

    if (body.event_date !== undefined) {
      updates.push('event_date = ?');
      values.push(body.event_date || null);
    }

    if (body.event_time !== undefined) {
      updates.push('event_time = ?');
      values.push(body.event_time || null);
    }

    if (body.event_location !== undefined) {
      updates.push('event_location = ?');
      values.push(body.event_location || null);
    }

    values.push(id);

    const query = `UPDATE news SET ${updates.join(', ')} WHERE id = ?`;
    await c.env.DB.prepare(query).bind(...values).run();

    return c.json({
      success: true,
      message: 'News item updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating news:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================
// DELETE /api/news/:id - Supprimer une actualité
// ============================================================

news.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    if (!id) {
      return c.json({
        success: false,
        error: 'ID is required'
      }, 400);
    }

    const result = await c.env.DB.prepare(
      `DELETE FROM news WHERE id = ?`
    ).bind(id).run();

    if (!result.success) {
      return c.json({
        success: false,
        error: 'Failed to delete news item'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'News item deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting news:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================
// PATCH /api/news/:id/archive - Archiver/désarchiver
// ============================================================

news.patch('/:id/archive', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json() as { is_archived: boolean };

    if (!id) {
      return c.json({
        success: false,
        error: 'ID is required'
      }, 400);
    }

    await c.env.DB.prepare(
      `UPDATE news SET is_archived = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?`
    ).bind(body.is_archived ? 1 : 0, id).run();

    return c.json({
      success: true,
      message: body.is_archived ? 'News item archived' : 'News item unarchived'
    });
  } catch (error: any) {
    console.error('Error archiving news:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ============================================================
// PATCH /api/news/:id/publish - Publier/dépublier
// ============================================================

news.patch('/:id/publish', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json() as { is_published: boolean };

    if (!id) {
      return c.json({
        success: false,
        error: 'ID is required'
      }, 400);
    }

    await c.env.DB.prepare(
      `UPDATE news SET is_published = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?`
    ).bind(body.is_published ? 1 : 0, id).run();

    return c.json({
      success: true,
      message: body.is_published ? 'News item published' : 'News item unpublished'
    });
  } catch (error: any) {
    console.error('Error publishing news:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

export default news;
