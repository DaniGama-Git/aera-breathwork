

## Plan: Auto-prefill recurring sessions in calendar dialog

### What changes
When the `AddToCalendar` component is opened from the recommendation screen or menu banner, it should:

1. **Accept optional recommendation props**: `recommendedFrequency` (e.g. 4), `recommendedTime` (e.g. `"before_key_moments"` mapped to a default clock time like `"09:00"`)
2. **Auto-generate a week of sessions**: Instead of picking a single date, the dialog pre-selects the next N weekdays (based on `recommendedFrequency`) starting from tomorrow, each at the recommended time
3. **Show the pre-filled schedule as a list**: Display something like "Mon 09:00, Wed 09:00, Fri 09:00, ..." that the user can review before adding
4. **Batch-add to calendar**: Each calendar action (Google, Outlook, .ics) creates all N events at once — Google/Outlook open multiple tabs, .ics generates a single file with multiple VEVENTs

### UI flow in the dialog
- Replace the single date/time picker with a **summary view** showing the auto-generated schedule (e.g. "5x Focus sessions this week")
- List each session date + time
- Allow toggling individual sessions on/off
- Keep the three calendar buttons (Google, Outlook, .ics) at the bottom

### Files to modify
- **`src/components/AddToCalendar.tsx`**: Add `recommendedFrequency?` and `recommendedTime?` props. When provided, auto-calculate the next N dates spread across the week. Update `generateICS` to support multiple VEVENTs. Google/Outlook buttons loop through each date.
- **`src/pages/Recommendation.tsx`**: Pass `recommendedFrequency` and `recommendedTime` to `AddToCalendar`
- **`src/pages/BreathworkMenu.tsx`**: Same — pass recommendation props to the banner's `AddToCalendar`

### Time mapping
Map `recommended_time` values to sensible default clock times:
- `start_of_day` → `"07:00"`
- `before_key_moments` → `"09:00"`  
- `between_meetings` → `"12:00"`
- `end_of_day` → `"17:00"`

### Date selection logic
Starting from tomorrow, pick the next N weekdays (Mon–Fri), evenly spaced. For example, frequency=3 → Mon, Wed, Fri. Frequency=5 → Mon–Fri.

