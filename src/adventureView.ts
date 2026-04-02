import {
  getState,
  save,
  notify,
  getActivePet,
  addExp,
  addItem,
  addJournalEntry,
  getSpecies,
  addCoins,
} from './gameState';
import { CombatEngine, generateRivalPetForLevel, ZONE_NAMES, type BattleEntity } from './combat';
import { renderPetAvatar, PET_SPECIES } from './petData';
import { spawnFloatingText } from './animations';

let currentEnemy: BattleEntity | null = null;
let isBattleOver = false;
let atkBuffTurns = 0;

export function initAdventureView() {
  const state = getState();
  const species = getSpecies()!;
  if (!species) return; // Guard
  const skill = species.skill || { name: '专属技能', mpCost: 20 };

  const controls = document.getElementById('battle-controls')!;
  controls.innerHTML = `
    <button class="btn btn-primary" id="btn-attack">
      <span>⚔️ 攻击</span>
    </button>
    <button class="btn btn-success" id="btn-defend">
      <span>🛡️ 防御</span>
      <span class="btn-skill-name">恢复 MP</span>
    </button>
    <button class="btn btn-amber" id="btn-skill">
      <span>✨ ${skill.name}</span>
      <span class="btn-skill-name">消耗 ${skill.mpCost} MP</span>
    </button>
  `;

  // Remove any existing overlay
  const arena = document.querySelector('.battle-arena')!;
  const overlay = arena.querySelector('.battle-overlay');
  if (overlay) overlay.remove();

  const backBtn = document.getElementById('adventure-back')!;
  backBtn.onclick = () => {
    state.phase = 'nurture';
    notify();
  };

  const attackBtn = document.getElementById('btn-attack')!;
  const defendBtn = document.getElementById('btn-defend')!;
  const skillBtn = document.getElementById('btn-skill')!;

  attackBtn.onclick = () => handlePlayerAction('attack');
  defendBtn.onclick = () => handlePlayerAction('defend');
  skillBtn.onclick = () => handlePlayerAction('skill');

  startNewEncounter();
}

export function startNewEncounter() {
  const pet = getActivePet();
  if (!pet) return;

  const state = getState();
  isBattleOver = false;
  atkBuffTurns = 0;

  const zone = state.adventure.currentZone;
  const stage = state.adventure.currentStage;
  currentEnemy = generateRivalPetForLevel(zone, stage);

  // reset pet HP/MP for battle (fully healed at start of adventure for now)
  if (pet.stats) {
    pet.stats.hp = pet.stats.maxHp;
    pet.stats.mp = pet.stats.maxMp;
  }

  updateBattleUI();

  // Update level display
  const levelDisplay = document.getElementById('adventure-stage-info');
  if (levelDisplay) {
    levelDisplay.textContent = `${ZONE_NAMES[zone]} 关卡${zone + 1}-${stage + 1}`;
  }

  addLog(`遇到了一只怪物！战斗开始！`, 'system');

  // Enable buttons
  setControlsEnabled(true);
}

function updateBattleUI() {
  const pet = getActivePet();
  if (!pet || !currentEnemy) return;

  const species = getSpecies()!;

  // Visuals
  const playerVisual = document.getElementById('player-battle-visual')!;
  const enemyVisual = document.getElementById('enemy-battle-visual')!;

  playerVisual.innerHTML = renderPetAvatar(species, pet.stageIndex);

  if (currentEnemy.speciesId !== undefined && currentEnemy.stageIndex !== undefined) {
    const enemySpecies = PET_SPECIES.find((s) => s.id === currentEnemy!.speciesId)!;
    enemyVisual.innerHTML = renderPetAvatar(enemySpecies, currentEnemy.stageIndex);
    enemyVisual.classList.add('flip-h'); // Rivals face left
  } else {
    enemyVisual.textContent = currentEnemy.emoji;
    enemyVisual.classList.remove('flip-h');
  }

  // Status
  document.getElementById('player-battle-name')!.textContent = `${pet.name} (Lv.${pet.level})`;
  document.getElementById('enemy-battle-name')!.textContent = currentEnemy.name;

  // HP Bars
  const playerHpFill = document.getElementById('player-hp-fill')!;
  const enemyHpFill = document.getElementById('enemy-hp-fill')!;

  if (pet.stats) {
    playerHpFill.style.width = `${(pet.stats.hp / pet.stats.maxHp) * 100}%`;
  }

  if (currentEnemy.stats) {
    enemyHpFill.style.width = `${(currentEnemy.stats.hp / currentEnemy.stats.maxHp) * 100}%`;
  }

  // MP Bars
  const playerMpFill = document.getElementById('player-mp-fill')!;
  if (pet.stats) {
    playerMpFill.style.width = `${(pet.stats.mp / pet.stats.maxMp) * 100}%`;
  }
}

async function handlePlayerAction(action: 'attack' | 'defend' | 'skill') {
  if (isBattleOver) return;
  setControlsEnabled(false);

  let damage = 0;
  let logMsg = '';

  const pet = getActivePet()!;
  if (!pet.stats) {
    logMsg = `战斗初始化失败：宠物属性缺失。`;
    addLog(logMsg, 'system');
    setControlsEnabled(true);
    return;
  }

  const playerEntity: BattleEntity = {
    name: pet.name,
    emoji: pet.stats.maxHp > 1000 ? '🐲' : '🐱',
    stats: pet.stats,
    isPlayer: true,
  };

  // 1. Player Turn
  if (action === 'attack') {
    const atkMultiplier = atkBuffTurns > 0 ? 1.5 : 1;
    const result = CombatEngine.calculateDamage(playerEntity, currentEnemy!, atkMultiplier);
    animateUnit('player');
    if (result.isMiss) {
      addLog(`${pet.name} 的攻击落空了！`, 'system');
    } else {
      damage = result.damage;
      addLog(
        `${pet.name} 发动攻击，造成了 ${damage} 点伤害！${result.isCrit ? ' (关键一击! 💥)' : ''}${atkBuffTurns > 0 ? ' 🔥' : ''}`,
        'player'
      );
      currentEnemy!.stats.hp = Math.max(0, currentEnemy!.stats.hp - damage);
      animateUnit('enemy', 'hit');
      spawnDamageText('enemy', damage, result.isCrit);
    }
  } else if (action === 'skill') {
    const species = getSpecies()!;
    const skill = species.skill;

    if (pet.stats.mp < skill.mpCost) {
      addLog(`能量不足！需要 ${skill.mpCost} 点能量。`, 'system');
      setControlsEnabled(true);
      return;
    }

    pet.stats.mp -= skill.mpCost;
    const result = CombatEngine.calculateDamage(playerEntity, currentEnemy!, skill.multiplier);
    animateUnit('player', 'skill');

    if (result.isMiss) {
      addLog(`${pet.name} 使用了「${skill.name}」，但是打偏了！`, 'skill');
    } else {
      damage = result.damage;
      addLog(`${pet.name} 释放技能「${skill.name}」，重创敌人造成 ${damage} 点伤害！`, 'skill');
      currentEnemy!.stats.hp = Math.max(0, currentEnemy!.stats.hp - damage);
      animateUnit('enemy', 'hit');
      spawnDamageText('enemy', damage, true);

      if (skill.effect === 'heal') {
        const heal = Math.floor(pet.stats.maxHp * 0.1);
        pet.stats.hp = Math.min(pet.stats.maxHp, pet.stats.hp + heal);
        addLog(`✨ 技能余晖为自身恢复了 ${heal} 点生命！`, 'heal');
        spawnDamageText('player', -heal, false);
      } else if (skill.effect === 'stun') {
        if (Math.random() < 0.5) {
          currentEnemy!.isStunned = true;
          addLog(`💫 技能的震慑力使敌人陷入眩晕！`, 'skill');
        }
      } else if (skill.effect === 'buff_atk') {
        atkBuffTurns = 2;
        addLog(`🔥 虚幻之火强化了自身攻击力！（持续2回合）`, 'skill');
      }
    }
  } else if (action === 'defend') {
    addLog(`${pet.name} 摆出了防御姿态。`, 'system');
    const heal = Math.floor(pet.stats.maxHp * 0.15);
    pet.stats.hp = Math.min(pet.stats.maxHp, pet.stats.hp + heal);
    const mpGain = 10;
    pet.stats.mp = Math.min(pet.stats.maxMp, pet.stats.mp + mpGain);
    addLog(`🛡️ 恢复了 ${heal} 生命和 ${mpGain} 能量。`, 'heal');
    spawnDamageText('player', -heal, false);
  }
  updateBattleUI();

  if (currentEnemy!.stats.hp <= 0) {
    handleVictory();
    return;
  }

  await sleep(1000);

  // 2. Enemy Turn
  if (!isBattleOver) {
    // Check stun
    if (currentEnemy!.isStunned) {
      currentEnemy!.isStunned = false;
      addLog(`${currentEnemy!.name} 处于眩晕状态，无法行动！`, 'system');
    } else {
      const monsterAction = CombatEngine.getMonsterAction(currentEnemy!);
      let multiplier = 1;
      let enemyLog = '';

      if (monsterAction === 'heavy') {
        multiplier = 1.6;
        enemyLog = `${currentEnemy!.name} 正在蓄力攻击！💥 `;
      }

      const result = CombatEngine.calculateDamage(currentEnemy!, playerEntity, multiplier);
      if (result.isMiss) {
        addLog(`${enemyLog}${currentEnemy!.name} 的攻击被你躲开了！`, 'enemy');
      } else {
        const enemyDmg = result.damage;
        pet.stats.hp = Math.max(0, pet.stats.hp - enemyDmg);
        if (monsterAction === 'heavy') {
          addLog(`⚠️ ${currentEnemy!.name} 发动重击，造成了 ${enemyDmg} 点巨大伤害！`, 'heavy');
        } else {
          addLog(`${currentEnemy!.name} 发动攻击，造成了 ${enemyDmg} 点伤害。`, 'enemy');
        }

        animateUnit('enemy', monsterAction === 'heavy' ? 'heavy' : 'attack');
        animateUnit('player', 'hit');
        spawnDamageText('player', enemyDmg, result.isCrit || monsterAction === 'heavy');
      }
    }
    updateBattleUI();

    if (pet.stats.hp <= 0) {
      handleDefeat();
      return;
    }
  }

  // Decrement attack buff
  if (atkBuffTurns > 0) atkBuffTurns--;

  setControlsEnabled(true);
}

function handleVictory() {
  isBattleOver = true;
  const state = getState();
  const pet = getActivePet()!;
  state.adventure.totalWins++;
  gameDataStatsMonstersDefeatedIncrement();

  const exp = 50 + pet.level * 10;
  const coins = 30 + pet.level * 5;
  addLog(`战斗胜利！获得了 ${exp} 点经验和 ${coins} 星币！`, 'system');
  addExp(exp);
  addCoins(coins);

  // Weighted drop table
  const dropTable: { itemId: string | null; weight: number }[] = [
    { itemId: null, weight: 35 },
    { itemId: 'bread', weight: 20 },
    { itemId: 'soap', weight: 15 },
    { itemId: 'meat', weight: 10 },
    { itemId: 'ball', weight: 10 },
    { itemId: 'exp_sm', weight: 5 },
    { itemId: 'exp_md', weight: 3 },
    { itemId: 'cake', weight: 2 },
  ];
  const totalWeight = dropTable.reduce((sum, d) => sum + d.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const drop of dropTable) {
    roll -= drop.weight;
    if (roll <= 0) {
      if (drop.itemId) {
        addItem(drop.itemId, 1);
        addLog(`🎁 在怪物的巢穴发现了物品！`, 'system');
      }
      break;
    }
  }

  // Level progression
  const adv = state.adventure;
  adv.currentStage++;
  if (adv.currentStage >= 3) {
    adv.currentStage = 0;
    adv.currentZone++;
    if (adv.currentZone >= 3) {
      adv.currentZone = 2; // Stay at last zone
      adv.currentStage = 2;
      addLog(`🏆 恭喜通关所有关卡！`, 'system');
    } else {
      addLog(`🌟 解锁新区域：${ZONE_NAMES[adv.currentZone]}！`, 'system');
    }
  }

  const globalLevel = adv.currentZone * 3 + adv.currentStage + 1;
  if (globalLevel > adv.unlockedLevels) {
    adv.unlockedLevels = globalLevel;
  }

  addJournalEntry('milestone', '战斗胜利', `在冒险中击败了 ${currentEnemy!.name}。`);
  save();
  showBattleResult('victory', exp);
}

// Internal helper for clarity (since gameData.stats is private to gameState)
function gameDataStatsMonstersDefeatedIncrement() {
  const state = getState();
  if (state.stats) state.stats.monstersDefeated++;
}

function handleDefeat() {
  isBattleOver = true;
  const state = getState();
  const pet = getActivePet();
  state.adventure.totalLosses++;
  if (pet) addLog(`${pet.name} 倒下了... 冒险结束。`, 'system');
  save();
  showBattleResult('defeat', 0);
}

function showBattleResult(type: 'victory' | 'defeat', exp: number) {
  const arena = document.querySelector('.battle-arena')!;
  const overlay = document.createElement('div');
  overlay.className = 'battle-overlay';

  const title = document.createElement('div');
  title.className = `overlay-title ${type}-title`;
  title.textContent = type === 'victory' ? 'VICTORY' : 'DEFEAT';

  const rewards = document.createElement('div');
  rewards.className = 'overlay-rewards';
  if (type === 'victory') {
    rewards.innerHTML = `
      <div>获得经验: +${exp}</div>
      <div style="font-size: 0.8rem; margin-top: 10px;">点击下方按钮寻找下一个目标</div>
    `;
  } else {
    rewards.innerHTML = `<div>你需要休息一下...</div>`;
  }

  const btn = document.createElement('button');
  btn.className = 'btn btn-primary btn-glow';
  btn.textContent = type === 'victory' ? '寻觅怪物 ⚔️' : '返回家园 🏠';
  btn.onclick = () => {
    if (type === 'victory') {
      initAdventureView();
    } else {
      const state = getState();
      state.phase = 'nurture';
      notify();
    }
  };

  overlay.appendChild(title);
  overlay.appendChild(rewards);
  overlay.appendChild(btn);
  arena.appendChild(overlay);
}

function addLog(
  msg: string,
  type: 'player' | 'enemy' | 'heal' | 'system' | 'skill' | 'heavy' = 'system'
) {
  const log = document.getElementById('battle-log')!;
  const div = document.createElement('div');
  div.className = `log-entry log-${type}`;
  div.textContent = msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function setControlsEnabled(enabled: boolean) {
  const btns = document.querySelectorAll('#battle-controls button');
  btns.forEach((b) => ((b as HTMLButtonElement).disabled = !enabled));
}

function animateUnit(
  unit: 'player' | 'enemy',
  type: 'attack' | 'hit' | 'heavy' | 'skill' = 'attack'
) {
  const el = document.getElementById(`${unit}-battle-visual`)!;

  el.classList.remove(
    'unit-attack-right',
    'unit-attack-left',
    'unit-skill-right',
    'unit-skill-left',
    'unit-hit',
    'unit-heavy-left'
  );
  void el.offsetWidth; // trigger reflow

  if (type === 'attack') {
    el.classList.add(unit === 'player' ? 'unit-attack-right' : 'unit-attack-left');
  } else if (type === 'skill') {
    el.classList.add(unit === 'player' ? 'unit-skill-right' : 'unit-skill-left');
  } else if (type === 'hit') {
    el.classList.add('unit-hit');
  } else if (type === 'heavy') {
    el.classList.add('unit-heavy-left');
  }
}

function spawnDamageText(unit: 'player' | 'enemy', amount: number, isCrit: boolean) {
  const el = document.getElementById(`${unit}-battle-visual`)!;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const color = amount > 0 ? (isCrit ? '#f43f5e' : '#f87171') : '#10b981';
  const text = amount > 0 ? `-${amount}` : `+${Math.abs(amount)}`;

  spawnFloatingText(
    document.getElementById('view-adventure')!,
    text,
    color,
    rect.left + rect.width / 2,
    rect.top
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
