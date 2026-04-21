

## Onboarding & Extension — Desktop Layout (Mobile Preserved)

Add a desktop layout for `/onboarding` and `/extension` while keeping the existing mobile design exactly as-is at small viewports.

### Approach: viewport-based switching

Use `useIsMobile()` (existing hook) inside each page to render either the current mobile layout or a new desktop layout. This keeps mobile pixel-perfect and avoids retrofitting `md:` classes everywhere.

```tsx
const isMobile = useIsMobile(); // breakpoint 768px
return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

### 1. Routing — `src/App.tsx`
- `/onboarding` and `/extension`: remove `MobileFrame` wrapper so desktop can use full viewport width. Mobile layout inside the page will still render in a centered 430px container manually so it looks identical to today.
- All other routes keep `MobileFrame`.

### 2. `src/pages/Onboarding.tsx`

**Mobile (<768px)**: render the **exact current JSX** unchanged, wrapped in a `max-w-[430px] mx-auto` container to mimic `MobileFrame`.

**Desktop (≥768px)** — new layout per Figma:
- Full-width header strip `bg-[#F5F5F7] px-10 py-6`: logo left (h-6, black), tagline right (`Breathe. Recover. Perform. / In under 5 minutes.`, semibold black both lines).
- Body: white, `max-w-[1280px] mx-auto px-10 flex-1`.
- Large grey card `bg-[#F5F5F7] rounded-[40px] p-16 mt-20`:
  - Top row: question (semibold ~22px) left, `Step X/Y · Skip` right (small grey).
  - Hint paragraph below question.
  - Step content: `MultiSelectStep` / `KeywordStep` rendered larger (parent gives more width; pills naturally expand).
- Bottom action bar pinned: full-width `border-t px-10 py-5 flex justify-between`. Left = outlined `Back` pill (only after step 1). Right = black `Continue →` pill.

Logic, state, save flow, step order — unchanged.

### 3. `src/pages/Extension.tsx`

**Mobile (<768px)**: render existing JSX unchanged inside `max-w-[430px] mx-auto`.

**Desktop (≥768px)** — new layout per `Manual_Add_extension.png`:
- Same header strip as onboarding.
- `max-w-[1280px] mx-auto px-10 py-10 space-y-6`.
- Hero card `bg-[#F5F5F7] rounded-[40px] p-16` with `grid md:grid-cols-2 gap-12 items-center`:
  - **Left**: pill badge (`Performance Breathwork · Built for work`), title `Chrome Extension` (~52px bold), subtitle, "Trigger words" subcard (`bg-[#E5E5E5] rounded-[20px] p-6`) with label + copy button + uppercase keywords + helper line, full-width black `Download Extension` pill (with download icon), helper text below.
  - **Right**: existing `mockup-extension-breathe.svg` (or current mockup) `w-full max-h-[420px] object-contain`, plus numbered 1–3 install steps below (14px).
- Two existing accordions (`How to install (Manually)`, `Calendar Settings`) kept, full-width within container, padding `px-8 py-5`, font 15px.
- Footer strip: `© 2026 āera. All rights reserved.` 12px grey, centered, border-top.

All download/keyword/copy logic and navigation unchanged.

### 4. Out of scope
- No copy or option changes.
- No data, auth, or save logic changes.
- Mobile layouts untouched.
- No new dependencies.

### Technical notes
- `useIsMobile` already exists at `src/hooks/use-mobile.tsx` (768px breakpoint).
- Tailwind only; no `md:` rewrites — desktop is its own JSX tree, mobile is the current JSX tree.
- `MultiSelectStep` and `KeywordStep` need no API changes; the desktop card's larger width naturally expands them.

