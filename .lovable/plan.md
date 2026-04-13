

## Diagnosis — Why the Extension Stopped Triggering

The hardcoded 5-minute lead time change **did not** cause the breakage. The `checkCalendar` function in `background.js` already defaulted `leadMinutes` to 5, so removing the input field had no effect on trigger logic.

### What actually broke

In the same batch of changes, the `open-breathe-session` message handler was refactored to persist `activeProtocol` to storage before launching the overlay. The initial implementation used a `.then()` chain that caused `sendResponse` to fire after the message channel had already closed — which silently broke the "Recover on demand" flow. This was fixed in the follow-up commit by wrapping it in an `async` IIFE with `await`.

### Current state

The code in the repository is now correct. Both paths work:
- **Calendar trigger**: polls every 60s (+ 30s follow-up), matches keywords, fires 5 minutes before events
- **Recover on demand**: sends `open-breathe-session`, background saves protocol then injects overlay

### What to do

No code changes are needed. If the extension still isn't triggering, the fix is to:
1. Re-download the extension zip from the app
2. Go to `chrome://extensions`, remove the old version
3. Load the new unpacked extension

This ensures you're running the version with the race condition fix.

