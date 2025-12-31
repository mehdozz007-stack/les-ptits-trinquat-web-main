import { Env } from './types/models';
import { handleParentsRequest } from './routes/parents';
import { handleLotsRequest } from './routes/lots';

/**
 * Cloudflare Worker - Tombola API
 * Entry point for all API requests
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Enable CORS for local development
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Parent-Auth',
        },
      });
    }

    // Add CORS headers to all responses
    const addCorsHeaders = (response: Response) => {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Parent-Auth');
      return response;
    };

    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);

      // Route: /api/parents
      if (pathSegments[1] === 'parents') {
        const response = await handleParentsRequest(request, env, pathSegments);
        return addCorsHeaders(response);
      }

      // Route: /api/lots
      if (pathSegments[1] === 'lots') {
        const response = await handleLotsRequest(request, env, pathSegments);
        return addCorsHeaders(response);
      }

      // Health check endpoint
      if (pathSegments[1] === 'health') {
        return addCorsHeaders(new Response(JSON.stringify({ status: 'ok' }), {
          headers: { 'Content-Type': 'application/json' },
        }));
      }

      // 404
      return addCorsHeaders(new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }));
    } catch (error) {
      console.error('Unhandled error:', error);
      return addCorsHeaders(new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }));
    }
  },

  /**
   * Scheduled event to run migrations (optional)
   */
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    console.log('Scheduled event triggered');
    // Can be used for cleanup, maintenance, etc.
  },
};
