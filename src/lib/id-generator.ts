/**
 * Génère un ID unique (UUID v4)
 */
export function generateId(): string {
    return crypto.randomUUID();
}
