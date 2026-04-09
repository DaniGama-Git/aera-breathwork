

## Plan: Calendar-triggered mode — borderless, full-bleed popup with controls from start

### Context

Currently, whether opened manually (toolbar click) or triggered by calendar, the extension shows the same UI: tabs at top, a rounded card inside padding, and session controls only appear during the breathing phase.

The user wants **two distinct modes**:
1. **Manual open** (toolbar click): Keep current behavior — tabs, card, settings, etc.
2. **Calendar-triggered** (autoStart): A clean, independent popup showing ONLY the breathing visuals edge-to-edge — no tabs, no card border/rounded corners, no padding. The stop/close controls should be visible from the very first screen (logo).

### Changes

#### 1. `extension/popup.js` — Detect autoStart mode and apply a body class

At init, check `autoStart` from storage. If true, add a CSS class (e.g., `body.triggered-mode`) that hides the tabs and makes the card fill the entire window borderlessly. Also show session controls immediately on every screen (not just breathing).

- Move the `autoStart` check to run **before** the default init sequence so only one flow executes
- When in triggered mode: hide `.tabs`, remove card padding/border-radius, make card fill viewport
- Show `#session-controls` as `.active` from the first screen onward (logo, intro, breathing, done)
- Modify `showScreen()` to keep controls visible in triggered mode

#### 2. `extension/popup.html` — Add CSS for `.triggered-mode`

```css
body.triggered-mode .tabs { display: none; }
body.triggered-mode .card-wrap { padding: 0; }
body.triggered-mode .card { border-radius: 0; aspect-ratio: auto; height: 100vh; width: 100vw; }
body.triggered-mode .session-controls { opacity: 1; }
```

#### 3. `extension/popup.js` — Refactor init flow

- Wrap the default init (lines 400-412) in an `else` branch so it only runs when NOT autoStart
- In the autoStart branch, add `document.body.classList.add("triggered-mode")` before preloading
- In `showScreen()`, add: if triggered mode, always keep `sessionControls.classList.add("active")`

### Files modified
- `extension/popup.html` — new CSS rules for `.triggered-mode`
- `extension/popup.js` — detect mode, apply class, keep controls visible across all screens

