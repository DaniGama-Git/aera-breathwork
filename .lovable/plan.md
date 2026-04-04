

## Plan: Connect Calendar Keywords to Specific Breathing Protocols

### Problem
The extension triggers the same generic breathing animation for every keyword match. Keywords like "pitch", "standup", or "interview" should route to their relevant protocol (Pre-Pitch, Context Switch, etc.).

### Changes

**1. Add keyword-to-protocol mapping in `extension/background.js`**
- Define a map: `{ "pitch": "pre-pitch", "negotiat": "pre-negotiation", "interview": "pre-pitch", "focus": "deep-focus", "standup": "context-switch", "review": "pre-negotiation", "presentation": "pre-pitch", "brainstorm": "creative-flow", ... }`
- When a keyword match fires, store the matched keyword and resolved protocol ID in `chrome.storage.local` alongside `autoStart: true`
- Fallback to a default protocol (e.g. Deep Focus) if no mapping exists

**2. Update `extension/popup.js` to read the selected protocol**
- On auto-start, read the protocol ID from storage
- Look up the matching protocol from the existing protocol engine
- Run that protocol's phase sequence instead of the hardcoded 3-round wave animation
- Update the notification message to reference the specific session name (e.g. `"Pitch in 2 min — starting Pre-Pitch breathwork"`)

**3. Update `extension/popup.html`** (minor)
- Show the session name in the UI header when a protocol-specific session is active

### What stays the same
- The iCal polling, keyword matching, and alarm logic remain unchanged
- The protocol engine and all existing protocols remain unchanged
- Onboarding keyword collection stays in the web app (syncing to extension is a separate concern requiring the extension to be installed)

### Technical detail
The keyword matching uses substring includes (`evt.summary.toLowerCase().includes(kw)`), so the mapping should use keyword stems (e.g. "negotiat" matches "negotiation", "negotiations", "negotiating").

