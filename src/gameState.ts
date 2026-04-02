// ========================================
// Game State - Legacy Compatibility Layer
// ========================================
// This file re-exports from the new modular systems
// and provides backward compatibility for existing imports

export type { GamePhase, InventoryItem, JournalEntry, PetState, AdventureProgress, TaskProgress, GameData } from './types';

// Re-export all systems functionality
export {
  // Store
  gameData,
  getState,
  save,
  load,
  resetGame,
  subscribe,
  notify,
  // Pets
  getActivePet,
  getPetSpecies as getSpecies,
  addExp,
  createHatchedPet,
  addPet,
  switchPet,
  canAddNewPet,
  startNewPetProcess,
  applyOfflineDecay,
  repairPetStats,
  tickStatDecay,
  // Inventory
  addItem,
  removeItem,
  getItemCount,
  buyItem,
  useItem,
  getInventoryWithDetail,
  // Tasks
  setTaskProgress,
  claimTaskReward,
  setAchievementProgress,
  claimAchievementReward,
  getTodayString,
  checkAndResetDailyTasks,
  getDailyTasksWithProgress,
  getAchievementsWithProgress,
  DAILY_TASKS,
  ACHIEVEMENTS,
  // Journal
  addJournalEntry,
  getJournalEntries,
  clearJournal,
  getEntryCountByType,
  // Adventure
  getAdventureProgress,
  setAdventureZone,
  recordBattleWin,
  recordBattleLoss,
  getEnemyLevelForStage,
  isZoneUnlocked,
  getZonesWithStatus,
  ZONE_NAMES,
} from './systems';

// Re-export addCoins (defined below)

// Hatching-specific functions (kept here as they're UI-specific)
import { PET_SPECIES } from './petData';
import { gameData, save, notify, addJournalEntry, createHatchedPet, addPet } from './systems';

/**
 * Select egg and start hatching process
 */
export function selectEgg(index: number) {
  gameData.selectedEggIndex = index;
  gameData.phase = 'hatching';
  gameData.hatchProgress = 0;
  gameData.hatchClicks = 0;
  save();
  notify();
}

/**
 * Add progress to hatching
 */
export function addHatchProgress(amount: number): boolean {
  gameData.hatchProgress = Math.min(100, gameData.hatchProgress + amount);
  gameData.hatchClicks++;
  gameData.stats.totalClicks++;
  save();
  notify();
  return gameData.hatchProgress >= 100;
}

/**
 * Complete hatching and create new pet
 */
export function hatchComplete() {
  const species = PET_SPECIES[gameData.selectedEggIndex];
  const newPet = createHatchedPet(species.id);

  // Add to pet list
  addPet(newPet);

  gameData.phase = 'birth';
  addJournalEntry(
    'birth',
    `${species.name} 诞生！`,
    `在星辰的见证下，你唤醒了这颗「${species.name}」蛋。`,
    { speciesId: species.id }
  );
  save();
  notify();
}

/**
 * Start nurture phase after birth
 */
export function startNurture() {
  gameData.phase = 'nurture';
  save();
  notify();
}

/**
 * Add coins with journal entry for large amounts
 */
export function addCoins(amount: number) {
  gameData.coins += amount;
  if (amount > 100) {
    addJournalEntry('milestone', '财富积累', `获得了 ${amount} 枚星币！钱包鼓起来了。`);
  }
  save();
  notify();
}
