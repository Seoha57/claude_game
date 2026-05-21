// ─────────────────────────────────────────────────────────────────
// 클라우드 동기화 모듈
//
// 페어링: PC에서 "동기화 시작" → /api/sync/create로 코드 받음
//         폰에서 "코드 입력" → /api/sync/pair로 자격증명 + 클라우드 데이터 수령
//
// 페어링 후: localStorage에 credentials({userId, secret}) 저장.
//           앱 시작 시 pull → merge → push.
//           이벤트(코덱·도전과제·통계·세이브 변경) 시 debounced push.
//           visibilitychange 'visible' 시 pull.
// ─────────────────────────────────────────────────────────────────

const CREDS_KEY = 'dungeoncard_sync_creds';
const VERSION_KEY = 'dungeoncard_sync_version'; // last known server version
const LAST_SYNC_KEY = 'dungeoncard_sync_lastat'; // last successful sync timestamp

// localStorage keys to sync
const SYNC_KEYS = [
  'dungeoncard_stats',
  'dungeoncard_audio',
  'dungeoncard_codex',
  'dungeoncard_ascension',
  'dungeoncard_achievements',
  'dungeoncard_save',
  'dungeoncard_daily',
];

export interface SyncCredentials {
  userId: string;
  secret: string;
}

export interface SyncSnapshot {
  // Map of key → JSON-decoded value (or null if absent)
  // updatedAt holds when this snapshot was captured (client clock)
  store: Record<string, unknown>;
  updatedAt: number;
}

// ── Credentials ─────────────────────────────────────────────────
export function getCredentials(): SyncCredentials | null {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SyncCredentials;
  } catch {
    return null;
  }
}

export function setCredentials(creds: SyncCredentials): void {
  try { localStorage.setItem(CREDS_KEY, JSON.stringify(creds)); } catch { /* ignore */ }
}

export function clearCredentials(): void {
  try {
    localStorage.removeItem(CREDS_KEY);
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  } catch { /* ignore */ }
}

export function isLinked(): boolean {
  return getCredentials() !== null;
}

export function getLastSyncAt(): number | null {
  try {
    const raw = localStorage.getItem(LAST_SYNC_KEY);
    return raw ? Number(raw) : null;
  } catch { return null; }
}

function setStoredVersion(v: number): void {
  try { localStorage.setItem(VERSION_KEY, String(v)); } catch { /* ignore */ }
}

function setLastSyncAt(t: number): void {
  try { localStorage.setItem(LAST_SYNC_KEY, String(t)); } catch { /* ignore */ }
}

// ── Snapshot serialization ───────────────────────────────────────
export function captureLocal(): SyncSnapshot {
  const store: Record<string, unknown> = {};
  for (const key of SYNC_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      store[key] = raw ? JSON.parse(raw) : null;
    } catch {
      store[key] = null;
    }
  }
  return { store, updatedAt: Date.now() };
}

export function applySnapshot(snap: SyncSnapshot): void {
  for (const key of SYNC_KEYS) {
    const val = snap.store[key];
    try {
      if (val === null || val === undefined) {
        // Don't aggressively delete — only set if remote actually has a value.
        // This avoids wiping local on first sync if remote is partial.
        continue;
      }
      localStorage.setItem(key, JSON.stringify(val));
    } catch { /* ignore */ }
  }
  // Notify the rest of the app that on-disk state changed
  window.dispatchEvent(new CustomEvent('dungeoncard:sync-applied'));
}

// ── Merge (additive, never destructive) ──────────────────────────
export function mergeSnapshots(local: SyncSnapshot, remote: SyncSnapshot): SyncSnapshot {
  const out: SyncSnapshot = {
    store: { ...local.store },
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
  };
  for (const key of SYNC_KEYS) {
    const l = local.store[key];
    const r = remote.store[key];
    out.store[key] = mergeKey(key, l, r);
  }
  return out;
}

function mergeKey(key: string, local: unknown, remote: unknown): unknown {
  if (local == null) return remote ?? null;
  if (remote == null) return local;

  switch (key) {
    case 'dungeoncard_codex':
      return mergeCodex(local, remote);
    case 'dungeoncard_achievements':
      return mergeAchievements(local, remote);
    case 'dungeoncard_stats':
      return mergeStats(local, remote);
    case 'dungeoncard_ascension':
      // Ascension is the highest unlocked level — take max
      return Math.max(Number(local) || 0, Number(remote) || 0);
    case 'dungeoncard_save':
      return mergeSave(local, remote);
    case 'dungeoncard_daily':
      return mergeDaily(local, remote);
    case 'dungeoncard_audio':
    default:
      // Last-write-wins for prefs — both are recent snapshots, pick remote if
      // it appears newer (we don't track per-key timestamps; this is fine).
      return remote;
  }
}

// Daily results: union per date, prefer newer per-date timestamp
function mergeDaily(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;
  const out: any = { version: local.version ?? remote.version ?? 1, results: { ...(local.results ?? {}) } };
  for (const date of Object.keys(remote.results ?? {})) {
    const lr = out.results[date];
    const rr = remote.results[date];
    if (!lr) out.results[date] = rr;
    else if ((rr.timestamp ?? 0) > (lr.timestamp ?? 0)) out.results[date] = rr;
  }
  return out;
}

// Codex: { version, cards: string[], relics: string[] } — union arrays
function mergeCodex(local: any, remote: any): any {
  const cards = new Set<string>();
  const relics = new Set<string>();
  for (const c of local?.cards ?? []) cards.add(c);
  for (const c of remote?.cards ?? []) cards.add(c);
  for (const r of local?.relics ?? []) relics.add(r);
  for (const r of remote?.relics ?? []) relics.add(r);
  return {
    version: Math.max(local?.version ?? 0, remote?.version ?? 0) || 1,
    cards: [...cards],
    relics: [...relics],
  };
}

// Achievements: Record<id, boolean> — OR per id
function mergeAchievements(local: any, remote: any): any {
  const out: Record<string, any> = { ...local };
  for (const k of Object.keys(remote ?? {})) {
    const lv = local?.[k];
    const rv = remote?.[k];
    if (typeof lv === 'boolean' || typeof rv === 'boolean') {
      out[k] = !!lv || !!rv;
    } else {
      // Some achievements may store metadata objects — prefer truthy/object over null
      out[k] = lv ?? rv;
    }
  }
  return out;
}

// Stats: { totalRuns, totalWins, totalTrueWins, totalLosses, perCharacter: {...} }
// Take MAX of each numeric counter.
function mergeStats(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;
  const out: any = { ...local };
  for (const k of Object.keys(remote)) {
    if (k === 'perCharacter') continue;
    if (typeof remote[k] === 'number') {
      out[k] = Math.max(Number(local[k] ?? 0), remote[k]);
    } else if (typeof remote[k] !== 'object') {
      out[k] = remote[k] ?? local[k];
    }
  }
  // perCharacter merge — per-char max
  const lp = local.perCharacter ?? {};
  const rp = remote.perCharacter ?? {};
  const allChars = new Set([...Object.keys(lp), ...Object.keys(rp)]);
  out.perCharacter = {};
  for (const c of allChars) {
    const lc = lp[c] ?? {};
    const rc = rp[c] ?? {};
    const merged: Record<string, any> = { ...lc };
    for (const k of Object.keys(rc)) {
      if (typeof rc[k] === 'number') {
        merged[k] = Math.max(Number(lc[k] ?? 0), rc[k]);
      } else {
        merged[k] = lc[k] ?? rc[k];
      }
    }
    out.perCharacter[c] = merged;
  }
  return out;
}

// Save: prefer the run with the higher floor; tie → keep local.
// (User can resolve via UI if both have meaningful saves.)
function mergeSave(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;
  const lf = local?.runState?.floor ?? 0;
  const rf = remote?.runState?.floor ?? 0;
  // If versions differ, may be incompatible; prefer the newer SAVE_VERSION
  const lv = local?.version ?? 0;
  const rv = remote?.version ?? 0;
  if (lv !== rv) return lv > rv ? local : remote;
  return rf > lf ? remote : local;
}

// ── API client ───────────────────────────────────────────────────
async function api<T = any>(
  path: string,
  init: RequestInit = {},
  creds?: SyncCredentials,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (creds) headers.Authorization = `Bearer ${creds.userId}:${creds.secret}`;
  const res = await fetch(path, { ...init, headers });
  if (!res.ok) {
    let bodyText = '';
    let parsed: any = null;
    try { bodyText = await res.text(); } catch { /* ignore */ }
    try { parsed = JSON.parse(bodyText); } catch { /* not json */ }
    // Surface server-provided hint if present
    if (parsed?.hint) {
      throw new Error(`${parsed.error || res.status}: ${parsed.hint}`);
    }
    if (parsed?.error) {
      throw new Error(`${res.status} ${parsed.error}`);
    }
    // Cloudflare often returns HTML for 5xx — show short version
    const snippet = bodyText.length > 200
      ? `서버 오류 (${res.status}). KV 바인딩 설정을 확인해보세요. SYNC_SETUP.md 참고.`
      : bodyText || res.statusText;
    throw new Error(`${res.status}: ${snippet}`);
  }
  return (await res.json()) as T;
}

export async function createSync(): Promise<{ code: string; expiresAt: number }> {
  const local = captureLocal();
  const resp = await api<{ userId: string; secret: string; code: string; expiresAt: number }>(
    '/api/sync/create',
    { method: 'POST', body: JSON.stringify({ data: local }) },
  );
  setCredentials({ userId: resp.userId, secret: resp.secret });
  setStoredVersion(1);
  setLastSyncAt(Date.now());
  return { code: resp.code, expiresAt: resp.expiresAt };
}

export async function pairSync(code: string): Promise<{ merged: boolean }> {
  const resp = await api<{
    userId: string;
    secret: string;
    data: SyncSnapshot | null;
    version: number;
  }>('/api/sync/pair', { method: 'POST', body: JSON.stringify({ code }) });
  const creds: SyncCredentials = { userId: resp.userId, secret: resp.secret };
  setCredentials(creds);

  const local = captureLocal();
  const remote = resp.data;
  let merged = false;
  if (remote && remote.store) {
    const result = mergeSnapshots(local, remote);
    applySnapshot(result);
    merged = true;
    // Push merged result back so both devices end up identical
    const pushed = await api<{ version: number; updatedAt: number }>(
      '/api/sync/push',
      { method: 'POST', body: JSON.stringify({ data: result, baseVersion: resp.version }) },
      creds,
    );
    setStoredVersion(pushed.version);
  } else {
    // Remote had nothing → push local up
    const pushed = await api<{ version: number; updatedAt: number }>(
      '/api/sync/push',
      { method: 'POST', body: JSON.stringify({ data: local }) },
      creds,
    );
    setStoredVersion(pushed.version);
  }
  setLastSyncAt(Date.now());
  return { merged };
}

// Pull from server and merge into local
export async function pullSync(): Promise<{ changed: boolean } | { error: string }> {
  const creds = getCredentials();
  if (!creds) return { error: 'not linked' };
  let resp: { data: SyncSnapshot | null; version: number };
  try {
    resp = await api<{ data: SyncSnapshot | null; version: number }>('/api/sync/pull', { method: 'GET' }, creds);
  } catch (e) {
    return { error: String(e) };
  }
  if (!resp.data) return { changed: false };
  const local = captureLocal();
  const merged = mergeSnapshots(local, resp.data);
  // Apply locally regardless — merge is idempotent
  applySnapshot(merged);
  setStoredVersion(resp.version);
  setLastSyncAt(Date.now());
  return { changed: true };
}

// Push current local state up
export async function pushSync(): Promise<{ version?: number; error?: string }> {
  const creds = getCredentials();
  if (!creds) return { error: 'not linked' };
  const local = captureLocal();
  try {
    const resp = await api<{ version: number; updatedAt: number }>(
      '/api/sync/push',
      { method: 'POST', body: JSON.stringify({ data: local }) },
      creds,
    );
    setStoredVersion(resp.version);
    setLastSyncAt(Date.now());
    return { version: resp.version };
  } catch (e) {
    return { error: String(e) };
  }
}

// ── Auto-sync ─────────────────────────────────────────────────────
let pushTimer: number | null = null;
let initialized = false;

// Mark that local state changed; debounce a push.
export function markDirty(): void {
  if (!isLinked()) return;
  if (pushTimer != null) clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => {
    pushTimer = null;
    void pushSync();
  }, 3000);
}

// Force an immediate push (e.g., before app close)
export async function flushDirty(): Promise<void> {
  if (pushTimer != null) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  if (isLinked()) {
    await pushSync();
  }
}

// Initialize at app startup
export function initializeSync(): void {
  if (initialized) return;
  initialized = true;
  if (!isLinked()) return;
  // Pull on startup
  void pullSync();
  // Pull when tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isLinked()) {
      void pullSync();
    }
  });
  // Flush on page hide (best-effort)
  window.addEventListener('pagehide', () => { void flushDirty(); });
}
