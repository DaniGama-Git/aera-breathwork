

# Update Calendar Setup to 3-Step Public iCal Flow

## Summary

Simplify both the extension settings and the web CalendarSetup page to a clear 3-step flow using the **public** iCal address. Remove all "secret iCal" references.

## Changes

### 1. Extension settings — `extension/popup.html` (lines 490-516)

Replace the current 3 guide steps with:

| Step | Title | Description |
|---|---|---|
| 1 | Open Google Calendar Settings | Click your calendar name in the left sidebar under "Settings for my calendars" |
| 2 | Make your calendar public | Under "Access permissions for events", check "Make available to public" |
| 3 | Copy the public iCal address | Scroll to "Integrate calendar" and copy the URL under "Public address in iCal format" |

### 2. Web CalendarSetup page — `src/pages/CalendarSetup.tsx` (lines 8-48)

Replace the current 6 STEPS with 3 matching steps:

| Step | Title | Description |
|---|---|---|
| 01 | Open Google Calendar Settings | Open settings and click your calendar name in the left sidebar |
| 02 | Make your calendar public | Under "Access permissions for events", check "Make available to public" |
| 03 | Copy the public iCal address | Scroll to "Integrate calendar" and copy the "Public address in iCal format" URL, then paste it into the āera extension settings |

Keep the "Open Calendar Settings" action button on step 01. Update the URL hint at the bottom to show the public URL format.

### 3. Validation — `extension/background.js`

Update `validateCalendarUrl()` to accept both public and private iCal URLs (the regex already accepts any `calendar.google.com/calendar/ical/` URL, so no change needed here).

### 4. Repackage — `public/aera-extension.zip`

Rebuild with the updated `popup.html`.

## Files Modified

| File | Change |
|---|---|
| `extension/popup.html` | Update step 3 from "secret" to "public" iCal |
| `src/pages/CalendarSetup.tsx` | Consolidate 6 steps → 3, remove secret references |
| `public/aera-extension.zip` | Repackage |

