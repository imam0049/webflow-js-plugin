# Webflow Slider - Our Work Slider

## 1. Overview

The Our Work Slider is a lightweight vanilla JavaScript slider built for Webflow projects. It shows one slide at a time, where each slide can contain a large image and a content card.

The JavaScript is intentionally reusable and design-agnostic. The reference layout shown in the provided example, with a large left image, right content card, centered dots, and bottom arrows, is handled with Webflow classes and CSS.

Key features:

- Vanilla JavaScript only, no jQuery
- Works directly in Webflow without build tools
- Supports multiple independent sliders on the same page
- Previous and next controls
- Dot indicators with active state
- Smooth `transform: translateX()` transitions
- Keyboard navigation with left and right arrows
- Optional autoplay with configurable delay
- Pause autoplay on hover and focus
- Infinite loop support
- Touch and swipe support for mobile
- GSAP and Webflow Interactions friendly

## 2. Installation (Webflow)

Add `webflow-slider.js` to your Webflow project before the closing `</body>` tag.

Recommended options:

- Host the file on your own CDN and add it with a script tag.
- Paste the JavaScript into Webflow Page Settings or Project Settings inside the custom code area before `</body>`.
- Use a Webflow Embed element near the end of the page for page-specific usage.

CDN-style example:

```html
<script src="https://your-cdn.com/webflow-slider.js"></script>
```

Custom embed example:

```html
<script>
  /* Paste the contents of webflow-slider.js here */
</script>
```

## 3. Required HTML Structure

Use this structure for each slider:

```html
<section class="ow-section">
  <div class="ow-slider" data-slider="our-work" data-autoplay="true" data-delay="5000">

    <div class="ow-slider_track" data-slider-track>
      
      <div class="ow-slider_item" data-slider-item>
        <img class="ow-slider_img" src="image-1.jpg" alt="">
        <div class="ow-slider_card">
          <h3>Project Title</h3>
          <p>Project description</p>
        </div>
      </div>

    </div>

    <button class="ow-slider_arrow is-prev" data-slider-prev>Prev</button>
    <button class="ow-slider_arrow is-next" data-slider-next>Next</button>

    <div class="ow-slider_dots" data-slider-dots></div>

  </div>
</section>
```

## 4. Data Attributes

`data-slider="our-work"`  
Add this to the main slider wrapper. The plugin uses it to find each slider.

```html
<div class="ow-slider" data-slider="our-work"></div>
```

`data-slider-track`  
Add this to the element that directly wraps all slides. The plugin moves this element with `translateX()`.

```html
<div class="ow-slider_track" data-slider-track></div>
```

`data-slider-item`  
Add this to each individual slide.

```html
<div class="ow-slider_item" data-slider-item></div>
```

`data-slider-prev`  
Add this to the previous button.

```html
<button data-slider-prev>Prev</button>
```

`data-slider-next`  
Add this to the next button.

```html
<button data-slider-next>Next</button>
```

`data-slider-dots`  
Add this to the dots wrapper. The plugin generates dot buttons inside this element.

```html
<div class="ow-slider_dots" data-slider-dots></div>
```

## 5. Class Naming Guide

Required classes are your Webflow styling hooks. The JavaScript relies on data attributes, not class names, so you can rename the Webflow classes if needed.

For the supplied reference design, keep the `ow-*` classes below so the CSS example works without changes.

Recommended classes:

- `ow-section`: Outer section wrapper
- `ow-slider`: Main slider wrapper
- `ow-slider_track`: Slide track
- `ow-slider_item`: Individual slide
- `ow-slider_img`: Slide image
- `ow-slider_card`: Slide content card
- `ow-slider_arrow`: Shared arrow button class
- `ow-slider_dots`: Dot wrapper

Generated classes:

- `slider-dot`: Added to each generated dot button
- `slider-dot is-active`: Added to the current slide dot

State classes:

- `is-active`: Added to the active slide and active dot
- `is-disabled`: Added to previous or next buttons when looping is disabled and the slider is at the first or last slide

## 6. Slider Setup Guide

1. Create a slider wrapper and add `data-slider="our-work"`.
2. Add a track element inside it and add `data-slider-track`.
3. Add one or more slide elements inside the track and add `data-slider-item` to each slide.
4. Add a previous button with `data-slider-prev`.
5. Add a next button with `data-slider-next`.
6. Add an empty dots wrapper with `data-slider-dots`.
7. Add the minimal CSS from this document or your own equivalent Webflow styles.
8. Add `webflow-slider.js` before the closing `</body>` tag.
9. Publish or preview the Webflow page.

## 7. Configuration Options

Configuration is handled with data attributes on the main slider wrapper.

`data-autoplay`  
Enables or disables autoplay.

```html
<div data-slider="our-work" data-autoplay="true"></div>
```

Default: `false`

`data-delay`  
Sets autoplay delay in milliseconds.

```html
<div data-slider="our-work" data-autoplay="true" data-delay="5000"></div>
```

Default: `5000`

`data-loop`  
Controls infinite looping. When enabled, next from the last slide goes to the first slide, and previous from the first slide goes to the last slide.

```html
<div data-slider="our-work" data-loop="true"></div>
```

Default: `true`

`data-pause-on-hover`  
Controls whether autoplay pauses on hover and focus.

```html
<div data-slider="our-work" data-pause-on-hover="true"></div>
```

Default: `true`

## 8. Example HTML

```html
<section class="ow-section">
  <div class="ow-slider" data-slider="our-work" data-autoplay="true" data-delay="5000">

    <div class="ow-slider_track" data-slider-track>
      
      <div class="ow-slider_item" data-slider-item>
        <img class="ow-slider_img" src="image-1.jpg" alt="">
        <div class="ow-slider_card">
          <h3>Project Title</h3>
          <p>Project description</p>
        </div>
      </div>

    </div>

    <button class="ow-slider_arrow is-prev" data-slider-prev>Prev</button>
    <button class="ow-slider_arrow is-next" data-slider-next>Next</button>

    <div class="ow-slider_dots" data-slider-dots></div>

  </div>
</section>
```

## 9. Minimal Required CSS

Add this CSS in Webflow custom code, page settings, or your site stylesheet. It recreates the supplied reference style while keeping the slider reusable. Change colors, spacing, typography, and breakpoint values as needed for other projects.

```css
.ow-section {
  background: #00243e;
  color: #fff;
  padding: clamp(4rem, 8vw, 8rem) 1.5rem;
}

.ow-slider {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 92.5rem;
  margin-right: auto;
  margin-left: auto;
  padding-bottom: 5.5rem;
}

.ow-slider_track {
  display: flex;
  width: 100%;
}

.ow-slider_item {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(20rem, 1fr);
  gap: 0.75rem;
  align-items: stretch;
  flex: 0 0 100%;
  max-width: 100%;
}

.ow-slider_img {
  display: block;
  width: 100%;
  height: clamp(24rem, 42vw, 39.5rem);
  object-fit: cover;
  border-radius: 0.25rem;
}

.ow-slider_card {
  display: flex;
  flex-direction: column;
  min-height: clamp(24rem, 42vw, 39.5rem);
  padding: clamp(2rem, 4vw, 3.5rem);
  border-radius: 0.25rem;
  background: #173c59;
  position: relative;
  z-index: 1;
}

.ow-slider_card h3 {
  margin-top: 0;
  margin-bottom: 1.75rem;
  font-size: clamp(1.5rem, 2vw, 2rem);
  line-height: 1.15;
  font-weight: 400;
}

.ow-slider_card p {
  max-width: 28rem;
  margin-top: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(1rem, 1.4vw, 1.25rem);
  line-height: 1.45;
}

.ow-slider_arrow {
  position: absolute;
  bottom: 0;
  z-index: 2;
  display: inline-flex;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.25rem;
  background: #60c8ff;
  color: #00243e;
  cursor: pointer;
}

.ow-slider_arrow.is-prev {
  left: calc(50% - 11rem);
}

.ow-slider_arrow.is-next {
  right: calc(50% - 11rem);
}

.ow-slider_arrow:hover {
  background: #8dd8ff;
}

.ow-slider_arrow.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}

.ow-slider_dots {
  position: absolute;
  bottom: 1.1875rem;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 0.625rem;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
}

.slider-dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.24);
  cursor: pointer;
}

.slider-dot.is-active {
  background: #60c8ff;
}

@media (max-width: 991px) {
  .ow-slider_item {
    grid-template-columns: 1fr;
  }

  .ow-slider_img,
  .ow-slider_card {
    min-height: auto;
    height: auto;
  }

  .ow-slider_img {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 479px) {
  .ow-slider {
    padding-bottom: 4.75rem;
  }

  .ow-slider_arrow {
    width: 2.75rem;
    height: 2.75rem;
  }

  .ow-slider_arrow.is-prev {
    left: 0;
  }

  .ow-slider_arrow.is-next {
    right: 0;
  }
}
```

## 10. Initialization

The slider automatically initializes on DOM load.

Manual initialization is also available:

```html
<script>
  window.WebflowSlider.init();
</script>
```

Manual initialization is useful when sliders are added dynamically after page load.

To destroy all initialized sliders:

```html
<script>
  window.WebflowSlider.destroy();
</script>
```

## 11. How Autoplay Works

Autoplay is disabled by default. Enable it with `data-autoplay="true"`.

```html
<div class="ow-slider" data-slider="our-work" data-autoplay="true" data-delay="5000"></div>
```

When autoplay is enabled, the slider advances after the configured delay. User navigation restarts the timer so the next automatic movement does not happen immediately after a click or swipe.

When `data-pause-on-hover="true"`, autoplay pauses while the user hovers over the slider or focuses inside it.

## 12. Dot Indicator Logic

The plugin creates one `.slider-dot` button for each `[data-slider-item]`.

When a slide becomes active:

- The matching dot receives `.is-active`.
- The matching dot receives `aria-current="true"`.
- Other dots have `.is-active` removed.

Clicking a dot moves directly to that slide.

## 13. Multiple Sliders Support

You can place multiple sliders on the same page. Each slider must have its own wrapper, track, slides, controls, and dots wrapper.

Example:

```html
<div class="ow-slider" data-slider="our-work"></div>
<div class="ow-slider" data-slider="our-work"></div>
```

Each instance stores its own state, autoplay timer, buttons, and dots.

## 14. GSAP Compatibility Notes

The plugin only animates the `[data-slider-track]` element with `transform: translateX()`.

Best practices:

- Avoid applying GSAP `x`, `xPercent`, or `transform` animations directly to `[data-slider-track]`.
- Animate elements inside each `[data-slider-item]` instead, such as images, text, or cards.
- If Webflow Interactions or GSAP need to animate the track, wrap the track in another element and animate the wrapper instead.
- Avoid changing slide widths during an active transition.

This keeps Webflow Interactions, GSAP timelines, and slider movement from competing over the same transform property.

## 15. Touch/Swipe Behavior

The slider supports pointer-based swipe gestures on mobile and touch devices.

Behavior:

- Swipe left to go to the next slide.
- Swipe right to go to the previous slide.
- Small movements are ignored to prevent accidental navigation.
- Vertical page scrolling is preserved with `touch-action: pan-y`.

## 16. Responsive Notes

The slider uses percentage-based transforms and `flex: 0 0 100%`, so each slide remains one full slider width at any breakpoint.

Responsive recommendations:

- Set images to `width: 100%`.
- Keep the slider wrapper `overflow: hidden`.
- Adjust card layout in Webflow across tablet and mobile breakpoints.
- Avoid fixed slide widths unless you also update the track and slide CSS carefully.

## 17. Troubleshooting

Slider not moving:

- Confirm the wrapper has `data-slider="our-work"`.
- Confirm the moving element has `data-slider-track`.
- Confirm each slide has `data-slider-item`.
- Confirm the slider wrapper has `overflow: hidden`.
- Check the browser console for JavaScript errors.

Dots not working:

- Confirm the dots wrapper has `data-slider-dots`.
- Confirm there is at least one `[data-slider-item]`.
- Do not manually add dot elements; the plugin generates them.

Previous or next buttons not working:

- Confirm buttons use `data-slider-prev` and `data-slider-next`.
- If `data-loop="false"`, the first and last slide buttons may become disabled.

Multiple sliders conflict:

- Make sure each slider has its own wrapper.
- Keep each slider track, buttons, and dots inside its matching `[data-slider="our-work"]` wrapper.
- Do not place one slider inside another slider.

## 18. Performance Notes

The plugin is designed to stay lightweight and Webflow-friendly.

Performance details:

- Uses one delegated click listener per slider.
- Uses `transform: translateX()` for smooth movement.
- Avoids repeated layout reads during slide changes.
- Uses a document fragment when generating dots.
- Keeps each slider instance independent.
- Does not depend on jQuery, external libraries, or build tools.
