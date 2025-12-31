var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/services/parent.service.ts
var ParentService;
var init_parent_service = __esm({
  "src/services/parent.service.ts"() {
    "use strict";
    ParentService = class {
      static {
        __name(this, "ParentService");
      }
      static async createParent(env, data) {
        const id = crypto.randomUUID();
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const result = await env.DB.prepare(
          `INSERT INTO parents (id, first_name, email, emoji, classes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(id, data.first_name, data.email, data.emoji, data.classes || null, now).run();
        if (!result.success) {
          throw new Error("Failed to create parent");
        }
        return {
          id,
          first_name: data.first_name,
          email: data.email,
          emoji: data.emoji,
          classes: data.classes,
          created_at: now
        };
      }
      static async getParent(env, id) {
        const result = await env.DB.prepare("SELECT * FROM parents WHERE id = ?").bind(id).first();
        return result || null;
      }
      static async getParentByEmail(env, email) {
        const result = await env.DB.prepare("SELECT * FROM parents WHERE email = ?").bind(email).first();
        return result || null;
      }
      static async getAllParents(env) {
        const response = await env.DB.prepare(
          "SELECT id, first_name, email, emoji, classes, created_at FROM parents ORDER BY created_at DESC"
        ).all();
        return response.results || [];
      }
      static async deleteParent(env, id) {
        const result = await env.DB.prepare("DELETE FROM parents WHERE id = ?").bind(id).run();
        return result.success;
      }
      static async updateParent(env, id, data) {
        const parent = await this.getParent(env, id);
        if (!parent) return null;
        const updated = { ...parent, ...data, id, created_at: parent.created_at };
        const result = await env.DB.prepare(
          `UPDATE parents SET first_name = ?, email = ?, emoji = ?, classes = ? WHERE id = ?`
        ).bind(updated.first_name, updated.email, updated.emoji, updated.classes || null, id).run();
        return result.success ? updated : null;
      }
      static async checkEmailExists(env, email, excludeId) {
        const query = excludeId ? "SELECT COUNT(*) as count FROM parents WHERE email = ? AND id != ?" : "SELECT COUNT(*) as count FROM parents WHERE email = ?";
        const bindings = excludeId ? [email, excludeId] : [email];
        const result = await env.DB.prepare(query).bind(...bindings).first();
        return result.count > 0;
      }
    };
  }
});

// src/services/lot.service.ts
var lot_service_exports = {};
__export(lot_service_exports, {
  LotService: () => LotService
});
var LotService;
var init_lot_service = __esm({
  "src/services/lot.service.ts"() {
    "use strict";
    init_parent_service();
    LotService = class {
      static {
        __name(this, "LotService");
      }
      static async createLot(env, data) {
        const id = crypto.randomUUID();
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const parent = await ParentService.getParent(env, data.parent_id);
        if (!parent) {
          throw new Error("Parent not found");
        }
        const result = await env.DB.prepare(
          `INSERT INTO lots (id, parent_id, title, description, status, created_at)
       VALUES (?, ?, ?, ?, 'available', ?)`
        ).bind(id, data.parent_id, data.title, data.description || null, now).run();
        if (!result.success) {
          throw new Error("Failed to create lot");
        }
        return {
          id,
          parent_id: data.parent_id,
          title: data.title,
          description: data.description,
          status: "available",
          created_at: now
        };
      }
      static async getLot(env, id) {
        const result = await env.DB.prepare("SELECT * FROM lots WHERE id = ?").bind(id).first();
        return result || null;
      }
      static async getAllLots(env) {
        const response = await env.DB.prepare(
          `SELECT id, parent_id, title, description, status, reserved_by, created_at 
       FROM lots ORDER BY created_at DESC`
        ).all();
        return response.results || [];
      }
      static async getLotsByParent(env, parentId) {
        const response = await env.DB.prepare(
          `SELECT id, parent_id, title, description, status, reserved_by, created_at 
       FROM lots WHERE parent_id = ? ORDER BY created_at DESC`
        ).bind(parentId).all();
        return response.results || [];
      }
      static async deleteLot(env, id, parentId) {
        const lot = await this.getLot(env, id);
        if (!lot || lot.parent_id !== parentId) {
          throw new Error("Not authorized to delete this lot");
        }
        const result = await env.DB.prepare("DELETE FROM lots WHERE id = ?").bind(id).run();
        return result.success;
      }
      static async reserveLot(env, lotId, requesterId) {
        const lot = await this.getLot(env, lotId);
        if (!lot) {
          throw new Error("Lot not found");
        }
        if (lot.status !== "available") {
          throw new Error("Lot is not available for reservation");
        }
        if (lot.parent_id === requesterId) {
          throw new Error("Cannot reserve your own lot");
        }
        const result = await env.DB.prepare(
          `UPDATE lots SET status = 'reserved', reserved_by = ? WHERE id = ?`
        ).bind(requesterId, lotId).run();
        if (!result.success) {
          throw new Error("Failed to reserve lot");
        }
        const reservationId = crypto.randomUUID();
        const now = (/* @__PURE__ */ new Date()).toISOString();
        await env.DB.prepare(
          `INSERT INTO reservations (id, lot_id, requester_id, created_at) VALUES (?, ?, ?, ?)`
        ).bind(reservationId, lotId, requesterId, now).run();
        return { ...lot, status: "reserved", reserved_by: requesterId };
      }
      static async updateLotStatus(env, id, status) {
        const result = await env.DB.prepare("UPDATE lots SET status = ? WHERE id = ?").bind(status, id).run();
        return result.success ? this.getLot(env, id) : null;
      }
    };
  }
});

// src/routes/parents.ts
init_parent_service();

// src/services/auth.service.ts
init_parent_service();
var AuthService = class {
  static {
    __name(this, "AuthService");
  }
  /**
   * Extract auth context from request (localStorage token format)
   * Token format: { parentId: string, email: string }
   */
  static async extractAuthContext(request) {
    try {
      const authHeader = request.headers.get("X-Parent-Auth");
      if (!authHeader) {
        return {};
      }
      const auth = JSON.parse(atob(authHeader));
      return {
        parentId: auth.parentId,
        email: auth.email
      };
    } catch (error) {
      console.error("Failed to extract auth context:", error);
      return {};
    }
  }
  /**
   * Verify parent identity and existence
   */
  static async verifyParentIdentity(env, parentId, email) {
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
  static async canModifyParent(env, parentId, targetParentId) {
    return parentId === targetParentId;
  }
  /**
   * Check if requester can delete a lot (must be owner)
   */
  static async canDeleteLot(env, requesterId, lotId) {
    const lot = await (await Promise.resolve().then(() => (init_lot_service(), lot_service_exports))).LotService.getLot(env, lotId);
    if (!lot) return false;
    return lot.parent_id === requesterId;
  }
};

// src/routes/parents.ts
async function handleParentsRequest(request, env, pathSegments) {
  const parentId = pathSegments[2];
  if (request.method === "GET" && !parentId) {
    try {
      const parents = await ParentService.getAllParents(env);
      const sanitized = parents.map((p) => ({
        id: p.id,
        first_name: p.first_name,
        emoji: p.emoji,
        classes: p.classes,
        created_at: p.created_at
      }));
      return jsonResponse({ success: true, data: sanitized });
    } catch (error) {
      return jsonError("Failed to fetch parents", 500);
    }
  }
  if (request.method === "POST" && !parentId) {
    try {
      const body = await request.json();
      if (!body.first_name || !body.email || !body.emoji) {
        return jsonError("Missing required fields", 400);
      }
      const exists = await ParentService.checkEmailExists(env, body.email);
      if (exists) {
        return jsonError("Email already registered", 409);
      }
      const parent = await ParentService.createParent(env, body);
      const response = {
        id: parent.id,
        first_name: parent.first_name,
        emoji: parent.emoji,
        classes: parent.classes,
        created_at: parent.created_at
      };
      return jsonResponse({ success: true, data: response }, 201);
    } catch (error) {
      console.error("Error creating parent:", error);
      return jsonError("Failed to create parent", 500);
    }
  }
  if (request.method === "DELETE" && parentId) {
    try {
      const auth = await AuthService.extractAuthContext(request);
      if (!auth.parentId || !auth.email) {
        return jsonError("Unauthorized", 401);
      }
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified || !await AuthService.canModifyParent(env, auth.parentId, parentId)) {
        return jsonError("Forbidden", 403);
      }
      const success = await ParentService.deleteParent(env, parentId);
      if (!success) {
        return jsonError("Parent not found", 404);
      }
      return jsonResponse({ success: true, data: { message: "Parent deleted" } });
    } catch (error) {
      console.error("Error deleting parent:", error);
      return jsonError("Failed to delete parent", 500);
    }
  }
  return jsonError("Not found", 404);
}
__name(handleParentsRequest, "handleParentsRequest");
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");
function jsonError(message, status = 400) {
  return jsonResponse({ success: false, error: message }, status);
}
__name(jsonError, "jsonError");

// src/routes/lots.ts
init_lot_service();
async function handleLotsRequest(request, env, pathSegments) {
  const lotId = pathSegments[2];
  const action = pathSegments[3];
  if (request.method === "GET" && !lotId) {
    try {
      const lots = await LotService.getAllLots(env);
      return jsonResponse2({ success: true, data: lots });
    } catch (error) {
      console.error("Error fetching lots:", error);
      return jsonError2("Failed to fetch lots", 500);
    }
  }
  if (request.method === "POST" && !lotId) {
    try {
      const auth = await AuthService.extractAuthContext(request);
      if (!auth.parentId || !auth.email) {
        return jsonError2("Unauthorized", 401);
      }
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified) {
        return jsonError2("Forbidden", 403);
      }
      const body = await request.json();
      if (!body.title) {
        return jsonError2("Missing required fields", 400);
      }
      const lot = await LotService.createLot(env, {
        parent_id: auth.parentId,
        title: body.title,
        description: body.description
      });
      return jsonResponse2({ success: true, data: lot }, 201);
    } catch (error) {
      console.error("Error creating lot:", error);
      const message = error instanceof Error ? error.message : "Failed to create lot";
      return jsonError2(message, 500);
    }
  }
  if (request.method === "DELETE" && lotId && !action) {
    try {
      const auth = await AuthService.extractAuthContext(request);
      if (!auth.parentId || !auth.email) {
        return jsonError2("Unauthorized", 401);
      }
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified) {
        return jsonError2("Forbidden", 403);
      }
      const canDelete = await AuthService.canDeleteLot(env, auth.parentId, lotId);
      if (!canDelete) {
        return jsonError2("Not authorized to delete this lot", 403);
      }
      const success = await LotService.deleteLot(env, lotId, auth.parentId);
      if (!success) {
        return jsonError2("Lot not found", 404);
      }
      return jsonResponse2({ success: true, data: { message: "Lot deleted" } });
    } catch (error) {
      console.error("Error deleting lot:", error);
      const message = error instanceof Error ? error.message : "Failed to delete lot";
      return jsonError2(message, 500);
    }
  }
  if (request.method === "POST" && lotId && action === "reserve") {
    try {
      const auth = await AuthService.extractAuthContext(request);
      if (!auth.parentId || !auth.email) {
        return jsonError2("Unauthorized", 401);
      }
      const verified = await AuthService.verifyParentIdentity(env, auth.parentId, auth.email);
      if (!verified) {
        return jsonError2("Forbidden", 403);
      }
      const lot = await LotService.reserveLot(env, lotId, auth.parentId);
      if (!lot) {
        return jsonError2("Failed to reserve lot", 500);
      }
      return jsonResponse2({ success: true, data: lot });
    } catch (error) {
      console.error("Error reserving lot:", error);
      const message = error instanceof Error ? error.message : "Failed to reserve lot";
      return jsonError2(message, 400);
    }
  }
  return jsonError2("Not found", 404);
}
__name(handleLotsRequest, "handleLotsRequest");
function jsonResponse2(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse2, "jsonResponse");
function jsonError2(message, status = 400) {
  return jsonResponse2({ success: false, error: message }, status);
}
__name(jsonError2, "jsonError");

// src/index.ts
var src_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Parent-Auth"
        }
      });
    }
    const addCorsHeaders = /* @__PURE__ */ __name((response) => {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Parent-Auth");
      return response;
    }, "addCorsHeaders");
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split("/").filter(Boolean);
      if (pathSegments[1] === "parents") {
        const response = await handleParentsRequest(request, env, pathSegments);
        return addCorsHeaders(response);
      }
      if (pathSegments[1] === "lots") {
        const response = await handleLotsRequest(request, env, pathSegments);
        return addCorsHeaders(response);
      }
      if (pathSegments[1] === "health") {
        return addCorsHeaders(new Response(JSON.stringify({ status: "ok" }), {
          headers: { "Content-Type": "application/json" }
        }));
      }
      return addCorsHeaders(new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      }));
    } catch (error) {
      console.error("Unhandled error:", error);
      return addCorsHeaders(new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }));
    }
  },
  /**
   * Scheduled event to run migrations (optional)
   */
  async scheduled(event, env) {
    console.log("Scheduled event triggered");
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError3 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError3;

// .wrangler/tmp/bundle-AJFfVR/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-AJFfVR/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
