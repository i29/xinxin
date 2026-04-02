// ========================================
// Task System - Daily Tasks & Achievements
// ========================================

import { gameData, save, notify } from './store';

export interface TaskProgress {
  taskId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface TaskDef {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'achievement';
  target: number;
  reward: {
    coins: number;
    exp?: number;
  };
}

/**
 * Set task progress
 */
export function setTaskProgress(taskId: string, progress: number, completed: boolean) {
  const existing = gameData.tasks.find((t: TaskProgress) => t.taskId === taskId);
  if (existing) {
    existing.progress = progress;
    existing.completed = completed;
  } else {
    gameData.tasks.push({ taskId, progress, completed, claimed: false });
  }
  save();
  notify();
}

/**
 * Claim task reward
 */
export function claimTaskReward(taskId: string): boolean {
  const task = gameData.tasks.find((t: TaskProgress) => t.taskId === taskId);
  if (!task || !task.completed || task.claimed) return false;

  task.claimed = true;
  gameData.stats.totalTasksCompleted++;

  // Add rewards
  const taskDef = DAILY_TASKS.find((t) => t.id === taskId);
  if (taskDef) {
    gameData.coins += taskDef.reward.coins;
    if (taskDef.reward.exp) {
      // Import addExp carefully to avoid circular dependency
      // This will be handled by re-exporting from gameState
    }
  }

  save();
  notify();
  return true;
}

/**
 * Set achievement progress
 */
export function setAchievementProgress(
  achievementId: string,
  progress: number,
  completed: boolean
) {
  const existing = gameData.achievements.find((a: TaskProgress) => a.taskId === achievementId);
  if (existing) {
    existing.progress = progress;
    existing.completed = completed;
  } else {
    gameData.achievements.push({ taskId: achievementId, progress, completed, claimed: false });
  }
  save();
}

/**
 * Claim achievement reward
 */
export function claimAchievementReward(achievementId: string): boolean {
  const ach = gameData.achievements.find((a: TaskProgress) => a.taskId === achievementId);
  if (!ach || !ach.completed || ach.claimed) return false;

  ach.claimed = true;
  save();
  notify();
  return true;
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Check and reset daily tasks if it's a new day
 */
export function checkAndResetDailyTasks() {
  const today = getTodayString();
  if (gameData.lastDailyReset !== today) {
    gameData.lastDailyReset = today;
    gameData.totalDays++;
    // Reset daily tasks
    gameData.tasks = [];
    save();
  }
}

/**
 * Get all daily tasks with their progress
 */
export function getDailyTasksWithProgress(): Array<TaskDef & { progress: TaskProgress | null }> {
  return DAILY_TASKS.map((task) => {
    const progress = gameData.tasks.find((t: TaskProgress) => t.taskId === task.id) || null;
    return { ...task, progress };
  });
}

/**
 * Get all achievements with their progress
 */
export function getAchievementsWithProgress(): Array<TaskDef & { progress: TaskProgress | null }> {
  return ACHIEVEMENTS.map((ach) => {
    const progress = gameData.achievements.find((a: TaskProgress) => a.taskId === ach.id) || null;
    return { ...ach, progress };
  });
}

// Daily Task Definitions
export const DAILY_TASKS: TaskDef[] = [
  {
    id: 'feed_pet',
    title: '喂养宠物',
    description: '给宠物喂食 3 次',
    type: 'daily',
    target: 3,
    reward: { coins: 50, exp: 20 },
  },
  {
    id: 'play_pet',
    title: '陪伴玩耍',
    description: '和宠物玩耍 2 次',
    type: 'daily',
    target: 2,
    reward: { coins: 50, exp: 20 },
  },
  {
    id: 'clean_pet',
    title: '清洁护理',
    description: '给宠物洗澡 2 次',
    type: 'daily',
    target: 2,
    reward: { coins: 50, exp: 20 },
  },
  {
    id: 'battle_win',
    title: '冒险胜利',
    description: '在冒险中获胜 3 次',
    type: 'daily',
    target: 3,
    reward: { coins: 100, exp: 50 },
  },
  {
    id: 'use_items',
    title: '使用道具',
    description: '使用 5 个道具',
    type: 'daily',
    target: 5,
    reward: { coins: 75, exp: 30 },
  },
];

// Achievement Definitions
export const ACHIEVEMENTS: TaskDef[] = [
  {
    id: 'first_hatch',
    title: '新生命诞生',
    description: '成功孵化第一只宠物',
    type: 'achievement',
    target: 1,
    reward: { coins: 200, exp: 100 },
  },
  {
    id: 'level_10',
    title: '初出茅庐',
    description: '宠物达到 10 级',
    type: 'achievement',
    target: 1,
    reward: { coins: 500, exp: 200 },
  },
  {
    id: 'level_50',
    title: '训练有素',
    description: '宠物达到 50 级',
    type: 'achievement',
    target: 1,
    reward: { coins: 2000, exp: 500 },
  },
  {
    id: 'level_100',
    title: '传奇训练师',
    description: '宠物达到 100 级',
    type: 'achievement',
    target: 1,
    reward: { coins: 10000, exp: 2000 },
  },
  {
    id: 'all_species',
    title: '全图鉴收集',
    description: '孵化所有 6 种宠物',
    type: 'achievement',
    target: 6,
    reward: { coins: 5000, exp: 1000 },
  },
  {
    id: 'zone_complete',
    title: '冒险大师',
    description: '通关所有 3 个区域',
    type: 'achievement',
    target: 3,
    reward: { coins: 3000, exp: 800 },
  },
];
