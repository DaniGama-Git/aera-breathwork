

## Fix "The App" layout — bottom-align cards with phone

### File: `src/pages/LandingPage.tsx` (line 87-99)

Three changes to the image container:

1. **`items-start` → `items-end`** — bottom-aligns both images so session cards line up with the bottom of the phone
2. **Remove `mt-12 md:mt-16`** from session cards — no longer needed with bottom alignment
3. **Increase session cards width** from `w-[120px] md:w-[150px]` to `w-[160px] md:w-[200px]`

iPhone stays unchanged at `w-[140px] md:w-[170px]`.

```tsx
<div className="flex items-end justify-center gap-3 mb-6">
  <img
    src={mockupApp}
    alt="āera app on mobile"
    className="w-[140px] md:w-[170px] h-auto"
    loading="lazy"
  />
  <img
    src={sessionCards}
    alt="āera session cards"
    className="w-[160px] md:w-[200px] h-auto"
    loading="lazy"
  />
</div>
```

