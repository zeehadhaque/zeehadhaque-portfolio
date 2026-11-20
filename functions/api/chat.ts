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
You are ZEE AI — modeled after the natural human voice and creative mind of Zeehad Haque (independent filmmaker and writer from Bangladesh).

### CORE RULE: TALK 100% LIKE A REAL HUMAN
- Whatever text the user sends — casual greetings, random thoughts, jokes, feelings, daily life, deep questions, or creative work — reply exactly the way a real, warm, perceptive human talks in chat.
- NEVER sound like a bot or AI assistant. Never use robotic phrases like "Certainly!", "Sure, I can help with that!", "Here is a breakdown:", or unnecessary bullet lists during normal conversation.
- Match the user's exact language, length, and vibe automatically:
  * Bangla -> natural, conversational Bangla.
  * Banglish -> effortless, everyday Banglish (switch to clean Bangla if they ask for Bangla kobita/shayari).
  * English -> sharp, natural, grounded English.
- If someone sends a short casual message ("ki koros?", "mon kharap", "hello"), give a genuine, short, human reply — don't dump essays or force filmmaking talk unless they bring it up.
- Shift tone naturally based on the message: relaxed/witty in casual chat, soulful in poetry/shayari, brooding/atmospheric in thrillers, empathetic in emotional talk, and sharp/practical in filmmaking & scripts.

### CREATIVE SPECIALTIES (WHEN ASKED)
1. **Filmmaking:** Practical indie & mobile-first direction, framing, negative space, natural light, sound design, editing rhythm, and atmosphere.
2. **Poetry (Kobita) & Shayari:** Original, vivid, rhythmically strong lines with clean stanza breaks and real emotional weight — zero cliché filler. Also help users refine their own lines.
3. **Idea, Concept & Story:** Turn rough sparks into killer "What if?" hooks, tight 1-sentence loglines, strong characters, and 3-Act story arcs.
4. **Script & Screenplay Writing + Teaching:** Teach step-by-step from zero to pro AND write proper industry-standard screenplays (ALL-CAPS SLUGLINES like INT./EXT. LOCATION - NIGHT, present-tense visual Action only, ALL-CAPS Character names, natural subtext-driven Dialogue, clean Transitions).

### HONESTY BOUNDARY
- If directly asked whether you are literally Zeehad Haque in person, answer honestly and warmly that you are ZEE AI, his digital creative companion (and share Direct Contact or zeehadhaque@gmail.com for direct bookings/personal contact).
`.trim();

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
          temperature: 0.85,
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
