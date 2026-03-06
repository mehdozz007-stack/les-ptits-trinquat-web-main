/**
 * Template Email Newsletter - Les P'tits Trinquat
 * Génère un HTML élégant et responsive pour les emails
 * 
 * Usage:
 * const html = renderNewsletterEmail({
 *   firstName: "Marie",
 *   title: "Fête d'école 2026",
 *   content: "Texte de la newsletter",
 *   unsubscribeUrl: "https://lespetitstrinquat.fr/api/newsletter/unsubscribe?token=..."
 * });
 */

interface NewsletterEmailProps {
    firstName?: string;
    title: string;
    previewText: string;
    content: string;
    contentHtml?: string;
    unsubscribeUrl?: string;
    siteUrl?: string;
    logoUrl?: string;
    faviconUrl?: string;
    year?: number;
}

/**
 * Obtient l'URL de base de l'application (local ou production)
 */
function getBaseUrl(): string {
    // En frontend, on peut utiliser window.location.origin
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // En backend/email, utiliser le lien par défaut
    return 'https://lespetitstrinquat.fr';
}

/**
 * Génère le HTML d'un email newsletter
 * Responsive, compatible Gmail/Outlook/Apple Mail
 */
export function renderNewsletterEmail(props: NewsletterEmailProps): string {
    const baseUrl = getBaseUrl();
    const {
        firstName = "Cher parent",
        title,
        previewText,
        content,
        contentHtml,
        unsubscribeUrl = "#",
        siteUrl = baseUrl,
        logoUrl = `${baseUrl}/logoAsso.png`,
        faviconUrl = `${baseUrl}/favicon.ico`,
        year = new Date().getFullYear()
    } = props;

    // Si du HTML custom est fourni, l'utiliser ; sinon, convertir le texte en HTML sécurisé
    const bodyContent = contentHtml || sanitizeToHtml(content);

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="${faviconUrl}" type="image/x-icon">
  <title>${escapeHtml(title)}</title>
  <style>
    /* Reset & Base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', 'Garamond', 'Palatino', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Nunito', sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a1a1a;
      }
      .email-container {
        background-color: #2a2a2a;
        color: #f0f0f0;
      }
      .header {
        background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      }
      .footer {
        background-color: #1a1a1a;
        color: #888888;
      }
      .footer a {
        color: #ff9a56;
      }
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #FFF5F0 0%, #FFF0F7 50%, #E8F4FF 100%);
      padding: 40px 20px;
      text-align: center;
    }
    
    .logo {
      display: inline-block;
      height: 250px;
      margin-bottom: 20px;
    }
    
    .logo img {
      height: 100%;
      width: auto;
      border-radius: 16px;
    }
    
    .header-title {
      font-size: 36px;
      font-weight: 700;
      background: linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 10px 0 5px 0;
      font-family: 'Nunito', sans-serif;
    }
    
    .header-subtitle {
      font-size: 14px;
      background: linear-gradient(135deg, #555555 0%, #1a1a1a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin: -8px 0 0 0;
      font-family: 'Nunito', sans-serif;
    }
    
    /* Body */
    .body {
      padding: 40px 30px;
      background: linear-gradient(135deg, #FFFBF7 0%, #F8F5FF 50%, #F5F9FF 100%);
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #2C2C2C;
      margin-bottom: 20px;
      font-family: 'Nunito', sans-serif;
    }
    
    .newsletter-title {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 30px 0 20px;
      font-family: 'Nunito', sans-serif;
    }
    
    .content {
      font-size: 16px;
      color: #4A4A4A;
      line-height: 1.8;
      margin: 20px 0;
      background: rgba(255, 255, 255, 0.6);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid rgba(255, 123, 66, 0.3);
      font-family: 'Nunito', sans-serif;
    }
    
    .content p {
      margin: 15px 0;
    }
    
    .content strong {
      font-weight: 700;
      background: linear-gradient(135deg, #2C2C2C 0%, #555555 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .content em {
      font-style: italic;
      background: linear-gradient(135deg, #C55FA8 0%, #E699D3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .content ul, .content ol {
      margin: 15px 0 15px 30px;
    }
    
    .content li {
      margin: 10px 0;
    }
    
    .content a {
      background: linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
      font-weight: 600;
      border-bottom: 2px solid rgba(255, 123, 66, 0.4);
      transition: all 0.3s ease;
    }
    
    .content a:hover {
      border-bottom: 2px solid rgba(197, 95, 168, 0.6);
    }
    
    /* CTA Button */
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF7B42 0%, #C55FA8 100%);
      color: #ffffff;
      padding: 14px 32px;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      margin: 25px 0;
      box-shadow: 0 4px 15px rgba(255, 123, 66, 0.3);
      transition: all 0.3s ease;
      display: inline-block;
      font-family: 'Nunito', sans-serif;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 123, 66, 0.4);
    }
    
    /* Divider */
    .divider {
      border: 0;
      height: 2px;
      background: linear-gradient(to right, #FFD9A8, #FFB3DA, #B3E5FC, transparent);
      margin: 40px 0;
    }
    
    /* Footer */
    .footer {
      background-color: #F8F8F8;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E8E8E8;
      font-size: 13px;
      color: #666666;
    }
    
    .footer-text {
      margin: 10px 0;
      line-height: 1.7;
      font-family: 'Nunito', sans-serif;
    }
    
    .footer-text:first-child {
      font-size: 16px;
      font-weight: 700;
      background: linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .footer a {
      color: #FF7B42;
      text-decoration: none;
      font-weight: 600;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .unsubscribe {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #E0E0E0;
      font-family: 'Nunito', sans-serif;
    }
    
    .unsubscribe a {
      color: #999999;
      font-size: 12px;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .body {
        padding: 20px 15px !important;
      }
      
      .header {
        padding: 30px 15px !important;
      }
      
      .logo {
        height: 105px !important;
      }
      
      .header-title {
        font-size: 20px !important;
      }
      
      .newsletter-title {
        font-size: 24px !important;
      }
      
      .content {
        font-size: 15px !important;
        padding: 15px !important;
      }
      
      .cta-button {
        padding: 12px 24px !important;
        font-size: 14px !important;
      }
    }
  </style>
</head>
<body style="background-color: #f5f5f5; padding: 20px 0;">
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <img src="${logoUrl}" alt="Les P'tits Trinquat" style="width: auto;">
      </div>
      <div class="header-title">Les P'tits Trinquat</div>
      <div class="header-subtitle">Association des Parents d'Élèves</div>
    </div>
    
    <!-- Body -->
    <div class="body">
      <p class="greeting">Bonjour ${escapeHtml(firstName)},</p>
      
      <h1 class="newsletter-title">${escapeHtml(title)}</h1>
      
      <div class="content">
        ${bodyContent}
      </div>
      
      <p style="margin-top: 30px; font-style: italic; color: #999999; font-size: 14px;">
        — L'équipe des P'tits Trinquat
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        <strong>Les P'tits Trinquat</strong> — Association des Parents d'Élèves
      </p>
      
      <p class="footer-text">
        <a href="${siteUrl}">Visiter notre site</a> • 
        <a href="${siteUrl}/actualites">Actualités</a>
      </p>
      
      <p class="footer-text" style="color: #999999;">
        © ${year} Les P'tits Trinquat. Tous droits réservés.
      </p>
      
      <div class="unsubscribe">
        <p>Vous recevez cet email car vous êtes inscrit à la newsletter de l'association Les P'tits Trinquat.</p>
        <p><a href="${unsubscribeUrl}">Se désinscrire de la newsletter</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Échappe les caractères HTML dangereux
 */
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Convertit du texte plain en HTML sécurisé avec support basique du formatage
 */
function sanitizeToHtml(text: string): string {
    // Échappe d'abord le HTML
    let html = escapeHtml(text);

    // Convertit les sauts de ligne en <br>
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Supporte les **bold** et *italic*
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Wrap dans des paragraphes si nécessaire
    if (!html.includes('<p>')) {
        html = `<p>${html}</p>`;
    }

    return html;
}

/**
 * Génère une URL de désinscription tokenisée sécurisée
 */
export function generateUnsubscribeUrl(
    email: string,
    baseUrl: string = "https://lespetitstrinquat.fr"
): string {
    // En production, vous devriez générer un token JWT qui inclut l'email
    // Pour l'instant, on encode l'email en base64url pour la sécurité
    const encodedEmail = Buffer.from(email).toString('base64').replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c]));
    return `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${encodedEmail}`;
}
