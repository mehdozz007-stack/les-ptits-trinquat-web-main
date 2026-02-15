// ============================================================
// Email Verification Service - Les P'tits Trinquat API
// ============================================================

import type { Env } from '../types';

// ============================================================
// Interface pour la réponse Resend
// ============================================================
interface ResendResponse {
    id: string;
    from: string;
    to: string;
    created_at: string;
}

// ============================================================
// Envoyer un email de vérification OTP
// ============================================================
export async function sendVerificationEmail(
    env: Env,
    email: string,
    code: string,
): Promise<{ success: boolean; error?: string }> {
    if (!env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured');
        return { success: false, error: 'Email service not configured' };
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #333;
          margin: 0;
          font-size: 28px;
        }
        .content {
          color: #555;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 48px;
          font-weight: bold;
          color: white;
          letter-spacing: 8px;
          margin: 0;
          font-family: 'Courier New', monospace;
        }
        .otp-info {
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎁 Les P'tits Trinquat</h1>
          <p style="color: #999; margin: 5px 0;">Vérification Email</p>
        </div>

        <div class="content">
          <p>Bonjour,</p>
          <p>Bienvenue dans la tombola des P'tits Trinquat ! Pour finaliser votre inscription, veuillez entrer le code de vérification ci-dessous :</p>

          <div class="otp-box">
            <p class="otp-code">${code}</p>
            <p class="otp-info">Ce code expire dans 10 minutes</p>
          </div>

          <div class="warning">
            <strong>⚠️ Important :</strong> Ne partagez pas ce code avec d'autres personnes. Les membres de l'équipe ne vous demanderont jamais ce code.
          </div>

          <p>Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email.</p>
          <p>Bon amusement avec la tombola ! 🎉</p>
        </div>

        <div class="footer">
          <p>© 2026 Les P'tits Trinquat. Tous droits réservés.</p>
          <p>Une école bienveillante et créative</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const plainText = `
Bonjour,

Bienvenue dans la tombola des P'tits Trinquat ! Votre code de vérification est :

${code}

Ce code expire dans 10 minutes.

Ne partagez pas ce code avec d'autres personnes. Si vous n'avez pas demandé cette vérification, ignorez cet email.

Bon amusement avec la tombola !

© 2026 Les P'tits Trinquat
  `.trim();

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Tombola <noreply@tombola.lespetitstrinquat.fr>',
                to: email,
                subject: `Votre code de vérification : ${code}`,
                html: htmlContent,
                text: plainText,
                reply_to: 'contact@lespetitstrinquat.fr',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Resend API error:', errorData);
            return { success: false, error: 'Failed to send verification email' };
        }

        const data = (await response.json()) as ResendResponse;
        console.log(`Verification email sent to ${email} (ID: ${data.id})`);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
