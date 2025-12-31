/**
 * Hybrid Storage Service - Sync between Server API and IndexedDB
 * Server is the source of truth, IndexedDB is the local cache
 */

import { Parent, Lot } from "../types";
import { TombolaDB } from "./tombolaDB";

const API_BASE = "/api";

export const HybridStorage = {
  /**
   * Load data from server first, fallback to IndexedDB cache
   */
  async loadData(): Promise<{ parents: Parent[]; lots: Lot[] }> {
    try {
      // Try to get from server first
      const response = await fetch(`${API_BASE}/data`);
      if (response.ok) {
        const data = await response.json();
        // Cache in IndexedDB
        await TombolaDB.clearAll();
        for (const parent of data.parents) {
          await TombolaDB.addParent(parent);
        }
        for (const lot of data.lots) {
          await TombolaDB.addLot(lot);
        }
        return data;
      }
    } catch (error) {
      console.warn("Server unavailable, using IndexedDB cache:", error);
    }

    // Fallback to IndexedDB cache
    const parents = await TombolaDB.getParents();
    const lots = await TombolaDB.getLots();
    return { parents, lots };
  },

  /**
   * Create parent on server and cache locally
   */
  async createParent(parent: Omit<Parent, "id">): Promise<Parent | null> {
    try {
      const response = await fetch(`${API_BASE}/parents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parent),
      });

      if (response.ok) {
        const newParent = await response.json();
        await TombolaDB.addParent(newParent);
        return newParent;
      }
    } catch (error) {
      console.error("Error creating parent:", error);
    }

    return null;
  },

  /**
   * Update parent on server and cache
   */
  async updateParent(id: string, parent: Partial<Parent>): Promise<Parent | null> {
    try {
      const response = await fetch(`${API_BASE}/parents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parent),
      });

      if (response.ok) {
        const updated = await response.json();
        await TombolaDB.updateParent(updated);
        return updated;
      }
    } catch (error) {
      console.error("Error updating parent:", error);
    }

    return null;
  },

  /**
   * Delete parent from server and cache
   */
  async deleteParent(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/parents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await TombolaDB.deleteParent(id);
        return true;
      }
    } catch (error) {
      console.error("Error deleting parent:", error);
    }

    return false;
  },

  /**
   * Create lot on server and cache locally
   */
  async createLot(lot: Omit<Lot, "id">): Promise<Lot | null> {
    try {
      const response = await fetch(`${API_BASE}/lots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lot),
      });

      if (response.ok) {
        const newLot = await response.json();
        await TombolaDB.addLot(newLot);
        return newLot;
      }
    } catch (error) {
      console.error("Error creating lot:", error);
    }

    return null;
  },

  /**
   * Update lot on server and cache
   */
  async updateLot(id: string, lot: Partial<Lot>): Promise<Lot | null> {
    try {
      const response = await fetch(`${API_BASE}/lots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lot),
      });

      if (response.ok) {
        const updated = await response.json();
        await TombolaDB.updateLot(updated);
        return updated;
      }
    } catch (error) {
      console.error("Error updating lot:", error);
    }

    return null;
  },

  /**
   * Delete lot from server and cache
   */
  async deleteLot(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/lots/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await TombolaDB.deleteLot(id);
        return true;
      }
    } catch (error) {
      console.error("Error deleting lot:", error);
    }

    return false;
  },
};
