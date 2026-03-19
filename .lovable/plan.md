

## Plan: Update HomeScreen icons, logo, and pill alignment

### Changes

1. **Replace blurry PNG icons with crisp SVGs** — Copy the 4 uploaded SVG icons (`activate.svg`, `reset.svg`, `focus.svg`, `recover.svg`) to `src/assets/` and update imports in `HomeScreen.tsx` from `.png` to `.svg`.

2. **Add the āera logo SVG** — Copy `logo-1.svg` to `src/assets/aera-logo.svg` and replace the text-based logo (`<span>āera</span>`) with an `<img>` tag using the SVG.

3. **Shift top pill row to the right** — Increase the `pl-[clamp(0px,8vw,32px)]` on the Activate/Reset row so that the right edge of the "Reset" pill aligns with the center of the "Recover" pill below. Will increase the left padding (approximately `pl-[clamp(24px,14vw,56px)]`) and test visually.

### Files modified
- `src/pages/HomeScreen.tsx` — update imports, logo, and pill row padding
- `src/assets/` — 5 new SVG files copied in

