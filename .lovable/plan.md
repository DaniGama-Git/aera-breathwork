

# Fix High-Density Trigger: Fire at Open Gaps (Keep Midday at Midpoint)

## Summary
- **high_density** (block c, lines 390–407): Replace the midpoint calculation with a gap-finding approach — scan events for the first open gap ≥ 5 minutes and fire there. If no gap exists, skip the trigger.
- **midday_energy** (block g, lines 471–491): Leave as-is — midpoint firing is correct for this trigger.
- Fix the git sync error by ensuring a clean commit.

## Technical Detail

**`extension/background.js`**:

1. Add a `findBestGap(events, minGapMs)` helper near the existing `detectBackToBack` / `findFirstGap` helpers (~line 535):
   - Walk sorted events, collect all gaps ≥ `minGapMs` (5 min)
   - Return the midpoint of the gap closest to the overall schedule midpoint
   - Return `null` if no qualifying gap

2. Update **high_density block** (lines 390–407):
   - Replace `midpoint` calculation with `findBestGap(todayEvents, 5 * 60 * 1000)`
   - If `null`, skip trigger and log "no open gap found"
   - Update log to show "gap @ HH:MM" instead of "midpoint"

3. Update **planned-trigger logging** for high_density to reflect gap-based timing or "no gap"

4. Leave midday_energy block unchanged

**`public/aera-extension.zip`** — repackage

## Files Changed
- `extension/background.js` — new `findBestGap` helper; updated high_density logic
- `public/aera-extension.zip` — repackaged

