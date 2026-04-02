// ========================================
// Pets System - Pet Management & Growth
// ========================================

import { PET_SPECIES, calculateStats, getStageIndex, getExpForLevel } from '../petData';
import { gameData, save, notify } from './store';
import { addJournalEntry } from './journal';

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

/**
 * Get active pet
 */
export function getActivePet(): PetState | null {
  if (gameData.pets.length === 0) return null;
  return gameData.pets[gameData.activePetIndex] || gameData.pets[0] || null;
}

/**
 * Get pet species definition
 */
export function getPetSpecies(): typeof PET_SPECIES[number] | null {
  const pet = getActivePet();
  if (!pet) return null;
  return PET_SPECIES.find((s: typeof PET_SPECIES[number]) => s.id === pet.speciesId) || null;
}

/**
 * Add experience to active pet
 */
export function addExp(amount: number): { levelUp: boolean; evolved: boolean } {
  const pet = getActivePet();
  if (!pet) return { levelUp: false, evolved: false };

  const species = getPetSpecies();
  if (!species) return { levelUp: false, evolved: false };

  pet.exp += amount;
  let levelUp = false;
  let evolved = false;

  // Level up loop
  let needed = getExpForLevel(pet.level);
  while (pet.exp >= needed && pet.level < 100) {
    pet.exp -= needed;
    pet.level++;
    levelUp = true;

    // Recalculate stats
    pet.stats = calculateStats(species, pet.level);

    // Check evolution
    const newStageIdx = getStageIndex(species, pet.level);
    if (newStageIdx > pet.stageIndex) {
      const oldStage = species.stages[pet.stageIndex];
      const newStage = species.stages[newStageIdx];
      pet.stageIndex = newStageIdx;
      gameData.stats.evolutionCount++;
      evolved = true;
      addJournalEntry(
        'evolution',
        '形态进化',
        `${pet.name} 从「${oldStage.name}」进化到了「${newStage.name}」！`
      );
    }

    if (pet.level % 10 === 0) {
      addJournalEntry(
        'milestone',
        '等级突破',
        `${pet.name} 达到了 Lv.${pet.level}，它的力量正在觉醒。`
      );
    }

    gameData.stats.highestLevel = Math.max(gameData.stats.highestLevel, pet.level);
    needed = getExpForLevel(pet.level);
  }

  save();
  notify();
  return { levelUp, evolved };
}

/**
 * Create new pet after hatching
 */
export function createHatchedPet(speciesId: string): PetState {
  const species = PET_SPECIES.find((s: typeof PET_SPECIES[number]) => s.id === speciesId)!;
  const newPet: PetState = {
    speciesId: species.id,
    name: species.name,
    level: 1,
    exp: 0,
    hunger: 80,
    happy: 80,
    clean: 80,
    stageIndex: 1,
    stats: calculateStats(species, 1),
  };
  // Initialize current HP/MP
  newPet.stats.hp = newPet.stats.maxHp;
  newPet.stats.mp = newPet.stats.maxMp;

  return newPet;
}

/**
 * Add new pet to the team
 */
export function addPet(pet: PetState): number {
  gameData.pets.push(pet);
  const index = gameData.pets.length - 1;
  gameData.activePetIndex = index;
  save();
  notify();
  return index;
}

/**
 * Switch active pet
 */
export function switchPet(index: number) {
  if (index >= 0 && index < gameData.pets.length) {
    gameData.activePetIndex = index;
    save();
    notify();
  }
}

/**
 * Check if can add new pet (max 2 for now)
 */
export function canAddNewPet(): boolean {
  return gameData.pets.length < 2;
}

/**
 * Start new pet process (go to egg selection)
 */
export function startNewPetProcess() {
  if (!canAddNewPet()) return;
  gameData.phase = 'egg_selection';
  save();
  notify();
}

/**
 * Apply offline stat decay to active pet
 */
export function applyOfflineDecay() {
  const pet = getActivePet();
  if (!pet || gameData.phase !== 'nurture') return;

  const STAT_DECAY_PER_HOUR = 3;
  const now = Date.now();
  const elapsed = now - gameData.lastSaveTime;
  const hours = elapsed / (1000 * 60 * 60);

  if (hours > 0.1) {
    const cappedHours = Math.min(hours, 24);
    const decay = Math.floor(cappedHours * STAT_DECAY_PER_HOUR);
    pet.hunger = Math.max(10, pet.hunger - decay);
    pet.happy = Math.max(10, pet.happy - decay);
    pet.clean = Math.max(10, pet.clean - decay);
  }
}

/**
 * Repair pet stats if missing or broken
 */
export function repairPetStats() {
  const pet = getActivePet();
  const species = getPetSpecies();
  if (!pet || !species) return;

  // If stats is missing or incomplete, recalculate
  if (!pet.stats || typeof pet.stats.maxHp !== 'number' || typeof pet.stats.mp !== 'number') {
    console.warn('Repairing pet stats...');
    pet.stats = calculateStats(species, pet.level);
    if (!pet.stats.hp || pet.stats.hp <= 0) {
      pet.stats.hp = pet.stats.maxHp;
    }
  }
}

/**
 * Tick stat decay (called periodically during gameplay)
 */
export function tickStatDecay() {
  const pet = getActivePet();
  if (!pet || gameData.phase !== 'nurture') return;

  // Small decay every tick (called ~every 60s)
  pet.hunger = Math.max(0, pet.hunger - 0.5);
  pet.happy = Math.max(0, pet.happy - 0.3);
  pet.clean = Math.max(0, pet.clean - 0.2);
  save();
  notify();
}
