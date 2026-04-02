// ========================================
// Main Entry - App Router & Init
// ========================================

import './style.css';
import {
  load,
  getState,
  subscribe,
  getActivePet,
  startNurture,
  checkAndResetDailyTasks,
  type GamePhase,
} from './gameState';
import { PET_SPECIES, getStageIndex, renderPetAvatar } from './petData';
import { initStarField } from './animations';
import { initEggSelection } from './eggSelection';
import { initHatching, cleanupHatching } from './hatching';
import { initPetNurture } from './petNurture';
import { initTaskPanel } from './taskPanel';
import { initAdventureView } from './adventureView';

// Load game state
load();
checkAndResetDailyTasks();

// Init star background
const canvas = document.getElementById('stars-canvas') as HTMLCanvasElement;
if (canvas) {
  initStarField(canvas);
}

// View management
const views: Record<string, HTMLElement> = {
  egg_selection: document.getElementById('view-egg-selection')!,
  hatching: document.getElementById('view-hatching')!,
  birth: document.getElementById('view-birth')!,
  nurture: document.getElementById('view-nurture')!,
  adventure: document.getElementById('view-adventure')!,
};

function showView(phase: GamePhase) {
  Object.entries(views).forEach(([key, el]) => {
    if (key === phase) {
      el.classList.remove('hidden');
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'fadeIn 0.6s ease';
    } else {
      el.classList.add('hidden');
    }
  });

  // Init view-specific logic
  switch (phase) {
    case 'egg_selection':
      initEggSelection();
      break;
    case 'hatching':
      initHatching();
      break;
    case 'birth':
      initBirthView();
      break;
    case 'nurture':
      checkAndResetDailyTasks();
      initPetNurture();
      initTaskPanel();
      break;
    case 'adventure':
      initAdventureView();
      break;
  }
}

function initBirthView() {
  const pet = getActivePet();
  if (!pet) return;
  const species = PET_SPECIES.find((s) => s.id === pet.speciesId)!;

  const birthPetEl = document.getElementById('birth-pet')!;
  const stageIdx = getStageIndex(species, pet.level);
  birthPetEl.innerHTML = renderPetAvatar(species, stageIdx);

  document.getElementById('birth-name')!.textContent = `${species.name} 诞生了！`;
  document.getElementById('birth-desc')!.textContent = species.description;

  const btn = document.getElementById('birth-continue')!;
  btn.onclick = () => {
    cleanupHatching();
    startNurture();
  };
}

// Subscribe to state changes for view switching
let currentPhase = getState().phase;
subscribe(() => {
  const newPhase = getState().phase;
  if (newPhase !== currentPhase) {
    currentPhase = newPhase;
    showView(newPhase);
  }
});

// Initial view
showView(getState().phase);
