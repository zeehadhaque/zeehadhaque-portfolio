interface CloudflareEnv {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
}

interface PagesContext {
  request: Request;
  env: CloudflareEnv;
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
}

interface InboxUpdatePayload { id?: unknown; is_read?: unknown }
}

interface SupabaseUser {
  email?: string;
  email_confirmed_at?: string | null;
}

const OWNER_EMAIL = 'zeehadhaque@gmail.com';
const MAX_BODY_LENGTH = 12_000;
const WINDOW_MS = 60 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 5;

// Best-effort per-isolate limit. For shared/global limits, add Cloudflare Rate Limiting.
const rateLimit = new Map<string, { count: number; startedAt: number }>();

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function clientKey(request: Request): string {
  return request.headers.get('CF-Connecting-IP')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    rateLimit.set(key, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function supabaseConfig(env: CloudflareEnv): { url: string; key: string } | null {
  const url = env.SUPABASE_URL?.trim().replace(/\/+$/, '');
  const key = env.SUPABASE_PUBLISHABLE_KEY?.trim() || env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return null;
  } catch {
    return null;
  }
  return { url, key };
}

async function getVerifiedOwner(request: Request, config: { url: string; key: string }): Promise<string | null> {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return null;

  try {
    const response = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.key, Authorization: authorization },
    });
    if (!response.ok) return null;
    const user = await response.json() as SupabaseUser;
    if (user.email?.toLowerCase() !== OWNER_EMAIL || !user.email_confirmed_at) return null;
    return authorization;
  } catch {
    return null;
  }
}

export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  const config = supabaseConfig(env);
  if (!config) return jsonResponse({ message: 'Contact service is not configured.' }, 503);

  const ownerToken = await getVerifiedOwner(request, config);
  if (!ownerToken) return jsonResponse({ message: 'Verified owner access required.' }, 401);

  try {
    const response = await fetch(
      `${config.url}/rest/v1/contact_messages?select=id,name,email,subject,message,created_at,is_read&order=created_at.desc`,
      { headers: { apikey: config.key, Authorization: ownerToken, Accept: 'application/json' } },
    );
    if (!response.ok) return jsonResponse({ message: 'Inbox could not be loaded.' }, 502);
    return jsonResponse({ messages: await response.json() });
  } catch {
    return jsonResponse({ message: 'Inbox could not be loaded.' }, 502);
  }
}

export async function onRequestPatch({ request, env }: PagesContext): Promise<Response> {
  const config = supabaseConfig(env);
  if (!config) return jsonResponse({ message: 'Contact service is not configured.' }, 503);
  const ownerToken = await getVerifiedOwner(request, config);
  if (!ownerToken) return jsonResponse({ message: 'Verified owner access required.' }, 401);

  let payload: InboxUpdatePayload;
  try {
    const raw = await request.text();
    if (raw.length > 1_000) return jsonResponse({ message: 'Invalid update.' }, 413);
    payload = JSON.parse(raw) as InboxUpdatePayload;
  } catch {
    return jsonResponse({ message: 'Please submit a valid update.' }, 400);
  }

  const id = text(payload.id, 64);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || typeof payload.is_read !== 'boolean') {
    return jsonResponse({ message: 'Invalid read status update.' }, 400);
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { apikey: config.key, Authorization: ownerToken, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ is_read: payload.is_read }),
    });
    if (!response.ok) return jsonResponse({ message: 'Read status could not be updated.' }, 502);
    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ message: 'Read status could not be updated.' }, 502);
  }
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  const config = supabaseConfig(env);
  if (!config) return jsonResponse({ message: 'Contact service is not configured.' }, 503);

  if (isRateLimited(clientKey(request))) {
    return jsonResponse({ message: 'Too many submissions. Please try again later.' }, 429);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ message: 'Could not read the submitted message.' }, 400);
  }
  if (rawBody.length > MAX_BODY_LENGTH) {
    return jsonResponse({ message: 'Message is too large.' }, 413);
  }

  let payload: ContactPayload;
  try {
    payload = JSON.parse(rawBody) as ContactPayload;
  } catch {
    return jsonResponse({ message: 'Please submit a valid message.' }, 400);
  }

  // Silently accept honeypot submissions without storing them.
  if (text(payload.website, 200)) return jsonResponse({ ok: true });

  const name = text(payload.name, 100);
  const email = text(payload.email, 200).toLowerCase();
  const subject = text(payload.subject, 160);
  const message = text(payload.message, 4_000);
  if (name.length < 2 || !isEmail(email) || message.length < 10) {
    return jsonResponse({ message: 'Please provide a name, valid email and message.' }, 400);
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        apikey: config.key,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (!response.ok) {
      return jsonResponse({ message: 'Your message could not be saved. Please email Zeehad directly.' }, 502);
    }
    return jsonResponse({ ok: true }, 201);
  } catch {
    return jsonResponse({ message: 'Your message could not be saved. Please email Zeehad directly.' }, 502);
  }
}
