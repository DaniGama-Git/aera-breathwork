

## Landing Page — Desktop Overhaul

Implementing the full desktop redesign of `src/pages/LandingPage.tsx` per the Figma. Hero stays as-is (already responsive). Everything below becomes a desktop layout, max-width **1280px**, centered, generous padding. Mobile stacks gracefully.

### Sections (top → bottom)

**1. The App + The Moment (combined row)** — light grey `#F5F5F7` background
- Two columns side-by-side on desktop (`md:grid-cols-2`), stacked on mobile.
- Each column: centered title (32–40px), subtitle, mockup image, description (~340px max), CTA button(s).
- Left: title "The App" + `mockup-app-screens.svg` + "Open App →" CTA → `/auth`.
- Right: title "The Moment" + `mockup-extension-breathe.svg` + "Add to Chrome — It's free" + "▶ Watch Demo" CTAs, plus the trust strip ("No credit card · Works with Google & Outlook · 2 min setup").
- Centered chevron at the bottom.

**2. The App — deep dive** — light grey card with rounded corners, contained inside max-w-1280px with horizontal margin
- Two-column grid: left = text block (small two-bar tab indicator, "The App" title, subtitle, body, "Open App →" CTA), right = `mockup-app-screens.svg` enlarged.

**3. The Moment — deep dive** — same card pattern as above
- Left text (tab indicator reversed, "The Moment", subtitle, body, "Add to Chrome →" CTA), right = `mockup-extension-breathe.svg`.

**4. How it works — Breathe. Recover. Perform.** — light grey card
- Header centered: "HOW IT WORKS" eyebrow, big title "Breathe. Recover. Perform.", subtitle "Three simple steps to peak performance every single day."
- 3 steps in a 2-col layout, alternating text/image:
  - **Step 1** — text left ("Reads your calendar"), illustration right (calendar mockup with "āera syncing" pill — placeholder for now until provided).
  - **Step 2** — illustration left (`Frame_38058.png` "Focus breath ready" card), text right ("Matches events to breathwork").
  - **Step 3** — text left ("Pops up at the right moment"), illustration right (`Frame_38064.png` "Reset complete" card — will swap once the transparent version arrives).
- Footer line: "No setup. No friction. Just better performance, one breath at a time."

**5. Footer** — white, centered "© 2026 āera. All rights reserved."

### Asset handling
- Copy `Frame_38058.png` → `src/assets/howitworks-step2-focus-ready.png`.
- Copy `Frame_38064.png` → `src/assets/howitworks-step3-reset-complete.png` (placeholder; will replace when transparent version provided).
- Step 1 calendar mockup: build inline with HTML/CSS (browser-chrome card with three event rows + side "āera syncing" pill) since no asset was supplied yet — easy to swap later.
- Reuse existing `mockup-app-screens.svg` and `mockup-extension-breathe.svg` for App/Moment sections.

### Technical
- Single file edit: `src/pages/LandingPage.tsx`. Hero unchanged.
- Wrapper: `max-w-[1280px] mx-auto px-6 md:px-10`.
- Cards: `rounded-[28px] bg-[#F5F5F7] p-8 md:p-16`.
- Section vertical rhythm: `py-12 md:py-20`, gaps inside cards `gap-10 md:gap-16`.
- Typography per existing brand: Neue Haas Grotesk (already global), titles `font-semibold`, body `text-gray-600/700`, eyebrow `uppercase tracking-widest text-[10px]`.
- Responsive: mobile = single column stack with smaller type (24–28px titles), desktop = grid layouts at `md:` breakpoint.
- All CTAs preserve existing routes (`/auth`, `/onboarding?flow=chrome`, `/wave`).
- No new dependencies.

### Out of scope for this turn
- Final Step 3 illustration (waiting on transparent version — will swap the asset filename only).
- Step 1 illustration if a final SVG is provided later (will swap the inline mockup for the asset).

