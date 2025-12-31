/**
 * Service de sécurité - Contrôles d'accès et vérifications de propriété
 * Garantit que:
 * - Un parent ne peut agir que sur ses propres données
 * - Aucun lot orphelin n'existe
 * - Les droits d'action sont respectés
 */

import AuthService from "./authService";

export interface Parent {
  id: string;
  prenom: string;
  role: string;
  classes: string;
  emoji: string;
  email: string;
  createdAt?: string;
}

export interface Lot {
  id: string;
  nom: string;
  description: string;
  emoji: string;
  statut: "disponible" | "reserve" | "remis";
  parentId: string;
  parentPrenom: string;
  parentEmail: string;
  dateAjout: string;
}

class SecurityService {
  /**
   * Vérifier si le parent actuel peut effectuer une action sur ce lot
   * Retourne true seulement si le parentId actuel est le propriétaire
   */
  canModifyLot(lotId: string, lots: Lot[]): boolean {
    const lot = lots.find((l) => l.id === lotId);
    if (!lot) return false;

    const currentParentId = AuthService.getCurrentParentId();
    return currentParentId !== null && lot.parentId === currentParentId;
  }

  /**
   * Vérifier si le parent actuel peut supprimer ce parent
   * Un parent ne peut supprimer que lui-même
   */
  canDeleteParent(parentId: string): boolean {
    const currentParentId = AuthService.getCurrentParentId();
    return currentParentId !== null && parentId === currentParentId;
  }

  /**
   * Vérifier si un lot appartient au parent actuel
   */
  isOwnLot(lot: Lot): boolean {
    const currentParentId = AuthService.getCurrentParentId();
    return currentParentId !== null && lot.parentId === currentParentId;
  }

  /**
   * Obtenir les lots du parent actuel
   */
  getOwnLots(lots: Lot[]): Lot[] {
    const currentParentId = AuthService.getCurrentParentId();
    if (!currentParentId) return [];
    return lots.filter((lot) => lot.parentId === currentParentId);
  }

  /**
   * Obtenir les lots des autres parents
   */
  getOtherLots(lots: Lot[]): Lot[] {
    const currentParentId = AuthService.getCurrentParentId();
    if (!currentParentId) return lots; // Si pas connecté, voir tous les lots
    return lots.filter((lot) => lot.parentId !== currentParentId);
  }

  /**
   * Vérifier si le parent est authentifié
   */
  isAuthenticated(): boolean {
    return AuthService.isAuthenticated();
  }

  /**
   * Obtenir le parentId actuel
   */
  getCurrentParentId(): string | null {
    return AuthService.getCurrentParentId();
  }

  /**
   * Vérifier les droits de réservation
   * - Le parent doit être connecté
   * - Le parent ne peut pas réserver son propre lot
   * - Le lot doit être disponible
   */
  canReserveLot(lotId: string, lots: Lot[]): {
    allowed: boolean;
    reason: string;
  } {
    if (!AuthService.isAuthenticated()) {
      return { allowed: false, reason: "Vous devez être connecté pour réserver" };
    }

    const lot = lots.find((l) => l.id === lotId);
    if (!lot) {
      return { allowed: false, reason: "Ce lot n'existe pas" };
    }

    const currentParentId = AuthService.getCurrentParentId();
    if (currentParentId === lot.parentId) {
      return { allowed: false, reason: "Vous ne pouvez pas réserver votre propre lot" };
    }

    if (lot.statut !== "disponible") {
      return {
        allowed: false,
        reason: `Ce lot est ${lot.statut === "reserve" ? "déjà réservé" : "indisponible"}`,
      };
    }

    return { allowed: true, reason: "" };
  }

  /**
   * Vérifier la cohérence des données (pas d'orphelins)
   * Retourne les IDs des lots orphelins
   */
  findOrphanLots(lots: Lot[], parents: Parent[]): string[] {
    const parentIds = new Set(parents.map((p) => p.id));
    return lots.filter((lot) => !parentIds.has(lot.parentId)).map((l) => l.id);
  }

  /**
   * Nettoyer les lots orphelins
   */
  removeOrphanLots(lots: Lot[], parents: Parent[]): Lot[] {
    const parentIds = new Set(parents.map((p) => p.id));
    return lots.filter((lot) => parentIds.has(lot.parentId));
  }

  /**
   * Obtenir tous les lots d'un parent spécifique
   */
  getParentLots(parentId: string, lots: Lot[]): Lot[] {
    return lots.filter((lot) => lot.parentId === parentId);
  }

  /**
   * Vérifier que le parent actuel peut voir son profil
   */
  canViewParentProfile(parentId: string): boolean {
    const currentParentId = AuthService.getCurrentParentId();
    // Pour les profils: afficher le sien ET les autres (c'est public)
    // Mais seul le sien peut être modifié
    return true;
  }

  /**
   * Vérifier que le parent actuel peut modifier ce profil
   */
  canEditParentProfile(parentId: string): boolean {
    const currentParentId = AuthService.getCurrentParentId();
    return currentParentId !== null && parentId === currentParentId;
  }
}

export default new SecurityService();
