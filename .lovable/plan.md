

## Pre-populating Extension with Onboarding Keywords

### The Challenge
The extension zip is a static file served to all users — it can't be customized per user at download time without server-side generation.

### Feasible Approaches

**Option A: Dynamic zip generation via backend function (Best UX)**
- Create a backend function that takes the user's keywords, injects them into a small `defaults.json` inside the extension folder, zips it, and returns the file
- The extension's `loadSettings` reads `defaults.json` on first run (if no saved keywords exist) and pre-fills the keywords input
- The download button on `/extension` calls this function instead of fetching the static zip

**Option B: Clipboard + current copy button (Already exists)**
- The "Your trigger words" card with the Copy button is already on the `/extension` page — users copy and paste into the extension settings
- Zero new code needed, but requires manual paste

**Option C: URL scheme / deep link (Not reliable)**
- Chrome extensions can't reliably receive data via URL parameters at install time

### Recommended: Option A — Dynamic zip

1. **Add `defaults.json` support to the extension**
   - On first load (no stored keywords), check for a bundled `defaults.json` with `{ "keywords": [...] }`
   - Pre-fill the keywords input and save to `chrome.storage.local`

2. **Create a backend function** (`generate-extension-zip`)
   - Accepts `{ keywords: string[] }` from authenticated user
   - Reads extension files from storage or embeds them
   - Writes `defaults.json` with the user's keywords
   - Returns the zip as a blob

3. **Update `/extension` page download handler**
   - Call the backend function with the user's keywords instead of fetching the static zip
   - Fall back to static zip if no keywords or function fails

4. **Bump extension version** to v3.4.0

### Complexity Note
The edge function approach requires storing all extension files in the function or in file storage so they can be zipped server-side. An alternative simpler approach: the edge function only generates `defaults.json`, and we use client-side JS (JSZip) to clone the static zip and inject the file before download — no server storage needed.

### Simpler Variant (JSZip client-side)
1. Install `jszip` package
2. On download click: fetch static zip → open with JSZip → add `defaults.json` with user's keywords → generate new blob → trigger download
3. Extension reads `defaults.json` on first run

This avoids any backend work entirely.

