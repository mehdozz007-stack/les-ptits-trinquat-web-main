/**
 * Password Reset Email Service
 * Sends secure password reset emails using Resend API
 */

import type { Env } from '../types';

/**
 * Send a password reset email with secure token link
 * The frontend should have a route like /reset-password?token=TOKEN
 * In development mode, logs the token to console instead of sending email
 */
export async function sendPasswordResetEmail(
    env: Env,
    email: string,
    resetToken: string,
    frontendUrl: string = 'https://lespetitstrinquat.fr'
): Promise<{ success: boolean; error?: string }> {
    try {
        const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

        // Development mode: log token instead of sending
        if (env.ENVIRONMENT === 'development' || !env.RESEND_API_KEY) {
            console.log('='.repeat(60));
            console.log('PASSWORD RESET EMAIL (DEV MODE)');
            console.log('='.repeat(60));
            console.log(`To: ${email}`);
            console.log(`Reset Link: ${resetLink}`);
            console.log(`Token: ${resetToken}`);
            console.log('='.repeat(60));
            return { success: true };
        }

        // Production: send via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'support@lespetitstrinquat.fr',
                to: email,
                subject: 'Réinitialisez votre mot de passe - Les P\'tits Trinquat',
                html: generatePasswordResetEmailHTML(resetLink),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Resend API error:', errorData);
            throw new Error(`Resend API error: ${response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
        console.error('Error sending password reset email:', errorMessage);
        return {
            success: false,
            error: 'Impossible d\'envoyer l\'email de réinitialisation. Veuillez réessayer.',
        };
    }
}

/**
 * Generate HTML email template for password reset
 */
function generatePasswordResetEmailHTML(resetLink: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #f9f7f4; padding: 20px; }
    .card { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { color: #b85c1e; margin: 0; font-size: 24px; }
    .content { color: #333; line-height: 1.6; margin: 20px 0; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { 
      display: inline-block; 
      background: linear-gradient(to right, #b85c1e, #d97a3f);
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 6px;
      font-weight: 600;
    }
    .button:hover { opacity: 0.9; }
    .warning { 
      background: #fff3cd; 
      border: 1px solid #ffc107; 
      color: #856404;
      padding: 12px;
      border-radius: 4px;
      margin: 20px 0;
      font-size: 13px;
    }
    .footer { 
      text-align: center; 
      color: #666; 
      font-size: 12px; 
      margin-top: 20px; 
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>🎈 Les P'tits Trinquat</h1>
        <p style="color: #666; margin: 5px 0;">Réinitialisation de mot de passe</p>
      </div>

      <div class="content">
        <p>Bonjour,</p>
        <p>Vous avez demandé une réinitialisation de votre mot de passe pour la Tombola des P'tits Trinquat.</p>
        
        <div class="button-container">
          <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
        </div>

        <p>Ou copiez ce lien dans votre navigateur:</p>
        <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
          ${resetLink}
        </p>

        <div class="warning">
          ⚠️ <strong>Attention :</strong> Ce lien expire dans 15 minutes. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
        </div>

        <p>Pour des raisons de sécurité, nous ne partagerons jamais votre mot de passe par email.</p>
      </div>

      <div class="footer">
        <p>© 2025 Les P'tits Trinquat - Tombola</p>
        <p>Vous recevez cet email car vous avez demandé une réinitialisation de mot de passe.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}
