

# Extension Protocol Overhaul — Intro Flow + Updated Protocols

## Summary
Rewrite all 11 extension protocols with the exact copy provided, add protocol name to the logo screen, implement per-protocol intro text screens that play before and between stages, and add per-protocol outro text on the done screen.

## Current Flow
`loading → logo ("āera") → startSession (breathing) → done ("You're ready.")`

## New Flow
`loading → logo ("āera" + PROTOCOL NAME) → intro 1 (tagline, 2-3s) → intro 2 (protocol description, 3-4s) → breathing stage 1 → stage intro (3s) → breathing stage 2 → ... → outro (custom text, white bg, 2-3s) → done`

## Changes

### 1. `extension/protocols.js` — Complete rewrite
Replace all protocol definitions with the 11 protocols provided. New structure adds:
- `introTexts`: array of `{ text, duration }` objects shown sequentially before breathing starts
- `outroText`: custom end text (e.g. "LET'S GO.", "LOCKED.", "BACK.")
- Stage-level `transition` fields become the intro text shown before each new stage
- Updated cycle counts, durations, and phase definitions to match the spec exactly

Protocol ID mapping:
| # | Title | ID | Audio |
|---|-------|----|-------|
| 1 | Pre-Pitch | `pre-pitch` | `audio/pre-pitch.mp3` |
| 3 | Pre-Negotiation | `pre-negotiation` | `audio/pre-negotiation.mp3` |
| 4 | Decision Clarity | `decision-clarity` | `audio/decision-clarity.mp3` |
| 5 | Pre-Meeting | `pre-meeting` | `audio/pre-meeting.mp3` |
| 6 | Post-Setback Recovery | `rebound` | `audio/rebound.mp3` |
| 7 | Deep Focus | `deep-focus` | `audio/deep-focus.mp3` |
| 8 | Creative Flow | `creative-flow` | `audio/decision-clarity.mp3` |
| 9 | Morning Activation | `wake-me-up` | `audio/wake-me-up.mp3` |
| 10 | Context Switch | `context-switch` | `audio/context-switch.mp3` |
| 11 | Midday Energizer | `energy-reset` | `audio/energy-reset.mp3` |

Back-to-back protocol stays as a fallback default.

### 2. `extension/popup.html`
- **Logo screen**: Add `<span class="logo-subtitle" id="logo-subtitle"></span>` below the āera text for protocol name
- **Done screen**: Make the subtitle dynamic via `id="done-text"` and support white background styling
- Add CSS for `.logo-subtitle` (uppercase, letter-spaced, smaller font below logo)

### 3. `extension/popup.js`
- **`setProtocol()`**: Populate `logo-subtitle` with protocol title, set `done-text` with `outroText`
- **`buildFullTimeline()`**: Process `introTexts` array as TRANSITION entries at the start of the timeline (before first stage), each with its specified duration
- **Screen flow in triggered/iframe mode**: Show logo screen with subtitle for 2.2s, then auto-play through intro texts as part of the timeline before breathing begins
- **Done screen**: Apply white background class and show custom outro text

### 4. Timeline intro text handling
The existing TRANSITION overlay mechanism already displays text and pauses breathing. The intro texts will be injected as TRANSITION entries at the start of the timeline and before each stage. This reuses the existing overlay rendering in `animate()` with no new screen type needed.

## Files Changed
- `extension/protocols.js` — full rewrite (11 protocols + back-to-back fallback)
- `extension/popup.html` — logo subtitle element, done screen dynamic text, white outro CSS
- `extension/popup.js` — timeline builder for intro texts, setProtocol updates, outro handling

