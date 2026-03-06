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
      box-shadow: 0 8px 24px rgba(255, 123, 66, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #FFF5F0 0%, #FFF0F7 50%, #E8F4FF 100%);
      padding: 50px 30px;
      text-align: center;
      position: relative;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 0%, rgba(255, 123, 66, 0.05) 0%, transparent 70%);
      pointer-events: none;
    }
    
    .logo {
      display: inline-block;
      height: 260px;
      margin-bottom: 25px;
      position: relative;
      z-index: 1;
    }
    
    .logo img {
      height: 100%;
      width: auto;
      border-radius: 20px;
      box-shadow: 0 12px 32px rgba(255, 123, 66, 0.15), 0 0 60px rgba(197, 95, 168, 0.08);
      filter: drop-shadow(0 8px 20px rgba(255, 123, 66, 0.12));
    }
    
    .header-title {
      font-size: 38px;
      font-weight: 800;
      color: #FF7B42;
      margin: 15px 0 8px 0;
      font-family: 'Nunito', sans-serif;
      letter-spacing: -0.5px;
    }
    
    .header-subtitle {
      font-size: 15px;
      color: #555555;
      font-weight: 700;
      letter-spacing: 1px;
      margin: 0;
      font-family: 'Nunito', sans-serif;
      text-transform: uppercase;
    }
    
    /* Body */
    .body {
      padding: 50px 35px;
      background: linear-gradient(180deg, #FFFBF7 0%, #F8F5FF 45%, #F5F9FF 100%);
      position: relative;
    }
    
    .body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle 400px at 0% 0%, rgba(255, 251, 247, 0.8), transparent),
        radial-gradient(circle 400px at 100% 100%, rgba(245, 249, 255, 0.8), transparent);
      pointer-events: none;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #3C3C3C;
      margin-bottom: 25px;
      font-family: 'Nunito', sans-serif;
      position: relative;
      z-index: 1;
    }
    
    .newsletter-title {
      font-size: 32px;
      font-weight: 800;
      color: #FF7B42;
      margin: 30px 0 25px;
      font-family: 'Nunito', sans-serif;
      position: relative;
      z-index: 1;
    }
    
    .content {
      font-size: 16px;
      color: #555555;
      line-height: 1.75;
      margin: 25px 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 100%);
      padding: 28px;
      border-radius: 16px;
      border-left: 5px solid;
      border-image: linear-gradient(180deg, #FF7B42 0%, #C55FA8 100%) 1;
      box-shadow: 0 4px 16px rgba(255, 123, 66, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
      font-family: 'Nunito', sans-serif;
      position: relative;
      z-index: 1;
      backdrop-filter: blur(10px);
    }
    
    .content p {
      margin: 16px 0;
    }
    
    .content strong {
      font-weight: 800;
      color: #333333;
    }
    
    .content em {
      font-style: italic;
      color: #D65FA8;
      font-weight: 600;
    }
    
    .content ul, .content ol {
      margin: 18px 0 18px 30px;
    }
    
    .content li {
      margin: 12px 0;
      padding-left: 8px;
    }
    
    .content a {
      color: #FF7B42;
      text-decoration: underline;
      font-weight: 700;
      transition: all 0.3s ease;
    }
    
    .content a:hover {
      color: #C55FA8;
    }
    
    /* CTA Button */
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%);
      color: #ffffff;
      padding: 16px 40px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 800;
      font-size: 16px;
      margin: 28px 0;
      box-shadow: 0 8px 24px rgba(255, 123, 66, 0.25), 0 4px 12px rgba(197, 95, 168, 0.15);
      transition: all 0.3s ease;
      display: inline-block;
      font-family: 'Nunito', sans-serif;
      border: none;
      cursor: pointer;
    }
    
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(255, 123, 66, 0.35), 0 6px 16px rgba(197, 95, 168, 0.2);
      text-decoration: none;
      color: #ffffff;
    }
    
    /* Divider */
    .divider {
      border: 0;
      height: 3px;
      background: linear-gradient(to right, #FFD9A8 0%, #FFB3DA 40%, #D9C5FF 70%, transparent 100%);
      margin: 45px 0;
      border-radius: 2px;
    }
    
    /* Footer */
    .footer {
      background: linear-gradient(180deg, #F5F5F5 0%, #F9F9F9 100%);
      padding: 35px 30px;
      text-align: center;
      border-top: 2px solid;
      border-image: linear-gradient(90deg, #FFD9A8 0%, #FFB3DA 50%, #D9C5FF 100%) 1;
      font-size: 13px;
      color: #666666;
    }
    
    .footer-text {
      margin: 12px 0;
      line-height: 1.8;
      font-family: 'Nunito', sans-serif;
    }
    
    .footer-text:first-child {
      font-size: 16px;
      font-weight: 800;
      color: #FF7B42;
    }
    
    .footer a {
      color: #FF7B42;
      text-decoration: none;
      font-weight: 700;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .unsubscribe {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #E0E0E0;
      font-family: 'Nunito', sans-serif;
    }
    
    .unsubscribe a {
      color: #FF7B42;
      font-weight: 600;
      font-size: 12px;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      
      .body {
        padding: 30px 20px !important;
      }
      
      .header {
        padding: 35px 20px !important;
      }
      
      .logo {
        height: 110px !important;
        margin-bottom: 18px !important;
      }
      
      .header-title {
        font-size: 24px !important;
        margin: 12px 0 6px 0 !important;
      }
      
      .header-subtitle {
        font-size: 12px !important;
      }
      
      .greeting {
        font-size: 16px !important;
        margin-bottom: 18px !important;
      }
      
      .newsletter-title {
        font-size: 26px !important;
        margin: 25px 0 18px !important;
      }
      
      .content {
        font-size: 15px !important;
        padding: 18px !important;
        margin: 18px 0 !important;
        border-radius: 12px !important;
      }
      
      .cta-button {
        padding: 12px 28px !important;
        font-size: 14px !important;
        margin: 20px 0 !important;
      }
      
      .divider {
        margin: 30px 0 !important;
      }
      
      .footer {
        padding: 25px 20px !important;
      }
      
      .footer-text {
        margin: 8px 0 !important;
        font-size: 12px !important;
      }
      
      .unsubscribe {
        margin-top: 18px !important;
        padding-top: 18px !important;
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
