

## Plan: Fix iframe overlay sizing + race condition

### 1. `extension/popup.js` — Restructure init block (lines 517-549)

Replace the current sequential iframe/autoStart logic with mutually exclusive branches:

- **Iframe path**: Sets fixed 290×400px dimensions, reads `activeProtocol` without removing `autoStart`, auto-starts the session
- **Standalone path**: Only runs when not in iframe; handles `autoStart` with `100vw/100vh` or falls back to settings panel

### 2. `extension/popup.js` — Fix race condition in Recover on Demand handler (lines 106-118)

- `await` the `chrome.runtime.sendMessage()` before calling `window.close()`

### 3. `extension/background.js` — Harden message handler (lines 73-84)

- `await openBreathPanel()` inside the storage callback
- Wrap `sendResponse` in try-catch to handle disconnected popup port

### 4. Repackage `public/aera-extension.zip`

