/**
 * Services pour gérer les parents
 * - Créer/lister/récupérer des parents
 * - Récupérer l'email en privé
 */

import { prisma } from "./prisma";
import { Parent } from "@prisma/client";

/**
 * Créer un nouveau parent
 */
export async function createParent(data: {
  firstName: string;
  emoji: string;
  role: string;
  classes?: string;
  email: string;
}): Promise<Parent> {
  return prisma.parent.create({
    data,
  });
}

/**
 * Récupérer tous les parents (sans email exposé)
 */
export async function getAllParents() {
  return prisma.parent.findMany({
    select: {
      id: true,
      firstName: true,
      emoji: true,
      role: true,
      classes: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Récupérer un parent spécifique par ID (avec email pour contact privé)
 */
export async function getParentById(id: string): Promise<Parent | null> {
  return prisma.parent.findUnique({
    where: { id },
  });
}

/**
 * Récupérer l'email d'un parent (accès privé uniquement)
 * À utiliser côté serveur/API uniquement
 */
export async function getParentEmail(parentId: string): Promise<string | null> {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: { email: true },
  });
  return parent?.email || null;
}

/**
 * Mettre à jour un parent
 */
export async function updateParent(
  id: string,
  data: Partial<{
    firstName: string;
    emoji: string;
    role: string;
    classes: string;
    email: string;
  }>
): Promise<Parent> {
  return prisma.parent.update({
    where: { id },
    data,
  });
}

/**
 * Supprimer un parent (et ses lots en cascade)
 */
export async function deleteParent(id: string): Promise<Parent> {
  return prisma.parent.delete({
    where: { id },
  });
}
