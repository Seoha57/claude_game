// POST /api/sync/push
// Authorization: Bearer <userId>:<secret>
// Body: { data: {...}, baseVersion?: number }
//   baseVersion (optional): if provided and doesn't match current version,
//     returns 409 with current data so client can merge and retry.
// Response: { version, updatedAt }

import { authenticate, Env, errorResponse, jsonResponse, UserRecord } from '../../_lib/sync';

const USER_TTL_SECONDS = 60 * 60 * 24 * 365 * 2;

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const auth = await authenticate(ctx.request, ctx.env);
  if ('error' in auth) return auth.error;

  let body: { data?: unknown; baseVersion?: number };
  try {
    body = (await ctx.request.json()) as { data?: unknown; baseVersion?: number };
  } catch {
    return errorResponse('invalid json', 400);
  }
  if (body.data === undefined) {
    return errorResponse('missing data', 400);
  }

  // Optional optimistic-concurrency check
  if (body.baseVersion !== undefined) {
    const existingRaw = await ctx.env.SYNC_KV.get(`user:${auth.userId}`);
    if (existingRaw) {
      try {
        const existing = JSON.parse(existingRaw) as UserRecord;
        if (existing.version !== body.baseVersion) {
          return jsonResponse(
            { conflict: true, currentData: existing.data, currentVersion: existing.version },
            409,
          );
        }
      } catch {
        /* corrupted record — proceed to overwrite */
      }
    }
  }

  // Determine next version (latest + 1)
  const existingRaw = await ctx.env.SYNC_KV.get(`user:${auth.userId}`);
  let nextVersion = 1;
  if (existingRaw) {
    try {
      const existing = JSON.parse(existingRaw) as UserRecord;
      nextVersion = (existing.version ?? 0) + 1;
    } catch {
      /* ignore */
    }
  }

  const updatedAt = Date.now();
  const record: UserRecord = { data: body.data, version: nextVersion, updatedAt };
  await ctx.env.SYNC_KV.put(`user:${auth.userId}`, JSON.stringify(record), {
    expirationTtl: USER_TTL_SECONDS,
  });

  return jsonResponse({ version: nextVersion, updatedAt });
};
