

## Three Fixes for Wave Preview

### Fix 1: Paused overlay hides everything underneath
**File:** `src/pages/WavePreview.tsx` (lines 349-359)

Add a dark semi-transparent background with backdrop blur to the paused overlay div. Bump z-index to `z-20` (same level as controls but rendered before them). Keep `pointerEvents: none`.

```tsx
// Current: z-15, no background
// New: z-20, dark background + blur
<div
  className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-500"
  style={{
    opacity: showPausedOverlay ? 1 : 0,
    pointerEvents: "none",
    background: showPausedOverlay ? "rgba(0,0,0,0.55)" : "transparent",
    backdropFilter: showPausedOverlay ? "blur(6px)" : "none",
  }}
>
```

Control buttons div (line 318) stays at `z-20` but will render after the overlay, keeping them clickable.

### Fix 2: macOS controls
No code change — these are native browser/OS window controls, not rendered by the app.

### Fix 3: Shorten "NATURALLY EXHALE" durations and labels
**File:** `src/data/breathingProtocols.ts`

All 7 occurrences of `label: "NATURALLY EXHALE"` → remove the label entirely (defaults to `"EXHALE"`). Duration changes for outliers:

| Location | Current | New |
|---|---|---|
| Line 491 (Deep Focus stage 1) | 6000ms | 3000ms |
| Line 538 (Wake Me Up stage 1) | 7000ms | 3500ms |
| Line 585 (Pre-Meeting stage 1) | 5000ms | 3000ms |
| Lines 256, 306, 409, 515 | 3000ms | 3000ms (no change) |

### Files to change
- `src/pages/WavePreview.tsx` — paused overlay background + z-index
- `src/data/breathingProtocols.ts` — remove "NATURALLY EXHALE" labels, reduce 3 outlier durations

