

## Simplify Extension Settings Panel

The current settings panel has lengthy instructional text across 3 steps plus form fields. The goal is to reduce text weight and friction while keeping the flow clear.

### Changes

**extension/popup.html** — Streamline the settings panel:

1. **Shorten the header description** — Replace the subtitle with a single concise line: "Scans your calendar and triggers sessions before key moments."

2. **Condense the 3 guide steps** into shorter, scannable instructions:
   - Step 1: **"Open Google Calendar Settings"** → hint: "Find your calendar → Integrate calendar"
   - Step 2: **"Copy secret iCal address"** → hint: "Copy the URL under 'Secret address in iCal format'"
   - Remove step 3 entirely — paste action is self-evident from the input below

3. **Simplify form labels**:
   - "Paste your iCal URL" → "iCal URL" (the paste action is obvious)
   - "Trigger keywords" stays, but shorten hint to "Comma-separated event title keywords"
   - "Lead time (minutes before event)" → "Lead time (mins)"

4. **Remove the section dividers** between steps and form to reduce visual clutter

**extension/popup.js** + **public/aera-extension.zip** — Repackage with updated HTML.

### Parity
The `/wave` route and web preview are unaffected — this is extension-only UI.

