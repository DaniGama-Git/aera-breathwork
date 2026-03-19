

## Breathwork Session: Activate Screen

### What We're Building
A mobile-first breathwork session screen matching the provided screenshot, using uploaded assets.

### Route
**`/breathwork-session-activate`** — dedicated route for the Activate session screen.

### Files to Create/Edit

1. **Copy assets to `src/assets/`** — `rectangle-bg.png`, `play-icon.png`, `breathe-icon.png`, `home-indicator.png`

2. **`src/pages/BreathworkSession.tsx`** — New file. Full screen component with:
   - Code comments explaining this is Screen 1 of 3: "Breathwork Session: Activate"
   - Comments noting the route is `/breathwork-session-activate`
   - `Rectangle.png` as full-bleed background (`bg-cover bg-center`)
   - Top: "Activate" pill badge + breathe icon, title "Mid-Day Energy Boost", subtitle "Rapid physiological up-regulation."
   - Center: Audio waveform visualization (CSS animated bars)
   - Bottom: Speaker row ("Jamie" · "Speaking..." · "00:03:00"), large circular play button using play icon asset
   - Bottom nav bar: dark rounded pill, 4 tabs (Home, Breathe active, Search, Science)
   - Home indicator bar at very bottom
   - Mobile-first layout (`max-w-[430px] mx-auto min-h-screen`), Inter font, white text

3. **`src/App.tsx`** — Add route `/breathwork-session-activate` with comment: `{/* Screen 1: Breathwork Session Activate */}`

4. **`src/pages/Index.tsx`** — Redirect to `/breathwork-session-activate`

