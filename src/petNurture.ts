// ========================================
// Pet Nurture View - Main Dashboard
// ========================================

import { getState, getSpecies, getActivePet, useItem, tickStatDecay, notify } from './gameState';
import type { EvolutionStage } from './petData';
import {
  ITEMS,
  PET_SPECIES,
  getExpForLevel,
  getStage,
  getStageIndex,
  getMoodEmoji,
  renderPetAvatar,
} from './petData';
import {
  initTiltEffect,
  updateEnvironment,
  updateFacilityIcons,
  updatePetShadow,
} from './animations';
import { trackAutoTask } from './taskSystem';

let decayTimer: ReturnType<typeof setInterval> | null = null;
let flipTimer: ReturnType<typeof setInterval> | null = null;

export function initPetNurture() {
  const pet = getActivePet();
  if (pet) {
    const species = getSpecies()!;
    updateEnvironment(pet.speciesId, pet.stageIndex);
    updateFacilityIcons(species);
  }
  updatePetUI();

  // Start stat decay timer
  if (decayTimer) clearInterval(decayTimer);
  decayTimer = setInterval(() => {
    tickStatDecay();
    updatePetUI();
  }, 60000); // every 60s

  // Start random flip timer for idle animation
  if (flipTimer) clearInterval(flipTimer);
  flipTimer = setInterval(() => {
    const petAvatar = document.getElementById('pet-avatar')!;
    if (petAvatar && !petAvatar.classList.contains('wandering')) {
      // Randomly flip the pet left or right (30% chance)
      if (Math.random() < 0.3) {
        const shouldFlip = Math.random() > 0.5;
        if (shouldFlip) {
          petAvatar.classList.add('flip-h');
        } else {
          petAvatar.classList.remove('flip-h');
        }
      }
    }
  }, 8000 + Math.random() * 7000); // Check every 8-15 seconds, only flip 30% of the time

  // Navigation
  const navAdventure = document.getElementById('nav-adventure')!;
  navAdventure.onclick = () => {
    getState().phase = 'adventure';
    notify();
  };

  // Pet click interaction
  const petAvatar = document.getElementById('pet-avatar')!;
  petAvatar.addEventListener('click', () => {
    petAvatar.classList.remove('micro-move');
    void petAvatar.offsetWidth;
    petAvatar.classList.add('micro-move');
    setTimeout(() => {
      petAvatar.classList.remove('micro-move');
    }, 200);
  });

  // Inventory click handler
  const invGrid = document.getElementById('inventory-grid')!;
  invGrid.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.inventory-item') as HTMLElement;
    if (!target) return;
    const itemId = target.dataset.itemId;
    if (!itemId) return;

    const result = useItem(itemId);
    if (result.success) {
      const itemDef = ITEMS.find((i) => i.id === itemId)!;
      // Interaction Animation
      let facilityType: 'food' | 'toy' | 'wash' = 'food';
      if (itemDef.type === 'food') facilityType = 'food';
      else if (itemDef.type === 'toy') facilityType = 'toy';
      else if (itemDef.type === 'soap') facilityType = 'wash';

      performInteraction(facilityType);

      // Track auto tasks
      if (itemDef.type === 'food') {
        trackAutoTask('daily_feed');
      } else if (itemDef.type === 'toy') {
        trackAutoTask('daily_play');
      }

      // Check for evolution
      if (result.evolved) {
        const species = getSpecies()!;
        const pet = getActivePet()!;
        const stage = getStage(species, pet.level);
        const prevStageIdx = pet.stageIndex - 1;
        const prevStage = species.stages[Math.max(0, prevStageIdx)];
        showEvolution(prevStage, stage);
      }

      updatePetUI();
    }
  });
}

export function updatePetUI() {
  const state = getState();
  const pet = getActivePet();
  if (!pet) return;
  const species = getSpecies();
  if (!species) return;

  const stage = getStage(species, pet.level);
  const nextStageIdx = getStageIndex(species, pet.level) + 1;
  const nextStage = nextStageIdx < species.stages.length ? species.stages[nextStageIdx] : null;

  // Pet avatar
  const avatar = document.getElementById('pet-avatar')!;
  const stageIdx = getStageIndex(species, pet.level);
  avatar.innerHTML = renderPetAvatar(species, stageIdx);

  // Update Environment
  updateEnvironment(pet.speciesId, stageIdx);

  // Pet info
  document.getElementById('pet-name')!.textContent = `${species.name} · ${stage.name}`;
  document.getElementById('pet-stage')!.textContent = stage.description;

  // Level & EXP
  const expNeeded = getExpForLevel(pet.level);
  document.getElementById('pet-level')!.textContent = `Lv.${pet.level}`;
  document.getElementById('pet-exp')!.textContent = `${pet.exp}/${expNeeded}`;
  (document.getElementById('exp-fill') as HTMLElement).style.width =
    `${(pet.exp / expNeeded) * 100}%`;

  // Next evolution text
  const nextEvoText = document.getElementById('next-evolution')!;
  if (nextStage) {
    nextEvoText.textContent = `下一次进化: Lv.${nextStage.level} ${nextStage.name}`;
  } else {
    nextEvoText.textContent = '✨ 已达最终形态！';
  }

  // Stats
  (document.getElementById('hunger-fill') as HTMLElement).style.width = `${pet.hunger}%`;
  document.getElementById('hunger-value')!.textContent = Math.floor(pet.hunger).toString();
  (document.getElementById('happy-fill') as HTMLElement).style.width = `${pet.happy}%`;
  document.getElementById('happy-value')!.textContent = Math.floor(pet.happy).toString();
  (document.getElementById('clean-fill') as HTMLElement).style.width = `${pet.clean}%`;
  document.getElementById('clean-value')!.textContent = Math.floor(pet.clean).toString();

  // Mood
  document.getElementById('pet-mood')!.textContent = getMoodEmoji(pet.hunger, pet.happy, pet.clean);

  // Initial Shadow Sync
  updatePetShadow(avatar.style.left || '50%', avatar.style.top || '50%');

  // Multi-Pet Slots
  renderPetSlots();

  // Coins
  const coinEl = document.getElementById('coin-amount');
  if (coinEl) coinEl.textContent = String(state.coins || 0);

  // Inventory
  renderInventory();
}

function renderPetSlots() {
  const slotContainer = document.getElementById('pet-slot-display');
  const btnNewPet = document.getElementById('btn-new-pet') as HTMLButtonElement;
  if (!slotContainer || !btnNewPet) return;

  const state = getState();
  slotContainer.innerHTML = '';

  state.pets.forEach((pet, index) => {
    const species = PET_SPECIES.find((s) => s.id === pet.speciesId);
    const slot = document.createElement('div');
    slot.className = `pet-slot ${index === state.activePetIndex ? 'active' : ''}`;
    slot.innerHTML = species ? species.stages[1].emoji : '❓';
    slot.title = `${pet.name} (Lv.${pet.level})`;
    slot.onclick = () => {
      if (index !== state.activePetIndex) {
        import('./gameState').then((m) => m.switchPet(index));
      }
    };
    slotContainer.appendChild(slot);
  });

  // Limit pets to 2 for now
  btnNewPet.disabled = state.pets.length >= 2;
  btnNewPet.onclick = () => {
    import('./gameState').then((m) => m.startNewPetProcess());
  };
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid')!;
  const state = getState();
  grid.innerHTML = '';

  if (state.inventory.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 12px;">背包空空如也，去完成任务获取道具吧！</div>';
    return;
  }

  for (const inv of state.inventory) {
    const itemDef = ITEMS.find((i) => i.id === inv.itemId);
    if (!itemDef || inv.count <= 0) continue;

    const el = document.createElement('div');
    el.className = 'inventory-item';
    el.dataset.itemId = inv.itemId;
    el.title = `${itemDef.name}: ${itemDef.description}\n点击使用`;
    el.innerHTML = `
      <span class="item-icon">${itemDef.emoji}</span>
      <span class="item-name">${itemDef.name}</span>
      <span class="item-count">×${inv.count}</span>
    `;
    initTiltEffect(el);
    grid.appendChild(el);
  }
}

export function cleanupNurture() {
  if (decayTimer) {
    clearInterval(decayTimer);
    decayTimer = null;
  }
  if (flipTimer) {
    clearInterval(flipTimer);
    flipTimer = null;
  }
}

async function performInteraction(type: 'food' | 'toy' | 'wash') {
  const pet = document.getElementById('pet-avatar')!;
  const facility = document.getElementById(`facility-${type}`)!;

  // 1. Position facility randomly but near center
  const fx = 30 + Math.random() * 40;
  const fy = 70 + Math.random() * 15;
  facility.style.left = `${fx}%`;
  facility.style.top = `${fy}%`;
  facility.classList.add('active');

  // 2. Move pet to facility
  if (fx < (parseFloat(pet.style.left) || 50)) pet.classList.add('flip-h');
  else pet.classList.remove('flip-h');

  pet.style.left = `${fx}%`;
  pet.style.top = `${fy}%`;
  pet.classList.add('wandering');

  // Sync Shadow
  updatePetShadow(`${fx}%`, `${fy}%`);

  // 3. Action Phase
  setTimeout(() => {
    pet.classList.remove('wandering');
    pet.classList.remove('micro-move');
    void pet.offsetWidth;
    pet.classList.add('micro-move');
    setTimeout(() => pet.classList.remove('micro-move'), 200);
  }, 1000);

  // 4. Cleanup Phase
  setTimeout(() => {
    facility.classList.remove('active');
  }, 3500);
}

export function showEvolution(oldStage: EvolutionStage, newStage: EvolutionStage) {
  const modal = document.getElementById('evolution-modal')!;
  const anim = document.getElementById('evolution-animation')!;
  modal.classList.remove('hidden');

  const species = getSpecies()!;
  const oldIdx = species.stages.indexOf(oldStage);
  const newIdx = species.stages.indexOf(newStage);

  const oldVisual = renderPetAvatar(species, oldIdx);
  const newVisual = renderPetAvatar(species, newIdx);

  anim.innerHTML = `
    <div class="evo-old-form">${oldVisual}</div>
    <div class="evo-arrow">⬇️</div>
    <div class="evo-new-form" style="opacity: 0; transform: scale(0.3);">${newVisual}</div>
    <div class="evo-title">🎊 进化成功！</div>
    <div class="evo-stage-name">${newStage.name}</div>
    <button class="btn btn-primary btn-glow evo-continue-btn">太棒了！ ✨</button>
  `;

  // Animate
  setTimeout(() => {
    const oldForm = anim.querySelector('.evo-old-form') as HTMLElement;
    const newForm = anim.querySelector('.evo-new-form') as HTMLElement;
    if (oldForm) {
      oldForm.style.opacity = '0.3';
      oldForm.style.transform = 'scale(0.5)';
    }
    if (newForm) {
      newForm.style.opacity = '1';
      newForm.style.transform = 'scale(1)';
      newForm.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }, 500);

  const btn = anim.querySelector('.evo-continue-btn')!;
  btn.addEventListener('click', () => {
    modal.classList.add('hidden');
    updatePetUI();
  });
}
