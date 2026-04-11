

## Best Practice: Content Script Overlay (with Popup Window Fallback)

The industry standard for "small floating panel inside the browser" is a **content script overlay**, not `chrome.windows.create`. Here's why:

### Why `chrome.windows.create` is unreliable

- `width`, `height`, `left`, `top` are **hints**, not guarantees — Chrome and the OS can override them
- macOS Stage Manager, Windows snap layouts, and display scaling all interfere
- Chrome enforces minimum window sizes (~400px on some platforms)
- No way to prevent users from resizing/maximizing it
- It steals focus from the current tab and appears in the taskbar as a separate window

### Why content script overlay is best practice

Extensions like Grammarly, Loom, 1Password, and Notion Web Clipper all use this approach. The overlay is:

- **Pixel-perfect** — CSS `position: fixed` is enforced by the rendering engine, not the OS
- **Non-intrusive** — stays on top of the page without stealing focus or creating a taskbar entry
- **Consistent** — works identically across all OS and Chrome versions
- **Dismissable** — easy to animate in/out

### Recommended hybrid approach

1. **Primary (99% of cases)**: Inject a content script overlay into the active tab — a small iframe (290x400px) anchored bottom-right with `position: fixed`
2. **Fallback (rare edge case)**: If no browser window/tab exists, use `chrome.windows.create` with fixed CSS dimensions as a safety net

### Implementation scope

1. Create `extension/content.js` — injects/removes the iframe overlay
2. Create `extension/content-overlay.css` — fixed-position styling
3. Update `extension/manifest.json` — add `scripting` + `activeTab` permissions
4. Update `extension/background.js` — replace `openStandalonePopup()` with inject-or-fallback logic
5. Update `extension/popup.html` — add `iframe-mode` CSS that constrains to container size
6. Repackage `public/aera-extension.zip`

This is a clean, production-grade solution used by most major extensions.

