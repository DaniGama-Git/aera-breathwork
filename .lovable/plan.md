

## Fix overlay black line + move close (×) button inside the overlay

### Problem
1. **Black line at top**: The iframe has `border-radius: 16px` but the popup content inside has conflicting styles from `triggered-mode` (which sets `border-radius: 0` on the card). The dark body background bleeds through at the rounded corners.
2. **Close button is outside the iframe**: Currently the × button is injected by `content.js` above the iframe in the wrapper div. It should be inside the overlay, on the same row as the pause/mute controls but aligned to the right.

### Changes

**1. `extension/content.js`** — Remove the external close button. Send a message into the iframe instead, or simply don't add it. The close functionality will be handled inside the popup itself via `window.parent.postMessage`.

- Remove the `closeBtn` element creation and appending
- Just append the iframe directly to the wrapper
- Add a `message` event listener on the window to listen for `{ type: "close-overlay" }` from the iframe, and call `removeOverlay()` when received

**2. `extension/popup.html`** — Two changes:
- **CSS**: In `body.iframe-mode`, ensure the card background matches and there's no gap. Set `border-radius: 0` on the card in iframe-mode (the iframe itself provides the border-radius). Remove `triggered-mode` class conflict.
- **HTML**: Add a close button inside `session-controls`, positioned to the right (using `margin-left: auto`):
  ```html
  <button class="ctrl-btn ctrl-close" id="ctrl-close" title="Close">
    <svg viewBox="0 0 24 24" ...>×</svg>
  </button>
  ```
- **CSS**: `.ctrl-close { margin-left: auto; }` to push it to the right end of the controls row.

**3. `extension/popup.js`** — Two changes:
- In the iframe-mode branch, do NOT add `triggered-mode` class (this is the root cause of the black line — it sets card `border-radius: 0` which conflicts with the iframe's rounded corners)
- Add click handler for the new `ctrl-close` button that posts a message to the parent: `window.parent.postMessage({ type: "close-overlay" }, "*")`
- Only show the close button in iframe mode

**4. Repackage** `public/aera-extension.zip`

### Result
- No black line (card fills iframe completely, iframe provides the rounded corners)
- × button sits in the same top bar as pause and mute, right-aligned
- Clean single-container overlay with no external floating buttons

