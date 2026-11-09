import {
  handleAcademyRequest,
  type AcademyWorkerEnv,
} from "../../src/server/academy";

interface PagesContext {
  request: Request;
  env: AcademyWorkerEnv;
}

/**
 * Cloudflare Pages route for /api/academy.
 * Reuses the same handler as the existing Workers deployment so the
 * authentication, progress, entitlement and admin checks stay consistent.
 */
export async function onRequest({ request, env }: PagesContext): Promise<Response> {
  return handleAcademyRequest(request, env);
}
