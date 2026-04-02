// ========================================
// Journal System - Game Event Logging
// ========================================

import { gameData, save, notify } from './store';

export interface JournalEntry {
  timestamp: number;
  event: string;
  details: string;
  type: 'birth' | 'level_up' | 'evolution' | 'milestone';
  data?: any;
}

/**
 * Add a journal entry
 */
export function addJournalEntry(
  type: JournalEntry['type'],
  event: string,
  details: string,
  data?: any
) {
  gameData.journal.unshift({
    timestamp: Date.now(),
    type,
    event,
    details,
    data,
  });
  // Keep last 50 entries
  if (gameData.journal.length > 50) gameData.journal.pop();
  save();
  notify();
}

/**
 * Get journal entries with optional filtering
 */
export function getJournalEntries(options?: {
  type?: JournalEntry['type'];
  limit?: number;
  offset?: number;
}): JournalEntry[] {
  let entries = [...gameData.journal];

  if (options?.type) {
    entries = entries.filter((e) => e.type === options.type);
  }

  const offset = options?.offset || 0;
  const limit = options?.limit || entries.length;

  return entries.slice(offset, offset + limit);
}

/**
 * Clear journal (use with caution)
 */
export function clearJournal() {
  gameData.journal = [];
  save();
  notify();
}

/**
 * Get entry count by type
 */
export function getEntryCountByType(type: JournalEntry['type']): number {
  return gameData.journal.filter((e: JournalEntry) => e.type === type).length;
}
