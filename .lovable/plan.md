

# Fix Fullscreen Mode for Extension Overlay

## Problem
When fullscreen is toggled, `content.js` expands the iframe to `100vw × 100vh`, but inside the iframe the popup's CSS keeps the body locked at `290px × 400px` (iframe-mode). The breathing UI stays small in the top-left corner instead of filling the screen.

## Fix

### 1. Add a `fullscreen-mode` CSS class in `extension/popup.html`
```css
body.fullscreen-mode {
  width: 100vw !important;
  min-width: unset !important;
  height: 100vh !important;
  min-height: unset !important;
}
body.fullscreen-mode .card-wrap { width: 100%; height: 100% }
body.fullscreen-mode .card { width: 100%; height: 100%; aspect-ratio: unset }
```

### 2. Toggle this class in `extension/popup.js`
In the fullscreen click handler (~line 607), add/remove `fullscreen-mode` on `document.body` and update `document.documentElement` styles to `100vw`/`100vh` when entering fullscreen, and back to `290px`/`400px` when exiting.

### 3. Repackage `public/aera-extension.zip`

## Files Changed
- `extension/popup.html` — add `fullscreen-mode` CSS rules
- `extension/popup.js` — toggle the class + html dimensions on fullscreen
- `public/aera-extension.zip` — rebuilt

