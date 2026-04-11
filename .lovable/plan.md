

## Remove fallback popup window — overlay only

### Problem
The `openBreathPanel` function falls back to opening a standalone popup window when overlay injection fails or no injectable tab is found. This fallback is causing confusion and unintended behavior.

### Changes

**1. `extension/background.js`**
- In `openBreathPanel`: remove step 4 (the fallback call to `openFallbackPopup()`) — just `return` or log a warning if overlay injection fails
- Comment out or remove the entire `openFallbackPopup()` function
- Remove the `chrome.notifications.onClicked` listener that calls `openBreathPanel()` without a tab (lines 194-198), since without fallback it would do nothing useful
- Keep steps 1-3 (preferred tab + auto-discover) intact — these are the overlay path

**2. Repackage `public/aera-extension.zip`**

### Result
"Recover on Demand" and calendar triggers will only inject the iframe overlay into an active browser tab. If no injectable tab exists, nothing happens (no popup window).

