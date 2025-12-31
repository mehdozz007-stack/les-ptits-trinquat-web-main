// REST API for Tombola with persistent file storage

import * as fs from "fs";
import * as path from "path";

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

interface StoredData {
  parents: Parent[];
  lots: Lot[];
}

// File-based storage for development
const DATA_FILE = path.join(process.cwd(), ".data", "tombola.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadData(): StoredData {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
  return { parents: [], lots: [] };
}

function saveData(data: StoredData) {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

let cachedData = loadData();

export async function onRequestGet(context: any) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // GET /api/data - Returns all data
  if (pathname === "/api/data") {
    const data = loadData();
    return new Response(
      JSON.stringify(data),
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
    const data = loadData();

    // POST /api/parents - Create parent
    if (pathname === "/api/parents") {
      const parent: Parent = {
        id: Math.random().toString(36).substr(2, 9),
        ...body,
      };
      data.parents.push(parent);
      saveData(data);
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
      data.lots.push(lot);
      saveData(data);
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
    const data = loadData();

    // PUT /api/parents/:id - Update parent
    const parentMatch = pathname.match(/\/api\/parents\/(.+)$/);
    if (parentMatch) {
      const id = parentMatch[1];
      const index = data.parents.findIndex((p) => p.id === id);
      if (index !== -1) {
        data.parents[index] = { ...data.parents[index], ...body };
        saveData(data);
        return new Response(JSON.stringify(data.parents[index]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // PUT /api/lots/:id - Update lot
    const lotMatch = pathname.match(/\/api\/lots\/(.+)$/);
    if (lotMatch) {
      const id = lotMatch[1];
      const index = data.lots.findIndex((l) => l.id === id);
      if (index !== -1) {
        data.lots[index] = { ...data.lots[index], ...body };
        saveData(data);
        return new Response(JSON.stringify(data.lots[index]), {
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

  const data = loadData();

  // DELETE /api/parents/:id - Delete parent
  const parentMatch = pathname.match(/\/api\/parents\/(.+)$/);
  if (parentMatch) {
    const id = parentMatch[1];
    const index = data.parents.findIndex((p) => p.id === id);
    if (index !== -1) {
      data.parents.splice(index, 1);
      // Also delete related lots
      data.lots = data.lots.filter((l) => l.parentId !== id);
      saveData(data);
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
    const index = data.lots.findIndex((l) => l.id === id);
    if (index !== -1) {
      data.lots.splice(index, 1);
      saveData(data);
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
