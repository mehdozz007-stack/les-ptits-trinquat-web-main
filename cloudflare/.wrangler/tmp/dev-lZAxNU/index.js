var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-20NDdM/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// src/utils/security.ts
function escapeHtml(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
__name(escapeHtml, "escapeHtml");
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 255;
}
__name(isValidEmail, "isValidEmail");
function sanitizeString(input, maxLength = 500) {
  if (!input || typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}
__name(sanitizeString, "sanitizeString");
function generateSecureToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(generateSecureToken, "generateSecureToken");
function generateId() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(generateId, "generateId");
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    data,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 1e5,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );
  const hashArray = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  return btoa(String.fromCharCode(...combined));
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, storedHash) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const storedHashBytes = combined.slice(16);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      data,
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 1e5,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
    const hashArray = new Uint8Array(derivedBits);
    if (hashArray.length !== storedHashBytes.length) return false;
    let result = 0;
    for (let i = 0; i < hashArray.length; i++) {
      result |= hashArray[i] ^ storedHashBytes[i];
    }
    return result === 0;
  } catch {
    return false;
  }
}
__name(verifyPassword, "verifyPassword");
async function checkRateLimit(db, identifier, endpoint, maxRequests, windowSeconds) {
  const now = /* @__PURE__ */ new Date();
  const windowStart = new Date(now.getTime() - windowSeconds * 1e3).toISOString();
  await db.prepare(
    "DELETE FROM rate_limits WHERE window_start < ?"
  ).bind(windowStart).run();
  const existing = await db.prepare(
    "SELECT request_count, window_start FROM rate_limits WHERE identifier = ? AND endpoint = ?"
  ).bind(identifier, endpoint).first();
  if (!existing) {
    await db.prepare(
      "INSERT INTO rate_limits (identifier, endpoint, request_count, window_start) VALUES (?, ?, 1, ?)"
    ).bind(identifier, endpoint, now.toISOString()).run();
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: new Date(now.getTime() + windowSeconds * 1e3)
    };
  }
  const windowStartDate = new Date(existing.window_start);
  const resetAt = new Date(windowStartDate.getTime() + windowSeconds * 1e3);
  if (existing.request_count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt
    };
  }
  await db.prepare(
    "UPDATE rate_limits SET request_count = request_count + 1 WHERE identifier = ? AND endpoint = ?"
  ).bind(identifier, endpoint).run();
  return {
    allowed: true,
    remaining: maxRequests - existing.request_count - 1,
    resetAt
  };
}
__name(checkRateLimit, "checkRateLimit");
async function logAudit(db, userId, action, resourceType, resourceId, request, details) {
  try {
    const ipAddress = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
    const userAgent = request.headers.get("User-Agent") || "unknown";
    await db.prepare(`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      action,
      resourceType,
      resourceId,
      sanitizeString(ipAddress, 45),
      sanitizeString(userAgent, 500),
      details ? JSON.stringify(details) : null
    ).run();
  } catch (error) {
    console.error("Audit log error:", error);
  }
}
__name(logAudit, "logAudit");
function validateInputLength(input, fieldName, minLength, maxLength) {
  if (!input || typeof input !== "string") {
    return { valid: false, error: `${fieldName} is required` };
  }
  const trimmed = input.trim();
  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }
  return { valid: true };
}
__name(validateInputLength, "validateInputLength");

// src/middleware/rateLimit.ts
async function rateLimitMiddleware(c, next) {
  if (c.env.ENVIRONMENT === "development" || c.env.ENVIRONMENT !== "production") {
    return next();
  }
  const identifier = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For") || "unknown";
  const endpoint = new URL(c.req.url).pathname;
  const maxRequests = parseInt(c.env.RATE_LIMIT_MAX || "60", 10);
  const windowSeconds = parseInt(c.env.RATE_LIMIT_WINDOW || "60", 10);
  try {
    const { allowed, remaining, resetAt } = await checkRateLimit(
      c.env.DB,
      identifier,
      endpoint,
      maxRequests,
      windowSeconds
    );
    c.res.headers.set("X-RateLimit-Limit", maxRequests.toString());
    c.res.headers.set("X-RateLimit-Remaining", remaining.toString());
    c.res.headers.set("X-RateLimit-Reset", resetAt.toISOString());
    if (!allowed) {
      return c.json({
        success: false,
        error: "Too many requests. Please try again later.",
        retry_after: Math.ceil((resetAt.getTime() - Date.now()) / 1e3)
      }, 429);
    }
    return next();
  } catch (error) {
    console.warn("[Rate Limit] Error checking rate limit:", error);
    return next();
  }
}
__name(rateLimitMiddleware, "rateLimitMiddleware");
async function authRateLimitMiddleware(c, next) {
  if (c.env.ENVIRONMENT === "development" || c.env.ENVIRONMENT !== "production") {
    return next();
  }
  const identifier = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For") || "unknown";
  try {
    const { allowed, remaining, resetAt } = await checkRateLimit(
      c.env.DB,
      identifier,
      "auth",
      5,
      60
    );
    c.res.headers.set("X-RateLimit-Limit", "5");
    c.res.headers.set("X-RateLimit-Remaining", remaining.toString());
    c.res.headers.set("X-RateLimit-Reset", resetAt.toISOString());
    if (!allowed) {
      return c.json({
        success: false,
        error: "Too many login attempts. Please try again later.",
        retry_after: Math.ceil((resetAt.getTime() - Date.now()) / 1e3)
      }, 429);
    }
    return next();
  } catch (error) {
    console.warn("[Auth Rate Limit] Error checking rate limit:", error);
    return next();
  }
}
__name(authRateLimitMiddleware, "authRateLimitMiddleware");

// src/middleware/auth.ts
async function extractAndValidateToken(c) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  if (!token || token.length < 32) {
    return null;
  }
  const result = await c.env.DB.prepare(`
    SELECT 
      s.id as session_id,
      s.user_id,
      s.token,
      s.expires_at,
      s.created_at as session_created_at,
      u.id as user_id,
      u.email,
      u.password_hash,
      u.created_at as user_created_at,
      u.updated_at as user_updated_at,
      ur.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    WHERE s.token = ?
  `).bind(token).first();
  if (!result) {
    return null;
  }
  const expiresAt = new Date(result.expires_at);
  if (expiresAt < /* @__PURE__ */ new Date()) {
    await c.env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(result.session_id).run();
    return null;
  }
  const user = {
    id: result.user_id,
    email: result.email,
    password_hash: result.password_hash,
    created_at: result.user_created_at,
    updated_at: result.user_updated_at
  };
  const session = {
    id: result.session_id,
    user_id: result.user_id,
    token: result.token,
    expires_at: result.expires_at,
    created_at: result.session_created_at
  };
  return {
    user,
    session,
    role: result.role
  };
}
__name(extractAndValidateToken, "extractAndValidateToken");
async function optionalAuth(c, next) {
  const authContext = await extractAndValidateToken(c);
  c.set("auth", authContext);
  await next();
}
__name(optionalAuth, "optionalAuth");
async function requireAuth(c, next) {
  const authContext = await extractAndValidateToken(c);
  if (!authContext) {
    return c.json({
      success: false,
      error: "Authentication required"
    }, 401);
  }
  c.set("auth", authContext);
  await next();
}
__name(requireAuth, "requireAuth");
async function requireAdmin(c, next) {
  const authContext = await extractAndValidateToken(c);
  if (!authContext) {
    return c.json({
      success: false,
      error: "Authentication required"
    }, 401);
  }
  if (authContext.role !== "admin") {
    return c.json({
      success: false,
      error: "Admin access required"
    }, 403);
  }
  c.set("auth", authContext);
  await next();
}
__name(requireAdmin, "requireAdmin");
function getAuthContext(c) {
  return c.get("auth");
}
__name(getAuthContext, "getAuthContext");

// src/routes/auth.ts
var auth = new Hono2();
auth.post("/login", authRateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    if (!body.email || !body.password) {
      return c.json({
        success: false,
        error: "Email and password are required"
      }, 400);
    }
    const email = sanitizeString(body.email.toLowerCase(), 255);
    const password = body.password;
    if (!isValidEmail(email)) {
      return c.json({
        success: false,
        error: "Invalid email format"
      }, 400);
    }
    const passwordValidation = validateInputLength(password, "Password", 8, 128);
    if (!passwordValidation.valid) {
      return c.json({
        success: false,
        error: passwordValidation.error
      }, 400);
    }
    const user = await c.env.DB.prepare(
      "SELECT id, email, password_hash FROM users WHERE email = ?"
    ).bind(email).first();
    if (!user) {
      await logAudit(c.env.DB, null, "LOGIN_FAILED", "user", null, c.req.raw, { email, reason: "user_not_found" });
      return c.json({
        success: false,
        error: "Invalid credentials"
      }, 401);
    }
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      await logAudit(c.env.DB, user.id, "LOGIN_FAILED", "user", user.id, c.req.raw, { reason: "invalid_password" });
      return c.json({
        success: false,
        error: "Invalid credentials"
      }, 401);
    }
    const roleResult = await c.env.DB.prepare(
      "SELECT role FROM user_roles WHERE user_id = ?"
    ).bind(user.id).first();
    const token = generateSecureToken();
    const sessionDuration = parseInt(c.env.SESSION_DURATION || "604800", 10);
    const expiresAt = new Date(Date.now() + sessionDuration * 1e3).toISOString();
    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(generateId(), user.id, token, expiresAt).run();
    await logAudit(c.env.DB, user.id, "LOGIN_SUCCESS", "user", user.id, c.req.raw);
    return c.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: roleResult?.role || null
        },
        expires_at: expiresAt
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({
      success: false,
      error: "An error occurred during login"
    }, 500);
  }
});
auth.post("/logout", requireAuth, async (c) => {
  try {
    const authContext = getAuthContext(c);
    if (authContext) {
      await c.env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(authContext.session.id).run();
      await logAudit(c.env.DB, authContext.user.id, "LOGOUT", "user", authContext.user.id, c.req.raw);
    }
    return c.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({
      success: false,
      error: "An error occurred during logout"
    }, 500);
  }
});
auth.get("/me", requireAuth, async (c) => {
  const authContext = getAuthContext(c);
  if (!authContext) {
    return c.json({
      success: false,
      error: "Not authenticated"
    }, 401);
  }
  return c.json({
    success: true,
    data: {
      id: authContext.user.id,
      email: authContext.user.email,
      role: authContext.role,
      session_expires_at: authContext.session.expires_at
    }
  });
});
auth.post("/register", authRateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    if (!body.email || !body.password || !body.password_confirm) {
      return c.json({
        success: false,
        error: "Email, password et confirmation requises"
      }, 400);
    }
    const email = sanitizeString(body.email.toLowerCase(), 255);
    if (!isValidEmail(email)) {
      return c.json({
        success: false,
        error: "Email invalide"
      }, 400);
    }
    const passwordValidation = validateInputLength(body.password, "Password", 8, 128);
    if (!passwordValidation.valid) {
      return c.json({
        success: false,
        error: passwordValidation.error
      }, 400);
    }
    if (body.password !== body.password_confirm) {
      return c.json({
        success: false,
        error: "Les mots de passe ne correspondent pas"
      }, 400);
    }
    const existingUser = await c.env.DB.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).bind(email).first();
    if (existingUser) {
      return c.json({
        success: false,
        error: "Cet email est d\xE9j\xE0 utilis\xE9"
      }, 400);
    }
    const passwordHash = await hashPassword(body.password);
    const userId = generateId();
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, password_hash, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(userId, email, passwordHash).run();
    await logAudit(c.env.DB, userId, "USER_REGISTERED", "user", userId, c.req.raw);
    const token = generateSecureToken();
    const sessionDuration = parseInt(c.env.SESSION_DURATION || "604800", 10);
    const expiresAt = new Date(Date.now() + sessionDuration * 1e3).toISOString();
    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(generateId(), userId, token, expiresAt).run();
    await logAudit(c.env.DB, userId, "AUTO_LOGIN_AFTER_REGISTER", "user", userId, c.req.raw);
    return c.json({
      success: true,
      data: {
        user: {
          id: userId,
          email
        },
        token
      },
      message: "Compte cr\xE9\xE9 et authentification r\xE9ussie !"
    }, 201);
  } catch (error) {
    console.error("Register error:", error);
    return c.json({
      success: false,
      error: "Erreur lors de la cr\xE9ation du compte"
    }, 500);
  }
});
auth.post("/change-password", requireAuth, async (c) => {
  try {
    const authContext = getAuthContext(c);
    if (!authContext) {
      return c.json({ success: false, error: "Not authenticated" }, 401);
    }
    const body = await c.req.json();
    if (!body.current_password || !body.new_password) {
      return c.json({
        success: false,
        error: "Current and new password are required"
      }, 400);
    }
    const newPasswordValidation = validateInputLength(body.new_password, "New password", 8, 128);
    if (!newPasswordValidation.valid) {
      return c.json({
        success: false,
        error: newPasswordValidation.error
      }, 400);
    }
    const isValid = await verifyPassword(body.current_password, authContext.user.password_hash);
    if (!isValid) {
      await logAudit(c.env.DB, authContext.user.id, "PASSWORD_CHANGE_FAILED", "user", authContext.user.id, c.req.raw);
      return c.json({
        success: false,
        error: "Current password is incorrect"
      }, 401);
    }
    const newHash = await hashPassword(body.new_password);
    await c.env.DB.prepare(`
      UPDATE users SET password_hash = ?, updated_at = ?
      WHERE id = ?
    `).bind(newHash, (/* @__PURE__ */ new Date()).toISOString(), authContext.user.id).run();
    await c.env.DB.prepare(`
      DELETE FROM sessions WHERE user_id = ? AND id != ?
    `).bind(authContext.user.id, authContext.session.id).run();
    await logAudit(c.env.DB, authContext.user.id, "PASSWORD_CHANGED", "user", authContext.user.id, c.req.raw);
    return c.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
var auth_default = auth;

// src/routes/newsletter.ts
var newsletter = new Hono2();
newsletter.post("/subscribe", rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    if (!body.consent) {
      return c.json({
        success: false,
        error: "Consent is required to subscribe"
      }, 400);
    }
    const email = sanitizeString(body.email?.toLowerCase() || "", 255);
    if (!isValidEmail(email)) {
      return c.json({
        success: false,
        error: "Invalid email address"
      }, 400);
    }
    let firstName = null;
    if (body.first_name) {
      const nameValidation = validateInputLength(body.first_name, "First name", 1, 100);
      if (!nameValidation.valid) {
        return c.json({
          success: false,
          error: nameValidation.error
        }, 400);
      }
      firstName = sanitizeString(body.first_name, 100);
    }
    const existing = await c.env.DB.prepare(
      "SELECT id, is_active FROM newsletter_subscribers WHERE email = ?"
    ).bind(email).first();
    if (existing) {
      if (existing.is_active) {
        return c.json({
          success: false,
          error: "This email is already subscribed"
        }, 409);
      }
      await c.env.DB.prepare(`
        UPDATE newsletter_subscribers 
        SET is_active = 1, first_name = ?, consent = 1
        WHERE id = ?
      `).bind(firstName, existing.id).run();
      await logAudit(c.env.DB, null, "NEWSLETTER_RESUBSCRIBE", "subscriber", existing.id, c.req.raw);
      return c.json({
        success: true,
        message: "Successfully resubscribed to newsletter"
      });
    }
    const id = generateId();
    await c.env.DB.prepare(`
      INSERT INTO newsletter_subscribers (id, email, first_name, consent, is_active)
      VALUES (?, ?, ?, 1, 1)
    `).bind(id, email, firstName).run();
    await logAudit(c.env.DB, null, "NEWSLETTER_SUBSCRIBE", "subscriber", id, c.req.raw);
    return c.json({
      success: true,
      message: "Successfully subscribed to newsletter"
    }, 201);
  } catch (error) {
    console.error("Subscribe error:", error);
    return c.json({
      success: false,
      error: "An error occurred during subscription"
    }, 500);
  }
});
newsletter.post("/unsubscribe", rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const email = sanitizeString(body.email?.toLowerCase() || "", 255);
    if (!isValidEmail(email)) {
      return c.json({
        success: false,
        error: "Invalid email address"
      }, 400);
    }
    const result = await c.env.DB.prepare(`
      UPDATE newsletter_subscribers SET is_active = 0 WHERE email = ?
    `).bind(email).run();
    if (result.meta.changes === 0) {
      return c.json({
        success: false,
        error: "Email not found"
      }, 404);
    }
    await logAudit(c.env.DB, null, "NEWSLETTER_UNSUBSCRIBE", "subscriber", null, c.req.raw, { email });
    return c.json({
      success: true,
      message: "Successfully unsubscribed from newsletter"
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
newsletter.get("/admin/subscribers", requireAdmin, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT id, email, first_name, consent, is_active, created_at
      FROM newsletter_subscribers
      ORDER BY created_at DESC
    `).all();
    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
newsletter.patch("/admin/subscribers/:id", requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const authContext = getAuthContext(c);
    if (typeof body.is_active === "boolean") {
      await c.env.DB.prepare(`
        UPDATE newsletter_subscribers SET is_active = ? WHERE id = ?
      `).bind(body.is_active ? 1 : 0, id).run();
      await logAudit(c.env.DB, authContext?.user.id || null, "SUBSCRIBER_STATUS_CHANGED", "subscriber", id, c.req.raw, { is_active: body.is_active });
    }
    return c.json({
      success: true,
      message: "Subscriber updated"
    });
  } catch (error) {
    console.error("Update subscriber error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
newsletter.delete("/admin/subscribers/:id", requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);
    await c.env.DB.prepare("DELETE FROM newsletter_subscribers WHERE id = ?").bind(id).run();
    await logAudit(c.env.DB, authContext?.user.id || null, "SUBSCRIBER_DELETED", "subscriber", id, c.req.raw);
    return c.json({
      success: true,
      message: "Subscriber deleted"
    });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
newsletter.get("/admin/newsletters", requireAdmin, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM newsletters ORDER BY created_at DESC
    `).all();
    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error("Get newsletters error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
newsletter.post("/admin/newsletters", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const authContext = getAuthContext(c);
    const titleValidation = validateInputLength(body.title, "Title", 1, 200);
    if (!titleValidation.valid) {
      return c.json({ success: false, error: titleValidation.error }, 400);
    }
    const subjectValidation = validateInputLength(body.subject, "Subject", 1, 200);
    if (!subjectValidation.valid) {
      return c.json({ success: false, error: subjectValidation.error }, 400);
    }
    const contentValidation = validateInputLength(body.content, "Content", 1, 5e4);
    if (!contentValidation.valid) {
      return c.json({ success: false, error: contentValidation.error }, 400);
    }
    const id = generateId();
    await c.env.DB.prepare(`
      INSERT INTO newsletters (id, title, subject, content, status)
      VALUES (?, ?, ?, ?, 'draft')
    `).bind(id, sanitizeString(body.title, 200), sanitizeString(body.subject, 200), body.content).run();
    await logAudit(c.env.DB, authContext?.user.id || null, "NEWSLETTER_CREATED", "newsletter", id, c.req.raw);
    return c.json({
      success: true,
      data: { id },
      message: "Newsletter created"
    }, 201);
  } catch (error) {
    console.error("Create newsletter error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
newsletter.post("/admin/send", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const authContext = getAuthContext(c);
    const subjectValidation = validateInputLength(body.subject, "Subject", 1, 200);
    if (!subjectValidation.valid) {
      return c.json({ success: false, error: subjectValidation.error }, 400);
    }
    const contentValidation = validateInputLength(body.content, "Content", 1, 5e4);
    if (!contentValidation.valid) {
      return c.json({ success: false, error: contentValidation.error }, 400);
    }
    const subscribers = await c.env.DB.prepare(`
      SELECT id, email, first_name 
      FROM newsletter_subscribers 
      WHERE is_active = 1 AND consent = 1
    `).all();
    if (!subscribers.results || subscribers.results.length === 0) {
      return c.json({
        success: false,
        error: "No active subscribers"
      }, 400);
    }
    const safeSubject = escapeHtml(body.subject);
    const results = [];
    for (const subscriber of subscribers.results) {
      try {
        const personalizedContent = body.content.replace(
          /\{\{prenom\}\}/gi,
          escapeHtml(subscriber.first_name || "Cher parent")
        );
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${c.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Les P'tits Trinquat <newsletter@ptits-trinquat.fr>",
            to: subscriber.email,
            subject: safeSubject,
            html: personalizedContent
          })
        });
        results.push({
          email: subscriber.email,
          success: response.ok,
          error: response.ok ? void 0 : `HTTP ${response.status}`
        });
      } catch (error) {
        results.push({
          email: subscriber.email,
          success: false,
          error: "Send failed"
        });
      }
    }
    const successCount = results.filter((r) => r.success).length;
    const newsletterId = generateId();
    await c.env.DB.prepare(`
      INSERT INTO newsletters (id, title, subject, content, status, sent_at, recipients_count)
      VALUES (?, ?, ?, ?, 'sent', ?, ?)
    `).bind(
      newsletterId,
      safeSubject,
      safeSubject,
      body.content,
      (/* @__PURE__ */ new Date()).toISOString(),
      successCount
    ).run();
    await logAudit(c.env.DB, authContext?.user.id || null, "NEWSLETTER_SENT", "newsletter", newsletterId, c.req.raw, {
      total: results.length,
      success: successCount,
      failed: results.length - successCount
    });
    return c.json({
      success: true,
      data: {
        sent: successCount,
        total: results.length,
        failed: results.filter((r) => !r.success)
      },
      message: `Newsletter sent to ${successCount}/${results.length} subscribers`
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    return c.json({
      success: false,
      error: "An error occurred while sending newsletter"
    }, 500);
  }
});
var newsletter_default = newsletter;

// src/routes/tombola.ts
var tombola = new Hono2();
tombola.get("/participants", async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT id, prenom, role, classes, emoji, created_at
      FROM tombola_participants
      ORDER BY created_at DESC
    `).all();
    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    console.error("Get participants error:", errorMessage);
    console.error("Error stack:", errorStack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return c.json({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});
tombola.get("/participants/my", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({
        success: false,
        error: "Authentification requise"
      }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    const session = await c.env.DB.prepare(`
      SELECT s.user_id, s.expires_at
      FROM sessions s
      WHERE s.token = ?
    `).bind(token).first();
    if (!session) {
      return c.json({
        success: false,
        error: "Token invalide"
      }, 401);
    }
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < /* @__PURE__ */ new Date()) {
      return c.json({
        success: false,
        error: "Token expir\xE9"
      }, 401);
    }
    const userId = session.user_id;
    const result = await c.env.DB.prepare(`
      SELECT id, prenom, role, classes, emoji, created_at
      FROM tombola_participants
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all();
    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Get my participants error:", errorMessage);
    return c.json({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});
tombola.get("/lots", async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT 
        l.id,
        l.nom,
        l.description,
        l.icone,
        l.statut,
        l.parent_id,
        l.reserved_by,
        l.created_at,
        p.id as parent_id_full,
        p.prenom as parent_prenom,
        p.emoji as parent_emoji,
        r.id as reserver_id_full,
        r.prenom as reserver_prenom,
        r.emoji as reserver_emoji
      FROM tombola_lots l
      LEFT JOIN tombola_participants p ON l.parent_id = p.id
      LEFT JOIN tombola_participants r ON l.reserved_by = r.id
      ORDER BY l.created_at DESC
    `).all();
    const transformedData = result.results.map((row) => ({
      id: row.id,
      nom: row.nom,
      description: row.description,
      icone: row.icone,
      statut: row.statut,
      parent_id: row.parent_id,
      reserved_by: row.reserved_by,
      created_at: row.created_at,
      parent: row.parent_prenom ? {
        id: row.parent_id_full,
        prenom: row.parent_prenom,
        emoji: row.parent_emoji
      } : void 0,
      reserver: row.reserver_prenom ? {
        id: row.reserver_id_full,
        prenom: row.reserver_prenom,
        emoji: row.reserver_emoji
      } : void 0
    }));
    return c.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    console.error("Get lots error:", errorMessage);
    console.error("Error stack:", errorStack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return c.json({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});
tombola.get("/lots/my", async (c) => {
  try {
    const userId = c.req.query("user_id");
    if (!userId) {
      return c.json({
        success: false,
        error: "user_id query parameter is required"
      }, 400);
    }
    const myParticipants = await c.env.DB.prepare(`
      SELECT id FROM tombola_participants WHERE user_id = ?
    `).bind(userId).all();
    if (myParticipants.results.length === 0) {
      return c.json({
        success: true,
        data: []
      });
    }
    const participantIds = myParticipants.results.map((p) => p.id);
    const placeholders = participantIds.map(() => "?").join(",");
    const result = await c.env.DB.prepare(`
      SELECT 
        l.id,
        l.nom,
        l.description,
        l.icone,
        l.statut,
        l.parent_id,
        l.reserved_by,
        l.created_at,
        p.id as parent_id_full,
        p.prenom as parent_prenom,
        p.emoji as parent_emoji,
        r.id as reserver_id_full,
        r.prenom as reserver_prenom,
        r.emoji as reserver_emoji
      FROM tombola_lots l
      LEFT JOIN tombola_participants p ON l.parent_id = p.id
      LEFT JOIN tombola_participants r ON l.reserved_by = r.id
      WHERE l.parent_id IN (${placeholders})
      ORDER BY l.created_at DESC
    `).bind(...participantIds).all();
    const transformedData = result.results.map((row) => ({
      id: row.id,
      nom: row.nom,
      description: row.description,
      icone: row.icone,
      statut: row.statut,
      parent_id: row.parent_id,
      reserved_by: row.reserved_by,
      created_at: row.created_at,
      parent: row.parent_prenom ? {
        id: row.parent_id_full,
        prenom: row.parent_prenom,
        emoji: row.parent_emoji
      } : void 0,
      reserver: row.reserver_prenom ? {
        id: row.reserver_id_full,
        prenom: row.reserver_prenom,
        emoji: row.reserver_emoji
      } : void 0
    }));
    return c.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Get my lots error:", errorMessage);
    return c.json({
      success: false,
      error: `Database error: ${errorMessage}`
    }, 500);
  }
});
tombola.post("/participants", rateLimitMiddleware, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({
        success: false,
        error: "Authentification requise"
      }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    const session = await c.env.DB.prepare(`
      SELECT s.user_id, u.is_active, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `).bind(token).first();
    if (!session) {
      return c.json({
        success: false,
        error: "Token invalide"
      }, 401);
    }
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < /* @__PURE__ */ new Date()) {
      return c.json({
        success: false,
        error: "Token expir\xE9"
      }, 401);
    }
    if (!session.is_active) {
      return c.json({
        success: false,
        error: "Utilisateur invalide ou d\xE9sactiv\xE9"
      }, 401);
    }
    const userId = session.user_id;
    const existingParticipant = await c.env.DB.prepare(
      "SELECT id FROM tombola_participants WHERE user_id = ?"
    ).bind(userId).first();
    if (existingParticipant) {
      return c.json({
        success: false,
        error: "Vous avez d\xE9j\xE0 un participant. Supprimez-le d'abord si vous voulez en cr\xE9er un nouveau."
      }, 400);
    }
    const body = await c.req.json();
    const prenomValidation = validateInputLength(body.prenom, "Pr\xE9nom", 1, 100);
    if (!prenomValidation.valid) {
      return c.json({ success: false, error: prenomValidation.error }, 400);
    }
    const email = sanitizeString(body.email?.toLowerCase() || "", 255);
    if (!isValidEmail(email)) {
      return c.json({
        success: false,
        error: "Adresse email invalide"
      }, 400);
    }
    let role = "Parent participant";
    if (body.role) {
      const roleValidation = validateInputLength(body.role, "Role", 1, 50);
      if (!roleValidation.valid) {
        return c.json({ success: false, error: roleValidation.error }, 400);
      }
      role = sanitizeString(body.role, 50);
    }
    let classes = null;
    if (body.classes) {
      const classesValidation = validateInputLength(body.classes, "Classes", 1, 200);
      if (!classesValidation.valid) {
        return c.json({ success: false, error: classesValidation.error }, 400);
      }
      classes = sanitizeString(body.classes, 200);
    }
    let emoji = "\u{1F60A}";
    if (body.emoji) {
      emoji = body.emoji.slice(0, 10);
    }
    const id = generateId();
    await c.env.DB.prepare(`
      INSERT INTO tombola_participants (id, user_id, prenom, email, role, classes, emoji)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, userId, sanitizeString(body.prenom, 100), email, role, classes, emoji).run();
    await logAudit(c.env.DB, userId, "PARTICIPANT_CREATED", "participant", id, c.req.raw);
    return c.json({
      success: true,
      data: { id },
      message: "Participant cr\xE9\xE9 avec succ\xE8s"
    }, 201);
  } catch (error) {
    console.error("Create participant error:", error);
    return c.json({
      success: false,
      error: "Erreur lors de la cr\xE9ation du participant"
    }, 500);
  }
});
tombola.post("/lots", rateLimitMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const nomValidation = validateInputLength(body.nom, "Nom", 1, 200);
    if (!nomValidation.valid) {
      return c.json({ success: false, error: nomValidation.error }, 400);
    }
    if (!body.parent_id) {
      return c.json({
        success: false,
        error: "Parent ID is required"
      }, 400);
    }
    const parent = await c.env.DB.prepare(
      "SELECT id, user_id FROM tombola_participants WHERE id = ?"
    ).bind(body.parent_id).first();
    if (!parent) {
      return c.json({
        success: false,
        error: "Parent participant not found"
      }, 404);
    }
    let description = null;
    if (body.description) {
      const descValidation = validateInputLength(body.description, "Description", 1, 1e3);
      if (!descValidation.valid) {
        return c.json({ success: false, error: descValidation.error }, 400);
      }
      description = sanitizeString(body.description, 1e3);
    }
    const icone = body.icone?.slice(0, 10) || "\u{1F381}";
    const id = generateId();
    await c.env.DB.prepare(`
      INSERT INTO tombola_lots (id, nom, description, icone, parent_id, statut, created_at)
      VALUES (?, ?, ?, ?, ?, 'disponible', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    `).bind(id, sanitizeString(body.nom, 200), description, icone, body.parent_id).run();
    await logAudit(c.env.DB, body.parent_id || null, "LOT_CREATED", "lot", id, c.req.raw);
    return c.json({
      success: true,
      data: { id },
      message: "Lot created"
    }, 201);
  } catch (error) {
    console.error("Create lot error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error details:", errorMsg);
    return c.json({
      success: false,
      error: `An error occurred: ${errorMsg}`
    }, 500);
  }
});
tombola.patch("/lots/:id/reserve", optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    if (!body.reserver_id) {
      return c.json({
        success: false,
        error: "Reserver ID is required"
      }, 400);
    }
    const lot = await c.env.DB.prepare(
      "SELECT id, statut, parent_id FROM tombola_lots WHERE id = ?"
    ).bind(id).first();
    if (!lot) {
      return c.json({ success: false, error: "Lot not found" }, 404);
    }
    if (lot.statut !== "disponible") {
      return c.json({
        success: false,
        error: "Lot is not available for reservation"
      }, 400);
    }
    const reserver = await c.env.DB.prepare(
      "SELECT id FROM tombola_participants WHERE id = ?"
    ).bind(body.reserver_id).first();
    if (!reserver) {
      return c.json({ success: false, error: "Reserver not found" }, 404);
    }
    if (lot.parent_id === body.reserver_id) {
      return c.json({
        success: false,
        error: "You cannot reserve your own lot"
      }, 400);
    }
    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'reserve', reserved_by = ? WHERE id = ?
    `).bind(body.reserver_id, id).run();
    await logAudit(c.env.DB, null, "LOT_RESERVED", "lot", id, c.req.raw, { reserver_id: body.reserver_id });
    return c.json({
      success: true,
      message: "Lot reserved successfully"
    });
  } catch (error) {
    console.error("Reserve lot error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error details:", errorMsg);
    return c.json({
      success: false,
      error: `An error occurred: ${errorMsg}`
    }, 500);
  }
});
tombola.post("/lots/:id/mark-remis", optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    let body = {};
    try {
      body = await c.req.json();
    } catch {
    }
    const lot = await c.env.DB.prepare(
      "SELECT id, statut, parent_id FROM tombola_lots WHERE id = ?"
    ).bind(id).first();
    if (!lot) {
      return c.json({ success: false, error: "Lot not found" }, 404);
    }
    if (lot.statut !== "reserve") {
      return c.json({
        success: false,
        error: "Only reserved lots can be marked as delivered"
      }, 400);
    }
    if (body.user_id) {
      const participant = await c.env.DB.prepare(
        "SELECT id, user_id FROM tombola_participants WHERE id = ?"
      ).bind(lot.parent_id).first();
      if (!participant) {
        return c.json({
          success: false,
          error: "Participant not found"
        }, 404);
      }
      if (participant.user_id !== body.user_id) {
        return c.json({
          success: false,
          error: "Unauthorized: This lot does not belong to your account"
        }, 403);
      }
    }
    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'remis' WHERE id = ?
    `).bind(id).run();
    await logAudit(c.env.DB, null, "LOT_MARKED_REMIS", "lot", id, c.req.raw);
    return c.json({
      success: true,
      message: "Lot marked as delivered"
    });
  } catch (error) {
    console.error("Mark remis error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.post("/lots/:id/mark-available", optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    let body = {};
    try {
      body = await c.req.json();
    } catch {
    }
    const lot = await c.env.DB.prepare(
      "SELECT id, statut, parent_id FROM tombola_lots WHERE id = ?"
    ).bind(id).first();
    if (!lot) {
      return c.json({ success: false, error: "Lot not found" }, 404);
    }
    if (lot.statut !== "reserve") {
      return c.json({
        success: false,
        error: "Only reserved lots can be made available again"
      }, 400);
    }
    if (body.user_id) {
      const participant = await c.env.DB.prepare(
        "SELECT id, user_id FROM tombola_participants WHERE id = ?"
      ).bind(lot.parent_id).first();
      if (!participant) {
        return c.json({
          success: false,
          error: "Participant not found"
        }, 404);
      }
      if (participant.user_id !== body.user_id) {
        return c.json({
          success: false,
          error: "Unauthorized: This lot does not belong to your account"
        }, 403);
      }
    }
    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'disponible', reserved_by = NULL WHERE id = ?
    `).bind(id).run();
    await logAudit(c.env.DB, null, "LOT_MARKED_AVAILABLE", "lot", id, c.req.raw);
    return c.json({
      success: true,
      message: "Lot made available again"
    });
  } catch (error) {
    console.error("Mark available error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.get("/contact-link/:lotId", optionalAuth, async (c) => {
  try {
    const { lotId } = c.req.param();
    const senderName = c.req.query("sender_name") || "Un parent";
    const lot = await c.env.DB.prepare(`
      SELECT l.nom, p.email, p.prenom
      FROM tombola_lots l
      JOIN tombola_participants p ON l.parent_id = p.id
      WHERE l.id = ?
    `).bind(lotId).first();
    if (!lot) {
      return c.json({ success: false, error: "Lot not found" }, 404);
    }
    const subject = encodeURIComponent(`Tombola - Int\xE9r\xEAt pour "${escapeHtml(lot.nom)}"`);
    const body = encodeURIComponent(
      `Bonjour ${escapeHtml(lot.prenom)},

Je suis ${escapeHtml(sanitizeString(senderName, 100))} et je suis int\xE9ress\xE9(e) par votre lot "${escapeHtml(lot.nom)}" propos\xE9 pour la tombola.

Pouvons-nous en discuter ?

Merci !`
    );
    const mailtoLink = `mailto:${lot.email}?subject=${subject}&body=${body}`;
    await logAudit(c.env.DB, null, "CONTACT_LINK_GENERATED", "lot", lotId, c.req.raw);
    return c.json({
      success: true,
      data: { mailto_link: mailtoLink }
    });
  } catch (error) {
    console.error("Get contact link error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.patch("/lots/:id/cancel", requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);
    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'disponible', reserved_by = NULL WHERE id = ?
    `).bind(id).run();
    await logAudit(c.env.DB, authContext?.user.id || null, "LOT_RESERVATION_CANCELLED", "lot", id, c.req.raw);
    return c.json({
      success: true,
      message: "Reservation cancelled"
    });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.patch("/lots/:id/remis", requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);
    await c.env.DB.prepare(`
      UPDATE tombola_lots SET statut = 'remis' WHERE id = ?
    `).bind(id).run();
    await logAudit(c.env.DB, authContext?.user.id || null, "LOT_MARKED_REMIS", "lot", id, c.req.raw);
    return c.json({
      success: true,
      message: "Lot marked as delivered"
    });
  } catch (error) {
    console.error("Mark remis error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.delete("/lots/:id", optionalAuth, async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    if (!body.parent_id) {
      return c.json({
        success: false,
        error: "Parent ID is required"
      }, 400);
    }
    const lot = await c.env.DB.prepare(
      "SELECT id, parent_id FROM tombola_lots WHERE id = ?"
    ).bind(id).first();
    if (!lot) {
      return c.json({ success: false, error: "Lot not found" }, 404);
    }
    if (lot.parent_id !== body.parent_id) {
      return c.json({
        success: false,
        error: "You can only delete your own lots"
      }, 403);
    }
    if (body.user_id) {
      const participant = await c.env.DB.prepare(
        "SELECT id, user_id FROM tombola_participants WHERE id = ?"
      ).bind(body.parent_id).first();
      if (!participant) {
        return c.json({
          success: false,
          error: "Participant not found"
        }, 404);
      }
      if (participant.user_id !== body.user_id) {
        return c.json({
          success: false,
          error: "Unauthorized: This lot does not belong to your account"
        }, 403);
      }
    }
    await c.env.DB.prepare("DELETE FROM tombola_lots WHERE id = ?").bind(id).run();
    await logAudit(c.env.DB, null, "LOT_DELETED", "lot", id, c.req.raw);
    return c.json({
      success: true,
      message: "Lot deleted"
    });
  } catch (error) {
    console.error("Delete lot error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.get("/contact-link/:lotId", optionalAuth, async (c) => {
  try {
    const { lotId } = c.req.param();
    const senderName = c.req.query("sender_name") || "Un parent";
    const lot = await c.env.DB.prepare(`
      SELECT l.nom, p.email, p.prenom
      FROM tombola_lots l
      JOIN tombola_participants p ON l.parent_id = p.id
      WHERE l.id = ?
    `).bind(lotId).first();
    if (!lot) {
      return c.json({ success: false, error: "Lot not found" }, 404);
    }
    const subject = encodeURIComponent(`Tombola - Int\xE9r\xEAt pour "${escapeHtml(lot.nom)}"`);
    const body = encodeURIComponent(
      `Bonjour ${escapeHtml(lot.prenom)},

Je suis ${escapeHtml(sanitizeString(senderName, 100))} et je suis int\xE9ress\xE9(e) par votre lot "${escapeHtml(lot.nom)}" propos\xE9 pour la tombola.

Pouvons-nous en discuter ?

Merci !`
    );
    const mailtoLink = `mailto:${lot.email}?subject=${subject}&body=${body}`;
    await logAudit(c.env.DB, null, "CONTACT_LINK_GENERATED", "lot", lotId, c.req.raw);
    return c.json({
      success: true,
      data: { mailto_link: mailtoLink }
    });
  } catch (error) {
    console.error("Get contact link error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.get("/admin/participants", requireAdmin, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM tombola_participants ORDER BY created_at DESC
    `).all();
    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error("Get admin participants error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.delete("/admin/participants/:id", requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const authContext = getAuthContext(c);
    await c.env.DB.prepare("DELETE FROM tombola_participants WHERE id = ?").bind(id).run();
    await logAudit(c.env.DB, authContext?.user.id || null, "PARTICIPANT_DELETED", "participant", id, c.req.raw);
    return c.json({
      success: true,
      message: "Participant deleted"
    });
  } catch (error) {
    console.error("Delete participant error:", error);
    return c.json({
      success: false,
      error: "An error occurred"
    }, 500);
  }
});
tombola.delete("/participants/:id", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({
        success: false,
        error: "Authentification requise"
      }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    const session = await c.env.DB.prepare(`
      SELECT s.user_id, u.is_active, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `).bind(token).first();
    if (!session) {
      return c.json({
        success: false,
        error: "Token invalide"
      }, 401);
    }
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < /* @__PURE__ */ new Date()) {
      return c.json({
        success: false,
        error: "Token expir\xE9"
      }, 401);
    }
    const userId = session.user_id;
    const { id } = c.req.param();
    const participant = await c.env.DB.prepare(
      "SELECT id, user_id FROM tombola_participants WHERE id = ?"
    ).bind(id).first();
    if (!participant) {
      return c.json({ success: false, error: "Participant not found" }, 404);
    }
    if (participant.user_id !== userId) {
      return c.json({
        success: false,
        error: "Vous ne pouvez supprimer que votre propre participation"
      }, 403);
    }
    await c.env.DB.prepare("DELETE FROM tombola_lots WHERE parent_id = ?").bind(id).run();
    await c.env.DB.prepare("DELETE FROM tombola_participants WHERE id = ?").bind(id).run();
    await c.env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
    await c.env.DB.prepare("DELETE FROM user_roles WHERE user_id = ?").bind(userId).run();
    await c.env.DB.prepare("DELETE FROM audit_logs WHERE user_id = ?").bind(userId).run();
    await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
    return c.json({
      success: true,
      message: "Compte supprim\xE9 : toutes les donn\xE9es utilisateur ont \xE9t\xE9 supprim\xE9es de la base de donn\xE9es"
    });
  } catch (error) {
    console.error("Delete own participation error:", error);
    return c.json({
      success: false,
      error: "Une erreur est survenue"
    }, 500);
  }
});
var tombola_default = tombola;

// src/index.ts
var app = new Hono2();
app.use("*", cors({
  origin: ["https://www.lespetitstrinquat.fr", "https://lespetitstrinquat.fr", "https://les-ptits-trinquat.pages.dev", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400
}));
app.get("/", (c) => {
  return c.json({
    name: "Les P'tits Trinquat API",
    version: "1.0.0",
    status: "healthy",
    environment: c.env.ENVIRONMENT
  });
});
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/init-db", async (c) => {
  try {
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      `CREATE TABLE IF NOT EXISTS user_roles (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        UNIQUE (user_id, role),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id)`,
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`,
      `CREATE TABLE IF NOT EXISTS tombola_participants (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT,
        prenom TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Parent participant',
        classes TEXT,
        emoji TEXT NOT NULL DEFAULT '\u{1F60A}',
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_participants_user_id ON tombola_participants(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email)`,
      `CREATE TABLE IF NOT EXISTS tombola_lots (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        nom TEXT NOT NULL,
        description TEXT,
        icone TEXT NOT NULL DEFAULT '\u{1F381}',
        statut TEXT NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'reserve', 'remis')),
        parent_id TEXT NOT NULL,
        reserved_by TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        FOREIGN KEY (parent_id) REFERENCES tombola_participants(id) ON DELETE CASCADE,
        FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id) ON DELETE SET NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id)`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_lots_reserved_by ON tombola_lots(reserved_by)`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_lots_statut ON tombola_lots(statut)`,
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        ip_address TEXT,
        user_agent TEXT,
        details TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)`,
      `CREATE TABLE IF NOT EXISTS rate_limits (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        identifier TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        request_count INTEGER NOT NULL DEFAULT 1,
        window_start TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        UNIQUE (identifier, endpoint)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier)`,
      `CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start)`
    ];
    for (const statement of statements) {
      if (statement.trim()) {
        await c.env.DB.prepare(statement).run();
      }
    }
    return c.json({
      success: true,
      message: "Database initialized successfully"
    });
  } catch (error) {
    console.error("DB init error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
app.route("/api/auth", auth_default);
app.route("/api/newsletter", newsletter_default);
app.route("/api/tombola", tombola_default);
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({
    success: false,
    error: c.env.ENVIRONMENT === "development" ? err.message : "An internal error occurred"
  }, 500);
});
app.notFound((c) => {
  return c.json({
    success: false,
    error: "Route not found"
  }, 404);
});
var src_default = app;

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
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
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
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-20NDdM/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-20NDdM/middleware-loader.entry.ts
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
