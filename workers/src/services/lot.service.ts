import { Lot, Env } from '../types/models';
import { ParentService } from './parent.service';

export class LotService {
  static async createLot(
    env: Env,
    data: { parent_id: string; title: string; description?: string }
  ): Promise<Lot> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Verify parent exists
    const parent = await ParentService.getParent(env, data.parent_id);
    if (!parent) {
      throw new Error('Parent not found');
    }

    const result = await env.DB.prepare(
      `INSERT INTO lots (id, parent_id, title, description, status, created_at)
       VALUES (?, ?, ?, ?, 'available', ?)`
    )
      .bind(id, data.parent_id, data.title, data.description || null, now)
      .run();

    if (!result.success) {
      throw new Error('Failed to create lot');
    }

    return {
      id,
      parent_id: data.parent_id,
      title: data.title,
      description: data.description,
      status: 'available',
      created_at: now,
    };
  }

  static async getLot(env: Env, id: string): Promise<Lot | null> {
    const result = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(id).first();
    return (result as Lot | null) || null;
  }

  static async getAllLots(env: Env): Promise<Lot[]> {
    const response = await env.DB.prepare(
      `SELECT id, parent_id, title, description, status, reserved_by, created_at 
       FROM lots ORDER BY created_at DESC`
    ).all();

    return (response.results as unknown as Lot[]) || [];
  }

  static async getLotsByParent(env: Env, parentId: string): Promise<Lot[]> {
    const response = await env.DB.prepare(
      `SELECT id, parent_id, title, description, status, reserved_by, created_at 
       FROM lots WHERE parent_id = ? ORDER BY created_at DESC`
    )
      .bind(parentId)
      .all();

    return (response.results as unknown as Lot[]) || [];
  }

  static async deleteLot(env: Env, id: string, parentId: string): Promise<boolean> {
    // Verify ownership
    const lot = await this.getLot(env, id);
    if (!lot || lot.parent_id !== parentId) {
      throw new Error('Not authorized to delete this lot');
    }

    const result = await env.DB.prepare('DELETE FROM lots WHERE id = ?').bind(id).run();
    return result.success;
  }

  static async reserveLot(env: Env, lotId: string, requesterId: string): Promise<Lot | null> {
    const lot = await this.getLot(env, lotId);
    if (!lot) {
      throw new Error('Lot not found');
    }

    if (lot.status !== 'available') {
      throw new Error('Lot is not available for reservation');
    }

    if (lot.parent_id === requesterId) {
      throw new Error('Cannot reserve your own lot');
    }

    const result = await env.DB.prepare(
      `UPDATE lots SET status = 'reserved', reserved_by = ? WHERE id = ?`
    )
      .bind(requesterId, lotId)
      .run();

    if (!result.success) {
      throw new Error('Failed to reserve lot');
    }

    // Log the reservation
    const reservationId = crypto.randomUUID();
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO reservations (id, lot_id, requester_id, created_at) VALUES (?, ?, ?, ?)`
    )
      .bind(reservationId, lotId, requesterId, now)
      .run();

    return { ...lot, status: 'reserved', reserved_by: requesterId };
  }

  static async updateLotStatus(
    env: Env,
    id: string,
    status: 'available' | 'reserved' | 'delivered'
  ): Promise<Lot | null> {
    const result = await env.DB.prepare('UPDATE lots SET status = ? WHERE id = ?').bind(status, id).run();

    return result.success ? this.getLot(env, id) : null;
  }
}
