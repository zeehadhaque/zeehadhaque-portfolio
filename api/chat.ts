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
const MAX_OUTPUT_TOKENS = 500;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendError(res, 503, "ZEE is being prepared. Please use the contact details below.");
  }

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
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
      },
    );

    if (!geminiResponse.ok) {
      return sendError(res, 502, "ZEE is taking a quiet moment. Please try again soon.");
    }

    const data = (await geminiResponse.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();

    if (!reply) {
      return sendError(res, 502, "ZEE could not find a clear answer. Please try again.");
    }

    return res.status(200).json({ reply: reply.slice(0, 3_000) });
  } catch {
    return sendError(res, 502, "ZEE is unavailable right now. You can still explore the site.");
  }
}
