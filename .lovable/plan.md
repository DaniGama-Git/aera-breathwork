

## Plan: Rename "Breathe on Demand" to "Recover on Demand"

Update three places in the extension popup:

1. **`extension/popup.html`**
   - Line 522: Change button text from `Breathe on demand` to `Recover on demand`
   - Line 337: Update CSS comment from `Breathe on demand` to `Recover on demand`

2. **`extension/popup.js`**
   - Line 103: Update comment from `Breathe on demand` to `Recover on demand`

3. **`public/aera-extension.zip`** — Repackage with updated files

No changes needed in the React app or other extension files.

