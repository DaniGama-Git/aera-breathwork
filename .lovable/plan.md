

# Fallback: Open Breathing Session in New Tab When No Injectable Tab Found

## Problem
When the user is on a restricted page (`chrome://`, `about:blank`, new tab page, etc.), `openBreathPanel` silently exits because no injectable tab exists. This affects both smart triggers and "Recover on Demand."

## Solution
Add a single fallback line in `openBreathPanel` — if no injectable tab is found, open `popup.html?triggered=true` in a new browser tab instead. The breathing session UI already works standalone in a tab, so no other changes needed.

## Technical Detail

**`extension/background.js`** — Update `openBreathPanel` (~line 694):
- Where it currently does nothing when `findInjectableTab()` returns null, add:
  ```javascript
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html?triggered=true") });
  ```
- This covers both smart triggers and Recover on Demand

**`public/aera-extension.zip`** — Repackage

## Files Changed
- `extension/background.js` — one fallback line in `openBreathPanel`
- `public/aera-extension.zip` — repackaged

