interface CloudflareEnv {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}

interface PagesContext {
  request: Request;
  env: CloudflareEnv;
}

interface ChatBody {
  message?: unknown;
}

const MAX_MESSAGE_LENGTH = 1_000;
const MAX_OUTPUT_TOKENS = 500;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

// Best-effort per-isolate limit. For shared/global limits, add Cloudflare Rate Limiting.
const requestLog = new Map<string, { count: number; startedAt: number }>();

const verifiedContext = `
You are ZEE, the website assistant for filmmaker Zeehad Haque. You are not Zeehad.
Use only the verified facts below. Never invent a biography, awards, credits, cast,
crew, clients, reviews, ratings, release dates, achievements, personal history,
film titles, or production information.
Verified facts:
- Name: Zeehad Haque
- Identity: Director, Writer, Cinematographer, Editor
- Location: Gazipur, Dhaka, Bangladesh
- Email: zeehadhaque@gmail.com
- WhatsApp: +8801629851155
- Brand statement: I DON'T JUST CAPTURE FRAMES. I CREATE WORLDS.
- The site contains eight supplied YouTube source links. The first seven titles
  are not verified yet. One supplied title is Don't Go There â€” Teaser.
- In-development projects: GHURPAK, ONUSONDHAN, SESH BIKEL: THE LAST MEETUP,
  SHYAMOL DEEP, PROTIDDHONI, à¦¨à¦•à§à¦·à¦¤à§à¦°à§‡à¦° à¦“à¦ªà¦¾à¦°à§‡, à¦“à¦‡ à¦¬à¦¾à¦¡à¦¼à¦¿à¦Ÿà¦¾à¦° à¦¸à¦¾à¦®à¦¨à§‡ à¦¯à§‡à¦“ à¦¨à¦¾, AUTOPSY.
- Zee Filmmaking Academy is planned to support Bangla/English switching, a
  filmmaking roadmap, a 30-day program, XP and ranks, lessons, examinations,
  Cine-Arcade, interactive learning and admin-controlled entitlements.
Personality: casual Bangladesh Banglish, friendly, warm, playful and helpful.
If information is unavailable, say so naturally and suggest the visitor use the
contact details or explore the relevant section. Keep replies concise.
`;

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
  const current = requestLog.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    requestLog.set(key, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (isRateLimited(clientKey(request))) {
    return jsonResponse({ message: 'Too many messages. Please try again shortly.' }, 429);
  }

  let body: ChatBody;
  try {
    body = await request.json() as ChatBody;
  } catch {
    return jsonResponse({ message: 'Please send a valid JSON message.' }, 400);
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ message: 'Please send a message under 1,000 characters.' }, 400);
  }

  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse({ message: 'ZEE is being prepared. Please use the contact details below.' }, 503);
  }

  const model = env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const geminiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: verifiedContext }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.55,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    });

    if (!geminiResponse.ok) {
      return jsonResponse({ message: 'ZEE is taking a quiet moment. Please try again soon.' }, 502);
    }

    const data = await geminiResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '').join('').trim();

    if (!reply) {
      return jsonResponse({ message: 'ZEE could not find a clear answer. Please try again.' }, 502);
    }

    return jsonResponse({ reply: reply.slice(0, 3_000) });
  } catch {
    return jsonResponse({ message: 'ZEE is unavailable right now. You can still explore the site.' }, 502);
  }
}
