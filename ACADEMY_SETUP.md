# Zee Filmmaking Academy — activation guide

The Academy UI, API, Supabase project, database tables, row-level security policies and account endpoints are configured. Learner sign-up uses email confirmation; the production Auth redirect allowlist still needs the active Worker origin added before the verification link can return to the site.

## 1. Database status

The production project `khagjlnczaihgkohmpmg` (`zee-filmmaking-academy`, Singapore) already has both SQL migrations applied: contact messages and Zee Filmmaking Academy. The Academy tables, 30-day answer key, RLS policies, bootstrap trigger and RPC functions were verified in the live database.

The migration creates:
- `academy_profiles` — verified learner profile metadata.
- `academy_day_progress` — one completion row per user/day.
- `academy_attempts` — quiz attempt history.
- `academy_answer_key` — server-side answer and XP key.
- `academy_entitlements` — time-limited or permanent feature access.

Row Level Security is enabled. Learners can read only their own profile/progress/attempts/entitlements. The verified owner can read the learner directory. Browser clients do not receive direct insert/update/delete grants for progress, attempts or entitlements. Progress and entitlements are changed through protected database functions.

## 2. Configure Cloudflare Worker variables

Supabase connection variables are already included in `wrangler.jsonc` as public Worker variables (`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`). The publishable key is specifically intended for client-facing use. The live `/api/academy` endpoint has been checked and returns `configured: true`.

Keep `GEMINI_API_KEY` as a Cloudflare Secret for the separate ZEE chat assistant; do not place it in frontend code or Git. Do not add a Supabase `service_role` key. The Worker verifies each user's access token with Supabase Auth and uses that user's token for database reads/RPC calls.

## 3. Configure Supabase Auth URLs

In **Supabase → Authentication → URL Configuration**:

- Set the Site URL to `https://zeehadhaque.zeehadhaque.workers.dev`.
- Add `https://zeehadhaque.zeehadhaque.workers.dev` to the allowed Redirect URLs.
- The signup handler sends Supabase email-confirmation redirects to the current Worker origin; Supabase will honor that URL after it is allowlisted.
- After `zeehadhaque.eu.org` is approved and connected to the Worker, add `https://zeehadhaque.eu.org` as an allowed redirect and update the Site URL if it becomes the canonical URL.
- Keep email confirmation enabled for learner accounts. The Academy only accepts a verified email session.

Supabase's email provider/template and SMTP deliverability are controlled by the Supabase project; confirm those are configured before inviting learners.

## 4. Build and deploy

The Worker entrypoint is `src/worker.ts`; static Vite output is `dist/`. The root `wrangler.jsonc` routes `/api/*` through the Worker and serves the SPA assets. The Worker dispatches `/api/academy`, `/api/chat` and `/api/contact`; unknown API paths return JSON 404.

Cloudflare build settings:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Pushes to `main` trigger the existing GitHub Actions build and Cloudflare deployment. The Supabase variables are already committed in `wrangler.jsonc`; Cloudflare still requires the repository Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## 5. First-run test

1. Open the live Worker URL and scroll to Zee Filmmaking Academy.
2. Create a learner account and verify its email.
3. Sign in, complete Day 01 with the correct answer and confirm the XP total increases by 20.
4. Refresh the page; the completed day and XP should still be present.
5. Try completing Day 03 before Day 02; the database should reject out-of-sequence completion.
6. Sign in with the verified owner account `zeehadhaque@gmail.com`. The Admin Studio should appear.
7. Grant a test learner `program.30day` (30 days), `track.advanced`, or `arcade.pro`; confirm the corresponding feature unlocks. Revoke it and confirm it locks again.

## Access model

- Guest visitors can study and practice Days 01–07. Guest answers do not persist and do not award account XP.
- Signed-in learners save successful lesson completion and reflection. XP is awarded once per lesson and calculated in the database from the server-side answer key.
- Days 08–30 require the `program.30day` entitlement and lessons are completed in sequence.
- `track.advanced` unlocks the Advanced Cinematography Lab.
- `arcade.pro` unlocks the advanced Cut Rhythm Lab challenge.
- Only the verified owner email can use the Admin Studio. Admin actions are checked again by database RPC functions.

The final examination is a practice checkpoint, not a formal qualification. The Cine-Arcade and advanced lab checklists are skill-practice activities; they do not issue professional certification.

## Worker route compatibility

The Worker reuses the existing `functions/api/chat.ts` and `functions/api/contact.ts` request handlers through explicit route dispatch. These handlers are invoked directly by `src/worker.ts`; they are not being treated as automatically executed Pages Functions. Configure the existing Gemini and Supabase variables above before expecting the chat/contact service to work.
