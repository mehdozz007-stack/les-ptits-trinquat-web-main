import { Env, ApiResponse, Lot } from '../types/models';
import { LotService } from '../services/lot.service';
import { AuthService } from '../services/auth.service';

export async function handleLotsRequest(
  request: Request,
  env: Env,
  pathSegments: string[]
): Promise<Response> {
  const lotId = pathSegments[2];
  const action = pathSegments[3];

  // GET /api/lots - List all lots (public)
  if (request.method === 'GET' && !lotId) {
    try {
      const lots = await LotService.getAllLots(env);
      return jsonResponse({ success: true, data: lots });
    } catch (error) {
      console.error('Error fetching lots:', error);
      return jsonError('Failed to fetch lots', 500);
    }
  }

  // POST /api/lots - Create new lot
  if (request.method === 'POST' && !lotId) {
    try {
      const auth = await AuthService.extractAuthContext(request);
      
      if (!auth.parentId || !auth.email) {
        return jsonError('Unauthorized', 401);
      }

      // Verify identity
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified) {
        return jsonError('Forbidden', 403);
      }

      const body = await request.json() as {
        title: string;
        description?: string;
      };

      if (!body.title) {
        return jsonError('Missing required fields', 400);
      }

      const lot = await LotService.createLot(env, {
        parent_id: auth.parentId,
        title: body.title,
        description: body.description,
      });

      return jsonResponse({ success: true, data: lot }, 201);
    } catch (error) {
      console.error('Error creating lot:', error);
      const message = error instanceof Error ? error.message : 'Failed to create lot';
      return jsonError(message, 500);
    }
  }

  // DELETE /api/lots/:id - Delete lot (only owner can delete)
  if (request.method === 'DELETE' && lotId && !action) {
    try {
      const auth = await AuthService.extractAuthContext(request);
      
      if (!auth.parentId || !auth.email) {
        return jsonError('Unauthorized', 401);
      }

      // Verify identity
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified) {
        return jsonError('Forbidden', 403);
      }

      // Check ownership
      const canDelete = await AuthService.canDeleteLot(env, auth.parentId, lotId);
      if (!canDelete) {
        return jsonError('Not authorized to delete this lot', 403);
      }

      const success = await LotService.deleteLot(env, lotId, auth.parentId);
      if (!success) {
        return jsonError('Lot not found', 404);
      }

      return jsonResponse({ success: true, data: { message: 'Lot deleted' } });
    } catch (error) {
      console.error('Error deleting lot:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete lot';
      return jsonError(message, 500);
    }
  }

  // POST /api/lots/:id/reserve - Reserve a lot
  if (request.method === 'POST' && lotId && action === 'reserve') {
    try {
      const auth = await AuthService.extractAuthContext(request);
      
      if (!auth.parentId || !auth.email) {
        return jsonError('Unauthorized', 401);
      }

      // Verify identity
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified) {
        return jsonError('Forbidden', 403);
      }

      const lot = await LotService.reserveLot(env, lotId, auth.parentId);
      if (!lot) {
        return jsonError('Failed to reserve lot', 500);
      }

      return jsonResponse({ success: true, data: lot });
    } catch (error) {
      console.error('Error reserving lot:', error);
      const message = error instanceof Error ? error.message : 'Failed to reserve lot';
      return jsonError(message, 400);
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
