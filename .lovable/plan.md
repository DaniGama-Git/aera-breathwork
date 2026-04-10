

## Fix Extension Download: Add Loading State + Overlay

### Problem
The download button has no loading state, so users can click multiple times while the fetch + JSZip repackaging runs silently. No visual feedback makes it feel broken.

### Changes

**src/pages/Extension.tsx**:

1. **Add `downloading` state** — `const [downloading, setDownloading] = useState(false)`

2. **Guard `handleDownload`** — Early return if already downloading. Set `downloading = true` at start, `false` in finally block.

3. **Add loading overlay** — When `downloading` is true, render a full-screen overlay with the BreatheDots animation and "Preparing download…" text, matching the app's dark aesthetic:
   ```tsx
   {downloading && (
     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
       <BreatheDots className="w-16 h-16 mb-4" />
       <p className="text-white/70 font-body text-[14px]">Preparing download…</p>
     </div>
   )}
   ```

4. **Disable button while downloading** — Add `disabled={downloading}` and visual disabled state to the download button.

### Files
- `src/pages/Extension.tsx` — add state, guard, overlay, button disable

