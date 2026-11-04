# Technical Architecture

## Deployment

Vercel is the single deployment target. Frontend assets are built with Vite;
Gemini and contact handlers live in Vercel serverless functions under `api/`.
No Cloudflare Worker or second deployment architecture is used.

## Frontend

- React 19
- TypeScript with strict checking
- Vite
- Semantic HTML
- Native CSS custom properties and modular CSS sections
- No UI framework dependency
- Content kept in `src/data/site.ts`
- Reusable components under `src/components/`

## Component boundaries

```text
src/
  app/App.tsx
  components/
    hero/HeroPortrait.tsx
    navigation/SiteNavigation.tsx
    sections/
      PersonalIntroduction.tsx
      OnSetSection.tsx
      OffSetSection.tsx
      FilmArchive.tsx
      FrameArchive.tsx
      FutureProjects.tsx
      AcademySection.tsx
      ContactSection.tsx
    zee-ai/ZeeAIAssistant.tsx
  data/site.ts
  hooks/useActiveSection.ts
  hooks/useReducedMotion.ts
  styles/tokens.css
  styles/global.css
```

## Gemini security

```text
Browser → POST /api/chat → Vercel function → Gemini API → safe response
```

`GEMINI_API_KEY` remains server-only. The endpoint validates and bounds input,
limits output, uses a verified portfolio context, applies a basic server-side
rate limit and returns safe errors. The browser never calls Gemini directly.

## Contact and private inbox security

```text
Browser → POST /api/contact → Vercel function → Supabase REST API
Owner → authenticated verified Supabase token → GET /api/contact → RLS owner policy
```

Public users can insert valid messages only. Anonymous users cannot read,
update or delete. Owner inbox reads require a server-verified Supabase Auth
identity whose email is exactly `zeehadhaque@gmail.com` and verified. The
Supabase RLS policy independently limits reads to the same owner email claim.
Service-role credentials never enter frontend code.

## Responsive and accessible behavior

- Desktop editorial grid with mobile-specific vertical composition
- Touch-friendly navigation and controls
- No horizontal overflow by design
- Semantic headings, labels, links and form controls
- Visible keyboard focus states
- Escape closes menus and film viewer
- `prefers-reduced-motion` disables nonessential transitions
- Basic content works without WebGL, hover or audio
- Video embeds are lazy and never autoplay

## Performance

- Hero portrait is preloaded and marked high priority.
- Film thumbnails are lazy-loaded.
- YouTube iframes mount only after selection.
- No Three.js is loaded for decorative purposes.
- CSS contour artwork avoids a heavy WebGL environment.
- Future media should be supplied in optimized responsive formats.

## Required Vercel environment variables

```text
GEMINI_API_KEY
GEMINI_MODEL (optional)
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY (not used by the public client; reserved for trusted admin operations)
```
