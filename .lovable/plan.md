

## Fix Extension Page Alignment & Remove Nav Bar

### Problems identified from the screenshot

1. **Nav bar still showing** — `BottomNavBar` is imported on line 8 but not used in the JSX. However, the route at line 127 wraps Extension in `<MobileFrame>`, which doesn't add a nav bar. The nav bar might be appearing from a different source — need to check if `BottomNavBar` was removed from the JSX but the import lingers. Looking at the current code, the nav bar component is NOT rendered in the JSX, so if it's still showing, another component may be injecting it. Will verify during implementation.

2. **Visual misalignment** — the page mixes centered content (logo, title, subtitle, mockup) with left-aligned content (steps, CTA). This creates an unbalanced feel:
   - The 3 steps are left-aligned with number labels, while everything above is centered
   - The download button is full-width but text inside is centered — yet steps above it aren't
   - The mockup image has `max-h-[200px]` which may be too small and feel disconnected

### Fixes in `src/pages/Extension.tsx`

1. **Center the steps section** — change from left-aligned `flex items-center` to centered text layout matching the hero section above. Remove step numbers (01/02/03) and use a simple centered list with subtle separators or bullet dots.

2. **Increase mockup prominence** — bump `max-h-[200px]` to `max-h-[260px]` to give the product image more visual weight and better fill the horizontal space.

3. **Tighten vertical spacing** — reduce `mb-8` on steps to `mb-6`, and adjust `pb-6` on mockup to `pb-4` so the page feels more cohesive.

4. **Remove unused import** — clean up the `BottomNavBar` import on line 8.

5. **Ensure no nav bar renders** — confirm no `<BottomNavBar />` exists in the JSX (it doesn't in current code, but will double-check during implementation).

### Files to change
- `src/pages/Extension.tsx` — center steps, enlarge mockup, tighten spacing, remove unused import

