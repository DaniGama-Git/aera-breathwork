

## Plan: Replace Extension Page Background

Replace the current gradient background image (`activate-gradient-v2.webp`) with the uploaded brand guidelines background image on the Chrome Extension page.

### Steps

1. **Copy uploaded image** to `src/assets/extension-bg.png`
2. **Update `src/pages/Extension.tsx`**: Change the import from `activate-gradient-v2.webp` to the new `extension-bg.png` and ensure the `<img>` tag uses `object-cover` to fill the viewport properly

No other files need changes.

