/**
 * Services pour gérer les lots de tombola
 * - Créer/lister/mettre à jour/supprimer des lots
 * - Réserver un lot
 * - Gérer les statuts
 */

import { prisma } from "./prisma";
import type { Lot, LotStatus } from "../../../generated/prisma";

/**
 * Créer un nouveau lot
 */
export async function createLot(data: {
  title: string;
  description?: string;
  icon: string;
  ownerId: string;
}): Promise<Lot> {
  return prisma.lot.create({
    data,
  });
}

/**
 * Récupérer tous les lots avec infos du propriétaire (email caché)
 */
export async function getAllLots() {
  return prisma.lot.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      status: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          firstName: true,
          emoji: true,
          email: true, // À utiliser avec caution - ne jamais afficher en UI
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
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Récupérer les lots d'un parent spécifique
 */
export async function getParentLots(ownerId: string) {
  return prisma.lot.findMany({
    where: { ownerId },
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      status: true,
      createdAt: true,
      reservedBy: {
        select: {
          id: true,
          firstName: true,
          emoji: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Récupérer les lots réservés par un parent
 */
export async function getParentReservedLots(reservedById: string) {
  return prisma.lot.findMany({
    where: { reservedById },
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      status: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          firstName: true,
          emoji: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Récupérer les lots disponibles uniquement
 */
export async function getAvailableLots() {
  return prisma.lot.findMany({
    where: { status: "AVAILABLE" },
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          firstName: true,
          emoji: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Réserver un lot (changer le statut et attribuer le parent)
 */
export async function reserveLot(
  lotId: string,
  reservedById: string
): Promise<Lot> {
  return prisma.lot.update({
    where: { id: lotId },
    data: {
      status: "RESERVED",
      reservedById,
    },
  });
}

/**
 * Marquer un lot comme remis
 */
export async function markLotAsGiven(lotId: string): Promise<Lot> {
  return prisma.lot.update({
    where: { id: lotId },
    data: {
      status: "GIVEN",
    },
  });
}

/**
 * Annuler la réservation d'un lot
 */
export async function cancelLotReservation(lotId: string): Promise<Lot> {
  return prisma.lot.update({
    where: { id: lotId },
    data: {
      status: "AVAILABLE",
      reservedById: null,
    },
  });
}

/**
 * Mettre à jour un lot
 */
export async function updateLot(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    icon: string;
  }>
): Promise<Lot> {
  return prisma.lot.update({
    where: { id },
    data,
  });
}

/**
 * Supprimer un lot
 */
export async function deleteLot(id: string): Promise<Lot> {
  return prisma.lot.delete({
    where: { id },
  });
}

/**
 * Récupérer les stats des lots
 */
export async function getLotStats() {
  const total = await prisma.lot.count();
  const available = await prisma.lot.count({
    where: { status: "AVAILABLE" },
  });
  const reserved = await prisma.lot.count({
    where: { status: "RESERVED" },
  });
  const given = await prisma.lot.count({
    where: { status: "GIVEN" },
  });

  return {
    total,
    available,
    reserved,
    given,
  };
}
