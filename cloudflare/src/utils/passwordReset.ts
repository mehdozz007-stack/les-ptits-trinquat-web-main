/**
 * Password Reset Token Utilities
 * Provides secure token generation, hashing, verification, and management
 * for password reset functionality
 */

/**
 * Generate a cryptographically secure password reset token
 * Uses URL-safe base64 encoding (48 random bytes = 64 base64 characters)
 */
export function generateResetToken(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(48));
    return btoa(String.fromCharCode(...randomBytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Hash a reset token using SHA-256
 * Stores only the hash in the database for security
 */
export async function hashResetToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a reset token against its stored hash
 */
export async function verifyResetToken(token: string, storedHash: string): Promise<boolean> {
    try {
        const tokenHash = await hashResetToken(token);
        return tokenHash === storedHash;
    } catch {
        return false;
    }
}

/**
 * Calculate token expiration timestamp (15 minutes from now)
 * Returns unix timestamp in seconds
 */
export function calculateResetTokenExpiration(): number {
    const now = Math.floor(Date.now() / 1000);
    const expirationMinutes = 15;
    return now + expirationMinutes * 60;
}

/**
 * Generate a unique token ID (for database primary key)
 * Format: reset_<timestamp>_<random>
 */
export function generateResetTokenId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `reset_${timestamp}_${random}`;
}
