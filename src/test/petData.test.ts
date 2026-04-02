import { describe, it, expect } from 'vitest';
import {
  PET_SPECIES,
  ITEMS,
  getExpForLevel,
  getStageIndex,
  calculateStats,
} from '../petData';

describe('petData', () => {
  describe('PET_SPECIES', () => {
    it('should have 6 species', () => {
      expect(PET_SPECIES.length).toBe(6);
    });

    it('should have valid species data', () => {
      PET_SPECIES.forEach((species) => {
        expect(species.id).toBeDefined();
        expect(species.name).toBeDefined();
        expect(species.stages.length).toBeGreaterThan(0);
        expect(species.skill).toBeDefined();
        expect(species.environment).toBeDefined();
      });
    });

    it('should have valid evolution stages', () => {
      PET_SPECIES.forEach((species) => {
        species.stages.forEach((stage, index) => {
          expect(stage.level).toBeDefined();
          expect(stage.name).toBeDefined();
          expect(stage.emoji).toBeDefined();
          
          // First stage should be at level 0 (egg)
          if (index === 0) {
            expect(stage.level).toBe(0);
          }
        });
      });
    });

    it('should have stages in ascending level order', () => {
      PET_SPECIES.forEach((species) => {
        for (let i = 1; i < species.stages.length; i++) {
          expect(species.stages[i].level).toBeGreaterThan(species.stages[i - 1].level);
        }
      });
    });
  });

  describe('ITEMS', () => {
    it('should have items defined', () => {
      expect(ITEMS.length).toBeGreaterThan(0);
    });

    it('should have valid item data', () => {
      ITEMS.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.emoji).toBeDefined();
        expect(item.price).toBeGreaterThan(0);
        expect(item.stat).toBeDefined();
        expect(item.value).toBeGreaterThan(0);
      });
    });

    it('should have food items', () => {
      const foodItems = ITEMS.filter((item) => item.stat === 'hunger' || item.stat === 'happy' || item.stat === 'clean');
      expect(foodItems.length).toBeGreaterThan(0);
    });

    it('should have experience items', () => {
      const expItems = ITEMS.filter((item) => item.stat === 'exp');
      expect(expItems.length).toBeGreaterThan(0);
    });
  });

  describe('getExpForLevel', () => {
    it('should return correct exp for level 1', () => {
      expect(getExpForLevel(1)).toBe(20);
    });

    it('should return correct exp for level 5', () => {
      expect(getExpForLevel(5)).toBe(100);
    });

    it('should return correct exp for level 10', () => {
      expect(getExpForLevel(10)).toBe(500);
    });

    it('should return correct exp for level 25', () => {
      expect(getExpForLevel(25)).toBe(2500);
    });

    it('should return correct exp for level 50', () => {
      expect(getExpForLevel(50)).toBe(5000);
    });

    it('should return correct exp for level 100', () => {
      expect(getExpForLevel(100)).toBe(10000);
    });

    it('should scale exp requirements with level', () => {
      expect(getExpForLevel(10)).toBeGreaterThan(getExpForLevel(5));
      expect(getExpForLevel(50)).toBeGreaterThan(getExpForLevel(10));
      expect(getExpForLevel(100)).toBeGreaterThan(getExpForLevel(50));
    });
  });

  describe('getStageIndex', () => {
    const species = PET_SPECIES[0]; // First species (cat)

    it('should return 0 for level 0', () => {
      expect(getStageIndex(species, 0)).toBe(0);
    });

    it('should return 1 for level 1', () => {
      expect(getStageIndex(species, 1)).toBe(1);
    });

    it('should return correct stage for mid-level', () => {
      const stageIdx = getStageIndex(species, 10);
      expect(stageIdx).toBeGreaterThan(0);
      expect(species.stages[stageIdx].level).toBeLessThanOrEqual(10);
    });

    it('should return last stage for max level', () => {
      const lastStageIdx = species.stages.length - 1;
      const maxLevel = species.stages[lastStageIdx].level;
      expect(getStageIndex(species, maxLevel)).toBe(lastStageIdx);
    });

    it('should return last stage for level beyond max', () => {
      const lastStageIdx = species.stages.length - 1;
      expect(getStageIndex(species, 999)).toBe(lastStageIdx);
    });
  });

  describe('calculateStats', () => {
    const species = PET_SPECIES[0]; // First species (cat)

    it('should calculate stats for level 1', () => {
      const stats = calculateStats(species, 1);
      expect(stats.hp).toBeGreaterThan(0);
      expect(stats.maxHp).toBeGreaterThan(0);
      expect(stats.mp).toBeGreaterThan(0);
      expect(stats.maxMp).toBeGreaterThan(0);
      expect(stats.atk).toBeGreaterThan(0);
      expect(stats.def).toBeGreaterThan(0);
      expect(stats.spd).toBeGreaterThan(0);
    });

    it('should calculate stats for level 10', () => {
      const stats = calculateStats(species, 10);
      expect(stats.hp).toBeGreaterThan(0);
      expect(stats.atk).toBeGreaterThan(0);
    });

    it('should scale stats with level', () => {
      const stats1 = calculateStats(species, 1);
      const stats10 = calculateStats(species, 10);
      const stats50 = calculateStats(species, 50);

      expect(stats10.hp).toBeGreaterThan(stats1.hp);
      expect(stats50.hp).toBeGreaterThan(stats10.hp);
      expect(stats10.atk).toBeGreaterThan(stats1.atk);
      expect(stats50.atk).toBeGreaterThan(stats10.atk);
    });

    it('should have hp equal to maxHp', () => {
      const stats = calculateStats(species, 5);
      expect(stats.hp).toBe(stats.maxHp);
    });

    it('should have mp equal to maxMp', () => {
      const stats = calculateStats(species, 5);
      expect(stats.mp).toBe(stats.maxMp);
    });

    it('should calculate different stats for different species', () => {
      const species1 = PET_SPECIES[0]; // Cat
      const species2 = PET_SPECIES[1]; // Dog
      
      const stats1 = calculateStats(species1, 10);
      const stats2 = calculateStats(species2, 10);

      // Different species should have different stat distributions
      // At least one stat should be different
      expect(
        stats1.hp !== stats2.hp ||
        stats1.atk !== stats2.atk ||
        stats1.def !== stats2.def ||
        stats1.spd !== stats2.spd
      ).toBe(true);
    });
  });

  describe('Species data integrity', () => {
    it('should have unique species IDs', () => {
      const ids = PET_SPECIES.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have unique item IDs', () => {
      const ids = ITEMS.map((i) => i.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid skill data for all species', () => {
      PET_SPECIES.forEach((species) => {
        expect(species.skill.id).toBeDefined();
        expect(species.skill.name).toBeDefined();
        expect(species.skill.mpCost).toBeGreaterThan(0);
        expect(species.skill.multiplier).toBeGreaterThan(0);
      });
    });

    it('should have valid environment data for all species', () => {
      PET_SPECIES.forEach((species) => {
        expect(species.environment.background).toBeDefined();
        expect(species.environment.themeColor).toBeDefined();
        expect(species.environment.facilities).toBeDefined();
        expect(species.environment.facilities.food).toBeDefined();
        expect(species.environment.facilities.toy).toBeDefined();
        expect(species.environment.facilities.wash).toBeDefined();
      });
    });
  });
});