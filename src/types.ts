// ========================================
// Type Definitions
// ========================================

export type GamePhase = 'egg_selection' | 'hatching' | 'birth' | 'nurture' | 'adventure';

export interface InventoryItem {
  itemId: string;
  count: number;
}

export interface JournalEntry {
  timestamp: number;
  event: string;
  details: string;
  type: 'birth' | 'level_up' | 'evolution' | 'milestone';
  data?: any;
}

export interface PetState {
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
}

export interface AdventureProgress {
  unlockedLevels: number;
  currentZone: number;
  currentStage: number;
  totalWins: number;
  totalLosses: number;
}

export interface TaskProgress {
  taskId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface GameData {
  phase: GamePhase;
  pets: PetState[];
  activePetIndex: number;
  inventory: InventoryItem[];
  coins: number;
  tasks: TaskProgress[];
  achievements: TaskProgress[];
  lastSaveTime: number;
  totalDays: number;
  lastDailyReset: string; // YYYY-MM-DD
  hatchProgress: number;
  hatchClicks: number;
  selectedEggIndex: number;
  journal: JournalEntry[];
  adventure: AdventureProgress;
  stats: {
    totalTasksCompleted: number;
    totalItemsUsed: number;
    totalClicks: number;
    highestLevel: number;
    evolutionCount: number;
    monstersDefeated: number;
  };
}
