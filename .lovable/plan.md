

# Fix: Extension Calendar Check "Failed to Fetch"

## Problem
`checkCalendar()` in `background.js` calls `fetch(icalUrl)` (line 112) without any retry logic or timeout. MV3 service workers are aggressively suspended and can fail on first fetch after wake-up. There's also no validation that the stored URL is still well-formed before fetching.

## Changes

### `extension/background.js`
1. **Add URL validation before fetch** — check that `icalUrl` starts with `https://calendar.google.com/calendar/ical/` before attempting fetch (same regex used in `validateCalendarUrl`)
2. **Add retry logic** — retry the fetch once after a 2s delay if the first attempt throws (handles transient MV3 wake-up failures)
3. **Add fetch timeout** — use `AbortController` with a 10s timeout so the service worker doesn't hang
4. **Better error logging** — log the URL (redacted) and error type to help diagnose

### Repackage `public/aera-extension.zip`
Rebuild the ZIP with the updated `background.js`.

