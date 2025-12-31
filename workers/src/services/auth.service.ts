import { Env, AuthContext } from '../types/models';
import { ParentService } from './parent.service';

export class AuthService {
  /**
   * Extract auth context from request (localStorage token format)
   * Token format: { parentId: string, email: string }
   */
  static async extractAuthContext(request: Request): Promise<AuthContext> {
    try {
      const authHeader = request.headers.get('X-Parent-Auth');
      if (!authHeader) {
        return {};
      }

      const auth = JSON.parse(atob(authHeader));
      return {
        parentId: auth.parentId,
        email: auth.email,
      };
    } catch (error) {
      console.error('Failed to extract auth context:', error);
      return {};
    }
  }

  /**
   * Verify parent identity and existence
   */
  static async verifyParentIdentity(
    env: Env,
    parentId?: string,
    email?: string
  ): Promise<boolean> {
    if (!parentId || !email) {
      return false;
    }

    const parent = await ParentService.getParent(env, parentId);
    if (!parent) {
      return false;
    }

    return parent.email === email;
  }

  /**
   * Check if requester can modify a resource
   */
  static async canModifyParent(env: Env, parentId: string, targetParentId: string): Promise<boolean> {
    // Can only modify own profile
    return parentId === targetParentId;
  }

  /**
   * Check if requester can delete a lot (must be owner)
   */
  static async canDeleteLot(
    env: Env,
    requesterId: string,
    lotId: string
  ): Promise<boolean> {
    const lot = await (await import('./lot.service')).LotService.getLot(env, lotId);
    if (!lot) return false;

    return lot.parent_id === requesterId;
  }
}
