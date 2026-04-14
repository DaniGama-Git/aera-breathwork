

# Fix Extension Download

## Problem
The trigger engine (added April 14) changed the JSZip condition from `keywords.length > 0` to `keywords.length > 0 || triggers.length > 0`. Since nearly every onboarded user has triggers selected, the browser now tries to decompress, inject a tiny JSON file into, and recompress a 53MB zip entirely in memory. This is what's failing — not the file size, not the audio, not the fullscreen fix.

## Solution
Stop bundling `defaults.json` into the zip. Instead, inject it as a separate mechanism:

### Option A: Skip JSZip entirely, use a separate defaults file
1. In `Extension.tsx`, download the zip as-is (no JSZip processing)
2. Also generate and download a small `defaults.json` file alongside it
3. Update the extension's `loadSettings()` in `popup.js` to check for `defaults.json` in the extension directory OR fall back to `chrome.storage.local`
4. Update install instructions to say "unzip, then drop `defaults.json` into the folder"

### Option B (simpler): Write defaults to a URL the extension fetches on first run
1. In `Extension.tsx`, after download, save the user's keywords/triggers to a Supabase table with a short token
2. The extension fetches defaults from `{supabase_url}/rest/v1/extension_defaults?token=eq.{token}` on first settings load
3. No JSZip needed at all

### Option C (simplest — recommended): Just skip JSZip for large files
1. In `Extension.tsx`, remove the JSZip reprocessing entirely
2. Download the raw zip as-is
3. The extension already loads defaults from `chrome.storage.local` and `defaults.json` — the onboarding preferences are already saved to Supabase, so the extension can fetch them on first run via an edge function or the user can configure them in settings
4. The trigger checkboxes in settings already work independently

**Recommendation: Option C.** The extension settings UI already lets users configure triggers and keywords. The JSZip injection was a nice-to-have that pre-populated settings, but it's not worth the download failure. Remove the JSZip path, download the zip directly, and let the extension settings handle configuration.

## Files Changed
- `src/pages/Extension.tsx` — Remove JSZip import and all reprocessing logic (lines 62-83). Just download the raw blob.
- `package.json` — Remove `jszip` dependency (no longer needed)

## What stays the same
- Extension zip, audio files, and all extension code unchanged
- Extension settings UI continues to work as before
- Trigger keywords display on the Extension page so users can copy/paste them into settings

