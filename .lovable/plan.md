

# Extension Settings Panel — Design Refresh

## Current State
The settings panel is a long scrollable form with: logo, connection status dot, 2-step calendar guide, iCal URL textarea, keywords input, trigger checkboxes, sound toggle, save button, and "Recover on demand" button. It feels like a setup wizard rather than a polished settings screen.

## Design Direction
Consolidate into clean, grouped sections with a more minimal, app-like feel — fewer labels, tighter spacing, and a single-scroll layout that feels finished rather than instructional.

## Changes (all in `extension/popup.html` + `extension/popup.js`)

### 1. Collapse the setup guide into a single accordion
Replace the two numbered guide steps + "Open Calendar Settings" link with a collapsible "How to connect" section that starts collapsed once a calendar URL is saved. This removes ~40% of vertical space for returning users.

### 2. Unify the calendar section
- Merge the connection status dot into the iCal URL field as an inline indicator (green dot inside the input when connected).
- Replace the textarea with a single-line input (URLs don't need multiline).
- Move the "validated" badge inline with the input.

### 3. Restyle trigger checkboxes as toggle pills
Replace the checkbox list with a compact grid of pill-shaped toggles (similar to the tab bar aesthetic). Each pill shows the trigger name and highlights when active. This is more visually appealing and touch-friendly.

### 4. Group sound + save into a bottom bar
- Move the sound toggle and save button into a sticky bottom bar so they're always visible without scrolling.
- Style save as a full-width dark button instead of the current outlined pill.

### 5. Remove the "āera" logo from settings
The logo is already in the tab bar context and the breathe panel. Remove it from settings to save space.

### 6. Restyle "Recover on demand"
Move it above the save bar as a secondary action with a subtler outline style, or place it as a floating action in the breathe tab instead.

### 7. Typography and spacing cleanup
- Reduce section gaps from 14px to 10px.
- Use consistent 13px for all labels.
- Remove redundant hint text where labels are self-explanatory.

## Files Changed
- `extension/popup.html` — restructured settings panel HTML + updated CSS
- `extension/popup.js` — accordion toggle logic, updated element references

## No backend or React changes needed — this is purely the extension's local popup UI.

