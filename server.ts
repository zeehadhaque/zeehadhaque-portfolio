import express, { type Request as ExpressRequest, type Response as ExpressResponse } from "express";
import fs from "node:fs";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import { handleAcademyRequest } from "./src/server/academy";
import { onRequestPost as handleChatPost } from "./functions/api/chat";
import {
  onRequestGet as handleContactGet,
  onRequestPost as handleContactPost,
} from "./functions/api/contact";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function toWebRequest(req: ExpressRequest): Request {
  const protocol = req.headers["x-forwarded-proto"]?.toString().split(",")[0]?.trim() || req.protocol || "http";
  const host = req.headers.host || `localhost:${PORT}`;
  const url = `${protocol}://${host}${req.originalUrl}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const entry of value) headers.append(key, entry);
    } else if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody && typeof req.body === "string" ? req.body : undefined;

  return new Request(url, {
    method: req.method,
    headers,
    body,
  });
}

async function sendWebResponse(webResponse: Response, res: ExpressResponse) {
  res.status(webResponse.status);
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const buffer = Buffer.from(await webResponse.arrayBuffer());
  res.send(buffer);
}

async function startServer() {
  const app = express();
  app.set("trust proxy", true);

  app.use("/api", express.text({ type: "*/*", limit: "1mb" }));

  app.all(["/api/academy", "/api/academy/"], async (req, res) => {
    const webRequest = toWebRequest(req);
    const webResponse = await handleAcademyRequest(webRequest, process.env);
    await sendWebResponse(webResponse, res);
  });

  app.all(["/api/chat", "/api/chat/"], async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ message: "Method not allowed." });
      return;
    }
    const webRequest = toWebRequest(req);
    const webResponse = await handleChatPost({ request: webRequest, env: process.env });
    await sendWebResponse(webResponse, res);
  });

  app.all(["/api/contact", "/api/contact/"], async (req, res) => {
    const webRequest = toWebRequest(req);
    if (req.method === "GET") {
      const webResponse = await handleContactGet({ request: webRequest, env: process.env });
      await sendWebResponse(webResponse, res);
      return;
    }
    if (req.method === "POST") {
      const webResponse = await handleContactPost({ request: webRequest, env: process.env });
      await sendWebResponse(webResponse, res);
      return;
    }
    res.status(405).json({ message: "Method not allowed." });
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "API route not found." });
  });

  if (!IS_PRODUCTION) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), "dist");
    app.use(express.static(distDir));
    app.use((req, res, next) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        next();
        return;
      }
      const aboutPath = path.join(distDir, "about", "index.html");
      if ((req.path === "/about" || req.path === "/about/") && fs.existsSync(aboutPath)) {
        res.sendFile(aboutPath);
        return;
      }
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
