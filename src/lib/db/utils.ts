/**
 * Utilitaires sécurité pour l'accès à la base de données
 * - Récupération sécurisée des emails (privés)
 * - Validation des données
 * - Gestion des erreurs
 */

import { prisma } from "./prisma";

/**
 * Récupérer l'email d'un parent de manière sécurisée
 * À utiliser UNIQUEMENT côté serveur / API
 * Jamais exposer cet email côté frontend
 */
export async function getSecureParentEmail(parentId: string): Promise<{
  email: string;
  firstName: string;
}> {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      email: true,
      firstName: true,
    },
  });

  if (!parent) {
    throw new Error(`Parent not found: ${parentId}`);
  }

  return parent;
}

/**
 * Récupérer les détails d'un lot avec l'email du propriétaire
 * À utiliser UNIQUEMENT côté serveur / API
 */
export async function getLotWithOwnerEmail(lotId: string) {
  const lot = await prisma.lot.findUnique({
    where: { id: lotId },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          emoji: true,
          email: true,
        },
      },
      reservedBy: {
        select: {
          id: true,
          firstName: true,
          emoji: true,
        },
      },
    },
  });

  if (!lot) {
    throw new Error(`Lot not found: ${lotId}`);
  }

  return lot;
}

/**
 * Valider une adresse email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider les données d'un nouveau parent
 */
export function validateParentData(data: {
  firstName?: string;
  email?: string;
  emoji?: string;
  role?: string;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push("Le prénom doit contenir au moins 2 caractères");
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("L'email n'est pas valide");
  }

  if (!data.emoji || data.emoji.length === 0) {
    errors.push("Un emoji doit être sélectionné");
  }

  if (!data.role || data.role.trim().length < 2) {
    errors.push("Le rôle doit être spécifié");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valider les données d'un nouveau lot
 */
export function validateLotData(data: {
  title?: string;
  icon?: string;
  ownerId?: string;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push("Le titre du lot doit contenir au moins 3 caractères");
  }

  if (!data.icon || data.icon.length === 0) {
    errors.push("Un emoji doit être sélectionné pour le lot");
  }

  if (!data.ownerId) {
    errors.push("Le propriétaire du lot doit être spécifié");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Vérifier si un parent peut réserver un lot
 */
export async function canParentReserveLot(
  parentId: string,
  lotId: string
): Promise<{
  canReserve: boolean;
  reason?: string;
}> {
  const lot = await prisma.lot.findUnique({
    where: { id: lotId },
  });

  if (!lot) {
    return {
      canReserve: false,
      reason: "Le lot n'existe pas",
    };
  }

  if (lot.ownerId === parentId) {
    return {
      canReserve: false,
      reason: "Vous ne pouvez pas réserver votre propre lot",
    };
  }

  if (lot.status !== "AVAILABLE") {
    return {
      canReserve: false,
      reason: "Ce lot n'est pas disponible pour réservation",
    };
  }

  if (lot.reservedById) {
    return {
      canReserve: false,
      reason: "Ce lot a déjà été réservé par quelqu'un d'autre",
    };
  }

  return {
    canReserve: true,
  };
}
