import { handleAcademyRequest, type AcademyWorkerEnv } from "./server/academy";

interface WorkerEnv extends AcademyWorkerEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: WorkerEnv, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/academy" || url.pathname === "/api/academy/") {
      return handleAcademyRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<WorkerEnv>;
