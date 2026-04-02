// ========================================
// Combat Engine - Turn-based Battle Logic
// ========================================

import { type CombatStats } from './petData';

export interface BattleEntity {
  name: string;
  emoji: string;
  stats: CombatStats;
  isPlayer: boolean;
  speciesId?: string;
  stageIndex?: number;
  isStunned?: boolean;
  atkBuffTurns?: number;
}

export interface BattleLog {
  attacker: string;
  defender: string;
  damage: number;
  isCrit: boolean;
  isMiss: boolean;
  description: string;
}

export interface BattleResult {
  winner: BattleEntity;
  loser: BattleEntity;
  logs: BattleLog[];
  expGained: number;
  itemRewards: { itemId: string; count: number }[];
}

export class CombatEngine {
  static calculateDamage(
    attacker: BattleEntity,
    defender: BattleEntity,
    multiplier: number = 1
  ): { damage: number; isCrit: boolean; isMiss: boolean } {
    // Evasion check: Speed difference impacts hit rate
    const hitRate = Math.min(0.95, 0.85 + (attacker.stats.spd - defender.stats.spd) / 500);
    const isMiss = Math.random() > hitRate;
    if (isMiss) return { damage: 0, isCrit: false, isMiss: true };

    // Crit check
    const critRate = 0.05 + attacker.stats.spd / 2000;
    const isCrit = Math.random() < critRate;

    // Damage logic: ATK vs DEF
    const variance = 0.9 + Math.random() * 0.2;
    let damage = Math.max(1, attacker.stats.atk * multiplier * variance - defender.stats.def * 0.5);

    if (isCrit) {
      damage *= 1.5;
    }

    return { damage: Math.floor(damage), isCrit, isMiss };
  }

  static getUnitTurnOrder(player: BattleEntity, enemy: BattleEntity): BattleEntity[] {
    return player.stats.spd >= enemy.stats.spd ? [player, enemy] : [enemy, player];
  }

  // Simple Monster AI
  static getMonsterAction(_monster: BattleEntity): 'attack' | 'heavy' {
    // 20% chance for a heavy attack
    return Math.random() < 0.2 ? 'heavy' : 'attack';
  }
}

import { PET_SPECIES, calculateStats, getStageIndex } from './petData';

// Level zones: 森林1-3, 洞穴1-3, 天空1-3
export const ZONE_NAMES = ['迷雾森林', '暗影洞穴', '苍穹之巅'];

export function generateRivalPetForLevel(zone: number, stage: number): BattleEntity {
  const globalLevel = zone * 3 + stage; // 0-8
  // Start monsters at level 1-2, increase by ~3 levels per stage
  const monsterLevel = Math.max(1, globalLevel * 3 + Math.floor(Math.random() * 3));
  const species = PET_SPECIES[Math.floor(Math.random() * PET_SPECIES.length)];
  const stageIdx = getStageIndex(species, monsterLevel);
  const stageDef = species.stages[stageIdx];

  const attributes = ['狂暴的', '机敏的', '顽强的', '神秘的', '远古的', '优雅的', '凶猛的'];
  const attr = attributes[Math.floor(Math.random() * attributes.length)];

  const stats = calculateStats(species, monsterLevel);
  // Scale based on zone: early monsters are slightly weaker than player's level-equivalent stats
  let scale = 1.0;
  if (zone === 0)
    scale = 0.85; // Zone 0: easier introduction
  else if (zone === 1)
    scale = 1.0; // Zone 1: standard
  else scale = 1.15; // Zone 2: challenging

  return {
    name: `${attr}${stageDef.name}`,
    emoji: stageDef.emoji,
    isPlayer: false,
    speciesId: species.id,
    stageIndex: stageIdx,
    stats: {
      ...stats,
      hp: Math.floor(stats.hp * scale),
      maxHp: Math.floor(stats.maxHp * scale),
      atk: Math.floor(stats.atk * scale),
      def: Math.floor(stats.def * scale),
      spd: Math.floor(stats.spd * scale),
    },
  };
}

export function generateRivalPet(level: number): BattleEntity {
  // Randomly pick a rival species (different from player if possible, but random is fine)
  const species = PET_SPECIES[Math.floor(Math.random() * PET_SPECIES.length)];
  const stageIdx = getStageIndex(species, level);
  const stage = species.stages[stageIdx];

  const attributes = ['狂暴的', '机敏的', '顽强的', '神秘的', '远古的', '优雅的', '凶猛的'];
  const attr = attributes[Math.floor(Math.random() * attributes.length)];

  // Base stats from the stage, scaled slightly for "wild" versions
  const stats = calculateStats(species, level);
  const scale = 1.05; // Wild animals are a bit tougher

  return {
    name: `${attr}${stage.name}`,
    emoji: stage.emoji,
    isPlayer: false,
    speciesId: species.id,
    stageIndex: stageIdx,
    stats: {
      ...stats,
      hp: Math.floor(stats.hp * scale),
      maxHp: Math.floor(stats.maxHp * scale),
      atk: Math.floor(stats.atk * scale),
      def: Math.floor(stats.def * scale),
      spd: Math.floor(stats.spd * scale),
    },
  };
}
