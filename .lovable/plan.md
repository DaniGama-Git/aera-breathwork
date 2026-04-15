

# Widen Back-to-Back Gap Threshold to 30 Minutes

## Change
In `extension/background.js`, the `detectBackToBack` function currently treats events as "consecutive" only if the gap between them is **<10 minutes**. This is too tight — most calendar events have 15-30 min breaks between them but still feel back-to-back.

Change the threshold from `10 * 60 * 1000` to `30 * 60 * 1000` so any events within 30 minutes of each other count as a consecutive block.

## Technical Detail

**`extension/background.js`** — `detectBackToBack` function (line ~501):
```js
// Before
if (gap < 10 * 60 * 1000)
// After
if (gap < 30 * 60 * 1000)
```

Also update the diagnostic gap logging from the approved plan to show gaps relative to this new 30-min threshold.

**`public/aera-extension.zip`** — repackage.

## Files Changed
- `extension/background.js` — change gap threshold from 10 to 30 minutes
- `public/aera-extension.zip` — repackaged

