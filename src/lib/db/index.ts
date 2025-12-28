/**
 * Database exports
 * Point d'entrée centralisé pour tous les services BD
 */

export { prisma, default as prismaDefault } from "./prisma";
export * as parentService from "./parentService";
export * as lotService from "./lotService";
export type { Parent, Lot, LotStatus } from "@prisma/client";
