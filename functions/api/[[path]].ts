// Simple REST API for Tombola (works on edge runtime)

// Types (copied from src/lib/types.ts for edge function compatibility)
interface Parent {
  id: string;
  prenom: string;
  role: string;
  classes: string;
  emoji: string;
  email: string;
  createdAt?: string;
}

interface Lot {
  id: string;
  nom: string;
  description: string;
  emoji: string;
  statut: "disponible" | "reserve" | "remis";
  parentId: string;
  parentPrenom: string;
  parentEmail: string;
  dateAjout: string;
}

// Simple in-memory storage for edge runtime (will be replaced with actual DB in production)
let parents: Parent[] = [];
let lots: Lot[] = [];

export async function onRequestGet(context: any) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // GET /api/data - Returns all data
  if (pathname === "/api/data") {
    return new Response(
      JSON.stringify({
        parents,
        lots,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context: any) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  try {
    const body = await context.request.json();

    // POST /api/parents - Create parent
    if (pathname === "/api/parents") {
      const parent: Parent = {
        id: Math.random().toString(36).substr(2, 9),
        ...body,
      };
      parents.push(parent);
      return new Response(JSON.stringify(parent), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST /api/lots - Create lot
    if (pathname === "/api/lots") {
      const lot: Lot = {
        id: Math.random().toString(36).substr(2, 9),
        ...body,
      };
      lots.push(lot);
      return new Response(JSON.stringify(lot), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPut(context: any) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  try {
    const body = await context.request.json();

    // PUT /api/parents/:id - Update parent
    const parentMatch = pathname.match(/\/api\/parents\/(.+)$/);
    if (parentMatch) {
      const id = parentMatch[1];
      const index = parents.findIndex((p) => p.id === id);
      if (index !== -1) {
        parents[index] = { ...parents[index], ...body };
        return new Response(JSON.stringify(parents[index]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // PUT /api/lots/:id - Update lot
    const lotMatch = pathname.match(/\/api\/lots\/(.+)$/);
    if (lotMatch) {
      const id = lotMatch[1];
      const index = lots.findIndex((l) => l.id === id);
      if (index !== -1) {
        lots[index] = { ...lots[index], ...body };
        return new Response(JSON.stringify(lots[index]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestDelete(context: any) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // DELETE /api/parents/:id - Delete parent
  const parentMatch = pathname.match(/\/api\/parents\/(.+)$/);
  if (parentMatch) {
    const id = parentMatch[1];
    const index = parents.findIndex((p) => p.id === id);
    if (index !== -1) {
      parents.splice(index, 1);
      // Also delete related lots
      lots = lots.filter((l) => l.parentId !== id);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // DELETE /api/lots/:id - Delete lot
  const lotMatch = pathname.match(/\/api\/lots\/(.+)$/);
  if (lotMatch) {
    const id = lotMatch[1];
    const index = lots.findIndex((l) => l.id === id);
    if (index !== -1) {
      lots.splice(index, 1);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
