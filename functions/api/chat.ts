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

interface GeminiResult {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string; status?: string };
}

const MAX_MESSAGE_LENGTH = 1_000;
const MAX_OUTPUT_TOKENS = 600;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const DEFAULT_MODEL = "gemini-3.8-flash";

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
  are not verified yet. One supplied title is Don't Go There — Teaser.
- In-development projects: GHURPAK, ONUSONDHAN, SESH BIKEL: THE LAST MEETUP,
  SHYAMOL DEEP, PROTIDDHONI, নক্ষত্রের ওপারে, ওই বাড়িটার সামনে যেও না, AUTOPSY.
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
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function clientKey(request: Request): string {
  return request.headers.get("CF-Connecting-IP")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? "unknown";
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

function isModelAvailabilityError(status: number, details: string): boolean {
  if (status === 404 || status === 410) return true;
  return status === 400 && /model|not found|not supported|unavailable|shut down|deprecated/i.test(details);
}

function providerErrorMessage(status: number): string {
  if (status === 401 || status === 403) {
    return "ZEE's AI connection needs its API key checked by the site owner.";
  }
  if (status === 429) {
    return "ZEE is temporarily busy. Please try again in a minute.";
  }
  if (status === 404 || status === 410) {
    return "ZEE's selected AI model is unavailable. The site owner needs to check the model setting.";
  }
  return "ZEE is having trouble reaching its AI service. Please try again shortly.";
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (isRateLimited(clientKey(request))) {
    return jsonResponse({ message: "Too many messages. Please try again shortly." }, 429);
  }

  let body: ChatBody;
  try {
    body = await request.json() as ChatBody;
  } catch {
    return jsonResponse({ message: "Please send a valid JSON message." }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ message: "Please send a message under 1,000 characters." }, 400);
  }

  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse({ message: "ZEE is not connected yet. The site owner needs to add the Gemini API key in Cloudflare." }, 503);
  }

  const configuredModel = env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const modelsToTry = configuredModel === DEFAULT_MODEL
    ? [DEFAULT_MODEL]
    : [configuredModel, DEFAULT_MODEL];

  try {
    for (const model of modelsToTry) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const geminiResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: verifiedContext }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            temperature: 0.55,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
          },
        }),
      });

      if (!geminiResponse.ok) {
        const details = await geminiResponse.text();
        // Never log the request URL: it contains the private API key.
        console.error("Gemini request failed", {
          model,
          status: geminiResponse.status,
          details: details.slice(0, 700),
        });

        const canTryFallback = model !== DEFAULT_MODEL
          && isModelAvailabilityError(geminiResponse.status, details);
        if (canTryFallback) continue;

        return jsonResponse({
          message: providerErrorMessage(geminiResponse.status),
        }, 502);
      }

      const data = await geminiResponse.json() as GeminiResult;
      const reply = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "").join("").trim();

      if (!reply) {
        console.error("Gemini returned an empty candidate", { model });
        return jsonResponse({
          message: "ZEE couldn't form a clear answer. Please try asking in a different way.",
        }, 502);
      }

      return jsonResponse({ reply: reply.slice(0, 3_000) });
    }

    return jsonResponse({
      message: "ZEE's AI model is currently unavailable. Please try again later.",
    }, 502);
  } catch (error) {
    console.error("Gemini connection error", error instanceof Error ? error.message : "Unknown error");
    return jsonResponse({
      message: "ZEE is unavailable right now. Please try again shortly.",
    }, 502);
  }
}
