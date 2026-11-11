import { handleAcademyRequest, type AcademyWorkerEnv } from "./server/academy";
import { onRequestPost as handleChatPost } from "../functions/api/chat";
import { onRequestGet as handleContactGet, onRequestPost as handleContactPost } from "../functions/api/contact";

interface WorkerEnv extends AcademyWorkerEnv {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://zeehadhaque.zeehadhaque.workers.dev/</loc>
  </url>
  <url>
    <loc>https://zeehadhaque.zeehadhaque.workers.dev/about/</loc>
  </url>
</urlset>
`;

const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://zeehadhaque.zeehadhaque.workers.dev/sitemap.xml
`;

function textFile(request: Request, body: string, contentType: string): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed.", {
      status: 405,
      headers: {
        Allow: "GET, HEAD",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
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

    if (url.pathname === "/sitemap.xml") {
      return textFile(request, SITEMAP_XML, "application/xml; charset=utf-8");
    }

    if (url.pathname === "/robots.txt") {
      return textFile(request, ROBOTS_TXT, "text/plain; charset=utf-8");
    }

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
