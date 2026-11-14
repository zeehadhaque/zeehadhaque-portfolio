import { GoogleGenAI } from "@google/genai";

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
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const FALLBACK_MODEL = "gemini-4-hydrogen";

const UNSUPPORTED_MODELS = new Set([
  "gemini-3.8-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-2.0-flash",
  "gemini-2.0-pro",
  "gemini-2.0-flash-thinking",
]);

// Best-effort per-isolate limit. For shared/global limits, add Cloudflare Rate Limiting.
const requestLog = new Map<string, { count: number; startedAt: number }>();

const verifiedContext = `
You are ZEE, the website assistant for filmmaker Zeehad Haque inside his Grand Cinema Palace digital universe. You are not Zeehad.
Use only the verified facts below (plus general, accurate filmmaking principles when explaining craft concepts). Never invent a biography, awards, credits, cast, crew, clients, reviews, ratings, release dates, achievements, personal history, unverified film titles, or production information.

Verified facts:
- Name: Zeehad Haque
- Identity: Director, Writer, Cinematographer, Editor
- Location: Gazipur, Dhaka, Bangladesh
- Email: zeehadhaque@gmail.com
- WhatsApp: +8801629851155
- Brand statement: I DON'T JUST CAPTURE FRAMES. I CREATE WORLDS.
- Seven Grand Cinema Palace Destinations on the site:
  1. Grand Foyer (#foyer): 4-shot cinema opening entrance, monumental architectural hall & identity typography (ZEEHAD HAQUE).
  2. The Screening Hall (#screening-hall): IMAX-scale screening auditorium with eight archived YouTube works (SHADOW / III, Don't Go There — Teaser, and six selected archive reels). Never invent titles for the six untitled archive reels.
  3. The Projection Room (#projection-room): Optical framing booth, fullscreen lightbox, framing, movement, craft & mobile-first toolkit (Redmi Note 14 Pro+ 5G, Blackmagic Camera, CapCut, DaVinci Resolve, FFmpeg).
  4. The Director's Suite (#directors-suite): Biography, working method, development slate (GHURPAK, ONUSONDHAN, SESH BIKEL: THE LAST MEETUP, SHYAMOL DEEP, PROTIDDHONI, নক্ষত্রের ওপারে, ওই বাড়িটার সামনে যেও না, AUTOPSY).
  5. Filmmaking Institute (#institute): Conservatory featuring a 30-day bilingual (English / বাংলা) curriculum with 12-topic roadmap, XP & ranks, learning streak & achievements, field reflections, examinations, Cine-Arcade, Advanced Lab, and admin-controlled entitlements.
  6. Intelligence Chamber (#intelligence): ZEE AI interface embedded inside the palace's optical control wing.
  7. The Grand Exit (#grand-exit): Monumental correspondence threshold & direct production channels.

Personality: casual Bangladesh Banglish, friendly, warm, sharp and helpful.
If information is unavailable, say so naturally and suggest the visitor use the
contact details or explore the relevant chamber. Keep replies concise (under 180 words).
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

function extractStatusCode(error: unknown): number {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }
  return 502;
}

function isModelAvailabilityError(status: number, details: string): boolean {
  if (status === 404 || status === 410 || status === 504 || status === 408) return true;
  return status === 400 && /model|not found|not supported|unavailable|shut down|deprecated/i.test(details);
}

function providerErrorMessage(status: number, details: string): string {
  if (status === 401 || status === 403 || /API_KEY_INVALID|PERMISSION_DENIED|API key/i.test(details)) {
    return "ZEE's AI connection needs a valid Gemini API key configured in Settings > Secrets.";
  }
  if (status === 429 || /RESOURCE_EXHAUSTED/i.test(details)) {
    return "ZEE is temporarily busy. Please try again in a minute.";
  }
  if (status === 404 || status === 410 || /NOT_FOUND/i.test(details)) {
    return "ZEE's selected AI model is unavailable. Please check the model setting.";
  }
  return "ZEE is having trouble reaching its AI service. Please try again shortly.";
}

function resolveModel(configured?: string): string {
  const candidate = configured?.trim();
  if (!candidate || UNSUPPORTED_MODELS.has(candidate)) {
    return DEFAULT_MODEL;
  }
  return candidate;
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
    return jsonResponse({ message: "ZEE is not connected yet. Please configure GEMINI_API_KEY in Settings > Secrets." }, 503);
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 15_000,
      retryOptions: { attempts: 2, initialDelay: 0.5 },
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const configuredModel = resolveModel(env.GEMINI_MODEL);
  const modelsToTry = Array.from(new Set([configuredModel, DEFAULT_MODEL, FALLBACK_MODEL]));

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: message,
        config: {
          systemInstruction: verifiedContext,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        console.warn("Gemini returned an empty response", { model });
        return jsonResponse({
          message: "ZEE couldn't form a clear answer. Please try asking in a different way.",
        }, 502);
      }

      return jsonResponse({ reply: reply.slice(0, 3_000) });
    } catch (error) {
      const status = extractStatusCode(error);
      const details = error instanceof Error ? error.message : String(error);
      console.warn("Gemini request failed:", model, status, details.slice(0, 300));

      const isLastModel = model === modelsToTry[modelsToTry.length - 1];
      const canTryFallback = !isLastModel && isModelAvailabilityError(status, details);
      if (canTryFallback) continue;

      return jsonResponse({
        message: providerErrorMessage(status, details),
      }, 502);
    }
  }

  return jsonResponse({
    message: "ZEE's AI model is currently unavailable. Please try again later.",
  }, 502);
}
