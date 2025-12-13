export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Si c'est un asset ou un fichier spécifique, laisse le serveur statique gérer
  if (
    pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/i) ||
    pathname === "/robots.txt" ||
    pathname === "/CNAME" ||
    pathname === "/_redirects" ||
    pathname === "/_routes.json" ||
    pathname.startsWith("/assets/")
  ) {
    return context.env.ASSETS.fetch(request);
  }

  // Pour toutes les autres routes, retourne index.html (SPA routing)
  const indexRequest = new Request(new URL("/index.html", url), request);
  return context.env.ASSETS.fetch(indexRequest);
}
