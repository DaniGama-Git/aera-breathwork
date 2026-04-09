

## Allow Logged-In Users to Access Onboarding

**Problem:** The `ProtectedRoute` component blocks access to `/onboarding` if the user didn't arrive via the "Add to Chrome" flow (`sessionStorage` flag). A logged-in user navigating directly to `/onboarding` gets redirected to `/menu`.

**Fix in `src/App.tsx`:**

Update the `ProtectedRoute` logic so that if the user is already on `/onboarding`, allow it regardless of the flow flag. Only block navigation *to* onboarding if there's no chrome flow — but don't redirect *away* from it if the user explicitly navigated there.

Specifically, change lines 47-52: instead of immediately setting `needsOnboarding = false` when there's no chrome flow, also check if the user is currently on `/onboarding`. If they are, allow it through.

```text
Current logic:
  no chrome flow → needsOnboarding = false → redirects away from /onboarding

New logic:
  no chrome flow AND not on /onboarding → needsOnboarding = false
  no chrome flow AND on /onboarding → allow (don't redirect away)
```

This is a single change in `src/App.tsx` (~3 lines modified).

