import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getState,
  subscribe,
  getActivePet,
  selectEgg,
  addHatchProgress,
  hatchComplete,
  addCoins,
  buyItem,
  addItem,
  useItem,
  addExp,
  save,
  load,
  resetGame,
  checkAndResetDailyTasks,
  addJournalEntry,
  switchPet,
  startNewPetProcess,
  setTaskProgress,
  claimTaskReward,
} from '../gameState';
import { PET_SPECIES } from '../petData';

describe('GameState', () => {
  beforeEach(() => {
    // 重置状态
    resetGame();
    // 清除localStorage mock
    vi.clearAllMocks();
  });

  describe('getState', () => {
    it('should return default state on first load', () => {
      const state = getState();
      expect(state.phase).toBe('egg_selection');
      expect(state.pets).toEqual([]);
      expect(state.coins).toBe(200);
      expect(state.inventory).toEqual([]);
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on state change', () => {
      const mockCallback = vi.fn();
      subscribe(mockCallback);
      addCoins(100);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should allow unsubscribing', () => {
      const mockCallback = vi.fn();
      const unsubscribe = subscribe(mockCallback);
      unsubscribe();
      addCoins(100);
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('getActivePet', () => {
    it('should return null when no pets exist', () => {
      const pet = getActivePet();
      expect(pet).toBeNull();
    });

    it('should return active pet after hatch', () => {
      selectEgg(0);
      hatchComplete();
      const pet = getActivePet();
      expect(pet).not.toBeNull();
      expect(pet?.speciesId).toBe(PET_SPECIES[0].id);
    });
  });

  describe('selectEgg', () => {
    it('should set phase to hatching', () => {
      selectEgg(1);
      const state = getState();
      expect(state.phase).toBe('hatching');
      expect(state.selectedEggIndex).toBe(1);
    });
  });

  describe('addHatchProgress', () => {
    it('should increase hatch progress', () => {
      selectEgg(0);
      const result = addHatchProgress(10);
      const state = getState();
      expect(state.hatchProgress).toBe(10);
      expect(result).toBe(false); // not complete yet
    });

    it('should return true when progress reaches 100', () => {
      selectEgg(0);
      const result = addHatchProgress(100);
      expect(result).toBe(true);
    });
  });

  describe('hatchComplete', () => {
    it('should create a new pet and set phase to birth', () => {
      selectEgg(0);
      hatchComplete();
      const state = getState();
      expect(state.phase).toBe('birth');
      expect(state.pets.length).toBe(1);
      expect(state.activePetIndex).toBe(0);
    });
  });

  describe('addCoins', () => {
    it('should increase coins', () => {
      addCoins(50);
      const state = getState();
      expect(state.coins).toBe(250); // 200 initial + 50
    });

    it('should add journal entry for large amounts', () => {
      addCoins(200);
      const state = getState();
      const journalEntry = state.journal.find((j: { event: string }) => j.event === '财富积累');
      expect(journalEntry).toBeDefined();
    });
  });

  describe('buyItem', () => {
    it('should purchase item if enough coins', () => {
      const result = buyItem('bread');
      expect(result).toBe(true);
      const state = getState();
      expect(state.coins).toBeLessThan(200);
      expect(state.inventory.some((i: { itemId: string }) => i.itemId === 'bread')).toBe(true);
    });

    it('should not purchase if not enough coins', () => {
      // Set coins to 0
      const state = getState();
      state.coins = 0;
      save();
      const result = buyItem('bread');
      expect(result).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should add new item to inventory', () => {
      addItem('ball', 2);
      const state = getState();
      const item = state.inventory.find((i: { itemId: string }) => i.itemId === 'ball');
      expect(item).toBeDefined();
      expect(item?.count).toBe(2);
    });

    it('should increase count for existing item', () => {
      addItem('ball', 1);
      addItem('ball', 3);
      const state = getState();
      const item = state.inventory.find((i: { itemId: string }) => i.itemId === 'ball');
      expect(item?.count).toBe(4);
    });
  });

  describe('useItem', () => {
    beforeEach(() => {
      selectEgg(0);
      hatchComplete();
      addItem('bread', 1);
    });

    it('should use item successfully', () => {
      const result = useItem('bread');
      expect(result.success).toBe(true);
      const state = getState();
      const item = state.inventory.find((i: { itemId: string }) => i.itemId === 'bread');
      expect(item).toBeUndefined(); // item should be removed when count reaches 0
    });

    it('should not use non-existent item', () => {
      const result = useItem('nonexistent');
      expect(result.success).toBe(false);
    });
  });

  describe('addExp', () => {
    beforeEach(() => {
      selectEgg(0);
      hatchComplete();
    });

    it('should increase experience', () => {
      addExp(50);
      const pet = getActivePet();
      // Level 1 needs 20 exp to level up, so after adding 50, we should have 30 left
      expect(pet?.exp).toBe(30);
      expect(pet?.level).toBe(2); // Should have leveled up
    });

    it('should level up when enough experience', () => {
      addExp(150); // Should level up
      const pet = getActivePet();
      expect(pet?.level).toBeGreaterThan(1);
    });
  });

  describe('save/load', () => {
    it('should save and load state correctly', () => {
      // Mock localStorage for this test
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
      vi.stubGlobal('localStorage', localStorageMock);

      // Add coins and save
      addCoins(100);
      save();

      // Verify localStorage.setItem was called
      expect(localStorageMock.setItem).toHaveBeenCalled();

      // Get the saved data
      const savedData = JSON.stringify(getState());
      localStorageMock.getItem.mockReturnValue(savedData);

      // Reset state
      resetGame();
      expect(getState().coins).toBe(200); // Back to default

      // Load the saved state
      load();
      const state = getState();
      expect(state.coins).toBe(300); // 200 initial + 100
    });
  });

  describe('checkAndResetDailyTasks', () => {
    it('should reset tasks on new day', () => {
      const state = getState();
      state.lastDailyReset = '2020-01-01';
      save();
      checkAndResetDailyTasks();
      const newState = getState();
      expect(newState.tasks).toEqual([]);
    });
  });

  describe('addJournalEntry', () => {
    it('should add entry to journal', () => {
      addJournalEntry('birth', '测试事件', '测试详情');
      const state = getState();
      expect(state.journal.length).toBe(1);
      expect(state.journal[0].event).toBe('测试事件');
    });

    it('should keep only last 50 entries', () => {
      for (let i = 0; i < 60; i++) {
        addJournalEntry('milestone', `事件${i}`, `详情${i}`);
      }
      const state = getState();
      expect(state.journal.length).toBe(50);
    });
  });

  describe('switchPet', () => {
    beforeEach(() => {
      selectEgg(0);
      hatchComplete();
      selectEgg(1);
      hatchComplete();
    });

    it('should switch active pet', () => {
      switchPet(1);
      const pet = getActivePet();
      expect(pet?.speciesId).toBe(PET_SPECIES[1].id);
    });
  });

  describe('startNewPetProcess', () => {
    it('should reset phase to egg_selection', () => {
      selectEgg(0);
      hatchComplete();
      startNewPetProcess();
      const state = getState();
      expect(state.phase).toBe('egg_selection');
    });

    it('should not allow more than 2 pets', () => {
      selectEgg(0);
      hatchComplete();
      selectEgg(1);
      hatchComplete();
      startNewPetProcess();
      const state = getState();
      expect(state.pets.length).toBe(2);
    });
  });

  describe('setTaskProgress', () => {
    it('should set task progress', () => {
      setTaskProgress('test_task', 50, false);
      const state = getState();
      const task = state.tasks.find((t: { taskId: string }) => t.taskId === 'test_task');
      expect(task?.progress).toBe(50);
      expect(task?.completed).toBe(false);
    });
  });

  describe('claimTaskReward', () => {
    it('should claim completed task reward', () => {
      setTaskProgress('test_task', 100, true);
      const result = claimTaskReward('test_task');
      expect(result).toBe(true);
      const state = getState();
      const task = state.tasks.find((t: { taskId: string }) => t.taskId === 'test_task');
      expect(task?.claimed).toBe(true);
    });
  });
});