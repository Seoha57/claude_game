import { Env, jsonResponse, errorResponse, checkKv } from '../../_lib/sync';

interface LeaderboardEntry {
  nickname: string;
  score: number;
  wave: number;
  characterClass: string;
  timestamp: number;
}

const LB_KEY = 'leaderboard:top';
const MAX_ENTRIES = 50;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const kvErr = checkKv(env);
  if (kvErr) return kvErr;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return errorResponse('invalid json');
  }

  const nickname = String(body.nickname ?? '').trim().slice(0, 12) || '익명 모험가';
  const score = typeof body.score === 'number' ? Math.floor(body.score) : 0;
  const wave = typeof body.wave === 'number' ? Math.floor(body.wave) : 0;
  const characterClass = String(body.characterClass ?? '').slice(0, 20);

  if (score <= 0 || wave <= 0) return errorResponse('invalid score/wave');

  const entry: LeaderboardEntry = { nickname, score, wave, characterClass, timestamp: Date.now() };

  const raw = await env.SYNC_KV.get(LB_KEY);
  const entries: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
  entries.push(entry);
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, MAX_ENTRIES);

  await env.SYNC_KV.put(LB_KEY, JSON.stringify(trimmed));

  const rank = trimmed.findIndex((e) => e === entry) + 1;
  return jsonResponse({ ok: true, rank });
};
