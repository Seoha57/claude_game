// Shared helpers for sync API. Pages Functions are deployed as part of
// the dist build by Cloudflare Pages.

export interface Env {
  SYNC_KV: KVNamespace;
}

export interface UserRecord {
  data: unknown;
  version: number;
  updatedAt: number;
}

export interface CodeRecord {
  userId: string;
  secret: string;
  expiresAt: number;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}

// Verify the KV binding exists. Helpful error if dashboard setup wasn't done.
export function checkKv(env: Env): Response | null {
  if (!env || !env.SYNC_KV) {
    return jsonResponse(
      {
        error: 'SYNC_KV binding not configured',
        hint: 'Cloudflare Dashboard → Pages 프로젝트 → Settings → Bindings에서 SYNC_KV (정확한 이름) KV namespace를 추가하세요. SYNC_SETUP.md 참고.',
      },
      503,
    );
  }
  return null;
}

// Random ID generator (UUID-ish, hex)
export function randomId(byteLength = 16): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate a human-friendly pairing code like "DNC-4F2X"
export function generatePairingCode(): string {
  // 4 alphanumeric chars from a safe alphabet (no 0/O/1/I confusion)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let code = '';
  for (const b of bytes) code += alphabet[b % alphabet.length];
  return `DNC-${code}`;
}

// Authenticate request via Authorization: Bearer <userId>:<secret>
export async function authenticate(
  request: Request,
  env: Env,
): Promise<{ userId: string } | { error: Response }> {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return { error: errorResponse('missing authorization', 401) };
  }
  const token = auth.slice('Bearer '.length).trim();
  const parts = token.split(':');
  if (parts.length !== 2) {
    return { error: errorResponse('malformed token', 401) };
  }
  const [userId, secret] = parts;
  if (!userId || !secret) {
    return { error: errorResponse('malformed token', 401) };
  }
  const stored = await env.SYNC_KV.get(`secret:${userId}`);
  if (!stored) {
    return { error: errorResponse('unknown user', 401) };
  }
  if (!constantTimeEqual(stored, secret)) {
    return { error: errorResponse('bad secret', 401) };
  }
  return { userId };
}

// Timing-safe string equality
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
