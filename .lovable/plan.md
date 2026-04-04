## Plan: Calendar Access — OAuth Primary + iCal Fallback

### The Problem
Users currently have to manually find and paste their Google Calendar iCal URL into the extension settings. This is high-friction and error-prone.

### Reality Check
Lovable Cloud's managed Google OAuth only provides basic sign-in scopes (email, profile). **Calendar read access requires additional setup** — either your own Google Cloud credentials or a workaround.

---

### Approach: Two-Tier System

#### Tier 1 — Guided iCal Setup (implement now, zero dependencies)
Add a polished, step-by-step visual guide **inside the extension settings panel** that:
1. Shows a "Connect Calendar" button
2. Opens a guided walkthrough: "Open Google Calendar → Settings → Select your calendar → Scroll to 'Secret address in iCal format' → Copy"
3. Provides a direct link to `https://calendar.google.com/r/settings` to reduce clicks
4. Auto-validates the pasted URL and shows a green checkmark

Also: store the iCal URL in the user's `onboarding_preferences` (which already has `calendar_keywords`) so it persists across devices.

#### Tier 2 — Google Calendar API via OAuth (future, requires Google Cloud project)
When you're ready to register with Google:
1. Create a Google Cloud project with Calendar API enabled
2. Create OAuth client ID for Chrome extension
3. Add `chrome.identity` permission to manifest
4. Use `chrome.identity.getAuthToken({ interactive: true, scopes: ['calendar.readonly'] })`
5. Fetch events directly from `googleapis.com/calendar/v3/events`
6. No iCal URL needed at all

**This is the ideal UX but requires Google Cloud Console setup and (eventually) Chrome Web Store publishing for production.**

---

### What I'll Implement Now (Tier 1)
1. **Extension settings redesign** — Replace the raw form with a guided "Connect Calendar" flow with clear steps and a direct link
2. **Store iCal URL in database** — When user completes onboarding calendar keywords, also store their iCal URL so the extension can fetch it
3. **Add a "Calendar Setup" page in the web app** — Linked from the extension download page, with a visual walkthrough

### What Stays the Same
- Extension polling logic, keyword matching, and protocol routing remain unchanged
- The iCal parsing engine stays as-is
