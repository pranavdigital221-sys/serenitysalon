import fs from 'fs';
import path from 'path';
import { ProductOrderItem } from '../types';
import { PRODUCTS } from '../data/mockData';

const DATA_DIR = path.join(process.cwd(), 'data');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');

export interface ProductInventoryRecord {
  productId: string;
  sku?: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

export interface InventoryLogEntry {
  orderId: string;
  productId: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  timestamp: string;
}

interface InventoryDatabase {
  items: Record<string, ProductInventoryRecord>;
  processedOrders: string[];
  logs: InventoryLogEntry[];
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initInventoryStore(): InventoryDatabase {
  ensureDataDir();

  if (fs.existsSync(INVENTORY_FILE)) {
    try {
      const content = fs.readFileSync(INVENTORY_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.items) {
        return parsed as InventoryDatabase;
      }
    } catch (err) {
      console.error('[INVENTORY] Error reading inventory file, re-initializing:', err);
    }
  }

  // Seed initial inventory from product catalog with realistic salon retail quantities
  const initialItems: Record<string, ProductInventoryRecord> = {};
  for (const product of PRODUCTS) {
    initialItems[product.id] = {
      productId: product.id,
      sku: product.sku || product.id,
      name: product.name,
      stock: 45, // default retail units per SKU
      lowStockThreshold: 5,
      lastUpdated: new Date().toISOString(),
    };
  }

  const initialDb: InventoryDatabase = {
    items: initialItems,
    processedOrders: [],
    logs: [],
  };

  try {
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[INVENTORY] Error initializing inventory file:', err);
  }

  return initialDb;
}

function saveInventoryStore(db: InventoryDatabase): void {
  ensureDataDir();
  const tempFile = `${INVENTORY_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, INVENTORY_FILE);
}

/**
 * Atomically deducts inventory stock for confirmed/paid order items.
 * Idempotent: safe against duplicate webhook or API invocations.
 */
export function reduceInventoryAtomically(
  items: ProductOrderItem[],
  orderId: string
): { success: boolean; deducted: boolean; error?: string } {
  if (!items || items.length === 0) {
    return { success: true, deducted: false };
  }

  try {
    const db = initInventoryStore();

    // Idempotency: skip if this order has already had its inventory deducted
    if (db.processedOrders.includes(orderId)) {
      console.log(`[INVENTORY] Order ${orderId} inventory already deducted. Skipping.`);
      return { success: true, deducted: false };
    }

    const now = new Date().toISOString();

    for (const item of items) {
      const pId = item.productId || (item as any).id;
      if (!pId) continue;

      let record = db.items[pId];
      if (!record) {
        // Fallback: match by product name if ID differs
        const matchingKey = Object.keys(db.items).find(
          (k) => db.items[k].name.toLowerCase() === item.name.toLowerCase()
        );
        if (matchingKey) {
          record = db.items[matchingKey];
        } else {
          // Create entry
          record = {
            productId: pId,
            name: item.name,
            stock: 30,
            lowStockThreshold: 5,
            lastUpdated: now,
          };
          db.items[pId] = record;
        }
      }

      const qty = Number(item.quantity) || 1;
      const prevStock = record.stock;
      const newStock = Math.max(0, prevStock - qty);

      record.stock = newStock;
      record.lastUpdated = now;

      db.logs.push({
        orderId,
        productId: record.productId,
        quantity: qty,
        previousStock: prevStock,
        newStock,
        timestamp: now,
      });

      console.log(
        `[INVENTORY ATOMIC REDUCTION] Order ${orderId}: ${record.name} stock reduced from ${prevStock} to ${newStock} (-${qty})`
      );
    }

    db.processedOrders.push(orderId);

    // Keep log size manageable
    if (db.logs.length > 1000) {
      db.logs = db.logs.slice(-500);
    }

    saveInventoryStore(db);
    return { success: true, deducted: true };
  } catch (err: any) {
    console.error(`[INVENTORY ATOMIC REDUCTION ERROR] Order ${orderId}:`, err);
    return { success: false, deducted: false, error: err.message };
  }
}

/**
 * Checks if stock is available for the requested order items
 */
export function checkInventoryStock(items: ProductOrderItem[]): {
  isAvailable: boolean;
  unavailableItems: Array<{ name: string; requested: number; available: number }>;
} {
  const db = initInventoryStore();
  const unavailable: Array<{ name: string; requested: number; available: number }> = [];

  for (const item of items) {
    const pId = item.productId || (item as any).id;
    if (!pId) continue;

    const record = db.items[pId];
    const qty = Number(item.quantity) || 1;

    if (record && record.stock < qty) {
      unavailable.push({
        name: record.name,
        requested: qty,
        available: record.stock,
      });
    }
  }

  return {
    isAvailable: unavailable.length === 0,
    unavailableItems: unavailable,
  };
}

/**
 * Retrieves the current inventory snapshot
 */
export function getInventorySnapshot(): Record<string, ProductInventoryRecord> {
  const db = initInventoryStore();
  return { ...db.items };
}
