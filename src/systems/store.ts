// ========================================
// Store - Central Game State Management
// ========================================

import type { GameData } from '../gameState';

export interface GameStateData extends Omit<GameData, 'pets'> {
  pets: Array<{
    speciesId: string;
    name: string;
    level: number;
    exp: number;
    hunger: number;
    happy: number;
    clean: number;
    stageIndex: number;
    stats: {
      hp: number;
      maxHp: number;
      mp: number;
      maxMp: number;
      atk: number;
      def: number;
      spd: number;
    };
  }>;
}

const SAVE_KEY = 'xinxin_pet_save';

let listeners: (() => void)[] = [];

// Internal game data reference - will be initialized by load()
export let gameData: GameStateData = createDefaultData();

function createDefaultData(): GameStateData {
  return {
    phase: 'egg_selection',
    pets: [],
    activePetIndex: 0,
    inventory: [],
    coins: 200,
    tasks: [],
    achievements: [],
    lastSaveTime: Date.now(),
    totalDays: 0,
    lastDailyReset: '',
    hatchProgress: 0,
    hatchClicks: 0,
    selectedEggIndex: -1,
    journal: [],
    adventure: {
      unlockedLevels: 1,
      currentZone: 0,
      currentStage: 0,
      totalWins: 0,
      totalLosses: 0,
    },
    stats: {
      totalTasksCompleted: 0,
      totalItemsUsed: 0,
      totalClicks: 0,
      highestLevel: 0,
      evolutionCount: 0,
      monstersDefeated: 0,
    },
  };
}

/**
 * Subscribe to state changes
 */
export function subscribe(fn: () => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

/**
 * Notify all listeners of state change
 */
export function notify() {
  listeners.forEach((fn) => fn());
}

/**
 * Get current game state
 */
export function getState(): GameStateData {
  return gameData;
}

/**
 * Save game state to localStorage
 */
export function save() {
  gameData.lastSaveTime = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
}

/**
 * Load game state from localStorage
 */
export function load(): GameStateData {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, any>;

      // Data Migration: Single pet to Pets array
      if (parsed.pet && (!parsed.pets || parsed.pets.length === 0)) {
        console.log('Migrating legacy single-pet save...');
        parsed.pets = [parsed.pet];
        parsed.activePetIndex = 0;
        delete parsed.pet;
      }

      // Merge with defaults for forward compat
      gameData = {
        ...createDefaultData(),
        ...parsed,
        pets: parsed.pets || [],
        activePetIndex: typeof parsed.activePetIndex === 'number' ? parsed.activePetIndex : 0,
        stats: { ...createDefaultData().stats, ...(parsed.stats || {}) },
        adventure: { ...createDefaultData().adventure, ...(parsed.adventure || {}) },
      };
    } catch (e) {
      console.error('Failed to load save:', e);
      gameData = createDefaultData();
    }
  } else {
    gameData = createDefaultData();
  }
  return gameData;
}

/**
 * Reset game and clear save
 */
export function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  gameData = createDefaultData();
  notify();
}

/**
 * Add coins (without journal logging - handled by wrapper in gameState.ts)
 */
export function addCoins(amount: number) {
  gameData.coins += amount;
  save();
  notify();
}

/**
 * Set game data (for internal use)
 */
export function setState(data: Partial<GameStateData>) {
  gameData = { ...gameData, ...data };
}
