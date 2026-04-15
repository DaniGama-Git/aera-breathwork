

# Temporary Dev Debug Log for Extension

## Summary
Add a temporary activity log to the extension Settings tab for verifying calendar scanning and trigger logic. Will be removed once everything is confirmed working.

## Approach
All debug code will be clearly marked with `// DEBUG` comments for easy removal later.

## Changes

### 1. `extension/background.js`
- At the end of each `checkCalendar()` run, push a structured log entry to `chrome.storage.local` under key `_debugLog` (capped at 30 entries)
- Entry includes: timestamp, events found today (count + summaries), active triggers, match result (protocol fired or skip reason), any fetch errors
- Also log on early exits (no URL, no triggers, fetch failure)
- All additions wrapped in `// DEBUG-START` / `// DEBUG-END` markers

### 2. `extension/popup.html`
- Add a "Debug Log" section at the bottom of the Settings tab (below "Recover on demand")
- Scrollable container (~180px max-height) showing log entries as compact rows
- "Clear" button to reset the log
- Wrapped in `<!-- DEBUG-START -->` / `<!-- DEBUG-END -->` comments

### 3. `extension/popup.js`
- On Settings tab open, read `_debugLog` from storage and render entries
- Each entry shows: time, events count, result (triggered protocol or "no match — reason")
- Color-coded: green for triggers, grey for no-match, red for errors
- Wrapped in `// DEBUG-START` / `// DEBUG-END` markers

### 4. Repackage `public/aera-extension.zip`

## Files Changed
- `extension/background.js` — scan logging to storage
- `extension/popup.html` — debug log section + styles
- `extension/popup.js` — log rendering
- `public/aera-extension.zip` — repackaged

