// ========================================
// Egg Selection View
// ========================================

import { PET_SPECIES } from './petData';
import { selectEgg } from './gameState';
import { initTiltEffect } from './animations';

const EGG_EMOJIS = ['🥚', '🪺', '🥚', '🥚', '🥚', '🥚'];
const EGG_NAMES = ['暖阳之蛋', '海浪之蛋', '花瓣之蛋', '烈焰之蛋', '星辰之蛋', '彩虹之蛋'];

export function initEggSelection() {
  const grid = document.getElementById('egg-grid')!;
  const hint = document.getElementById('egg-hint')!;
  grid.innerHTML = '';

  PET_SPECIES.forEach((species, index) => {
    const card = document.createElement('div');
    card.className = 'egg-card';
    card.dataset.eggIndex = String(index);
    card.style.setProperty('--egg-glow', species.eggGlow);
    card.innerHTML = `
      <div class="egg-emoji" style="animation-delay: ${index * 0.3}s">${EGG_EMOJIS[index]}</div>
      <div class="egg-name">${EGG_NAMES[index]}</div>
      <div class="egg-mystery">??? 未知生物</div>
    `;

    // Glow on hover
    card.style.cssText += `--egg-bg: ${species.eggColor};`;
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = species.eggGlow;
      card.style.boxShadow = `0 0 30px ${species.eggGlow}, inset 0 0 30px rgba(255,255,255,0.03)`;
      hint.textContent = `💭 ${species.hint}`;
      hint.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'transparent';
      card.style.boxShadow = 'none';
      hint.style.opacity = '0.5';
    });

    card.addEventListener('click', () => {
      showEggConfirmModal(index, EGG_NAMES[index]);
    });

    initTiltEffect(card);

    grid.appendChild(card);
  });
}

function showEggConfirmModal(index: number, eggName: string) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'egg-confirm-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content glass-card" style="text-align: center; max-width: 380px;">
      <div style="font-size: 4rem; margin-bottom: 12px;">${EGG_EMOJIS[index]}</div>
      <h2 style="margin-bottom: 8px; font-size: 1.3rem;">确定选择</h2>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">「${eggName}」<br><small style="color: var(--text-muted);">${PET_SPECIES[index].hint}</small></p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn btn-sm" id="egg-cancel-btn" style="background: rgba(255,255,255,0.1); color: var(--text-secondary);">再想想 🤔</button>
        <button class="btn btn-sm btn-primary btn-glow" id="egg-confirm-btn">确定选择 ✨</button>
      </div>
    </div>
  `;

  document.getElementById('app')!.appendChild(modal);

  // Cancel
  document.getElementById('egg-cancel-btn')!.addEventListener('click', () => {
    modal.remove();
  });
  modal.querySelector('.modal-overlay')!.addEventListener('click', () => {
    modal.remove();
  });

  // Confirm
  document.getElementById('egg-confirm-btn')!.addEventListener('click', () => {
    modal.remove();
    selectEgg(index);
  });
}
