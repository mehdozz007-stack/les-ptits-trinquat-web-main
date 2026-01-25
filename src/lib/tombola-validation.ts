/**
 * Validation et règles métier pour la Tombola
 * Centralise toute la logique de sécurité et cohérence des données
 */

/**
 * Regex pour valider un email (RFC 5322 simplifié)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TombolaValidation = {
  /**
   * Valide un email
   */
  isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email.trim());
  },

  /**
   * Valide un prénom (non vide, pas trop court)
   */
  isValidPrenom(prenom: string): boolean {
    const trimmed = prenom.trim();
    return trimmed.length >= 2 && trimmed.length <= 50;
  },

  /**
   * Valide un emoji (chaîne non-vide, généralement 1-2 caractères)
   */
  isValidEmoji(emoji: string): boolean {
    return emoji.length > 0 && emoji.length <= 4;
  },

  /**
   * Valide un titre de lot
   */
  isValidLotTitle(title: string): boolean {
    const trimmed = title.trim();
    return trimmed.length >= 3 && trimmed.length <= 100;
  },

  /**
   * Valide une description de lot (optionnelle)
   */
  isValidLotDescription(description: string | undefined): boolean {
    if (!description) return true; // Optionnel
    const trimmed = description.trim();
    return trimmed.length <= 500;
  },

  /**
   * Valide les données d'inscription parent (complet)
   */
  validateParentRegistration(data: {
    prenom: string;
    email: string;
    emoji: string;
    role?: string;
    classes?: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidPrenom(data.prenom)) {
      errors.push("Le prénom doit contenir entre 2 et 50 caractères");
    }

    if (!this.isValidEmail(data.email)) {
      errors.push("L'email n'est pas valide");
    }

    if (!this.isValidEmoji(data.emoji)) {
      errors.push("L'emoji n'est pas valide");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Valide les données de création d'un lot
   */
  validateLotCreation(data: {
    nom: string;
    description?: string;
    emoji: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidLotTitle(data.nom)) {
      errors.push("Le nom du lot doit contenir entre 3 et 100 caractères");
    }

    if (!this.isValidLotDescription(data.description)) {
      errors.push("La description ne doit pas dépasser 500 caractères");
    }

    if (!this.isValidEmoji(data.emoji)) {
      errors.push("L'emoji n'est pas valide");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Vérifie qu'il n'existe pas de doublon email
   */
  checkEmailDuplicate(
    email: string,
    existingParents: Array<{ email: string }>
  ): boolean {
    return existingParents.some((p) => p.email.toLowerCase() === email.toLowerCase());
  },

  /**
   * Vérifie qu'un parent existe par ID
   */
  parentExists(parentId: string | null, parents: Array<{ id: string }>): boolean {
    if (!parentId) return false;
    return parents.some((p) => p.id === parentId);
  },

  /**
   * Vérifie qu'aucun lot orphelin n'existe
   * (lot sans parent valide)
   */
  checkForOrphanLots(
    lots: Array<{ id: string; parentId: string }>,
    parents: Array<{ id: string }>
  ): { isValid: boolean; orphanLots: string[] } {
    const parentIds = new Set(parents.map((p) => p.id));
    const orphanLots = lots
      .filter((lot) => !parentIds.has(lot.parentId))
      .map((lot) => lot.id);

    return {
      isValid: orphanLots.length === 0,
      orphanLots,
    };
  },

  /**
   * Empêche la réservation d'un lot par son propriétaire
   */
  canReserveLot(lotOwnerId: string, reserverId: string): boolean {
    return lotOwnerId !== reserverId;
  },

  /**
   * Récupère tous les lots associés à un parent
   */
  getParentLots(
    parentId: string,
    lots: Array<{ id: string; parentId: string }>
  ): string[] {
    return lots.filter((lot) => lot.parentId === parentId).map((lot) => lot.id);
  },
};

export default TombolaValidation;
