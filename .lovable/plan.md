

## Revert onboarding background image

Replace the current `onboarding-bg.jpg` with the uploaded dark dunes image and reset the background styling to standard settings.

### Changes

1. **Copy uploaded image** to `src/assets/onboarding-bg.jpg`, overwriting the current file
2. **`src/pages/Onboarding.tsx`** — reset the `<img>` tag to simple cover settings:
   - `object-bottom` → `object-center`
   - Remove the `bg-black/30` overlay or keep it minimal
   - Ensure `bg-[#d8dce0]` on the container matches the sky tone in the image

