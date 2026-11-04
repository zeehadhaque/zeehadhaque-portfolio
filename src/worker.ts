import { handleAcademyRequest, type AcademyWorkerEnv } from "./server/academy";
import { onRequestPost as handleChatPost } from "../functions/api/chat";
import { onRequestGet as handleContactGet, onRequestPost as handleContactPost } from "../functions/api/contact";

interface WorkerEnv extends AcademyWorkerEnv {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/academy" || url.pathname === "/api/academy/") {
      return handleAcademyRequest(request, env);
    }

    if (url.pathname === "/api/chat" || url.pathname === "/api/chat/") {
      if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);
      return handleChatPost({ request, env });
    }

    if (url.pathname === "/api/contact" || url.pathname === "/api/contact/") {
      if (request.method === "GET") return handleContactGet({ request, env });
      if (request.method === "POST") return handleContactPost({ request, env });
      return json({ message: "Method not allowed." }, 405);
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ message: "API route not found." }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
