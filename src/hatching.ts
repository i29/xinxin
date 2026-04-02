// ========================================
// Hatching View
// ========================================

import { getState, addHatchProgress, hatchComplete } from './gameState';
import { PET_SPECIES } from './petData';
import { shakeElement, hatchExplosion, burstParticles } from './animations';

let hatchingInterval: ReturnType<typeof setInterval> | null = null;

export function initHatching() {
  const egg = document.getElementById('hatching-egg')!;
  const progressFill = document.getElementById('hatching-progress')!;
  const percentText = document.getElementById('hatching-percent')!;
  const clicksText = document.getElementById('hatching-clicks')!;
  const particlesContainer = document.getElementById('hatch-particles')!;

  const state = getState();
  const species = PET_SPECIES[state.selectedEggIndex];

  // Set egg glow color
  const eggGlow = egg.querySelector('.egg-glow') as HTMLElement;
  if (eggGlow) {
    eggGlow.style.background = `radial-gradient(circle, ${species.eggGlow}, transparent 70%)`;
  }

  function updateUI() {
    const s = getState();
    progressFill.style.width = s.hatchProgress + '%';
    percentText.textContent = Math.floor(s.hatchProgress) + '%';
    clicksText.textContent = `点击次数: ${s.hatchClicks}`;

    // Show cracks as progress increases
    const cracks = egg.querySelectorAll('.egg-crack');
    cracks.forEach((crack, i) => {
      const el = crack as HTMLElement;
      if (s.hatchProgress > (i + 1) * 25) {
        el.style.opacity = '1';
        el.style.height = 15 + s.hatchProgress * 0.3 + 'px';
      }
    });

    // Increase glow
    if (eggGlow) {
      eggGlow.style.opacity = String(Math.min(0.8, s.hatchProgress / 100));
    }
  }

  // Click to hatch
  egg.addEventListener('click', (e) => {
    const progress = 1.5 + Math.random() * 1; // 1.5-2.5% per click
    const done = addHatchProgress(progress);
    shakeElement(egg);

    // Click particles
    const rect = egg.getBoundingClientRect();
    const px = e.clientX - rect.left + egg.offsetLeft;
    const py = e.clientY - rect.top + egg.offsetTop;
    burstParticles(egg.parentElement!, px, py, 5, species.eggGlow);

    updateUI();

    if (done) {
      // Hatch animation!
      egg.style.pointerEvents = 'none';
      hatchExplosion(particlesContainer);
      egg.querySelector('.egg-body')!.classList.add('shake');

      setTimeout(() => {
        hatchComplete();
      }, 1200);
    }
  });

  // Auto-progress (slow background hatching)
  hatchingInterval = setInterval(() => {
    const s = getState();
    if (s.hatchProgress < 100 && s.phase === 'hatching') {
      addHatchProgress(0.1);
      updateUI();
    }
  }, 2000);

  updateUI();
}

export function cleanupHatching() {
  if (hatchingInterval) {
    clearInterval(hatchingInterval);
    hatchingInterval = null;
  }
}
