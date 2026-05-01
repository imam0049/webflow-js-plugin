# Webflow Client Logo Slider

## 1. Overview

The Client Logo Slider is a reusable vanilla JavaScript marquee plugin for Webflow. It continuously scrolls client logos horizontally in an infinite loop.

Marquee behavior:

- Logos move continuously from right to left by default.
- Items are cloned automatically to create a seamless loop.
- The track moves with `transform: translateX()`.
- Animation uses `requestAnimationFrame` for smooth performance.

## 2. Installation in Webflow

Add `webflow-client-logo-slider.js` before the closing `</body>` tag.

Options:

- Upload the file to a CDN and include it with a script tag.
- Paste the file into Webflow Project Settings before `</body>`.
- Paste the file into Webflow Page Settings before `</body>` for page-specific use.

GitHub + CDN example:

```html
<script src="https://cdn.jsdelivr.net/gh/your-username/your-repo@1.0.0/webflow-client-logo-slider/webflow-client-logo-slider.js"></script>
```

## 3. Required HTML Structure

Use your existing Webflow classes and add the custom attributes:

```html
<div class="client-logo-slider" data-logo-slider data-logo-speed="1" data-logo-direction="left" data-logo-pause-hover="true">
  
  <div class="logo-track" data-logo-track>
    
    <div class="company-logo" data-logo-item>
      <!-- SVG or Image -->
    </div>

    <div class="company-logo" data-logo-item>
      <!-- SVG or Image -->
    </div>

    <div class="company-logo" data-logo-item>
      <!-- SVG or Image -->
    </div>

  </div>

</div>
```

Important:

- Wrapper `.client-logo-slider` must have `overflow: hidden`.
- Track must be horizontal flex.
- Items must not wrap.
- Logos should maintain original size.

The plugin also applies the key inline styles needed for marquee behavior.

## 4. Attribute API

Required attributes:

`data-logo-slider`  
Add this to the main slider wrapper.

```html
<div class="client-logo-slider" data-logo-slider></div>
```

`data-logo-track`  
Add this to the moving logo track.

```html
<div class="logo-track" data-logo-track></div>
```

`data-logo-item`  
Add this to each original logo item.

```html
<div class="company-logo" data-logo-item></div>
```

Optional attributes:

`data-logo-speed="1"`  
Controls marquee speed. Higher values move faster.

```html
<div data-logo-slider data-logo-speed="1.5"></div>
```

Default: `1`

`data-logo-direction="left"`  
Controls direction. Use `left` or `right`.

```html
<div data-logo-slider data-logo-direction="right"></div>
```

Default: `left`

`data-logo-pause-hover="true"`  
Pauses the animation on hover and focus.

```html
<div data-logo-slider data-logo-pause-hover="true"></div>
```

Default: `true`

`data-logo-gap="40"`  
Controls the gap between logo items in pixels.

```html
<div data-logo-slider data-logo-gap="56"></div>
```

Default: `40`

`data-logo-duplicate="true"`  
Controls whether the plugin clones items for seamless looping.

```html
<div data-logo-slider data-logo-duplicate="true"></div>
```

Default: `true`

## 5. Class Naming Guide

The JavaScript uses only data attributes for targeting. Classes are for Webflow styling only.

Suggested classes:

- `client-logo-slider`: wrapper
- `logo-track`: moving track
- `company-logo`: each logo item

State classes added by JavaScript:

- `is-running`: added while animation is active
- `is-paused`: added while animation is paused

Generated clone attribute:

- `data-logo-clone="true"` is added to cloned logo items

## 6. Setup Guide in Webflow

1. Create the outer logo slider wrapper.
2. Add `data-logo-slider` to the wrapper.
3. Add optional settings like `data-logo-speed`, `data-logo-direction`, and `data-logo-pause-hover`.
4. Add one logo track inside the wrapper.
5. Add `data-logo-track` to the track.
6. Add each logo inside the track.
7. Add `data-logo-item` to every original logo item.
8. Add the minimal CSS below or equivalent Webflow styles.
9. Add `webflow-client-logo-slider.js` before `</body>`.
10. Publish or preview the page.

## 7. Animation Logic

The plugin measures the width of the original logo set, including gaps. It then clones the original items until the track is wide enough to cover large screens.

How infinite loop works:

- For left direction, the track moves negatively on the X axis.
- When it has moved one full original set width, the position wraps back by that same width.
- Because cloned items match the originals, the loop appears continuous.

How duplication works:

- Original items keep `data-logo-item`.
- Cloned items also keep the visual markup.
- Cloned items receive `data-logo-clone="true"` and `aria-hidden="true"`.
- On resize or destroy, clones are removed and rebuilt.

## 8. Example HTML

```html
<div class="client-logo-slider" data-logo-slider data-logo-speed="1" data-logo-direction="left" data-logo-pause-hover="true" data-logo-gap="40">
  <div class="logo-track" data-logo-track>
    <div class="company-logo" data-logo-item>
      <img src="logo-1.svg" alt="Company 1">
    </div>
    <div class="company-logo" data-logo-item>
      <img src="logo-2.svg" alt="Company 2">
    </div>
    <div class="company-logo" data-logo-item>
      <img src="logo-3.svg" alt="Company 3">
    </div>
  </div>
</div>
```

## 9. Minimal CSS

```css
.client-logo-slider {
  width: 100%;
  overflow: hidden;
}

.logo-track {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.company-logo {
  flex: 0 0 auto;
}

.company-logo img,
.company-logo svg {
  display: block;
  width: auto;
  max-width: none;
  height: auto;
}
```

If you set spacing in Webflow, you can omit `data-logo-gap`. If you want the plugin to control spacing, use `data-logo-gap="40"`.

## 10. Initialization

The logo slider initializes automatically on DOM load.

Manual initialization:

```html
<script>
  window.WebflowLogoSlider.init();
</script>
```

Destroy all initialized sliders:

```html
<script>
  window.WebflowLogoSlider.destroy();
</script>
```

Inspect initialized sliders:

```html
<script>
  console.log(window.WebflowLogoSlider.instances());
</script>
```

## 11. Multiple Sliders Support

You can use multiple logo sliders on the same page.

Each slider must have its own:

- `[data-logo-slider]`
- `[data-logo-track]`
- `[data-logo-item]` elements

Each instance has its own speed, direction, hover state, clones, and resize handling.

## 12. Responsive Behavior

The plugin recalculates widths on resize. Clones are removed and rebuilt so the marquee remains seamless across breakpoints.

Responsive tips:

- Keep logos at their natural size.
- Avoid percentage widths on logo items unless intentional.
- Let the wrapper clip the overflowing track.
- Use Webflow breakpoints for logo sizing.

## 13. Performance Notes

The plugin uses `requestAnimationFrame` because it syncs animation updates with the browser rendering loop.

Performance details:

- Uses `transform: translateX()` instead of left/margin animation.
- Measures widths during init and debounced resize, not every frame.
- Writes only one transform per animation frame.
- Clones are rebuilt only when needed.
- No jQuery or external dependencies.

## 14. GSAP Compatibility Notes

The plugin controls `transform` on `[data-logo-track]`.

Best practices:

- Do not animate `[data-logo-track]` with GSAP `x`, `xPercent`, or `transform`.
- Animate elements inside `[data-logo-item]` instead.
- Keep Webflow Interactions on inner logo images/SVGs, not the moving track.
- If using ScrollTrigger, refresh after major layout changes elsewhere on the page.

The plugin does not use scroll-based animation and does not pin or lock the page.

## 15. Troubleshooting

Slider not moving:

- Confirm the wrapper has `data-logo-slider`.
- Confirm the track has `data-logo-track`.
- Confirm each logo has `data-logo-item`.
- Confirm `data-logo-speed` is greater than `0`.
- Check the browser console for JavaScript errors.

Jump or glitch issue:

- Make sure `data-logo-duplicate` is not set to `false`.
- Make sure there are enough original logos to create a natural loop.
- Avoid animating `[data-logo-track]` with GSAP or Webflow Interactions.
- Ensure logo images have loaded and have stable dimensions.

Logos overlapping:

- Add `data-logo-gap="40"` or set a gap in Webflow.
- Confirm `.logo-track` is flex and does not wrap.
- Confirm `.company-logo` uses `flex: 0 0 auto`.

Resize issues:

- The plugin rebuilds clones after resize with a short debounce.
- If logos load late, call `window.WebflowLogoSlider.destroy()` then `window.WebflowLogoSlider.init()` after assets are ready.

## 16. Best Practices

- Use optimized SVG or WebP/PNG logo assets.
- Keep logo dimensions consistent for a cleaner marquee.
- Use descriptive `alt` text for real logo images.
- Use `aria-hidden="true"` only on decorative logos.
- Keep the wrapper overflow hidden.
- Avoid applying transforms to the moving track from other scripts.
- Use one track per slider wrapper.
