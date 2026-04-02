// ========================================
// Adventure System - Zone & Battle Management
// ========================================

import { gameData, save, notify } from './store';

export interface AdventureProgress {
  unlockedLevels: number;
  currentZone: number;
  currentStage: number;
  totalWins: number;
  totalLosses: number;
}

/**
 * Zone names for adventure
 */
export const ZONE_NAMES = ['迷雾森林', '暗影洞穴', '苍穹之巅'];

/**
 * Get current adventure progress
 */
export function getAdventureProgress(): AdventureProgress {
  return { ...gameData.adventure };
}

/**
 * Set current zone and stage
 */
export function setAdventureZone(zone: number, stage: number) {
  gameData.adventure.currentZone = zone;
  gameData.adventure.currentStage = stage;
  save();
  notify();
}

/**
 * Record battle win
 */
export function recordBattleWin() {
  gameData.adventure.totalWins++;
  gameData.stats.monstersDefeated++;

  // Unlock next stage
  const { currentZone, currentStage } = gameData.adventure;
  if (currentStage < 2) {
    gameData.adventure.currentStage++;
  } else if (currentZone < 2) {
    // Unlock next zone
    gameData.adventure.currentZone++;
    gameData.adventure.currentStage = 0;
    gameData.adventure.unlockedLevels = Math.max(
      gameData.adventure.unlockedLevels,
      gameData.adventure.currentZone + 1
    );
  }

  save();
  notify();
}

/**
 * Record battle loss
 */
export function recordBattleLoss() {
  gameData.adventure.totalLosses++;
  save();
  notify();
}

/**
 * Get enemy level for current zone/stage
 */
export function getEnemyLevelForStage(): number {
  const { currentZone, currentStage } = gameData.adventure;
  const globalLevel = currentZone * 3 + currentStage;
  return Math.max(1, globalLevel * 3 + Math.floor(Math.random() * 3));
}

/**
 * Check if zone is unlocked
 */
export function isZoneUnlocked(zone: number): boolean {
  return zone < gameData.adventure.unlockedLevels;
}

/**
 * Get all zones with unlock status
 */
export function getZonesWithStatus(): Array<{
  index: number;
  name: string;
  unlocked: boolean;
  stages: number;
}> {
  return ZONE_NAMES.map((name, index) => ({
    index,
    name,
    unlocked: isZoneUnlocked(index),
    stages: 3,
  }));
}
