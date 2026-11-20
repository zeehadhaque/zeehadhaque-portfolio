import { GoogleGenAI } from "@google/genai";

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

const MAX_MESSAGE_LENGTH = 1_000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const DEFAULT_MODEL = "gemini-3.1-flash-lite";

const UNSUPPORTED_MODELS = new Set([
  "gemini-3.8-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-2.0-flash",
  "gemini-2.0-pro",
  "gemini-2.0-flash-thinking",
]);

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

function getClientKey(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "unknown";
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

function sendError(res: VercelResponse, status: number, message: string) {
  res.status(status).json({ message });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendError(res, 405, "Method not allowed.");
  }

  if (isRateLimited(getClientKey(req))) {
    return sendError(res, 429, "Too many messages. Please try again shortly.");
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return sendError(res, 400, "Please send a message under 1,000 characters.");
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return sendError(res, 503, "ZEE is being prepared. Please use the contact details below.");
  }

  try {
    const rawModel = process.env.GEMINI_MODEL?.trim();
    const model = !rawModel || UNSUPPORTED_MODELS.has(rawModel) ? DEFAULT_MODEL : rawModel;
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
      return sendError(res, 502, "ZEE could not find a clear answer. Please try again.");
    }

    return res.status(200).json({ reply: reply.slice(0, 3_000) });
  } catch {
    return sendError(res, 502, "ZEE is unavailable right now. You can still explore the site.");
  }
}
