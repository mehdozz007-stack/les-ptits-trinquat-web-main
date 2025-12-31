import { Env, ApiResponse, Parent } from '../types/models';
import { ParentService } from '../services/parent.service';
import { AuthService } from '../services/auth.service';
import { LotService } from '../services/lot.service';

export async function handleParentsRequest(
  request: Request,
  env: Env,
  params: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const parentId = pathSegments[2];

  // GET /api/parents - List all parents (public, no email exposed)
  if (request.method === 'GET' && !parentId) {
    try {
      const parents = await ParentService.getAllParents(env);
      // Remove email from response for privacy
      const sanitized = parents.map(p => ({
        id: p.id,
        first_name: p.first_name,
        emoji: p.emoji,
        classes: p.classes,
        created_at: p.created_at,
      }));

      return jsonResponse({ success: true, data: sanitized });
    } catch (error) {
      return jsonError('Failed to fetch parents', 500);
    }
  }

  // POST /api/parents - Create new parent
  if (request.method === 'POST' && !parentId) {
    try {
      const body = await request.json() as {
        first_name: string;
        email: string;
        emoji: string;
        classes?: string;
      };

      // Validate input
      if (!body.first_name || !body.email || !body.emoji) {
        return jsonError('Missing required fields', 400);
      }

      // Check email uniqueness
      const exists = await ParentService.checkEmailExists(env, body.email);
      if (exists) {
        return jsonError('Email already registered', 409);
      }

      const parent = await ParentService.createParent(env, body);
      
      // Return without email
      const response = {
        id: parent.id,
        first_name: parent.first_name,
        emoji: parent.emoji,
        classes: parent.classes,
        created_at: parent.created_at,
      };

      return jsonResponse({ success: true, data: response }, 201);
    } catch (error) {
      console.error('Error creating parent:', error);
      return jsonError('Failed to create parent', 500);
    }
  }

  // DELETE /api/parents/:id - Delete parent (and cascade delete lots)
  if (request.method === 'DELETE' && parentId) {
    try {
      const auth = await AuthService.extractAuthContext(request);
      
      if (!auth.parentId || !auth.email) {
        return jsonError('Unauthorized', 401);
      }

      // Verify identity
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified || !await AuthService.canModifyParent(env, auth.parentId, parentId)) {
        return jsonError('Forbidden', 403);
      }

      const success = await ParentService.deleteParent(env, parentId);
      if (!success) {
        return jsonError('Parent not found', 404);
      }

      return jsonResponse({ success: true, data: { message: 'Parent deleted' } });
    } catch (error) {
      console.error('Error deleting parent:', error);
      return jsonError('Failed to delete parent', 500);
    }
  }

  return jsonError('Not found', 404);
}

function jsonResponse<T>(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(message: string, status = 400): Response {
  return jsonResponse({ success: false, error: message }, status);
}
