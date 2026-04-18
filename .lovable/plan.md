
The Download Extension button currently uses:
- **Font family**: `inherit` (which resolves to the global body font = **Neue Haas Grotesk Display Pro**)
- **Font weight**: `500` (55 Roman — the project default)
- **Font size**: `17px`
- **Line height**: `100%`
- **Letter spacing**: `0.02em`

### Proposed change
Drop the size one step down to **15px** (keeping weight 500 and the same letter spacing / line-height) so it feels lighter on mobile while staying tappable. The icon size (18px) stays as-is for balance.

### File to update
- `src/pages/Extension.tsx` — Download Extension button: change `fontSize: "17px"` → `fontSize: "15px"`.

No other styling changes.
