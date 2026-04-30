# Webflow Slider - Our Work Slider

## 1. Overview

The Our Work Slider is a reusable vanilla JavaScript slider plugin for Webflow. It moves one slide at a time with `transform: translateX()` and leaves all visual styling to your existing Webflow classes.

The plugin does not use Webflow class names to identify slider parts. It only reads data attributes, so it can work with your current Webflow structure or any future class naming system.

Key features:

- Vanilla JavaScript only, no jQuery
- No build tools
- Multiple independent sliders on the same page
- Previous and next controls
- Auto-generated dot indicators
- Active slide and active dot states
- Smooth `translateX()` movement
- Keyboard navigation with left and right arrows
- Optional autoplay
- Configurable autoplay delay
- Pause autoplay on hover and focus
- Infinite loop support
- Touch and swipe support
- Webflow Interactions and GSAP friendly

## 2. Installation (Webflow)

Add `webflow-slider.js` before the closing `</body>` tag.

Use one of these options:

- Upload the file to your CDN and include it with a `<script>` tag.
- Paste the file contents into Webflow Project Settings custom code before `</body>`.
- Paste the file contents into Page Settings custom code before `</body>` for page-specific usage.

CDN example:

```html
<script src="https://your-cdn.com/webflow-slider.js"></script>
```

Custom code example:

```html
<script>
  /* Paste webflow-slider.js here */
</script>
```

## 3. Required HTML Structure

Your current Webflow structure can be used. Add data attributes to the existing elements.

Important: the element with `data-slider-track` should contain only slide items. Keep the control bar outside the track so it does not move with the slides.

```html
<div class="our-work-slider" data-slider="our-work" data-autoplay="true" data-delay="5000">
  <div data-slider-track>
    <div class="case-slider-wrap" data-slider-item>
      <div class="case-content-image">
        <img src="image-1.webp" loading="lazy" alt="" class="image-4">
      </div>

      <div class="case-media-inner">
        <div class="case-media-content">
          <div class="case-media-content-top">
            <div class="code-embed-9 w-embed"></div>
            <div class="text-block-42">Milling</div>
          </div>
          <div class="text-block-44">Simple project title here lorem ipsum text</div>
          <div class="text-block-45">High-precision milling for complex geometries, delivering accurate, consistent components across a wide range of industries.</div>
        </div>

        <div class="div-block-14">
          <a href="#" class="case-learn-btn w-inline-block">
            <div class="ph ph-arrow-elbow-down-right"></div>
            <div class="learn-more">Learn more</div>
          </a>
        </div>
      </div>
    </div>

    <div class="case-slider-wrap" data-slider-item>
      <!-- Duplicate your Webflow slide structure for slide 2 -->
    </div>
  </div>

  <div class="case-slider-controls">
    <div class="case-slider-arrow" data-slider-prev>
      <div class="ph ph-arrow-left"></div>
    </div>

    <div class="div-block-7" data-slider-dots></div>

    <div class="case-slider-arrow active" data-slider-next>
      <div class="ph ph-arrow-right"></div>
    </div>
  </div>
</div>
```

If your current `case-slider-wrap` is directly inside `.our-work-slider`, wrap all `case-slider-wrap` slides in one extra div and put `data-slider-track` on that wrapper.

## 4. Data Attributes

`data-slider="our-work"`  
Add this to the main slider wrapper.

```html
<div class="our-work-slider" data-slider="our-work"></div>
```

`data-slider-track`  
Add this to the element that wraps all slide items. This is the only element the plugin moves.

```html
<div data-slider-track></div>
```

`data-slider-item`  
Add this to each individual slide.

```html
<div class="case-slider-wrap" data-slider-item></div>
```

`data-slider-prev`  
Add this to the previous arrow element. It can be a `button`, `a`, or `div`.

```html
<div class="case-slider-arrow" data-slider-prev></div>
```

`data-slider-next`  
Add this to the next arrow element. It can be a `button`, `a`, or `div`.

```html
<div class="case-slider-arrow active" data-slider-next></div>
```

`data-slider-dots`  
Add this to the dots wrapper. The plugin creates the dots inside this element.

```html
<div class="div-block-7" data-slider-dots></div>
```

`data-slider-dot`  
The plugin adds this automatically to generated dot elements. You do not need to add it manually.

## 5. Class Naming Guide

The plugin does not require any class names for targeting.

Your existing classes are only for Webflow styling, such as:

- `our-work-slider`
- `case-slider-wrap`
- `case-content-image`
- `case-media-inner`
- `case-slider-controls`
- `case-slider-arrow`
- `div-block-7`

Generated classes:

- `slider-dot`: added to each generated dot
- `slider-dot is-active`: added to the active dot

State classes:

- `is-active`: added to the active slide and active dot
- `is-disabled`: added to previous or next controls when `data-loop="false"` and the slider reaches the first or last slide

## 6. Slider Setup Guide

1. Select the outer `.our-work-slider` element and add `data-slider="our-work"`.
2. Wrap all `.case-slider-wrap` slide items in one track element.
3. Add `data-slider-track` to that track wrapper.
4. Add `data-slider-item` to every `.case-slider-wrap`.
5. Add `data-slider-prev` to the left arrow.
6. Add `data-slider-next` to the right arrow.
7. Add `data-slider-dots` to the dots wrapper.
8. Remove any manually created dot children inside the dots wrapper if you want the plugin to generate them cleanly.
9. Add `webflow-slider.js` before `</body>`.
10. Publish or preview the page.

## 7. Configuration Options

Configuration uses data attributes on the main slider wrapper.

`data-autoplay`  
Enables autoplay.

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
Enables or disables infinite looping.

```html
<div data-slider="our-work" data-loop="false"></div>
```

Default: `true`

`data-pause-on-hover`  
Pauses autoplay when the user hovers over the slider or focuses inside it.

```html
<div data-slider="our-work" data-pause-on-hover="true"></div>
```

Default: `true`

## 8. Example HTML

```html
<div class="our-work-slider" data-slider="our-work" data-autoplay="true" data-delay="5000" data-loop="true">
  <div data-slider-track>
    <div class="case-slider-wrap" data-slider-item>
      <div class="case-content-image">
        <img src="image-1.webp" loading="lazy" alt="" class="image-4">
      </div>
      <div class="case-media-inner">
        <div class="case-media-content">
          <div class="case-media-content-top">
            <div class="code-embed-9 w-embed"></div>
            <div class="text-block-42">Milling</div>
          </div>
          <div class="text-block-44">Simple project title here lorem ipsum text</div>
          <div class="text-block-45">High-precision milling for complex geometries, delivering accurate, consistent components across a wide range of industries.</div>
        </div>
        <div class="div-block-14">
          <a href="#" class="case-learn-btn w-inline-block">
            <div class="ph ph-arrow-elbow-down-right"></div>
            <div class="learn-more">Learn more</div>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="case-slider-controls">
    <div class="case-slider-arrow" data-slider-prev>
      <div class="ph ph-arrow-left"></div>
    </div>
    <div class="div-block-7" data-slider-dots></div>
    <div class="case-slider-arrow active" data-slider-next>
      <div class="ph ph-arrow-right"></div>
    </div>
  </div>
</div>
```

## 9. Minimal Required CSS

No new CSS is required by this plugin if your Webflow layout is already styled.

The plugin writes only the minimum inline styles needed for slider behavior:

- `display: flex` on `[data-slider-track]`
- `transform: translateX(...)` on `[data-slider-track]`
- `transition` on `[data-slider-track]`
- `flex: 0 0 100%` on each `[data-slider-item]`
- `max-width: 100%` on each `[data-slider-item]`
- `touch-action: pan-y` on `[data-slider-track]`

Keep `overflow: hidden` on the visible slider area in Webflow so only one slide is visible.

## 10. Initialization

The slider initializes automatically on DOM load.

Manual initialization:

```html
<script>
  window.WebflowSlider.init();
</script>
```

This is useful if you add sliders dynamically after page load.

Destroy all initialized sliders:

```html
<script>
  window.WebflowSlider.destroy();
</script>
```

Inspect initialized sliders:

```html
<script>
  console.log(window.WebflowSlider.instances());
</script>
```

## 11. How Autoplay Works

Autoplay is disabled unless `data-autoplay="true"` is added.

When autoplay is enabled, the slider advances after the configured `data-delay`. If the user clicks an arrow, clicks a dot, or swipes, the autoplay timer restarts.

If `data-pause-on-hover="true"`, autoplay pauses on hover and focus, then resumes when the user leaves or blurs the slider.

## 12. Dot Indicator Logic

The plugin clears the `[data-slider-dots]` wrapper and creates one dot for each `[data-slider-item]`.

Each generated dot receives:

- `class="slider-dot"`
- `data-slider-dot="0"`, `data-slider-dot="1"`, and so on
- `aria-label="Go to slide 1"`, `aria-label="Go to slide 2"`, and so on

The active dot receives:

- `is-active`
- `aria-current="true"`

## 13. Multiple Sliders Support

You can add multiple sliders to one page. Each slider must have its own:

- `[data-slider="our-work"]`
- `[data-slider-track]`
- `[data-slider-item]` elements
- `[data-slider-prev]`
- `[data-slider-next]`
- `[data-slider-dots]`

The plugin scopes all queries inside each slider wrapper, so sliders do not conflict.

## 14. GSAP Compatibility Notes

The plugin only controls `transform` on `[data-slider-track]`.

Best practices:

- Do not animate `[data-slider-track]` with GSAP `x`, `xPercent`, or `transform`.
- Animate children inside `[data-slider-item]` instead.
- Keep Webflow Interactions on slide content, image, card, or text elements.
- Avoid changing slide widths while the slider is moving.

This prevents GSAP, Webflow Interactions, and the slider plugin from competing over the same transform property.

## 15. Touch/Swipe Behavior

Swipe gestures work on pointer-enabled devices.

- Swipe left to go next.
- Swipe right to go previous.
- Small movements are ignored.
- Vertical page scrolling remains available because the plugin sets `touch-action: pan-y`.

## 16. Responsive Notes

The plugin uses percentage-based movement, so it adapts to your Webflow breakpoints.

For responsive behavior:

- Keep each slide at full width.
- Keep controls outside `[data-slider-track]`.
- Keep the visible slider area clipped with `overflow: hidden`.
- Use Webflow breakpoints for image/card stacking and spacing.

## 17. Troubleshooting

Slider not moving:

- Confirm the wrapper has `data-slider="our-work"`.
- Confirm the track has `data-slider-track`.
- Confirm each slide has `data-slider-item`.
- Confirm the controls are outside `[data-slider-track]`.
- Confirm the slider area has `overflow: hidden`.

Dots not working:

- Confirm the dots wrapper has `data-slider-dots`.
- Remove manually created dots inside the wrapper, because the plugin generates dots automatically.
- Confirm there is more than one `[data-slider-item]`.

Multiple sliders conflict:

- Make sure each slider has a separate wrapper.
- Keep all controls for a slider inside that slider wrapper.
- Do not nest one slider inside another.

Controls not clicking:

- Add `data-slider-prev` and `data-slider-next` to the clickable arrow elements, not only to the icon inside.
- If using links as arrows, the plugin prevents the default link click.

## 18. Performance Notes

The plugin is built to be lightweight in Webflow.

Performance details:

- Uses one delegated click listener per slider.
- Uses transforms instead of layout-position animation.
- Avoids repeated layout reads during slide changes.
- Generates dots with a document fragment.
- Keeps autoplay timers scoped per slider.
- Uses only data attributes for DOM targeting.
- Does not require jQuery or any external dependency.
