# Project Knowledge

## Authoritative source

The supplied personal cinematic identity brief is authoritative. The previous
reference site `https://zeehadhaque.vercel.app/` returned HTTP 404 during the
audit, so no content was imported from it and no missing information was
invented.

The current direction supersedes the earlier castle-first concept. This is a
portrait-led, light editorial personal-brand website for Zeehad Haque.

## Verified identity

- **Name:** Zeehad Haque
- **Professional identity:** Director · Writer · Cinematographer · Editor
- **Location:** Gazipur, Dhaka, Bangladesh
- **Email:** zeehadhaque@gmail.com
- **WhatsApp:** +8801629851155
- **Brand statement:** `I DON'T JUST CAPTURE FRAMES. I CREATE WORLDS.`

The statement is treated as a proposed creative headline, not as a fabricated
biography.

## Creative direction

The interface uses a primarily light editorial paper background, near-black
type, cobalt as the signature accent and ice blue as its supporting tone. The
experience is portrait-led and image-sequence-oriented, with a deliberate
professional/personal split through **On Set** and **Off Set**.

Reference principles were studied from the public Lando Norris website:
portrait-led identity, personal storytelling, editorial image sequencing,
professional/personal content division, archive presentation and a strong
closing contact/social moment. No Lando Norris identity, branding, copy,
photography or proprietary assets are used.

## Content integrity

No awards, clients, partnerships, biography, credits, cast, crew, reviews,
release dates, social statistics or achievements are added without verified
source material. Missing archive material is represented as unavailable rather
than replaced with stock or generated imagery.

## Current implementation

The complete front-end foundation includes:

- Hero portrait and `ENTER THE FRAME` interaction
- Editorial introduction
- On Set / Off Set sections
- Selected Films archive with the eight supplied URLs
- Lazy YouTube poster previews and click-to-open embeds
- Frame Archive with an honest unavailable-material state
- Exact eight-project In Development list
- Zee Filmmaking Academy feature environment
- Contact actions and contact form client
- ZEE assistant interface
- Responsive navigation, loading state and reduced-motion support

Gemini and Supabase server endpoints are implemented separately under `api/`
and require deployment environment configuration.
