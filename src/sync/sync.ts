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

const CREDS_KEY = 'dod_sync_creds';
const VERSION_KEY = 'dod_sync_version'; // last known server version
const LAST_SYNC_KEY = 'dod_sync_lastat'; // last successful sync timestamp

// localStorage keys to sync
const SYNC_KEYS = [
  'dod_stats',
  'dod_audio',
  'dod_codex',
  'dod_ascension',
  'dod_achievements',
  'dod_save',
  'dod_daily',
  'dod_history',
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
  window.dispatchEvent(new CustomEvent('dod:sync-applied'));
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
    case 'dod_codex':
      return mergeCodex(local, remote);
    case 'dod_achievements':
      return mergeAchievements(local, remote);
    case 'dod_stats':
      return mergeStats(local, remote);
    case 'dod_ascension':
      // Ascension is the highest unlocked level — take max
      return Math.max(Number(local) || 0, Number(remote) || 0);
    case 'dod_save':
      return mergeSave(local, remote);
    case 'dod_daily':
      return mergeDaily(local, remote);
    case 'dod_history':
      return mergeHistory(local, remote);
    case 'dod_audio':
    default:
      // Last-write-wins for prefs — both are recent snapshots, pick remote if
      // it appears newer (we don't track per-key timestamps; this is fine).
      return remote;
  }
}

// Run history: union by entry id, sort by timestamp desc, cap at 30
function mergeHistory(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;
  const byId = new Map<string, any>();
  for (const e of local.entries ?? []) byId.set(e.id, e);
  for (const e of remote.entries ?? []) if (!byId.has(e.id)) byId.set(e.id, e);
  const merged = [...byId.values()].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)).slice(0, 30);
  return { version: local.version ?? remote.version ?? 1, entries: merged };
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

// Achievements: { version, unlocked: string[], perCharClear: {}, perCharTrue: {} }
// unlocked는 합집합, perChar*는 캐릭별 OR.
function mergeAchievements(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;
  const unlocked = new Set<string>();
  for (const id of local.unlocked ?? []) unlocked.add(id);
  for (const id of remote.unlocked ?? []) unlocked.add(id);
  const orMerge = (a: any = {}, b: any = {}) => {
    const out: Record<string, boolean> = { ...a };
    for (const k of Object.keys(b)) out[k] = !!out[k] || !!b[k];
    return out;
  };
  return {
    version: Math.max(local.version ?? 0, remote.version ?? 0) || 1,
    unlocked: [...unlocked],
    perCharClear: orMerge(local.perCharClear, remote.perCharClear),
    perCharTrue: orMerge(local.perCharTrue, remote.perCharTrue),
  };
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

// Save: prefer the more-progressed run. 챕터를 먼저 비교하고(더 깊은 챕터
// 우선), 같은 챕터면 floor로 비교. 동률이면 local 유지.
function mergeSave(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;
  // If versions differ, may be incompatible; prefer the newer SAVE_VERSION
  const lv = local?.version ?? 0;
  const rv = remote?.version ?? 0;
  if (lv !== rv) return lv > rv ? local : remote;
  const lc = local?.runState?.chapter ?? 1;
  const rc = remote?.runState?.chapter ?? 1;
  if (lc !== rc) return rc > lc ? remote : local;
  const lf = local?.runState?.floor ?? 0;
  const rf = remote?.runState?.floor ?? 0;
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

// ── Firebase integration (lazy-loaded) ───────────────────────────
type FirebaseModule = typeof import('./firebase');
let _fb: FirebaseModule | null = null;
let _fbLinked = false;

async function fb(): Promise<FirebaseModule> {
  return _fb ??= await import('./firebase');
}

export async function pullFirebase(): Promise<{ changed: boolean } | { error: string }> {
  try {
    const mod = await fb();
    const remote = await mod.firebasePull();
    if (!remote) return { changed: false };
    const local = captureLocal();
    const merged = mergeSnapshots(local, remote);
    applySnapshot(merged);
    return { changed: true };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function pushFirebase(): Promise<{ error?: string }> {
  try {
    const mod = await fb();
    const local = captureLocal();
    await mod.firebasePush(local);
    return {};
  } catch (e) {
    return { error: String(e) };
  }
}

// ── Auto-sync ─────────────────────────────────────────────────────
let pushTimer: number | null = null;
let initialized = false;

function isAnyLinked(): boolean {
  return isLinked() || _fbLinked;
}

export function markDirty(): void {
  if (!isAnyLinked()) return;
  if (pushTimer != null) clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => {
    pushTimer = null;
    if (_fbLinked) void pushFirebase();
    else if (isLinked()) void pushSync();
  }, 3000);
}

export async function flushDirty(): Promise<void> {
  if (pushTimer != null) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  if (_fbLinked) await pushFirebase();
  else if (isLinked()) await pushSync();
}

export function initializeSync(): void {
  if (initialized) return;
  initialized = true;

  fb().then(mod => {
    if (!mod.isFirebaseConfigured()) return;
    mod.waitForAuth().then(() => {
      _fbLinked = mod.isFirebaseLinked();
      if (_fbLinked) void pullFirebase();
    });
    window.addEventListener('dod:auth-changed', () => {
      _fbLinked = mod.isFirebaseLinked();
      if (_fbLinked) void pullFirebase();
    });
  });

  if (isLinked()) void pullSync();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (_fbLinked) void pullFirebase();
      else if (isLinked()) void pullSync();
    }
  });
  window.addEventListener('pagehide', () => { void flushDirty(); });
}

// ── 복구 키 / 백업 ───────────────────────────────────────────────
// 페어링 코드(DNC-XXXX)는 1시간이면 만료되므로 복구 수단이 못 된다.
// 실제 신원인 userId:secret을 사용자가 보관할 수 있게 노출한다.

export function getRecoveryKey(): string | null {
  const creds = getCredentials();
  return creds ? `${creds.userId}:${creds.secret}` : null;
}

/** 복구 키로 기존 클라우드 계정에 다시 연결하고 데이터를 받아온다. */
export async function restoreWithKey(key: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = key.trim();
  const sep = trimmed.indexOf(':');
  if (sep <= 0 || sep === trimmed.length - 1) {
    return { ok: false, error: '복구 키 형식이 올바르지 않습니다 (userId:secret)' };
  }
  const userId = trimmed.slice(0, sep).trim();
  const secret = trimmed.slice(sep + 1).trim();
  const previous = getCredentials();
  setCredentials({ userId, secret });
  const res = await pullSync();
  if ('error' in res) {
    // 복구 실패 — 원래 상태로 되돌린다
    if (previous) setCredentials(previous);
    else clearCredentials();
    return { ok: false, error: res.error };
  }
  return { ok: true };
}

export interface BackupFile {
  kind: 'dod-backup';
  version: number;
  store: Record<string, unknown>;
  updatedAt: number;
}

export function exportBackup(): string {
  const snap = captureLocal();
  const file: BackupFile = { kind: 'dod-backup', version: 1, store: snap.store, updatedAt: snap.updatedAt };
  return JSON.stringify(file, null, 2);
}

/** 백업 파일을 현재 기록과 합친다 (merge는 추가만 하고 지우지 않는다). */
export function importBackup(text: string): { ok: true } | { ok: false; error: string } {
  let parsed: BackupFile;
  try {
    parsed = JSON.parse(text) as BackupFile;
  } catch {
    return { ok: false, error: '백업 파일을 읽을 수 없습니다' };
  }
  if (parsed?.kind !== 'dod-backup' || !parsed.store || typeof parsed.store !== 'object') {
    return { ok: false, error: '덱 오브 던전 백업 파일이 아닙니다' };
  }
  const merged = mergeSnapshots(captureLocal(), { store: parsed.store, updatedAt: parsed.updatedAt ?? Date.now() });
  applySnapshot(merged);
  markDirty();
  return { ok: true };
}
