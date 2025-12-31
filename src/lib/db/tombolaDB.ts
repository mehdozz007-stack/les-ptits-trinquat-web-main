/**
 * IndexedDB Service for persisting Tombola data
 * Works in incognito mode (per-tab persistence)
 */

import { Parent, Lot } from "../types";

const DB_NAME = "TombolaDB";
const DB_VERSION = 1;
const PARENTS_STORE = "parents";
const LOTS_STORE = "lots";

let db: IDBDatabase | null = null;

async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create parents store
      if (!database.objectStoreNames.contains(PARENTS_STORE)) {
        const parentsStore = database.createObjectStore(PARENTS_STORE, { keyPath: "id" });
        parentsStore.createIndex("email", "email", { unique: false });
      }

      // Create lots store
      if (!database.objectStoreNames.contains(LOTS_STORE)) {
        const lotsStore = database.createObjectStore(LOTS_STORE, { keyPath: "id" });
        lotsStore.createIndex("parentId", "parentId", { unique: false });
      }
    };
  });
}

export const TombolaDB = {
  // Parents operations
  async getParents(): Promise<Parent[]> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([PARENTS_STORE], "readonly");
      const store = transaction.objectStore(PARENTS_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  },

  async addParent(parent: Parent): Promise<Parent> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([PARENTS_STORE], "readwrite");
      const store = transaction.objectStore(PARENTS_STORE);
      const request = store.add(parent);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(parent);
    });
  },

  async updateParent(parent: Parent): Promise<Parent> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([PARENTS_STORE], "readwrite");
      const store = transaction.objectStore(PARENTS_STORE);
      const request = store.put(parent);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(parent);
    });
  },

  async deleteParent(id: string): Promise<void> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([PARENTS_STORE], "readwrite");
      const store = transaction.objectStore(PARENTS_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },

  // Lots operations
  async getLots(): Promise<Lot[]> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([LOTS_STORE], "readonly");
      const store = transaction.objectStore(LOTS_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  },

  async addLot(lot: Lot): Promise<Lot> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([LOTS_STORE], "readwrite");
      const store = transaction.objectStore(LOTS_STORE);
      const request = store.add(lot);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(lot);
    });
  },

  async updateLot(lot: Lot): Promise<Lot> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([LOTS_STORE], "readwrite");
      const store = transaction.objectStore(LOTS_STORE);
      const request = store.put(lot);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(lot);
    });
  },

  async deleteLot(id: string): Promise<void> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([LOTS_STORE], "readwrite");
      const store = transaction.objectStore(LOTS_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },

  async getLotsByParent(parentId: string): Promise<Lot[]> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([LOTS_STORE], "readonly");
      const store = transaction.objectStore(LOTS_STORE);
      const index = store.index("parentId");
      const request = index.getAll(parentId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  },

  async clearAll(): Promise<void> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([PARENTS_STORE, LOTS_STORE], "readwrite");
      const parentsRequest = transaction.objectStore(PARENTS_STORE).clear();
      const lotsRequest = transaction.objectStore(LOTS_STORE).clear();

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  },
};
