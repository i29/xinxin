// ========================================
// Systems Module - Central Export
// ========================================

// Types
export type { PetState } from './pets';
export type { InventoryItem } from './inventory';
export type { JournalEntry } from './journal';
export type { TaskProgress, TaskDef } from './taskSystem';
export type { AdventureProgress } from './adventure';

// GameData type and GamePhase
export type { GamePhase, GameData } from '../gameState';

// Core store
export { gameData, getState, setState, save, load, resetGame, subscribe, notify } from './store';
export { addCoins } from '../gameState';

// Pets management
export {
  getActivePet,
  getPetSpecies,
  addExp,
  createHatchedPet,
  addPet,
  switchPet,
  canAddNewPet,
  startNewPetProcess,
  applyOfflineDecay,
  repairPetStats,
  tickStatDecay,
} from './pets';

// Inventory
export { addItem, removeItem, getItemCount, buyItem, useItem, getInventoryWithDetail } from './inventory';

// Tasks & Achievements
export {
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
} from './taskSystem';

// Journal
export { addJournalEntry, getJournalEntries, clearJournal, getEntryCountByType } from './journal';

// Adventure
export {
  getAdventureProgress,
  setAdventureZone,
  recordBattleWin,
  recordBattleLoss,
  getEnemyLevelForStage,
  isZoneUnlocked,
  getZonesWithStatus,
  ZONE_NAMES,
} from './adventure';
