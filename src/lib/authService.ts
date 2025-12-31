/**
 * Service d'authentification simple (sans mot de passe)
 * Gère:
 * - La création d'un parentId unique à l'inscription
 * - La persistance du parentId actuel en localStorage
 * - La reconnexion automatique du parent
 * - La déconnexion
 */

export interface AuthSession {
  parentId: string;
  loginTime: string;
}

const STORAGE_KEY = "tombola_auth_session";

class AuthService {
  /**
   * Générer un parentId unique (UUID-like string)
   * Format: timestamp + random string
   */
  generateParentId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `parent_${timestamp}_${randomStr}`;
  }

  /**
   * Créer une nouvelle session après inscription
   * Sauvegarde le parentId et l'heure de connexion
   */
  createSession(parentId: string): AuthSession {
    const session: AuthSession = {
      parentId,
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  /**
   * Récupérer la session actuelle (parentId actuellement connecté)
   * Utilisé pour retrouver le parent au chargement de la page
   */
  getSession(): AuthSession | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored) as AuthSession;
    } catch {
      return null;
    }
  }

  /**
   * Vérifier si un parentId est actuellement connecté
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Récupérer le parentId du parent actuellement connecté
   */
  getCurrentParentId(): string | null {
    return this.getSession()?.parentId ?? null;
  }

  /**
   * Déconnecter le parent actuel
   * Supprime la session du localStorage
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Vérifier si un parentId correspond à la session actuelle
   * Utilisé pour vérifier les droits d'action
   */
  isOwnParent(parentId: string): boolean {
    const currentId = this.getCurrentParentId();
    return currentId !== null && currentId === parentId;
  }
}

export default new AuthService();
