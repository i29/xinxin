// ========================================
// Inventory System - Item Management
// ========================================

import { ITEMS, type ItemDef } from '../petData';
import { gameData, save, notify } from './store';
import { addJournalEntry } from './journal';
import { addExp, getActivePet } from './pets';

export interface InventoryItem {
  itemId: string;
  count: number;
}

/**
 * Add item to inventory
 */
export function addItem(itemId: string, count: number = 1) {
  const existing = gameData.inventory.find((i: InventoryItem) => i.itemId === itemId);
  if (existing) {
    existing.count += count;
  } else {
    gameData.inventory.push({ itemId, count });
  }
  save();
  notify();
}

/**
 * Remove item from inventory
 */
export function removeItem(itemId: string, count: number = 1) {
  const invItem = gameData.inventory.find((i: InventoryItem) => i.itemId === itemId);
  if (!invItem || invItem.count < count) return false;

  invItem.count -= count;
  if (invItem.count <= 0) {
    gameData.inventory = gameData.inventory.filter((i: InventoryItem) => i.itemId !== itemId);
  }
  save();
  notify();
  return true;
}

/**
 * Get item count in inventory
 */
export function getItemCount(itemId: string): number {
  const invItem = gameData.inventory.find((i: InventoryItem) => i.itemId === itemId);
  return invItem?.count ?? 0;
}

/**
 * Buy item from shop
 */
export function buyItem(itemId: string): boolean {
  const itemDef = ITEMS.find((i) => i.id === itemId);
  if (!itemDef || gameData.coins < itemDef.price) return false;

  gameData.coins -= itemDef.price;
  addItem(itemId, 1);
  return true;
}

/**
 * Use item and apply effects
 */
export function useItem(itemId: string): { success: boolean; levelUp: boolean; evolved: boolean } {
  const invItem = gameData.inventory.find((i: InventoryItem) => i.itemId === itemId);
  const pet = getActivePet();
  if (!invItem || invItem.count <= 0 || !pet) {
    return { success: false, levelUp: false, evolved: false };
  }

  const itemDef = ITEMS.find((i) => i.id === itemId);
  if (!itemDef) return { success: false, levelUp: false, evolved: false };

  // Consume item
  removeItem(itemId, 1);

  // Track usage
  gameData.stats.totalItemsUsed++;

  let levelUp = false;
  let evolved = false;

  // Apply item effects
  if (itemDef.stat === 'exp') {
    const result = addExp(itemDef.value);
    levelUp = result.levelUp;
    evolved = result.evolved;
  } else {
    const pet = getActivePet();
    if (pet) {
      switch (itemDef.stat) {
        case 'hunger':
          pet.hunger = Math.min(100, pet.hunger + itemDef.value);
          break;
        case 'happy':
          pet.happy = Math.min(100, pet.happy + itemDef.value);
          break;
        case 'clean':
          pet.clean = Math.min(100, pet.clean + itemDef.value);
          break;
      }
      addJournalEntry(
        'milestone',
        '细心照料',
        `给宠物使用了 ${itemDef.emoji} ${itemDef.name}，状态得到了提升。`,
        { itemId: itemId }
      );
    }
  }

  save();
  notify();
  return { success: true, levelUp, evolved };
}

/**
 * Get all items in inventory with their definitions
 */
export function getInventoryWithDetail(): Array<InventoryItem & { def: ItemDef }> {
  return gameData.inventory
    .map((item: InventoryItem) => {
      const def = ITEMS.find((i) => i.id === item.itemId);
      return def ? { ...item, def } : null;
    })
    .filter((item): item is InventoryItem & { def: ItemDef } => item !== null);
}
