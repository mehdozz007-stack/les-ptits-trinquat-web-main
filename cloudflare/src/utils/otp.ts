// ============================================================
// OTP Generation & Hashing - Les P'tits Trinquat API
// ============================================================

// ============================================================
// Générer un code OTP 6 chiffres cryptographiquement sécurisé
// ============================================================
export function generateOtpCode(): string {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);
    const number = (array[0] << 16) | (array[1] << 8) | array[2];
    const code = (number % 1000000).toString().padStart(6, '0');
    return code;
}

// ============================================================
// Hash un code OTP pour stockage sécurisé
// ============================================================
export async function hashOtpCode(code: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// Vérifier un code OTP contre un hash
// ============================================================
export async function verifyOtpCode(code: string, hash: string): Promise<boolean> {
    const codeHash = await hashOtpCode(code);
    return codeHash === hash;
}

// ============================================================
// Calculer la date d'expiration (10 minutes par défaut)
// ============================================================
export function calculateOtpExpiration(expirationMinutes: number = 10): string {
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    return expiresAt.toISOString();
}
