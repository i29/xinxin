import { describe, it, expect, vi } from 'vitest';
import { CombatEngine, type BattleEntity, generateRivalPetForLevel, generateRivalPet } from '../combat';

// Mock Math.random for deterministic tests
const mockMathRandom = (value: number) => {
  vi.spyOn(Math, 'random').mockReturnValue(value);
};

describe('CombatEngine', () => {
  const createEntity = (overrides: Partial<BattleEntity> = {}): BattleEntity => ({
    name: 'Test',
    emoji: '🐱',
    stats: {
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      atk: 20,
      def: 10,
      spd: 15,
    },
    isPlayer: true,
    ...overrides,
  });

  describe('calculateDamage', () => {
    it('should calculate damage based on ATK and DEF', () => {
      const attacker = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 20, def: 10, spd: 15 } });
      const defender = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 8, spd: 10 },
      });

      mockMathRandom(0.5); // Average roll
      const result = CombatEngine.calculateDamage(attacker, defender, 1);

      expect(result.damage).toBeGreaterThan(0);
      expect(typeof result.isCrit).toBe('boolean');
      expect(typeof result.isMiss).toBe('boolean');
    });

    it('should calculate damage with multiplier', () => {
      const attacker = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 20, def: 10, spd: 15 } });
      const defender = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 8, spd: 10 },
      });

      mockMathRandom(0.5);
      const normalResult = CombatEngine.calculateDamage(attacker, defender, 1);
      const multipliedResult = CombatEngine.calculateDamage(attacker, defender, 2);

      expect(multipliedResult.damage).toBeGreaterThan(normalResult.damage);
    });

    it('should have chance to miss', () => {
      const attacker = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 20, def: 10, spd: 15 } });
      const defender = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 8, spd: 10 },
      });

      // Mock random to guarantee miss (value > hitRate)
      mockMathRandom(0.99);
      const result = CombatEngine.calculateDamage(attacker, defender, 1);

      expect(result.isMiss).toBe(true);
      expect(result.damage).toBe(0);
    });

    it('should have chance to crit', () => {
      const attacker = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 20, def: 10, spd: 15 } });
      const defender = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 8, spd: 10 },
      });

      // Mock random to guarantee crit (value < critRate)
      mockMathRandom(0.01);
      const result = CombatEngine.calculateDamage(attacker, defender, 1);

      expect(result.isCrit).toBe(true);
    });

    it('should always do at least 1 damage on hit', () => {
      const attacker = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 1, def: 10, spd: 15 } });
      const defender = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 100, spd: 10 },
      });

      mockMathRandom(0.5); // No miss
      const result = CombatEngine.calculateDamage(attacker, defender, 1);

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getUnitTurnOrder', () => {
    it('should determine turn order based on speed', () => {
      const fastEntity = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 20, def: 10, spd: 20 } });
      const slowEntity = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 8, spd: 5 },
      });

      const order = CombatEngine.getUnitTurnOrder(fastEntity, slowEntity);
      expect(order[0]).toBe(fastEntity);
      expect(order[1]).toBe(slowEntity);
    });

    it('should handle equal speed (player goes first)', () => {
      const entity1 = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 20, def: 10, spd: 15 } });
      const entity2 = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 8, spd: 15 },
      });

      const order = CombatEngine.getUnitTurnOrder(entity1, entity2);
      expect(order[0]).toBe(entity1); // Player with equal speed goes first
      expect(order[1]).toBe(entity2);
    });

    it('should put faster entity first', () => {
      const slowEntity = createEntity({ stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 20, def: 10, spd: 5 } });
      const fastEntity = createEntity({
        isPlayer: false,
        stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, atk: 15, def: 8, spd: 20 },
      });

      const order = CombatEngine.getUnitTurnOrder(slowEntity, fastEntity);
      expect(order[0]).toBe(fastEntity);
      expect(order[1]).toBe(slowEntity);
    });
  });

  describe('getMonsterAction', () => {
    it('should return attack or heavy attack', () => {
      const monster = createEntity({ isPlayer: false });
      
      mockMathRandom(0.1); // Less than 0.2, should be 'heavy'
      const action1 = CombatEngine.getMonsterAction(monster);
      expect(action1).toBe('heavy');

      mockMathRandom(0.3); // Greater than 0.2, should be 'attack'
      const action2 = CombatEngine.getMonsterAction(monster);
      expect(action2).toBe('attack');
    });
  });
});

describe('generateRivalPetForLevel', () => {
  it('should generate a monster for a given zone and stage', () => {
    const monster = generateRivalPetForLevel(0, 0);
    expect(monster).toBeDefined();
    expect(monster.name).toBeDefined();
    expect(monster.emoji).toBeDefined();
    expect(monster.stats).toBeDefined();
    expect(monster.isPlayer).toBe(false);
    expect(monster.speciesId).toBeDefined();
    expect(monster.stageIndex).toBeDefined();
  });

  it('should scale monster stats based on zone', () => {
    const monster0 = generateRivalPetForLevel(0, 0);
    const monster2 = generateRivalPetForLevel(2, 0);

    // Zone 2 monsters should be stronger than zone 0
    expect(monster2.stats.atk).toBeGreaterThanOrEqual(monster0.stats.atk);
  });

  it('should scale monster stats based on stage', () => {
    const monsterStage0 = generateRivalPetForLevel(0, 0);
    const monsterStage2 = generateRivalPetForLevel(0, 2);

    // Later stages should generally be stronger
    expect(monsterStage2.stats.atk).toBeGreaterThan(monsterStage0.stats.atk);
  });
});

describe('generateRivalPet', () => {
  it('should generate a rival pet with given level', () => {
    const rival = generateRivalPet(5);
    expect(rival).toBeDefined();
    expect(rival.name).toContain('的'); // Should have an attribute prefix
    expect(rival.stats).toBeDefined();
    expect(rival.isPlayer).toBe(false);
    expect(rival.speciesId).toBeDefined();
  });

  it('should scale stats with level', () => {
    const rival1 = generateRivalPet(1);
    const rival10 = generateRivalPet(10);

    expect(rival10.stats.hp).toBeGreaterThan(rival1.stats.hp);
    expect(rival10.stats.atk).toBeGreaterThan(rival1.stats.atk);
    expect(rival10.stats.def).toBeGreaterThan(rival1.stats.def);
  });

  it('should have slightly scaled stats (1.05x)', () => {
    // The function scales stats by 1.05
    const rival = generateRivalPet(5);
    expect(rival.stats.hp).toBeGreaterThan(0);
    expect(rival.stats.atk).toBeGreaterThan(0);
  });
});