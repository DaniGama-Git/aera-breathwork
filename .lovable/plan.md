

## Plan: Full-screen recommendation + persistent menu banner with calendar scheduling

### Overview
After onboarding completes, the user sees a full-screen recommendation screen showing their archetype and suggested weekly plan. They can schedule sessions from there or skip to the menu, where a persistent banner repeats the recommendation with a "Schedule Sessions" CTA.

### Step 1: Create the Recommendation Screen (`/recommendation`)

New page: `src/pages/Recommendation.tsx`
- Full-screen dark overlay (matching onboarding aesthetic)
- Fetches `stress_archetype`, `recommended_session`, `recommended_frequency`, `recommended_time` from the `profiles` table
- Displays:
  - Archetype name in friendly format (e.g. "You're a Deep Worker")
  - Recommended category with its image (e.g. Focus card image)
  - Frequency (e.g. "We recommend 4 Focus sessions per week")
  - Best time (e.g. "Best time: Before key moments")
- Two CTAs:
  - "Schedule Sessions" -- opens the existing `AddToCalendar` dialog pre-filled with the recommended session details
  - "Go to Menu" -- navigates to `/menu`

### Step 2: Update routing and onboarding flow

- Add `/recommendation` route in `App.tsx` as a `ProtectedRoute`
- Change `Onboarding.tsx` line 144: navigate to `/recommendation` instead of `/menu`
- The recommendation page is a one-time post-onboarding screen (not gated -- user can always navigate away)

### Step 3: Add persistent banner to BreathworkMenu

In `src/pages/BreathworkMenu.tsx`:
- Fetch the user's profile (`stress_archetype`, `recommended_session`, `recommended_frequency`, `recommended_time`) from the database
- Render a dismissible banner card between the header and categories section:
  - Rounded card (`rounded-xl`) with light background
  - Shows: "4x Focus sessions per week" + "Best time: Before key moments"
  - "Schedule Sessions" button opens `AddToCalendar`
  - Dismiss (X) button hides the banner and saves `recommendation_dismissed` flag (stored in `localStorage` to avoid a schema change)
- Only shown when `stress_archetype` exists and not dismissed

### Step 4: Add `recommendation_dismissed` to profiles table (database migration)

Add a `recommendation_dismissed` boolean column (default `false`) to the `profiles` table so the dismiss state persists across devices.

### Files to create/modify
- **Create**: `src/pages/Recommendation.tsx`
- **Modify**: `src/App.tsx` (add route)
- **Modify**: `src/pages/Onboarding.tsx` (redirect to `/recommendation`)
- **Modify**: `src/pages/BreathworkMenu.tsx` (add banner)
- **Database migration**: Add `recommendation_dismissed` column to `profiles`

### Technical details
- Archetype display names map: `{ pack_animal: "Pack Animal", deep_worker: "Deep Worker", anticipator: "Anticipator", sprinter: "Sprinter" }`
- Category display names map: `{ activate: "Activate", focus: "Focus", reset: "Reset", recover: "Recover" }`
- Recommended time display: `{ start_of_day: "Start of day", before_key_moments: "Before key moments", between_meetings: "Between meetings", end_of_day: "End of day" }`
- Reuses existing `AddToCalendar` component and category images from `sessionData.ts`

