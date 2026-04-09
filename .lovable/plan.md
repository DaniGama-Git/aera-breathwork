

## Reduce Text, Add Visuals to Extension Page

**Problem:** The extension download page is a wall of 5 numbered text steps. It reads like documentation, not a product experience.

**Approach:** Replace the step-by-step text list with a visual-first layout — a product mockup hero, condensed instructions, and a cleaner flow.

### Changes to `src/pages/Extension.tsx`

1. **Add a product mockup image** below the hero subtitle — use the existing `mockup-extension.png` asset (already in `src/assets/`) showing the extension in action. This immediately communicates what the user is getting.

2. **Collapse 5 steps into 3** — merge related instructions:
   - **Step 1: Download & unzip** (combines current steps 01 + 02)
   - **Step 2: Add to Chrome** — "Open `chrome://extensions`, enable Developer mode, click Load unpacked" (combines 03 + 04)
   - **Step 3: Connect calendar** (current step 05)
   
   Each step becomes a single line with a number badge — no paragraph descriptions.

3. **Visual layout restructure:**
   - Hero: logo + title + one-line subtitle + mockup image (centered, ~200px tall)
   - Below mockup: 3 compact instruction lines (icon + short text, no cards/boxes)
   - Download CTA button stays as-is
   - Keywords section stays as-is

4. **Remove verbose descriptions** — each step becomes ~8 words max. Example:
   - ~~"Click the button below to download the āera extension."~~ → just the download button itself
   - ~~'Go to chrome://extensions and enable "Developer mode" (top-right toggle).'~~ → "Enable Developer mode at chrome://extensions"

### Files to change
- `src/pages/Extension.tsx` — restructure layout, add mockup image, condense steps

### Result
The page goes from ~60% text to ~30% text with a prominent product visual. Feels like a product page, not a README.

