

## Fix: Overlay not appearing — service worker race condition

### Root Cause

In `background.js` (lines 73-85), when the popup sends `open-breathe-session`:

```javascript
sendResponse({ ok: true });         // responds immediately
chrome.storage.local.set({...}, () => {
  openBreathPanel(protocolId, targetTabId);  // called INSIDE storage callback
});
return false;                        // tells Chrome: "I'm done with this message"
```

`return false` signals Chrome that the message handler is finished. In Manifest V3 service workers, Chrome can **terminate the worker** if nothing else keeps it alive. The `chrome.storage.local.set` callback (which calls `openBreathPanel`) may never fire because the worker gets killed first.

Additionally, the `autoStart` / `activeProtocol` storage flags are no longer needed (they were for the fallback popup window path), so we can simplify the entire flow.

### Changes

**1. `extension/background.js`** — Fix the `open-breathe-session` handler:

- Call `openBreathPanel(protocolId, targetTabId)` **directly** (not inside a storage callback)
- Remove the unnecessary `chrome.storage.local.set({ autoStart, activeProtocol })` — these flags were only needed for the fallback popup, which no longer exists
- Use `return true` to keep the message channel alive until overlay injection completes, preventing service worker termination

```javascript
if (message?.type === "open-breathe-session") {
  const protocolId = message.protocolId || "back-to-back";
  const targetTabId = message.targetTabId || null;
  
  openBreathPanel(protocolId, targetTabId).then(() => {
    sendResponse({ ok: true });
  });
  return true; // keep channel alive
}
```

**2. `extension/popup.js`** — Adjust the "Recover on Demand" handler:

- The `await chrome.runtime.sendMessage(...)` now waits for the actual overlay injection to complete (since background uses `return true`)
- Remove the artificial 350ms delay — it's no longer needed
- Still close the popup after response

**3. Repackage `public/aera-extension.zip`**

### Result
The overlay injection runs reliably because the service worker stays alive until the work is done. No more race condition between worker termination and the overlay injection call.

