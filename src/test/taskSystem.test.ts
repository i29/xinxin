// ========================================
// Task System Tests
// ========================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  setTaskProgress,
  claimTaskReward,
  setAchievementProgress,
  claimAchievementReward,
  getTodayString,
  checkAndResetDailyTasks,
  getDailyTasksWithProgress,
  getAchievementsWithProgress,
  DAILY_TASKS,
  ACHIEVEMENTS,
} from '../systems/taskSystem';
import { gameData, resetGame } from '../systems/store';

describe('Task System', () => {
  beforeEach(() => {
    resetGame();
  });

  describe('DAILY_TASKS', () => {
    it('should have 5 daily tasks', () => {
      expect(DAILY_TASKS).toHaveLength(5);
    });

    it('should have unique IDs', () => {
      const ids = DAILY_TASKS.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid rewards', () => {
      DAILY_TASKS.forEach((task) => {
        expect(task.reward.coins).toBeGreaterThan(0);
        expect(task.type).toBe('daily');
      });
    });
  });

  describe('ACHIEVEMENTS', () => {
    it('should have 6 achievements', () => {
      expect(ACHIEVEMENTS).toHaveLength(6);
    });

    it('should have unique IDs', () => {
      const ids = ACHIEVEMENTS.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('setTaskProgress', () => {
    it('should create new task if not exists', () => {
      setTaskProgress('feed_pet', 1, false);
      const task = gameData.tasks.find((t) => t.taskId === 'feed_pet');
      expect(task).toBeDefined();
      expect(task!.progress).toBe(1);
      expect(task!.completed).toBe(false);
    });

    it('should update existing task', () => {
      setTaskProgress('feed_pet', 1, false);
      setTaskProgress('feed_pet', 3, true);
      const task = gameData.tasks.find((t) => t.taskId === 'feed_pet');
      expect(task!.progress).toBe(3);
      expect(task!.completed).toBe(true);
    });
  });

  describe('claimTaskReward', () => {
    it('should return false if task not completed', () => {
      setTaskProgress('feed_pet', 1, false);
      const result = claimTaskReward('feed_pet');
      expect(result).toBe(false);
    });

    it('should return true and mark as claimed', () => {
      setTaskProgress('feed_pet', 3, true);
      const result = claimTaskReward('feed_pet');
      expect(result).toBe(true);

      const task = gameData.tasks.find((t) => t.taskId === 'feed_pet');
      expect(task!.claimed).toBe(true);
    });

    it('should increase totalTasksCompleted', () => {
      setTaskProgress('feed_pet', 3, true);
      const initialCount = gameData.stats.totalTasksCompleted;
      claimTaskReward('feed_pet');
      expect(gameData.stats.totalTasksCompleted).toBe(initialCount + 1);
    });

    it('should add coins to balance', () => {
      setTaskProgress('feed_pet', 3, true);
      const initialCoins = gameData.coins;
      claimTaskReward('feed_pet');
      expect(gameData.coins).toBe(initialCoins + 50); // feed_pet reward
    });

    it('should not allow double claiming', () => {
      setTaskProgress('feed_pet', 3, true);
      claimTaskReward('feed_pet');
      const result2 = claimTaskReward('feed_pet');
      expect(result2).toBe(false);
    });
  });

  describe('setAchievementProgress', () => {
    it('should create new achievement if not exists', () => {
      setAchievementProgress('first_hatch', 1, true);
      const ach = gameData.achievements.find((a) => a.taskId === 'first_hatch');
      expect(ach).toBeDefined();
      expect(ach!.completed).toBe(true);
    });

    it('should update existing achievement', () => {
      setAchievementProgress('first_hatch', 0, false);
      setAchievementProgress('first_hatch', 1, true);
      const ach = gameData.achievements.find((a) => a.taskId === 'first_hatch');
      expect(ach!.progress).toBe(1);
    });
  });

  describe('claimAchievementReward', () => {
    it('should return false if not completed', () => {
      setAchievementProgress('first_hatch', 0, false);
      const result = claimAchievementReward('first_hatch');
      expect(result).toBe(false);
    });

    it('should return true and mark as claimed', () => {
      setAchievementProgress('first_hatch', 1, true);
      const result = claimAchievementReward('first_hatch');
      expect(result).toBe(true);

      const ach = gameData.achievements.find((a) => a.taskId === 'first_hatch');
      expect(ach!.claimed).toBe(true);
    });
  });

  describe('getTodayString', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const today = getTodayString();
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      expect(regex.test(today)).toBe(true);
    });
  });

  describe('checkAndResetDailyTasks', () => {
    it('should reset tasks if day changed', () => {
      gameData.lastDailyReset = '2020-01-01';
      gameData.tasks = [{ taskId: 'old_task', progress: 5, completed: true, claimed: false }];

      checkAndResetDailyTasks();

      expect(gameData.tasks).toHaveLength(0);
      expect(gameData.totalDays).toBeGreaterThan(0);
    });

    it('should not reset if same day', () => {
      gameData.lastDailyReset = getTodayString();
      const initialDays = gameData.totalDays;

      checkAndResetDailyTasks();

      expect(gameData.totalDays).toBe(initialDays);
    });
  });

  describe('getDailyTasksWithProgress', () => {
    it('should return all daily tasks with progress', () => {
      const tasks = getDailyTasksWithProgress();
      expect(tasks).toHaveLength(5);
      expect(tasks[0].id).toBe('feed_pet');
    });

    it('should include null for unstarted tasks', () => {
      const tasks = getDailyTasksWithProgress();
      expect(tasks[0].progress).toBeNull();
    });

    it('should include progress for started tasks', () => {
      setTaskProgress('feed_pet', 1, false);
      const tasks = getDailyTasksWithProgress();
      expect(tasks.find((t) => t.id === 'feed_pet')!.progress).not.toBeNull();
    });
  });

  describe('getAchievementsWithProgress', () => {
    it('should return all achievements', () => {
      const achievements = getAchievementsWithProgress();
      expect(achievements).toHaveLength(6);
    });

    it('should include progress data', () => {
      setAchievementProgress('first_hatch', 1, true);
      const achievements = getAchievementsWithProgress();
      const firstHatch = achievements.find((a) => a.id === 'first_hatch');
      expect(firstHatch!.progress).not.toBeNull();
      expect(firstHatch!.progress!.completed).toBe(true);
    });
  });
});
