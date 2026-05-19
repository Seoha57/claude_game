// GET /api/sync/pull
// Authorization: Bearer <userId>:<secret>
// Response: { data, version } — data is null if user has no record yet

import { authenticate, Env, jsonResponse, UserRecord } from '../../_lib/sync';

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const auth = await authenticate(ctx.request, ctx.env);
  if ('error' in auth) return auth.error;
  const userRaw = await ctx.env.SYNC_KV.get(`user:${auth.userId}`);
  if (!userRaw) {
    return jsonResponse({ data: null, version: 0 });
  }
  try {
    const record = JSON.parse(userRaw) as UserRecord;
    return jsonResponse({ data: record.data, version: record.version });
  } catch {
    return jsonResponse({ data: null, version: 0 });
  }
};
