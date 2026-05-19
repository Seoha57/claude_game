// POST /api/sync/create
// Generates a fresh sync account: { userId, secret, code }
// The code is valid for 1 hour and allows other devices to pair via /api/sync/pair.
// Body (optional): { data: {...} }  — initial data to upload
//
// Response: { userId, secret, code, expiresAt }

import { checkKv, Env, errorResponse, generatePairingCode, jsonResponse, randomId } from '../../_lib/sync';

const CODE_TTL_SECONDS = 60 * 60; // 1 hour
const USER_TTL_SECONDS = 60 * 60 * 24 * 365 * 2; // 2 years

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const kvCheck = checkKv(env);
  if (kvCheck) return kvCheck;
  let body: { data?: unknown } = {};
  try {
    if (request.headers.get('content-length') !== '0') {
      body = (await request.json()) as { data?: unknown };
    }
  } catch {
    return errorResponse('invalid json', 400);
  }

  const userId = randomId(16);
  const secret = randomId(24);

  // Generate a pairing code, retry if collision (very rare with 32^4 space)
  let code = generatePairingCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await env.SYNC_KV.get(`code:${code}`);
    if (!existing) break;
    code = generatePairingCode();
  }

  const expiresAt = Date.now() + CODE_TTL_SECONDS * 1000;
  const codeRecord = JSON.stringify({ userId, secret, expiresAt });
  await env.SYNC_KV.put(`code:${code}`, codeRecord, { expirationTtl: CODE_TTL_SECONDS });

  // Store the secret keyed by userId for later authentication
  await env.SYNC_KV.put(`secret:${userId}`, secret, { expirationTtl: USER_TTL_SECONDS });

  // Store initial data if provided
  if (body.data !== undefined) {
    const userRecord = JSON.stringify({ data: body.data, version: 1, updatedAt: Date.now() });
    await env.SYNC_KV.put(`user:${userId}`, userRecord, { expirationTtl: USER_TTL_SECONDS });
  }

  return jsonResponse({ userId, secret, code, expiresAt });
};
