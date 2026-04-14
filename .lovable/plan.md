

# Fix Fullscreen Mode for Extension Breathing Overlay

## Problem
The screenshot shows the breathing UI stuck at 290x400px in the top-left corner when fullscreen is toggled. The parent iframe expands correctly (via `content.js`), but the popup's internal CSS (`iframe-mode`) keeps the body at fixed 290x400px dimensions.

## Fix

### 1. Add fullscreen CSS rules in `extension/popup.html`
Add a `.fullscreen-mode` class that overrides the `iframe-mode` constraints:

```css
body.iframe-mode.fullscreen-mode {
  width: 100vw !important;
  min-width: 100vw !important;
  height: 100vh !important;
  min-height: 100vh !important;
}
body.iframe-mode.fullscreen-mode .card-wrap {
  width: 100%; height: 100%;
}
body.iframe-mode.fullscreen-mode .card {
  width: 100%; height: 100%; aspect-ratio: unset;
}
```

Also override `html.overlay-mode` when fullscreen:
```css
html.overlay-mode.fullscreen-mode {
  width: 100vw !important;
  height: 100vh !important;
}
```

### 2. Toggle the class in `extension/popup.js`
In the fullscreen click handler (~line 607), add/remove `fullscreen-mode` on both `document.body` and `document.documentElement` when toggling:

```js
ctrlFullscreen.addEventListener("click", () => {
  isFullscreen = !isFullscreen;
  window.parent.postMessage({ type: "toggle-fullscreen", fullscreen: isFullscreen }, "*");
  document.body.classList.toggle("fullscreen-mode", isFullscreen);
  document.documentElement.classList.toggle("fullscreen-mode", isFullscreen);
  expandIcon.style.display = isFullscreen ? "none" : "";
  shrinkIcon.style.display = isFullscreen ? "" : "none";
});
```

### 3. Repackage `public/aera-extension.zip`

## Files Changed
- `extension/popup.html` — add `fullscreen-mode` CSS overrides
- `extension/popup.js` — toggle class on fullscreen
- `public/aera-extension.zip` — rebuilt

