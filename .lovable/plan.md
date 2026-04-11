

## Why the Overlay Is Still Opening Full-Screen

There are **two compounding bugs**:

### Bug 1: `chrome.tabs.sendMessage` silently fails
The `openBreathPanel()` function tries to message the content script via `chrome.tabs.sendMessage`. But `content.js` is registered as `document_idle` — if the tab was opened before the extension was installed/reloaded, the content script isn't loaded yet. The `sendMessage` call throws, gets caught, and falls through to `openFallbackPopup()`.

### Bug 2: `chrome.windows.create` dimensions are ignored
The fallback creates a window with `width: 290, height: 400` but Chrome and the OS treat these as **hints**. macOS in particular can override with minimum sizes (~400px+) or snap/maximize behavior. The CSS inside `popup.html` has `html` hardcoded to `360px x 520px`, and `body.triggered-mode` constrains the body to `290px x 400px` — but the `html` element stays at `360x520`, causing the content to overflow or the window to expand.

### The Fix

**1. `extension/background.js` — Use `chrome.scripting.executeScript` instead of `sendMessage`**

Instead of relying on the content script being pre-loaded, programmatically inject the overlay code into the active tab. This guarantees the injection works even if the declarative content script hasn't loaded yet:

```javascript
async function openBreathPanel(protocolId) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs?.[0];
    
    if (tab?.id && /^https?:\/\//.test(tab.url || "")) {
      // Inject content script programmatically (idempotent)
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      // Small delay to ensure script is ready, then send message
      await new Promise(r => setTimeout(r, 100));
      await chrome.tabs.sendMessage(tab.id, {
        type: "show-breathe-overlay",
        protocolId,
      });
      return;
    }
  } catch (e) { /* fall through to fallback */ }
  
  openFallbackPopup();
}
```

**2. `extension/popup.html` — Fix `html` element sizing for triggered/iframe modes**

Add CSS so that in both `iframe-mode` and `triggered-mode`, the `html` element also gets constrained (currently only the `body` is constrained while `html` stays at 360x520):

```css
body.iframe-mode { width:290px!important; height:400px!important; }
body.triggered-mode { width:290px!important; height:400px!important; }

/* Also constrain the html element */
body.iframe-mode ~ html,
html:has(body.iframe-mode) { width:290px!important; height:400px!important; }
html:has(body.triggered-mode) { width:290px!important; height:400px!important; }
```

Actually, since CSS can't select the parent `html` from `body`, we'll handle this in `popup.js` by also setting `document.documentElement.style` when entering these modes.

**3. `extension/popup.js` — Constrain `html` element in triggered/iframe mode**

When `iframe-mode` or `triggered-mode` classes are added, also set the `html` element dimensions:

```javascript
if (isIframeMode) {
  document.body.classList.add("iframe-mode");
  document.documentElement.style.width = "290px";
  document.documentElement.style.height = "400px";
}

// And in the autoStart block:
document.documentElement.style.width = "290px";
document.documentElement.style.height = "400px";
```

**4. `extension/manifest.json` — Ensure `scripting` permission is present** (already added in previous update — just verify).

**5. Repackage `public/aera-extension.zip`**.

### Summary

The primary fix is using `chrome.scripting.executeScript` to guarantee the content script is injected before messaging it. The secondary fix constrains the `html` element (not just `body`) so even the fallback window renders at the correct size.

