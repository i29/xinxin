// ========================================
// Journal System Tests
// ========================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  addJournalEntry,
  getJournalEntries,
  clearJournal,
  getEntryCountByType,
} from '../systems/journal';
import { resetGame } from '../systems/store';

describe('Journal System', () => {
  beforeEach(() => {
    resetGame();
  });

  describe('addJournalEntry', () => {
    it('should add a new journal entry', () => {
      addJournalEntry('birth', 'Test Event', 'Test Details');
      const entries = getJournalEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].event).toBe('Test Event');
    });

    it('should add timestamp automatically', () => {
      const before = Date.now();
      addJournalEntry('level_up', 'Level Up', 'Reached level 5');
      const after = Date.now();

      const entries = getJournalEntries();
      expect(entries[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(entries[0].timestamp).toBeLessThanOrEqual(after);
    });

    it('should add optional data field', () => {
      const data = { level: 5, speciesId: 'cat' };
      addJournalEntry('level_up', 'Level Up', 'Details', data);
      const entries = getJournalEntries();
      expect(entries[0].data).toEqual(data);
    });
  });

  describe('getJournalEntries', () => {
    it('should return entries in reverse chronological order', () => {
      addJournalEntry('birth', 'First', 'Details');
      addJournalEntry('level_up', 'Second', 'Details');
      addJournalEntry('evolution', 'Third', 'Details');

      const entries = getJournalEntries();
      expect(entries[0].event).toBe('Third');
      expect(entries[2].event).toBe('First');
    });

    it('should filter by type', () => {
      addJournalEntry('birth', 'Birth 1', 'Details');
      addJournalEntry('level_up', 'Level 1', 'Details');
      addJournalEntry('birth', 'Birth 2', 'Details');

      const birthEntries = getJournalEntries({ type: 'birth' });
      expect(birthEntries).toHaveLength(2);
      expect(birthEntries.every((e) => e.type === 'birth')).toBe(true);
    });

    it('should support limit parameter', () => {
      for (let i = 0; i < 5; i++) {
        addJournalEntry('level_up', `Entry ${i}`, 'Details');
      }

      const entries = getJournalEntries({ limit: 3 });
      expect(entries).toHaveLength(3);
    });

    it('should support offset parameter', () => {
      for (let i = 0; i < 5; i++) {
        addJournalEntry('level_up', `Entry ${i}`, 'Details');
      }

      const entries = getJournalEntries({ offset: 2, limit: 2 });
      expect(entries).toHaveLength(2);
      expect(entries[0].event).toBe('Entry 2');
    });
  });

  describe('clearJournal', () => {
    it('should clear all entries', () => {
      addJournalEntry('birth', 'Test', 'Details');
      addJournalEntry('level_up', 'Test 2', 'Details');
      expect(getJournalEntries()).toHaveLength(2);

      clearJournal();
      expect(getJournalEntries()).toHaveLength(0);
    });
  });

  describe('getEntryCountByType', () => {
    it('should count entries by type', () => {
      addJournalEntry('birth', 'Birth 1', 'Details');
      addJournalEntry('level_up', 'Level 1', 'Details');
      addJournalEntry('birth', 'Birth 2', 'Details');
      addJournalEntry('milestone', 'Milestone', 'Details');

      expect(getEntryCountByType('birth')).toBe(2);
      expect(getEntryCountByType('level_up')).toBe(1);
      expect(getEntryCountByType('milestone')).toBe(1);
      expect(getEntryCountByType('evolution')).toBe(0);
    });
  });

  describe('Entry limit', () => {
    it('should keep only last 50 entries', () => {
      for (let i = 0; i < 60; i++) {
        addJournalEntry('level_up', `Entry ${i}`, 'Details');
      }

      const entries = getJournalEntries();
      expect(entries).toHaveLength(50);
      expect(entries[0].event).toBe('Entry 59');
    });
  });
});
