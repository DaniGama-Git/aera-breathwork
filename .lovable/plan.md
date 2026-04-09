

## Plan: iPhone mockup with uploaded screenshot + existing 3-screen visual

### What changes

Under "The App" card, show two visuals:
1. A new iPhone mockup frame containing the uploaded home screen image (`Aera_Brand_Guidelines_Home_Screen-2.jpg`)
2. The existing 3-screen mockup SVG (`mockup-app-screens.svg`) below or beside it

### Steps

1. **Copy the uploaded image** to `src/assets/aera-home-screen-2.jpg`

2. **Generate an iPhone mockup PNG** using a script — render the uploaded screenshot inside a realistic iPhone 15 Pro frame (dark bezel, rounded corners, notch). Save as `src/assets/mockup-iphone.png` (overwrite the existing one).

3. **Update `LandingPage.tsx`** — in The App card's visual area, show both:
   - The new iPhone mockup (centered, primary)
   - The existing `mockup-app-screens.svg` below it (the 3 side-by-side screens)

### Technical details

- Use Python with Pillow to composite the screenshot into an iPhone frame
- iPhone frame: dark rounded rectangle with appropriate aspect ratio, notch cutout, inner screen area
- The 3-screen SVG import (`mockupAppScreens`) will be added back alongside the phone mockup
- Layout: iPhone centered on top, 3-screen SVG below with appropriate spacing

