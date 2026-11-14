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
