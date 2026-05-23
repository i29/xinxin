// ========================================
// Adventure System Tests
// ========================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAdventureProgress,
  setAdventureZone,
  recordBattleWin,
  recordBattleLoss,
  getEnemyLevelForStage,
  isZoneUnlocked,
  getZonesWithStatus,
  ZONE_NAMES,
} from '../systems/adventure';
import { gameData, resetGame } from '../systems/store';

describe('Adventure System', () => {
  beforeEach(() => {
    resetGame();
    vi.clearAllMocks();
  });

  describe('ZONE_NAMES', () => {
    it('should have 3 zones', () => {
      expect(ZONE_NAMES).toHaveLength(3);
      expect(ZONE_NAMES[0]).toBe('迷雾森林');
      expect(ZONE_NAMES[1]).toBe('暗影洞穴');
      expect(ZONE_NAMES[2]).toBe('苍穹之巅');
    });
  });

  describe('getAdventureProgress', () => {
    it('should return initial adventure progress', () => {
      const progress = getAdventureProgress();
      expect(progress.unlockedLevels).toBe(1);
      expect(progress.currentZone).toBe(0);
      expect(progress.currentStage).toBe(0);
      expect(progress.totalWins).toBe(0);
      expect(progress.totalLosses).toBe(0);
    });

    it('should return a copy, not the original', () => {
      const progress1 = getAdventureProgress();
      const progress2 = getAdventureProgress();
      expect(progress1).not.toBe(progress2);
    });
  });

  describe('setAdventureZone', () => {
    it('should set zone and stage correctly', () => {
      setAdventureZone(1, 2);
      const progress = getAdventureProgress();
      expect(progress.currentZone).toBe(1);
      expect(progress.currentStage).toBe(2);
    });
  });

  describe('recordBattleWin', () => {
    it('should increment totalWins and monstersDefeated', () => {
      const initialWins = gameData.adventure.totalWins;
      const initialDefeated = gameData.stats.monstersDefeated;

      recordBattleWin();

      expect(gameData.adventure.totalWins).toBe(initialWins + 1);
      expect(gameData.stats.monstersDefeated).toBe(initialDefeated + 1);
    });

    it('should advance to next stage within same zone', () => {
      setAdventureZone(0, 0);
      recordBattleWin();
      expect(gameData.adventure.currentStage).toBe(1);
    });

    it('should advance to next zone after completing all stages', () => {
      setAdventureZone(0, 2);
      recordBattleWin();
      expect(gameData.adventure.currentZone).toBe(1);
      expect(gameData.adventure.currentStage).toBe(0);
    });

    it('should unlock new levels when advancing zones', () => {
      setAdventureZone(0, 2);
      recordBattleWin();
      expect(gameData.adventure.unlockedLevels).toBeGreaterThanOrEqual(2);
    });
  });

  describe('recordBattleLoss', () => {
    it('should increment totalLosses', () => {
      const initialLosses = gameData.adventure.totalLosses;
      recordBattleLoss();
      expect(gameData.adventure.totalLosses).toBe(initialLosses + 1);
    });
  });

  describe('getEnemyLevelForStage', () => {
    it('should return a positive level value', () => {
      setAdventureZone(0, 0);
      const level = getEnemyLevelForStage();
      expect(level).toBeGreaterThan(0);
    });

    it('should scale with zone and stage', () => {
      setAdventureZone(0, 0);
      const level1 = getEnemyLevelForStage();

      setAdventureZone(2, 2);
      const level2 = getEnemyLevelForStage();

      expect(level2).toBeGreaterThan(level1);
    });
  });

  describe('isZoneUnlocked', () => {
    it('should return true for unlocked zones', () => {
      expect(isZoneUnlocked(0)).toBe(true);
    });

    it('should return false for locked zones', () => {
      expect(isZoneUnlocked(1)).toBe(false);
      expect(isZoneUnlocked(2)).toBe(false);
    });
  });

  describe('getZonesWithStatus', () => {
    it('should return all zones with correct status', () => {
      const zones = getZonesWithStatus();
      expect(zones).toHaveLength(3);
      expect(zones[0].unlocked).toBe(true);
      expect(zones[1].unlocked).toBe(false);
      expect(zones[2].unlocked).toBe(false);
    });

    it('should include zone names and indices', () => {
      const zones = getZonesWithStatus();
      zones.forEach((zone, index) => {
        expect(zone.index).toBe(index);
        expect(zone.name).toBe(ZONE_NAMES[index]);
        expect(zone.stages).toBe(3);
      });
    });
  });
});
