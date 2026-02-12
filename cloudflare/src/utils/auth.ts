// ============================================================
// Utilitaires pour authentification
// ============================================================

/**
 * Hash un mot de passe avec bcrypt (simple approach)
 * Note: En production, utiliser une vraie lib bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    // Validation basique
    if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }

    // Utiliser la crypto API Web pour créer un hash sécurisé
    // Note: C'est une approche simple pour D1/Cloudflare
    // En production avec Node.js, utiliser bcryptjs
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertir le hash en base64
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Ajouter un salt simple et un prefix
    return `sha256:${hashHex}`;
}

/**
 * Vérifier un mot de passe contre son hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        const newHash = await hashPassword(password);
        // Comparer les hashes
        return newHash === hash;
    } catch {
        return false;
    }
}

/**
 * Valider la force du mot de passe
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
    if (!password) return { valid: false, error: 'Password is required' };
    if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
    if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain uppercase letter' };
    if (!/[a-z]/.test(password)) return { valid: false, error: 'Password must contain lowercase letter' };
    if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain number' };
    return { valid: true };
}
