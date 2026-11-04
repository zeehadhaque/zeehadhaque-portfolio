export interface AcademyWorkerEnv {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  user_metadata?: { display_name?: string };
}

interface SupabaseConfig {
  url: string;
  key: string;
}

const OWNER_EMAIL = "zeehadhaque@gmail.com";
const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

function configFrom(env: AcademyWorkerEnv): SupabaseConfig | null {
  const url = env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = env.SUPABASE_PUBLISHABLE_KEY?.trim() || env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch { return null; }
  return { url, key };
}

function bearer(request: Request): string | null {
  const value = request.headers.get("Authorization");
  return value?.startsWith("Bearer ") ? value.slice(7).trim() : null;
}

async function supabaseFetch(config: SupabaseConfig, path: string, init: RequestInit = {}, token?: string) {
  const headers = new Headers(init.headers);
  headers.set("apikey", config.key);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  else headers.set("Authorization", `Bearer ${config.key}`);
  return fetch(`${config.url}${path}`, { ...init, headers });
}

async function verifiedUser(config: SupabaseConfig, token: string): Promise<AuthUser | null> {
  try {
    const response = await supabaseFetch(config, "/auth/v1/user", {}, token);
    if (!response.ok) return null;
    const user = await response.json() as AuthUser;
    if (!user.id || !user.email_confirmed_at) return null;
    return user;
  } catch { return null; }
}

function isAdmin(user: AuthUser): boolean {
  return user.email?.toLowerCase() === OWNER_EMAIL && Boolean(user.email_confirmed_at);
}

async function restJson<T>(response: Response): Promise<T | null> {
  if (!response.ok) return null;
  try { return await response.json() as T; } catch { return null; }
}

export async function handleAcademyRequest(request: Request, env: AcademyWorkerEnv): Promise<Response> {
  const config = configFrom(env);
  if (!config) return json({ configured: false, message: "Academy account and progress services are not configured yet." }, 503);

  if (request.method === "GET") {
    const token = bearer(request);
    if (!token) return json({ configured: true, signedIn: false });

    const user = await verifiedUser(config, token);
    if (!user) return json({ message: "Your session has expired or your email is not verified. Please sign in again." }, 401);

    const [profileRes, progressRes, attemptsRes, entitlementsRes] = await Promise.all([
      supabaseFetch(config, `/rest/v1/academy_profiles?select=user_id,display_name,email,created_at&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, {}, token),
      supabaseFetch(config, `/rest/v1/academy_day_progress?select=day,xp_earned,reflection,completed_at&user_id=eq.${encodeURIComponent(user.id)}&order=day.asc`, {}, token),
      supabaseFetch(config, `/rest/v1/academy_attempts?select=id,day,is_correct,xp_awarded,attempted_at&user_id=eq.${encodeURIComponent(user.id)}&order=attempted_at.desc&limit=100`, {}, token),
      supabaseFetch(config, `/rest/v1/academy_entitlements?select=entitlement_key,expires_at,granted_at&user_id=eq.${encodeURIComponent(user.id)}`, {}, token),
    ]);

    const [profiles, progress, attempts, entitlements] = await Promise.all([
      restJson<Array<{user_id:string;display_name:string;email:string;created_at:string}>>(profileRes),
      restJson<Array<{day:number;xp_earned:number;reflection:string;completed_at:string}>>(progressRes),
      restJson<Array<{id:number;day:number;is_correct:boolean;xp_awarded:number;attempted_at:string}>>(attemptsRes),
      restJson<Array<{entitlement_key:string;expires_at:string|null;granted_at:string}>>(entitlementsRes),
    ]);
    if (!profiles || !progress || !attempts || !entitlements) {
      return json({ message: "Academy records could not be loaded. Apply the Academy database migration and try again." }, 503);
    }

    let students: unknown[] | undefined;
    let studentEntitlements: unknown[] | undefined;
    if (isAdmin(user)) {
      const [studentResponse, entitlementResponse] = await Promise.all([
        supabaseFetch(
          config,
          "/rest/v1/academy_profiles?select=user_id,display_name,email,created_at&order=created_at.desc&limit=100",
          {},
          token,
        ),
        supabaseFetch(
          config,
          "/rest/v1/academy_entitlements?select=user_id,entitlement_key,expires_at,granted_at&order=granted_at.desc",
          {},
          token,
        ),
      ]);
      students = await restJson<unknown[]>(studentResponse) ?? [];
      studentEntitlements = await restJson<unknown[]>(entitlementResponse) ?? [];
    }

    return json({
      configured: true,
      signedIn: true,
      user: { id: user.id, email: user.email, displayName: profiles[0]?.display_name ?? user.user_metadata?.display_name ?? "Filmmaker" },
      isAdmin: isAdmin(user),
      progress,
      attempts,
      entitlements: entitlements.filter((entry) => !entry.expires_at || Date.parse(entry.expires_at) > Date.now()),
      ...(students ? { students, studentEntitlements } : {}),
    });
  }

  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);
  const raw = await request.text();
  if (raw.length > 12_000) return json({ message: "Request is too large." }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("invalid");
  } catch { return json({ message: "Please submit a valid JSON request." }, 400); }

  const action = typeof body.action === "string" ? body.action : "";

  if (action === "signup" || action === "login" || action === "refresh") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (action === "signup" && (!email || password.length < 8 || typeof body.displayName !== "string" || body.displayName.trim().length < 2)) {
      return json({ message: "Enter a name, valid email and password with at least 8 characters." }, 400);
    }
    if (action === "login" && (!email || password.length < 8)) {
      return json({ message: "Enter your email and password." }, 400);
    }

    let path: string;
    let payload: Record<string, unknown>;
    if (action === "signup") {
      path = "/auth/v1/signup";
      payload = { email, password, data: { display_name: String(body.displayName).trim().slice(0, 80) } };
    } else if (action === "refresh") {
      if (typeof body.refreshToken !== "string" || !body.refreshToken) return json({ message: "Session refresh token is missing. Sign in again." }, 401);
      path = "/auth/v1/token?grant_type=refresh_token";
      payload = { refresh_token: body.refreshToken };
    } else {
      path = "/auth/v1/token?grant_type=password";
      payload = { email, password };
    }

    try {
      const response = await supabaseFetch(config, path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as Record<string, unknown>;
      if (!response.ok) {
        const message = typeof result.msg === "string" ? result.msg : typeof result.message === "string" ? result.message : "Account request failed. Check your details and try again.";
        return json({ message: message.slice(0, 300) }, response.status === 429 ? 429 : 400);
      }
      return json(result, response.status);
    } catch { return json({ message: "Authentication service is temporarily unavailable." }, 502); }
  }

  const token = bearer(request);
  if (!token) return json({ message: "Sign in to save progress or manage access." }, 401);
  const user = await verifiedUser(config, token);
  if (!user) return json({ message: "A verified sign-in is required. Please sign in again." }, 401);

  if (action === "complete_day") {
    const day = Number(body.day);
    const answerIndex = Number(body.answerIndex);
    const reflection = typeof body.reflection === "string" ? body.reflection.trim().slice(0, 2000) : "";
    if (!Number.isInteger(day) || day < 1 || day > 30 || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 5) {
      return json({ message: "Invalid lesson answer." }, 400);
    }
    const response = await supabaseFetch(config, "/rest/v1/rpc/academy_complete_day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p_day: day, p_answer_index: answerIndex, p_reflection: reflection }),
    }, token);
    if (!response.ok) {
      const details = await response.text();
      if (details.includes("entitlement_required")) return json({ message: "This lesson requires the 30-day programme entitlement." }, 403);
      return json({ message: "Progress could not be saved. Make sure the Academy database migration is applied." }, 502);
    }
    return json(await response.json());
  }

  if (action === "grant" || action === "revoke") {
    if (!isAdmin(user)) return json({ message: "Verified Academy administrator access is required." }, 403);
    const userId = typeof body.userId === "string" ? body.userId : "";
    const key = typeof body.entitlementKey === "string" ? body.entitlementKey : "";
    if (!/^[0-9a-f-]{36}$/i.test(userId)) return json({ message: "Choose a valid learner account." }, 400);
    const allowed = ["program.30day", "track.advanced", "arcade.pro", "certificate.issue"];
    if (!allowed.includes(key)) return json({ message: "Choose a valid entitlement." }, 400);

    const path = action === "grant" ? "/rest/v1/rpc/academy_grant_entitlement" : "/rest/v1/rpc/academy_revoke_entitlement";
    const payload = action === "grant"
      ? {
          p_user_id: userId,
          p_entitlement_key: key,
          p_days: body.days === null || body.days === "" ? null : Number(body.days),
          p_note: typeof body.note === "string" ? body.note.slice(0, 300) : "",
        }
      : { p_user_id: userId, p_entitlement_key: key };

    const response = await supabaseFetch(config, path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, token);
    if (!response.ok) return json({ message: "Entitlement change failed. Check the learner and duration." }, 400);
    return json(await response.json());
  }

  return json({ message: "Unknown Academy action." }, 400);
}
