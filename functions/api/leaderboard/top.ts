import { Env, jsonResponse, checkKv } from '../../_lib/sync';

const LB_KEY = 'leaderboard:top';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const kvErr = checkKv(env);
  if (kvErr) return kvErr;

  const raw = await env.SYNC_KV.get(LB_KEY);
  const entries = raw ? JSON.parse(raw) : [];

  return jsonResponse({ entries });
};
