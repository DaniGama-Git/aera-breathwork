

# Add "Planned Triggers" to Debug Log

## Problem
The debug log currently only shows the scan result (fired or "no match") but doesn't show **what triggers are scheduled for later today** and when they would fire. For example, you should see that an `end_of_day` trigger is planned for ~1 min after your last event ends.

## Approach
After scanning today's events, compute and log a `planned` array showing every trigger that *could* fire today, with its estimated fire time and current status (pending, already fired, or not applicable).

## Changes

### 1. `extension/background.js` — compute planned triggers
After parsing today's events (line ~196), build a `planned` array on the log entry. For each trigger type enabled, calculate:

- **before_critical**: for each future event with a keyword match, show `"before_critical: 'pitch' @ 14:30 → pre-pitch (in 45 min)"`
- **back_to_back**: if a 3+ block is detected, show the gap time — `"back_to_back: gap @ 11:30 (in 2h)"`
- **high_density**: if 4+ events, show midpoint time — `"high_density: midpoint @ 13:15 (in 1h)"`
- **daily_load_cap**: if 5+ events or 6.5h+, show 60% point — `"load_cap: 60% @ 14:00 (in 2h)"`
- **end_of_day**: show last event end time — `"end_of_day: last event ends @ 17:00 (fires ~17:01)"`
- **morning**: show first event time — `"morning: first event @ 09:00 (fires ~08:50)"`
- **mid_day_energy**: show midpoint — `"midday_energy: midpoint @ 13:15"`

Mark each as `✓ already fired` if `triggeredEvents` has the key, or `⏳ pending` if not yet.

Add this as `_logEntry.planned = [...]` alongside the existing fields.

### 2. `extension/popup.js` — render planned triggers
In the debug log renderer, if `entry.planned` exists and has items, show them as a sub-list below the scan result. Each planned trigger shown as a compact line with the time and status.

### 3. `extension/popup.html` — minor CSS for planned items
Add styling for the planned trigger lines (smaller font, indented, color-coded: grey for pending, green for fired).

### 4. Repackage `public/aera-extension.zip`

## Files Changed
- `extension/background.js` — planned trigger computation in debug log
- `extension/popup.js` — render planned array
- `extension/popup.html` — CSS for planned items
- `public/aera-extension.zip` — repackaged

