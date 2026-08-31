const MIGRATION_FLAG = 'dod_migrated';

const KEY_MAP: [string, string][] = [
  ['dungeoncard_save', 'dod_save'],
  ['dungeoncard_stats', 'dod_stats'],
  ['dungeoncard_audio', 'dod_audio'],
  ['dungeoncard_codex', 'dod_codex'],
  ['dungeoncard_ascension', 'dod_ascension'],
  ['dungeoncard_achievements', 'dod_achievements'],
  ['dungeoncard_daily', 'dod_daily'],
  ['dungeoncard_history', 'dod_history'],
  ['dungeoncard_card_frame', 'dod_card_frame'],
  ['dungeoncard_sync_creds', 'dod_sync_creds'],
  ['dungeoncard_sync_version', 'dod_sync_version'],
  ['dungeoncard_sync_lastat', 'dod_sync_lastat'],
];

export function migrateStorage(): void {
  try {
    if (localStorage.getItem(MIGRATION_FLAG)) return;
    for (const [oldKey, newKey] of KEY_MAP) {
      const val = localStorage.getItem(oldKey);
      if (val !== null && localStorage.getItem(newKey) === null) {
        localStorage.setItem(newKey, val);
      }
      if (val !== null) localStorage.removeItem(oldKey);
    }
    localStorage.setItem(MIGRATION_FLAG, '1');
  } catch { /* ignore */ }
}
