// ========================================
// Task Panel - Daily Tasks, Achievements, Challenges
// ========================================

import { getState, setTaskProgress, addItem, buyItem } from './gameState';
import { ITEMS } from './petData';
import {
  generateDailyTasks,
  getAchievements,
  claimDailyTaskReward,
  claimAchievementRewardFull,
  getRandomQuizQuestions,
  updateAchievements,
  type TaskDef,
} from './taskSystem';
import { updatePetUI } from './petNurture';

let currentTab = 'daily';

export function initTaskPanel() {
  // Tab buttons
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = (tab as HTMLElement).dataset.tab || 'daily';
      renderTasks();
    });
  });

  renderTasks();
}

export function renderTasks() {
  updateAchievements();
  const content = document.getElementById('tasks-content')!;

  switch (currentTab) {
    case 'daily':
      renderDailyTasks(content);
      break;
    case 'shop':
      renderShop(content);
      break;
    case 'achievement':
      renderAchievements(content);
      break;
    case 'challenge':
      renderChallenges(content);
      break;
    case 'journal':
      renderJournal(content);
      break;
  }
}

function renderDailyTasks(container: HTMLElement) {
  const tasks = generateDailyTasks();
  const state = getState();
  container.innerHTML = '';

  for (const task of tasks) {
    const tp = state.tasks.find((t: { taskId: string; progress: number; completed: boolean; claimed: boolean }) => t.taskId === task.id);
    const progress = tp ? tp.progress : 0;
    const completed = tp ? tp.completed : false;
    const claimed = tp ? tp.claimed : false;

    const card = document.createElement('div');
    card.className = `task-card ${claimed ? 'completed' : ''}`;

    const rewardText =
      task.rewards
        .map((r) => {
          const item = ITEMS.find((i) => i.id === r.itemId);
          return item ? `${item.emoji}×${r.count}` : '';
        })
        .join(' ') + (task.expReward ? ` +${task.expReward}exp` : '');

    card.innerHTML = `
      <div class="task-card-header">
        <div class="task-card-title">${task.emoji} ${task.name}</div>
        <div class="task-card-reward">${rewardText}</div>
      </div>
      <div class="task-card-desc">${task.description}</div>
      <div class="task-card-footer">
        <div class="task-progress-mini">
          <div class="mini-bar"><div class="mini-fill" style="width: ${(progress / task.targetCount) * 100}%"></div></div>
          <span class="mini-text">${progress}/${task.targetCount}</span>
        </div>
        ${getTaskButton(task, completed, claimed)}
      </div>
    `;

    // Bind button actions
    const btn = card.querySelector('.task-action-btn') as HTMLElement;
    if (btn) {
      if (claimed) {
        // Already claimed
      } else if (completed) {
        btn.addEventListener('click', () => {
          claimDailyTaskReward(task);
          renderTasks();
          updatePetUI();
        });
      } else if (task.type !== 'auto') {
        btn.addEventListener('click', () => {
          startMiniGame(task);
        });
      }
    }

    container.appendChild(card);
  }
}

function getTaskButton(task: TaskDef, completed: boolean, claimed: boolean): string {
  if (claimed) {
    return '<span style="color: var(--accent-emerald); font-size: 0.8rem;">✅ 已领取</span>';
  }
  if (completed) {
    return '<button class="btn btn-sm btn-success task-action-btn">领取奖励 🎁</button>';
  }
  if (task.type === 'auto') {
    return '<span style="color: var(--text-muted); font-size: 0.75rem;">自动追踪</span>';
  }
  return '<button class="btn btn-sm btn-amber task-action-btn">开始 ▶</button>';
}

function renderAchievements(container: HTMLElement) {
  const achs = getAchievements();
  const state = getState();
  container.innerHTML = '';

  for (const ach of achs) {
    const ap = state.achievements.find((a: { taskId: string; progress: number; completed: boolean; claimed: boolean }) => a.taskId === ach.id);
    const progress = ap ? ap.progress : 0;
    const completed = ap ? ap.completed : false;
    const claimed = ap ? ap.claimed : false;

    const card = document.createElement('div');
    card.className = `task-card ${claimed ? 'completed' : ''}`;

    const rewardText =
      ach.rewards
        .map((r) => {
          const item = ITEMS.find((i) => i.id === r.itemId);
          return item ? `${item.emoji}×${r.count}` : '';
        })
        .join(' ') + (ach.expReward ? ` +${ach.expReward}exp` : '');

    card.innerHTML = `
      <div class="task-card-header">
        <div class="task-card-title">${ach.emoji} ${ach.name}</div>
        <div class="task-card-reward">${rewardText}</div>
      </div>
      <div class="task-card-desc">${ach.description}</div>
      <div class="task-card-footer">
        <div class="task-progress-mini">
          <div class="mini-bar"><div class="mini-fill" style="width: ${(progress / ach.targetValue) * 100}%"></div></div>
          <span class="mini-text">${progress}/${ach.targetValue}</span>
        </div>
        ${
          claimed
            ? '<span style="color: var(--accent-emerald); font-size: 0.8rem;">✅ 已领取</span>'
            : completed
              ? '<button class="btn btn-sm btn-success ach-claim-btn">领取 🎁</button>'
              : '<span style="color: var(--text-muted); font-size: 0.75rem;">进行中</span>'
        }
      </div>
    `;

    const claimBtn = card.querySelector('.ach-claim-btn');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        claimAchievementRewardFull(ach);
        renderTasks();
        updatePetUI();
      });
    }

    container.appendChild(card);
  }
}

function renderShop(container: HTMLElement) {
  const state = getState();
  container.innerHTML = '';

  // 1. Welfare Section (if inventory is empty)
  const isInventoryEmpty = state.inventory.length === 0;
  if (isInventoryEmpty) {
    const welfare = document.createElement('div');
    welfare.className = 'welfare-banner';
    welfare.innerHTML = `
      <div>
        <h4 style="margin-bottom: 4px;">🎁 每日救济礼包</h4>
        <p>检测到您的背包空空如也，送您一些基础补给！</p>
      </div>
      <button class="btn btn-sm btn-success" id="btn-claim-welfare">领取 🥖</button>
    `;
    container.appendChild(welfare);

    welfare.querySelector('#btn-claim-welfare')?.addEventListener('click', () => {
      addItem('bread', 3);
      addItem('soap', 1);
      addItem('ball', 1);
      renderTasks();
      updatePetUI();
    });
  }

  // 2. Shop Items
  const shopGrid = document.createElement('div');
  shopGrid.className = 'shop-grid';

  // Include all items in shop now
  const shopItems = ITEMS;

  for (const item of shopItems) {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-card-emoji">${item.emoji}</div>
      <div class="shop-card-name">${item.name}</div>
      <div class="shop-card-price">🪙 ${item.price}</div>
      <button class="btn btn-xs btn-amber shop-buy-btn" data-id="${item.id}" ${state.coins < item.price ? 'disabled' : ''}>购买</button>
    `;

    card.querySelector('.shop-buy-btn')?.addEventListener('click', () => {
      if (buyItem(item.id)) {
        renderTasks();
        updatePetUI();
      }
    });

    shopGrid.appendChild(card);
  }

  container.appendChild(shopGrid);
}

function renderChallenges(container: HTMLElement) {
  container.innerHTML = `
    <div style="padding: 40px; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 16px;">🎲</div>
      <h3 style="margin-bottom: 8px;">限时挑战</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
        完成特殊挑战获取丰厚奖励！
      </p>
      <div class="task-card" style="margin-bottom: 10px;">
        <div class="task-card-header">
          <div class="task-card-title">🧩 模式记忆挑战</div>
          <div class="task-card-reward">🧪×2 💎×1</div>
        </div>
        <div class="task-card-desc">记住并重复出现的表情符号模式！</div>
        <div class="task-card-footer">
          <div></div>
          <button class="btn btn-sm btn-amber" id="challenge-pattern-btn">挑战 ⚡</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('challenge-pattern-btn')?.addEventListener('click', () => {
    startPatternChallenge();
  });
}

// ========================================
// Mini Games
// ========================================

function openModal(title: string) {
  const modal = document.getElementById('minigame-modal')!;
  document.getElementById('minigame-title')!.textContent = title;
  modal.classList.remove('hidden');

  const closeBtn = document.getElementById('minigame-close')!;
  const overlay = modal.querySelector('.modal-overlay')!;

  const close = () => {
    modal.classList.add('hidden');
    document.getElementById('minigame-body')!.innerHTML = '';
  };

  closeBtn.onclick = close;
  overlay.addEventListener('click', close, { once: true });
}

function startMiniGame(task: TaskDef) {
  switch (task.type) {
    case 'checkin':
      // Instant complete
      setTaskProgress(task.id, 1, true);
      renderTasks();
      break;
    case 'click':
      startClickGame(task);
      break;
    case 'quiz':
      startQuizGame(task);
      break;
    case 'memory':
      startMemoryGame(task);
      break;
  }
}

// --- Click Game ---
function startClickGame(task: TaskDef) {
  openModal('👆 连续点击挑战');
  const body = document.getElementById('minigame-body')!;
  let clicks = 0;
  let timeLeft = 10;
  let timer: ReturnType<typeof setInterval>;

  body.innerHTML = `
    <div class="click-game-area">
      <div class="click-timer">⏱️ 剩余时间: <span id="click-time">${timeLeft}</span>秒</div>
      <div class="click-counter" id="click-count">0</div>
      <div class="click-target" id="click-target">👆</div>
      <div style="color: var(--text-muted); font-size: 0.8rem;">目标: ${task.targetCount} 次</div>
    </div>
  `;

  const target = document.getElementById('click-target')!;
  const countEl = document.getElementById('click-count')!;
  const timeEl = document.getElementById('click-time')!;

  target.addEventListener('click', () => {
    clicks++;
    countEl.textContent = String(clicks);
    target.style.transform = 'scale(0.85)';
    setTimeout(() => {
      target.style.transform = '';
    }, 100);
  });

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = String(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      const success = clicks >= task.targetCount;
      setTaskProgress(task.id, Math.min(clicks, task.targetCount), success);
      body.innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">${success ? '🎉' : '😅'}</div>
          <h3>${success ? '挑战成功！' : '差一点点！'}</h3>
          <p style="color: var(--text-muted);">你点击了 ${clicks} 次 ${success ? '' : `(需要 ${task.targetCount} 次)`}</p>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="document.getElementById('minigame-modal').classList.add('hidden')">确定</button>
        </div>
      `;
      renderTasks();
    }
  }, 1000);
}

// --- Quiz Game ---
function startQuizGame(task: TaskDef) {
  openModal('❓ 宠物知识问答');
  const body = document.getElementById('minigame-body')!;
  const questions = getRandomQuizQuestions(task.targetCount);
  let correct = 0;

  function showQuestion(idx: number) {
    if (idx >= questions.length) {
      // Done
      const success = correct >= task.targetCount;
      setTaskProgress(task.id, correct, success);
      body.innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">${success ? '🎉' : '😅'}</div>
          <h3>${success ? '全部答对！' : '再接再厉！'}</h3>
          <p style="color: var(--text-muted);">正确: ${correct}/${questions.length}</p>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="document.getElementById('minigame-modal').classList.add('hidden')">确定</button>
        </div>
      `;
      renderTasks();
      return;
    }

    const q = questions[idx];
    body.innerHTML = `
      <div class="quiz-container">
        <div style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 8px;">问题 ${idx + 1}/${questions.length}</div>
        <div class="quiz-question">${q.question}</div>
        ${q.options.map((opt, i) => `<button class="quiz-option" data-idx="${i}">${opt}</button>`).join('')}
      </div>
    `;

    body.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosenIdx = parseInt((btn as HTMLElement).dataset.idx || '0');
        const isCorrect = chosenIdx === q.correctIndex;

        // Highlight answers
        body.querySelectorAll('.quiz-option').forEach((b, i) => {
          (b as HTMLElement).style.pointerEvents = 'none';
          if (i === q.correctIndex) b.classList.add('correct');
          if (i === chosenIdx && !isCorrect) b.classList.add('wrong');
        });

        if (isCorrect) correct++;

        setTimeout(() => showQuestion(idx + 1), 1200);
      });
    });
  }

  showQuestion(0);
}

// --- Memory Game ---
function startMemoryGame(task: TaskDef) {
  openModal('🃏 记忆翻牌');
  const body = document.getElementById('minigame-body')!;
  const emojis = ['🐱', '🐶', '🐰', '🐹', '🦊', '🦄'];
  const pairs = emojis.slice(0, task.targetCount);
  const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
  let flipped: number[] = [];
  let matched = 0;
  let locked = false;

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 12px;">
      <span style="color: var(--text-muted); font-size: 0.85rem;">找出所有配对！已配对: <span id="match-count">0</span>/${task.targetCount}</span>
    </div>
    <div class="memory-grid">
      ${cards.map((_, i) => `<div class="memory-card" data-idx="${i}">❓</div>`).join('')}
    </div>
  `;

  const grid = body.querySelector('.memory-grid')!;
  grid.addEventListener('click', (e) => {
    if (locked) return;
    const card = (e.target as HTMLElement).closest('.memory-card') as HTMLElement;
    if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    const idx = parseInt(card.dataset.idx || '0');
    card.textContent = cards[idx];
    card.classList.add('flipped');
    flipped.push(idx);

    if (flipped.length === 2) {
      locked = true;
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        // Match!
        matched++;
        document.getElementById('match-count')!.textContent = String(matched);
        const cardA = grid.querySelector(`[data-idx="${a}"]`)!;
        const cardB = grid.querySelector(`[data-idx="${b}"]`)!;
        cardA.classList.add('matched');
        cardB.classList.add('matched');
        flipped = [];
        locked = false;

        if (matched >= task.targetCount) {
          setTaskProgress(task.id, matched, true);
          setTimeout(() => {
            body.innerHTML = `
              <div style="text-align: center; padding: 30px;">
                <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
                <h3>全部找到了！</h3>
                <button class="btn btn-primary" style="margin-top: 16px;" onclick="document.getElementById('minigame-modal').classList.add('hidden')">确定</button>
              </div>
            `;
            renderTasks();
          }, 600);
        }
      } else {
        setTimeout(() => {
          const cardA = grid.querySelector(`[data-idx="${a}"]`) as HTMLElement;
          const cardB = grid.querySelector(`[data-idx="${b}"]`) as HTMLElement;
          cardA.textContent = '❓';
          cardB.textContent = '❓';
          cardA.classList.remove('flipped');
          cardB.classList.remove('flipped');
          flipped = [];
          locked = false;
        }, 800);
      }
    }
  });
}

// --- Pattern Challenge ---
function startPatternChallenge() {
  openModal('🧩 模式记忆挑战');
  const body = document.getElementById('minigame-body')!;
  const emojis = ['🍎', '🍌', '🍇', '🍒', '🥝', '🫐'];
  let pattern: string[] = [];
  let userPattern: string[] = [];
  let level = 1;
  const maxLevels = 5;
  let isShowing = false;

  function nextLevel() {
    if (level > maxLevels) {
      finishGame(true);
      return;
    }
    userPattern = [];
    pattern.push(emojis[Math.floor(Math.random() * emojis.length)]);
    showPattern();
  }

  async function showPattern() {
    isShowing = true;
    body.innerHTML = `
      <div class="pattern-game-area">
        <div class="pattern-level">第 ${level}/${maxLevels} 关</div>
        <div class="pattern-display" id="pattern-show">...</div>
        <div class="pattern-controls" style="opacity: 0.5; pointer-events: none;">
          ${emojis.map((e) => `<button class="pattern-btn">${e}</button>`).join('')}
        </div>
      </div>
    `;

    const display = document.getElementById('pattern-show') as HTMLElement;
    for (const emoji of pattern) {
      display.textContent = emoji;
      display.style.transform = 'scale(1.2)';
      await new Promise((r) => setTimeout(r, 600));
      display.textContent = '';
      display.style.transform = 'scale(1)';
      await new Promise((r) => setTimeout(r, 200));
    }

    display.textContent = '请重复模式！';
    const controls = body.querySelector('.pattern-controls') as HTMLElement;
    controls.style.opacity = '1';
    controls.style.pointerEvents = 'auto';
    isShowing = false;

    body.querySelectorAll('.pattern-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isShowing) return;
        const e = btn.textContent!;
        userPattern.push(e);

        // Visual feedback
        (btn as HTMLElement).style.transform = 'scale(0.9)';
        setTimeout(() => ((btn as HTMLElement).style.transform = ''), 100);

        if (userPattern[userPattern.length - 1] !== pattern[userPattern.length - 1]) {
          finishGame(false);
          return;
        }

        if (userPattern.length === pattern.length) {
          level++;
          setTimeout(nextLevel, 1000);
        }
      });
    });
  }

  function finishGame(success: boolean) {
    if (success) {
      addItem('exp_md', 2);
      addItem('exp_lg', 1);
    }
    body.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">${success ? '🏆' : '😤'}</div>
        <h3>${success ? '完美记忆！' : '记错了哦~'}</h3>
        <p style="color: var(--text-muted);">${success ? '挑战成功，获得丰厚奖励！' : `在第 ${level} 关失败了`}</p>
        ${success ? '<p style="color: var(--accent-emerald);">获得: 🧪×2 💎×1</p>' : ''}
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="document.getElementById('minigame-modal').classList.add('hidden')">确定</button>
      </div>
    `;
    renderTasks();
    updatePetUI();
  }

  nextLevel();
}

function renderJournal(container: HTMLElement) {
  const state = getState();
  const journal = state.journal;

  if (journal.length === 0) {
    container.innerHTML = `
      <div style="padding: 60px 20px; text-align: center; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 16px;">📚</div>
        <p>还没有记录任何成长瞬间哦~</p>
      </div>
    `;
    return;
  }

  const typeIcons: Record<string, string> = {
    birth: '🥚',
    level_up: '🆙',
    evolution: '🦋',
    milestone: '🌟',
  };

  const typeNames: Record<string, string> = {
    birth: '诞生时刻',
    level_up: '等级提升',
    evolution: '进化突破',
    milestone: '重要里程',
  };

  container.innerHTML = `
    <div class="journal-timeline">
      ${journal
        .map(
          (entry: { timestamp: number; event: string; details: string; type: string }) => `
        <div class="journal-entry entry-type-${entry.type}">
          <div class="entry-header">
            <span class="entry-icon">${typeIcons[entry.type] || '📝'}</span>
            <span class="entry-time">${new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
          <div class="entry-dot"></div>
          <div class="entry-content">
            <div class="entry-badge">${typeNames[entry.type] || '详情'}</div>
            <div class="entry-title">${entry.event}</div>
            <div class="entry-details">${entry.details}</div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}
