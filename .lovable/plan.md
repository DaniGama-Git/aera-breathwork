

## Problem

When clicking "Google Calendar" for recurring sessions, the code tries to open multiple popups (one per date) via `window.open`. Browsers block all popups after the first one, so only one day gets through -- the session replay confirms "Some popups were blocked."

Opening multiple tabs is not a viable approach for Google/Outlook Calendar links.

## Solution

For Google and Outlook recurring sessions, instead of opening N popups, **download a single .ics file containing all N events**. This is the same approach already used by the "Download .ics" button and works reliably without popup blockers.

The Google and Outlook buttons will still be shown for **single-session** mode (no recurring props). For recurring mode, simplify to a single "Add All to Calendar" button that downloads one .ics file with all sessions, which works with Google Calendar, Outlook, Apple Calendar, etc.

### Changes to `src/components/AddToCalendar.tsx`

1. **Recurring mode**: Replace the three separate buttons (Google, Outlook, .ics) with a single "Download Schedule (.ics)" button that generates one multi-event .ics file
2. Alternatively, keep all three buttons but change Google/Outlook handlers to also download the .ics file instead of trying to open multiple popups, with a toast explaining to import the file into their calendar
3. Remove the `openExternalCalendarLink` loop logic for recurring mode

### Recommended approach

Keep the three buttons for visual consistency, but for recurring mode:
- **Google**: Download the .ics file + show toast "Import this file into Google Calendar (Settings > Import)"
- **Outlook**: Download the .ics file + show toast "Import this file into Outlook (File > Import)"  
- **.ics**: Same as current behavior

This avoids popup blocking entirely while giving users clear instructions.

### Files to modify
- `src/components/AddToCalendar.tsx` -- update `handleGoogle` and `handleOutlook` for recurring mode to use .ics download instead of multiple popups

