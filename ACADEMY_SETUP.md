# Zee Filmmaking Academy — activation guide

The Academy UI and API are implemented in the repository. Learner accounts, persisted progress, XP awards and access entitlements remain disabled until the Supabase migration and Cloudflare Worker variables below are configured.

## 1. Apply the database migration

Open **Supabase Dashboard → SQL Editor**.

1. If the project has not used the portfolio contact form before, run `supabase/migrations/001_contact_messages.sql` first.
2. Run the complete file `supabase/migrations/002_zee_filmmaking_academy.sql` once.
3. Confirm that the Academy tables and RPC functions were created.

The migration creates:
- `academy_profiles` — verified learner profile metadata.
- `academy_day_progress` — one completion row per user/day.
- `academy_attempts` — quiz attempt history.
- `academy_answer_key` — server-side answer and XP key.
- `academy_entitlements` — time-limited or permanent feature access.

Row Level Security is enabled. Learners can read only their own profile/progress/attempts/entitlements. The verified owner can read the learner directory. Browser clients do not receive direct insert/update/delete grants for progress, attempts or entitlements. Progress and entitlements are changed through protected database functions.

## 2. Configure Cloudflare Worker variables

Open **Cloudflare Dashboard → Workers & Pages → zeehadhaque-filmmaker → Settings → Variables and Secrets**.

Add these production variables:

| Name | Type | Value |
|---|---|---|
| `SUPABASE_URL` | Text | Supabase project URL, e.g. `https://<project-ref>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Text | Supabase publishable key (legacy anon key is accepted as fallback) |
| `GEMINI_API_KEY` | Secret | Gemini API key for the existing ZEE chat assistant |
| `GEMINI_MODEL` | Text | Optional Gemini model name; the existing chat function has a default |

Do not add a Supabase `service_role` key. The Worker verifies the user's access token with Supabase Auth and uses that user's token for database reads/RPC calls. It never needs the service-role credential. Keep `GEMINI_API_KEY` as a Cloudflare Secret; never place it in frontend code or Git.

## 3. Configure Supabase Auth URLs

In **Supabase → Authentication → URL Configuration**:

- Set the Site URL to the active Worker URL: `https://zeehadhaque-filmmaker.khayrulislamzeehad.workers.dev`.
- Add the same Worker origin to the allowed Redirect URLs.
- After `zeehadhaque.eu.org` is approved and connected to the Worker, add `https://zeehadhaque.eu.org` as an allowed redirect and update the Site URL if it becomes the canonical URL.
- Keep email confirmation enabled for learner accounts. The Academy only accepts a verified email session.

Supabase's email provider/template and SMTP deliverability are controlled by the Supabase project; confirm those are configured before inviting learners.

## 4. Build and deploy

The Worker entrypoint is `src/worker.ts`; static Vite output is `dist/`. The root `wrangler.jsonc` routes `/api/*` through the Worker and serves the SPA assets. The Worker dispatches `/api/academy`, `/api/chat` and `/api/contact`; unknown API paths return JSON 404.

Cloudflare build settings:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Deploy from `main` after merging the Academy pull request. Confirm the build and deployment succeed before testing the API.

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
