import { Parent, Env, ApiResponse } from '../types/models';

export class ParentService {
  static async createParent(
    env: Env,
    data: { first_name: string; email: string; emoji: string; classes?: string }
  ): Promise<Parent> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await env.DB.prepare(
      `INSERT INTO parents (id, first_name, email, emoji, classes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(id, data.first_name, data.email, data.emoji, data.classes || null, now)
      .run();

    if (!result.success) {
      throw new Error('Failed to create parent');
    }

    return {
      id,
      first_name: data.first_name,
      email: data.email,
      emoji: data.emoji,
      classes: data.classes,
      created_at: now,
    };
  }

  static async getParent(env: Env, id: string): Promise<Parent | null> {
    const result = await env.DB.prepare('SELECT * FROM parents WHERE id = ?').bind(id).first();
    return (result as Parent | null) || null;
  }

  static async getParentByEmail(env: Env, email: string): Promise<Parent | null> {
    const result = await env.DB.prepare('SELECT * FROM parents WHERE email = ?').bind(email).first();
    return (result as Parent | null) || null;
  }

  static async getAllParents(env: Env): Promise<Parent[]> {
    const response = await env.DB.prepare(
      'SELECT id, first_name, email, emoji, classes, created_at FROM parents ORDER BY created_at DESC'
    ).all();

    return (response.results as unknown as Parent[]) || [];
  }

  static async deleteParent(env: Env, id: string): Promise<boolean> {
    const result = await env.DB.prepare('DELETE FROM parents WHERE id = ?').bind(id).run();
    return result.success;
  }

  static async updateParent(
    env: Env,
    id: string,
    data: Partial<Parent>
  ): Promise<Parent | null> {
    const parent = await this.getParent(env, id);
    if (!parent) return null;

    const updated = { ...parent, ...data, id, created_at: parent.created_at };
    
    const result = await env.DB.prepare(
      `UPDATE parents SET first_name = ?, email = ?, emoji = ?, classes = ? WHERE id = ?`
    )
      .bind(updated.first_name, updated.email, updated.emoji, updated.classes || null, id)
      .run();

    return result.success ? updated : null;
  }

  static async checkEmailExists(env: Env, email: string, excludeId?: string): Promise<boolean> {
    const query = excludeId
      ? 'SELECT COUNT(*) as count FROM parents WHERE email = ? AND id != ?'
      : 'SELECT COUNT(*) as count FROM parents WHERE email = ?';

    const bindings = excludeId ? [email, excludeId] : [email];
    const result = await env.DB.prepare(query).bind(...bindings).first();

    return (result as { count: number }).count > 0;
  }
}
