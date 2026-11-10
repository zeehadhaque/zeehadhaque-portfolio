# Cloudflare Workers deployment

This repository builds the cinematic portfolio with React, TypeScript and Vite, then serves it through the Cloudflare Worker named `zeehadhaque-filmmaker`.

## Automatic GitHub deployment

The workflow at `.github/workflows/deploy-cloudflare.yml` builds and deploys the Worker whenever a commit reaches `main`. It can also be started manually from the repository's Actions tab.

Add these repository secrets under **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Account:Read and Workers Scripts:Edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID that owns the Worker |

Once both secrets exist, merging a change to `main` triggers the build and deployment automatically. Without them, the workflow still builds the project but skips deployment.

## Cloudflare runtime variables

Configure these under **Cloudflare Dashboard → Workers & Pages → zeehadhaque-filmmaker → Settings → Variables and Secrets**. Use encrypted secrets for API keys.

| Variable | Type | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Secret | Powers the ZEE AI assistant; never put it in frontend code or Git |
| `GEMINI_MODEL` | Text (optional) | Optional model override |
| `SUPABASE_URL` | Text | Supabase project URL for Academy accounts and contact messages |
| `SUPABASE_PUBLISHABLE_KEY` | Secret | Supabase publishable key; legacy anon key is accepted as fallback |

Do not add a Supabase service-role key. The Academy uses verified user tokens and protected database functions.

## Academy and contact database

Apply the SQL migrations in `supabase/migrations/` to the matching Supabase project before enabling account-backed Academy progress or contact submissions. The public site and guest Academy lessons can render without Supabase, but sign-in, saved progress, owner inbox and contact form persistence require the matching configuration.

## Manual deployment

From a clean clone of this repository:

```powershell
npm.cmd ci
npm.cmd run build
npx.cmd wrangler deploy --config wrangler.jsonc
```

Authenticate first with `npx.cmd wrangler login` if Wrangler has not been authorised on that machine.

## API routes

- `POST /api/chat` — Gemini-powered ZEE assistant.
- `POST /api/contact` — saves a public contact message through Supabase.
- `GET /api/contact` — verified owner inbox.
- `GET /api/academy` and `POST /api/academy` — Academy authentication, progress and entitlement operations.

Runtime secrets are stored by Cloudflare and are not overwritten by a normal Worker code deployment.
