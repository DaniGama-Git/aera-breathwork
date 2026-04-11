
Goal: stop “Breathe on Demand” from opening the standalone extension window unless the current page is truly non-injectable.

What I found
- `extension/background.js` already uses `lastFocusedWindow` and routes both launch types through `showOverlayInTab(...)`.
- `extension/popup.js` already calls `window.close()`.
- `extension/content.js` already owns the single overlay UI + close button.
- So the original issue was only partially solved. The remaining failure is most likely that the background script is still trying to discover the tab after the popup interaction, which can race or select the wrong context. There is also no diagnostic output showing which step is failing.

Implementation plan
1. Strengthen tab targeting in `extension/popup.js`
- Before sending `open-breathe-session`, read the currently active browser tab from the popup context.
- Send that `tabId` along with `protocolId`.
- Keep `window.close()` immediately after sending.

2. Use the explicit tab first in `extension/background.js`
- Update the message handler to accept an optional `tabId`.
- In `openBreathPanel`, first try that exact tab:
  - `chrome.tabs.get(tabId)`
  - verify it is a normal `http/https` page
  - run the existing `showOverlayInTab(...)` flow
- Only if that fails, fall back to the current discovery logic.

3. Add a tiny defer before fallback discovery
- When launch comes from the popup, wait one short tick before running the fallback tab search so the popup has time to close and focus can return to the browser window.
- No UI/CSS changes.

4. Keep one overlay path only
- Preserve this single path for both manual and scheduled launches:
```text
openBreathPanel -> showOverlayInTab -> sendMessage(content.js) -> executeScript(content.js if needed)
```
- Do not add any second injection implementation.

5. Restrict fallback window to real edge cases only
- `openFallbackPopup()` should run only when:
  - the preferred tab is missing/invalid
  - no injectable `http/https` tab can be found
  - or Chrome explicitly rejects injection on protected pages (`chrome://`, extension pages, Chrome Web Store, etc.)

6. Add temporary failure logging
- Add concise logs around:
  - preferred tab received
  - tab chosen
  - sendMessage failure
  - executeScript failure
  - exact reason fallback was used
- This will let us confirm whether the issue is target selection vs protected-page rejection.

7. Optional hardening
- If cross-window tab detection is still inconsistent, add the `tabs` permission in `extension/manifest.json` to make tab lookup more reliable across Chromium variants.

Verification
- Test from a normal `https://` page with the popup open.
- Click “Breathe on Demand” and confirm the overlay appears in-page, not as a separate extension window.
- Confirm the close button still dismisses the overlay.
- Confirm scheduled triggers use the same overlay path.
- Confirm fallback only happens on protected/non-injectable pages.

Technical notes
- No new CSS.
- No new popup/window behavior.
- No second overlay implementation.
- Main code changes will be in:
  - `extension/popup.js`
  - `extension/background.js`
  - possibly `extension/manifest.json` only if permission hardening is needed
