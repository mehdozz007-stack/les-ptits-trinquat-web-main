/**
 * Helper pour obtenir le logo en tant que data URI ou URL
 * En dev, utilise un placeholder ou data URI
 * En prod, utilise l'URL publique
 */

export function getLogoUrl(siteUrl: string, environment: string): string {
  if (environment === 'development') {
    // En dev, utiliser le placeholder de Resend
    return 'https://react-email-demo-bdj5 immigrant.vercel.app/static/vercel-logo.png';
  }
  
  // En production, utiliser le vrai logo
  return `${siteUrl}/logoAsso.png`;
}

/**
 * Retourne le logo en tant qu'image HTML sûre
 */
export function getLogoHtml(siteUrl: string, environment: string): string {
  const logoUrl = getLogoUrl(siteUrl, environment);
  return `<img src="${logoUrl}" alt="Les P'tits Trinquat" style="width: auto;">`;
}
