

## Plan: Create HRV Demo Page

Build a static demo page matching the uploaded HRV Tracking screenshot. All data is hardcoded for demo purposes.

### New file: `src/pages/HrvDemo.tsx`

A light-themed page (white background) with the 430px max-width container, containing:

1. **Header** — Back arrow + "Your HRV" title centered
2. **Stress Score card** — Icon, "Stress Score" / "Pay Attention" labels, circular arc gauge showing score of 32 (built with SVG arc, orange/brown gradient)
3. **HRV Trend card** — Heart icon + "HRV" label, green "+5.6%" badge, "Post Session HRV" with "+12 ms" and large "74 ms" value. Below: an SVG chart with a smooth line curve over vertical bar visualization (stylized, not real data). Time range pills: Days (active), Month, 6 Months, Year
4. **Bottom metrics row** — 3 small cards: Resting Heart Rate (74 ms, +12 ms), Heart Rate Variability (36 ms), Respiratory Rate (17.4 ms, +2.6% green badge)
5. **BottomNavBar** — Reuse existing component but with "Science" tab active instead of "Breathe"

### HRV Chart visualization
Use a simple inline SVG with a hand-drawn polyline for the smooth curve and rectangles for the vertical bars — no charting library needed for static demo data.

### Circular gauge (Stress Score)
SVG arc using `stroke-dasharray` / `stroke-dashoffset` on a circle element with a gradient from brown to orange.

### Route update: `src/App.tsx`
Add `/hrv` route pointing to the new `HrvDemo` page.

### BottomNavBar update
Add an optional `activeTab` prop so the HRV page can set "Science" as active. Default remains "Breathe" for existing screens.

### Files
- **Create** `src/pages/HrvDemo.tsx`
- **Edit** `src/App.tsx` — add route
- **Edit** `src/components/BottomNavBar.tsx` — add `activeTab` prop

