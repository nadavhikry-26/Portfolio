# CLAUDE.md — Nadav Hikry Portfolio Site

This file is the build brief. Read it fully before writing any code, and
follow it on every session. When something here conflicts with a later
instruction I type in chat, ask me before overriding it.

---

## 0. What this is

A personal portfolio site for **Nadav Hikry, Senior AI Product Designer**
(currently Product Experience Lead at Elementor, based in Israel).

Its job: be a **showcase / highlight reel** that earns a callback from
hiring managers. It is NOT a set of deep case studies — the full case
study happens in the next step of the hiring process (a live presentation).
So keep each project short and appealing, with real substance but not the
full process breakdown.

Primary audience: hiring managers in the Israeli product-design market
(English-language site is standard and expected).

---

## 1. Tech stack

- **Plain HTML, CSS, and JavaScript. No framework, no build tools.**
  One self-contained site that can be opened directly and hosted anywhere
  (Netlify, Vercel, GitHub Pages, etc.).
- Single `index.html` plus separate `styles.css` and `script.js` (keep it
  clean and readable — Nadav is a designer who will tweak this later).
- No dependencies unless truly needed. If a tiny bit of JS is needed for
  scroll animation and the light/dark toggle, write it vanilla.
- Must be fully responsive (looks great on mobile — many recruiters open on
  phones) and fast to load.
- Accessible: semantic HTML, alt text on images, good contrast, keyboard
  navigable, respects `prefers-reduced-motion`.

---

## 2. Visual system (this is the heart of it — get this right)

The site must feel: **stunning, well-designed, top-tier typography, clean,
professional but not too serious, with smooth gentle animation.**

Reference feel: Pamidor (pamidordesign.com) and Daniel Autry
(danielautry.com) — confident, minimal, big type, lots of whitespace.

### Color — pure monochrome, no accent color

- **Light mode (daytime default):** bright near-white background, warm
  near-black text.
  - Background: `#F7F7F5`
  - Text: `#1A1A1A`
  - Muted text: `#6A6A66`
  - Borders/hairlines: `#E6E6E2`
- **Dark mode (evening default):** warm near-black background, warm
  off-white text.
  - Background: `#111110`
  - Text: `#F2F0EA`
  - Muted text: `#9C968A`
  - Borders/hairlines: `#2A2926`
- No accent/brand color anywhere. The design lives on type, space, and
  contrast. Buttons are solid (black pill with light text in light mode;
  light pill with dark text in dark mode).
- Use CSS custom properties (variables) for all colors so both themes are
  driven from one place.

### Light/dark behavior

- Default the theme by the visitor's **local time of day**: light mode
  during daytime (roughly 07:00–19:00 local), dark mode in the evening/night.
- Provide a **small manual toggle** in the nav that overrides the auto
  setting and remembers the choice for the session (in-memory or a simple
  cookie is fine — note: this site is hosted normally so localStorage is
  OK here, unlike Claude.ai artifacts).
- The transition between modes should be smooth (gentle color fade), not a
  hard flip.

### Typography

- Big, bold, confident sans-serif headlines set tight (large size, tight
  line-height, slightly negative letter-spacing). Think stacked names like
  Pamidor's "DOR / SHARABY" — Nadav's hero should stack "NADAV / HIKRY".
- Clean, quiet, highly-readable sans for body text.
- Use a strong free typeface so licensing is never an issue. Recommended:
  a geometric/grotesk sans such as **"Inter"** for body and either a
  heavier weight of the same or a display grotesk for headlines. If you can
  set up a tasteful pairing (e.g. a characterful display sans for headlines
  + Inter for body), do — but keep it to two families max. Prefer
  self-hosted or Google Fonts.
- Establish a clear type scale and use only 2 weights (regular + medium/bold).

### Layout & motion

- Generous whitespace, wide margins, single-column reading measure.
- Black pill buttons and nav items, rounded, high-contrast (Pamidor style).
- Numbered section styling is welcome (the deck uses big ghosted numerals
  01, 02 — optional to echo, tastefully).
- **Smooth, gentle animation only:** elements fade-and-rise subtly on
  scroll into view; smooth easing on hovers and the theme toggle; a subtle
  marquee is OK for a logo/credibility strip. Nothing bouncy, spinny, or
  flashy. Motion should feel calm and expensive. Always respect
  `prefers-reduced-motion`.

---

## 3. Site structure

Nav (top): **Work · Writing · About · Contact** + light/dark toggle.
Logo mark top-left: `NADAV®` (simple wordmark).

Sections, in order:

### Hero (Home)
- Large stacked headline: **NADAV / HIKRY**
- Sub-line: **Senior AI Product Designer**
- Optional POV tagline — PLACEHOLDER, Nadav to finalize:
  `"I make complex products feel simple."`
  (Leave it in but easy to find/edit. It's fine to ship with it.)
- A quiet scroll cue (e.g. "↓ View work").

### Work (two projects — the core)
Each project: name, one-line hook, role/company line, a short paragraph,
and 2 strong visuals. Keep it a highlight, not a case study.

**Project 1 — Sticklight Cloud** (list this one FIRST)
- Hook: *Where do you host the app the AI just built for you?*
- Meta: Product & Design, 0→1 · Elementor · MVP, in internal production
- Copy:
  > AI tools like Lovable, Cursor, and Bolt can generate an app in seconds
  > — but shipping it professionally is where people hit a wall. Vercel and
  > Netlify are built for developers who understand infrastructure; the
  > vibe-coding tools are closed boxes. Sticklight Cloud is the missing
  > layer: professional-grade hosting built for the output of *any* AI
  > coding tool. It auto-detects the tech stack and wires everything behind
  > the scenes, so power users get a single hub to deploy and manage all
  > their AI apps. I led it from problem to MVP — product thinking, UX, and
  > the full interface.
- Images: `images/sticklight-dashboard.png`, `images/sticklight-workflow.png`

**Project 2 — Riverside**
- Hook: *Onboarding, rebuilt around intent*
- Meta: Product Design · Onboarding redesign
- Copy:
  > Riverside's onboarding wasn't landing — activation was low, and users
  > waited too long to reach the moment the product actually pays off. The
  > flow also didn't account for *why* someone showed up; a podcaster, a
  > marketer, and a team recording a webinar all got the same generic path.
  > I redesigned onboarding around user intent — different goals, different
  > routes — with an emphasis on building trust and a visible sense of
  > progress from the very first action. The new flow went through A/B
  > testing as part of a phased rollout.
- Images: `images/riverside-intent.png`, `images/riverside-onboarding.png`
  (optional third: `images/riverside-results.png`)
- IMPORTANT: do NOT state any specific metrics/percentages for Riverside.
  There are no confirmed numbers. Describe the work qualitatively only.

### Writing (one external link, opens in a new tab — not a project)
Display as a single clean card:
- Title: **Making Domain Search Work**
- Blurb: *On designing the "domain taken" moment — and why AI should be
  timed, not first.*
- Meta: Elementor UX · 4 min read
- Link (open in new tab, `rel="noopener"`):
  https://ux.elementor.com/making-domain-search-work/
- Show a small ↗ external-link indicator.

### About
- Portrait image: `images/nadav-portrait.png` (placeholder — Nadav may
  swap for a cleaner headshot later; design so it's easy to replace).
- Copy (edit to taste):
  > I'm Nadav — a senior product designer based in Israel, currently
  > Product Experience Lead at Elementor. Over the years I've designed
  > across a range of industries, from ride-hailing at Gett to AI-native
  > products today. I like the hard part of the job: taking something
  > complex and ambiguous and making it feel obvious and simple to use.
  >
  > I work AI-native — not just designing AI products, but building with AI
  > tooling directly, from prototyping to setting up my own workflows. When
  > I'm not designing, I'm probably playing guitar or spending time with my
  > wife Dana and our three kids.

### Playground
One entry for now (room to add more later):
- Title: **This site**
- Copy: *Designed and built with Claude Code — a designer directing AI to
  ship the whole thing, from design to build to deploy.*

### Contact / Footer
- Heading: **Let's talk.**
- Email: `PLACEHOLDER_EMAIL` (Nadav to fill in)
- LinkedIn: `PLACEHOLDER_LINKEDIN_URL` (Nadav to fill in)
- Line: "Available for new opportunities."

---

## 4. Assets

All images are in the `images/` folder next to this file:
- `sticklight-dashboard.png` — Sticklight Cloud projects dashboard
- `sticklight-workflow.png` — Sticklight AI workflow / Cursor setup
- `riverside-intent.png` — Riverside intent-selection screen
- `riverside-onboarding.png` — Riverside redesigned onboarding
- `riverside-results.png` — Riverside results view (optional)
- `nadav-portrait.png` — portrait (placeholder, dark/artistic)

These were exported from a slide deck, so they may have slide-sized
padding/aspect ratios. Crop, frame, or present them inside tasteful
device/browser frames or padded cards so they look intentional on the site
rather than raw screenshots. Keep them sharp on retina.

---

## 5. Placeholders Nadav still needs to fill

Make these easy to find (group them / comment them clearly in the HTML):
- POV tagline (currently "I make complex products feel simple")
- Contact email
- LinkedIn URL
- Possibly a cleaner portrait photo
- Confirm whether Sticklight Cloud is public or internal (currently phrased
  as "MVP, in internal production" to be safe — don't link it externally).

---

## 6. Build approach

- Start by scaffolding the full page structure with all sections and real
  copy in place (no lorem ipsum — the real copy is above).
- Then style it to the visual system: get typography, spacing, and the
  light/dark system right first, since that's where quality lives.
- Add the gentle scroll/hover animations last.
- Show me the result, and I'll art-direct refinements in plain language
  ("bigger headline", "more space here", "softer fade"). Expect iteration.
- Keep the code clean, commented at section boundaries, and easy for a
  designer to edit by hand.
