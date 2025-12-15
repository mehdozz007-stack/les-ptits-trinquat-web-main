export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Si c'est un asset statique, laisse Cloudflare servir
    if (
      pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|pdf)$/i) ||
      pathname === "/robots.txt" ||
      pathname === "/CNAME" ||
      pathname === "/_redirects" ||
      pathname === "/_routes.json" ||
      pathname.startsWith("/assets/") ||
      pathname.startsWith("/documents/")
    ) {
      return context.env.ASSETS.fetch(request);
    }

    // Pour toutes les autres routes (SPA), sers index.html avec status 200
    // Ne redirige pas, sers directement le contenu
    const indexUrl = new URL("/index.html", url);
    const indexRequest = new Request(indexUrl.toString(), {
      method: request.method,
      headers: request.headers,
    });
    
    const response = await context.env.ASSETS.fetch(indexRequest);
    
    // Si on obtient une bonne réponse, retourne-la
    if (response.status === 200) {
      return new Response(response.body, {
        status: 200,
        statusText: "OK",
        headers: response.headers,
      });
    }

    // Fallback : retourne index.html même si erreur
    return context.env.ASSETS.fetch(indexRequest);
  } catch (error) {
    // En cas d'erreur, essaie quand même de servir index.html
    const url = new URL(context.request.url);
    const indexUrl = new URL("/index.html", url);
    return context.env.ASSETS.fetch(new Request(indexUrl.toString()));
  }
}
