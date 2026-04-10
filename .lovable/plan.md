

## Problem

The previous change removed the `#ctrl-close` button from `popup.html`, but `popup.js` still references it on line 130 (`document.getElementById("ctrl-close")`) and attaches a click listener on line 362 (`ctrlClose.addEventListener("click", ...)`). This throws a null reference error that crashes the entire script before the init block runs, so the popup never advances past the loading screen.

## Fix

Two options:

1. **Add the button back** to the HTML (inside `.session-controls`) since it serves as the session close/stop control during breathing.
2. **Guard the JS references** so they don't crash if the element is missing.

Given the user previously said one close button should be removed to avoid redundancy, and the `.card-close` button (persistent X on the card) is still present, the best approach is to **remove the JS references to `ctrl-close`** and have the existing `.card-close` button handle stopping the session as well.

### Changes

**`extension/popup.js`:**
- Remove line 130 (`const ctrlClose = ...`)
- Remove the `ctrlClose.addEventListener("click", ...)` block (lines 362-370 approx)
- Add the same stop-session logic to the existing `card-close` button click handler (or ensure it already stops the session)

**`extension/popup.html`:**
- No changes needed (button already removed)

**Repackage** `public/aera-extension.zip`

