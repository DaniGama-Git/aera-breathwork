

## Plan

### Issue 1: Extension popup size (triggered mode)
The standalone popup opens at 235x235 but the CSS for `body.triggered-mode` sets `width:100vw; height:100vh` which should fill whatever window size Chrome gives. The problem is the content inside (card, overlays, padding) may not fit well at 235x235. The triggered-mode CSS already scales down fonts/buttons for small sizes.

**Changes:**
- Keep `background.js` at 235x235 (already correct)
- Ensure `body.triggered-mode` CSS has no minimum dimensions forcing overflow — already looks fine
- The content should already fit at 235x235 given the scaled-down triggered-mode styles. If the user is seeing clipping, it's likely from the `screen-overlay` padding (24px → already overridden to 16px). May need to tighten further.

Actually, re-reading the user's message: "or use 290 x 320 like in the /wave route" — they're okay with a slightly larger size. Let's change `background.js` to 290x320 to give breathing room.

### Issue 2: Settings "saved" confirmation placement
Currently `<div class="status" id="status">` is at the bottom of the settings panel, after the save button. The user has to scroll down to see it. Additionally it has a green background (`rgba(34,197,94,0.1)`) which the user wants removed — just green text on black.

**Changes in `extension/popup.html`:**
- Move the `<div class="status" id="status"></div>` to right after the save button (it's already there, but the issue is scrolling). Instead, we should show inline status messages near each field, or simply ensure the status appears right below the last changed field. Simplest fix: move the status div to right after the save button AND auto-scroll it into view.

- Remove `background` from `.status.success` and `.status.error` — just colored text on transparent background.

**Changes in `extension/popup.js`:**
- In `showStatus()`, add `statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` so users see it.

### Summary of file changes:

1. **`extension/background.js`** — Change popup dimensions from 235x235 to 290x320
2. **`extension/popup.html`** — Remove background color from `.status.success` and `.status.error` CSS classes (just keep colored text). Optionally tighten triggered-mode padding if needed.
3. **`extension/popup.js`** — Add `scrollIntoView` call in `showStatus()` so the confirmation is visible without manual scrolling.
4. **Repackage** the extension zip.

