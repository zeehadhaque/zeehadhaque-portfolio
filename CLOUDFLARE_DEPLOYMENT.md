# Cloudflare Pages deployment

This repository is a React + TypeScript + Vite site. Cloudflare Pages serves the Vite output from `dist` and runs the Pages Functions in `functions/`.

## Git-connected Pages build settings

- Production branch: `main`
- Root directory: `/`
- Framework preset: React (Vite)
- Build command: `npm run build`
- Build output directory: `dist`

The `public/_routes.json` file limits Pages Function invocation to `/api/*`, so ordinary static website requests are served as static assets.

## Runtime variables

Add these under Cloudflare Dashboard â†’ Workers & Pages â†’ your Pages project â†’ Settings â†’ Variables and Secrets. Add values for the Production environment (and Preview too only if preview deployments need working APIs).

| Variable | Type | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Secret | Google Gemini API key; never put it in frontend code or Git |
| `GEMINI_MODEL` | Text | Optional; defaults to `gemini-3.8-flash` |
| `SUPABASE_URL` | Text | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Text | Supabase publishable key; legacy anon key is accepted as fallback |

Do not add a Supabase service-role key. Public contact submissions use the publishable/anon key and the table's Row Level Security policy. Owner inbox reads require a bearer token for the verified `zeehadhaque@gmail.com` account.

## Supabase prerequisite

If the `contact_messages` table and its RLS policies have not already been created in the Supabase project, run `supabase/migrations/001_contact_messages.sql` once in the Supabase SQL Editor.

## API routes

- `POST /api/chat` â€” Gemini-powered ZEE assistant; request `{ "message": "..." }`, response `{ "reply": "..." }`.
- `POST /api/contact` â€” saves the public contact form; response `{ "ok": true }`.
- `GET /api/contact` â€” requires a verified owner Supabase access token and returns `{ "messages": [...] }`.

The old `api/` and `vercel.json` files are intentionally retained for the existing Vercel deployment. Cloudflare Pages uses the new `functions/api/` files instead.

## Rate limiting note

The included limits are best-effort per Cloudflare isolate, not a globally shared counter. For stronger abuse protection, configure Cloudflare Rate Limiting or Turnstile before relying on these limits for high-traffic public use.
