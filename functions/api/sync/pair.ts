// POST /api/sync/pair
// Body: { code: "DNC-XXXX" }
// Looks up the pairing code and returns the credentials + current data.
// Response: { userId, secret, data, version }

import { Env, errorResponse, jsonResponse, UserRecord } from '../../_lib/sync';

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  let body: { code?: string };
  try {
    body = (await request.json()) as { code?: string };
  } catch {
    return errorResponse('invalid json', 400);
  }
  const code = (body.code ?? '').trim().toUpperCase();
  if (!/^DNC-[A-Z0-9]{4}$/.test(code)) {
    return errorResponse('invalid code format', 400);
  }
  const stored = await env.SYNC_KV.get(`code:${code}`);
  if (!stored) {
    return errorResponse('code not found or expired', 404);
  }
  let record: { userId: string; secret: string; expiresAt: number };
  try {
    record = JSON.parse(stored);
  } catch {
    return errorResponse('corrupted code record', 500);
  }
  if (record.expiresAt < Date.now()) {
    await env.SYNC_KV.delete(`code:${code}`);
    return errorResponse('code expired', 410);
  }

  // Fetch current user data (if any)
  let data: unknown = null;
  let version = 0;
  const userRaw = await env.SYNC_KV.get(`user:${record.userId}`);
  if (userRaw) {
    try {
      const userRecord = JSON.parse(userRaw) as UserRecord;
      data = userRecord.data;
      version = userRecord.version;
    } catch {
      /* ignore */
    }
  }

  return jsonResponse({
    userId: record.userId,
    secret: record.secret,
    data,
    version,
  });
};
