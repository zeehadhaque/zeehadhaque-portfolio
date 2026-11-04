interface VercelRequest {
  method?: string;
  body?: Record<string, unknown>;
  headers: Record<string, string | undefined>;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(payload: unknown): VercelResponse;
  setHeader(name: string, value: string): void;
}

const OWNER_EMAIL = "zeehadhaque@gmail.com";
const MAX_BODY_LENGTH = 12_000;
const rateLimit = new Map<string, { count: number; startedAt: number }>();

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
}

function sendError(res: VercelResponse, status: number, message: string) {
  res.status(status).json({ message });
}

function clientKey(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || now - current.startedAt >= 60 * 60 * 1_000) {
    rateLimit.set(key, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

async function getVerifiedOwner(req: VercelRequest, config: { url: string; key: string }) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) return null;

  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: { apikey: config.key, Authorization: authorization },
  });
  if (!response.ok) return null;

  const user = (await response.json()) as { email?: string; email_confirmed_at?: string | null };
  if (user.email?.toLowerCase() !== OWNER_EMAIL || !user.email_confirmed_at) return null;
  return authorization;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const config = supabaseConfig();
  if (!config) return sendError(res, 503, "Contact service is not configured.");

  if (req.method === "GET") {
    const ownerToken = await getVerifiedOwner(req, config);
    if (!ownerToken) return sendError(res, 401, "Verified owner access required.");

    const response = await fetch(
      `${config.url}/rest/v1/contact_messages?select=id,name,email,subject,message,created_at&order=created_at.desc`,
      { headers: { apikey: config.key, Authorization: ownerToken } },
    );
    if (!response.ok) return sendError(res, 502, "Inbox could not be loaded.");
    return res.status(200).json({ messages: await response.json() });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return sendError(res, 405, "Method not allowed.");
  }

  if (isRateLimited(clientKey(req))) return sendError(res, 429, "Too many submissions. Please try again later.");

  const rawBody = JSON.stringify(req.body ?? {});
  if (rawBody.length > MAX_BODY_LENGTH) return sendError(res, 413, "Message is too large.");

  const payload = (req.body ?? {}) as ContactPayload;
  if (text(payload.website, 200)) return res.status(200).json({ ok: true });

  const name = text(payload.name, 100);
  const email = text(payload.email, 200).toLowerCase();
  const subject = text(payload.subject, 160);
  const message = text(payload.message, 4_000);
  if (name.length < 2 || !isEmail(email) || message.length < 10) {
    return sendError(res, 400, "Please provide a name, valid email and message.");
  }

  const response = await fetch(`${config.url}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      apikey: config.key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, email, subject, message }),
  });

  if (!response.ok) return sendError(res, 502, "Your message could not be saved. Please email Zeehad directly.");
  return res.status(201).json({ ok: true });
}
