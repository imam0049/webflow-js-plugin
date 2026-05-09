# Webflow Milestone Slider

## 1. Overview

The Webflow Milestone Slider is a reusable vanilla JavaScript plugin for a company history or "see the history" section. It turns milestone cards into a horizontal slider with previous and next controls plus line-style indicators.

Key features:

- Vanilla JavaScript only
- No jQuery
- No build tools
- Works directly inside Webflow
- Supports multiple independent milestone sliders on the same page
- Horizontal `translateX()` movement
- Previous and next controls
- Generated line indicators
- Active indicator class support for your existing `indi-active` style
- Respects fixed and responsive card widths created in Webflow
- Supports card gaps from Webflow flex/grid styles
- Keyboard navigation with left and right arrows
- Touch/swipe support
- Responsive behavior
- GSAP and Webflow Interactions friendly when the moving track is not animated elsewhere

## 2. Installation in Webflow

Add `webflow-milestone-slider.js` before the closing `</body>` tag.

CDN/GitHub example:

```html
<script src="https://cdn.jsdelivr.net/gh/your-username/your-repo@1.0.0/webflow-milestone-slider/webflow-milestone-slider.js"></script>
```

You can also paste the script into Webflow Project Settings or Page Settings before `</body>`.

## 3. Required HTML Structure

Convert your current Webflow structure by adding data attributes:

```html
<div class="abt-milestone-grid" data-milestone-slider data-milestone-loop="false">
  <div class="abt-milestone-crads" data-milestone-track>

    <div class="abt-milestone-card" data-milestone-item>
      <div class="squire"></div>
      <div class="abt-milestone-content">
        <div class="text-block-101">1966</div>
        <div class="text-block-102">Founded by craftsmen who believed precision mattered more than shortcuts.</div>
      </div>
      <div class="div-block-25">
        <img src="about-image17.jpg" loading="lazy" alt="" class="image-17">
      </div>
    </div>

    <div class="abt-milestone-card" data-milestone-item>
      <!-- Milestone content -->
    </div>

  </div>

  <div class="abt-milestone-pagination">
    <div class="abt-milestone-prev" data-milestone-prev>
      <div class="text-block-103">PREV</div>
    </div>

    <div class="abt-milestone-indicator" data-milestone-indicators></div>

    <div class="abt-milestone-next" data-milestone-next>
      <div>NEXT</div>
    </div>
  </div>
</div>
```

Important: keep the pagination controls outside `[data-milestone-track]` so controls do not move with the cards.

## 4. Attribute API

Required attributes:

`data-milestone-slider`  
Add this to the full slider wrapper.

`data-milestone-track`  
Add this to the horizontal moving card container.

`data-milestone-item`  
Add this to each milestone card.

`data-milestone-prev`  
Add this to the previous control.

`data-milestone-next`  
Add this to the next control.

`data-milestone-indicators`  
Add this to the indicator wrapper. The plugin generates indicator items inside it.

Generated attribute:

`data-milestone-indicator`  
Added automatically to each generated indicator.

Optional attributes:

`data-milestone-start="0"`  
Sets the starting item index.

`data-milestone-loop="false"`  
Enables or disables looping.

`data-milestone-duration="500"`  
Sets slide transition duration in milliseconds.

Card width and gap:

- Card width should be designed in Webflow on `.abt-milestone-card`.
- Gap should be designed in Webflow on `.abt-milestone-crads`.
- The plugin measures real card positions, so fixed widths, responsive widths, and CSS gaps are respected automatically.
- The plugin does not set card width or card gap.

## 5. Class Naming Guide

The JavaScript targets only data attributes. Your Webflow classes stay as styling hooks.

Existing class examples:

- `abt-milestone-grid`
- `abt-milestone-crads`
- `abt-milestone-card`
- `abt-milestone-pagination`
- `abt-milestone-prev`
- `abt-milestone-next`
- `abt-milestone-indicator`
- `indicator-item`

State classes:

- `is-active`: added to the active milestone card and active indicator
- `indi-active`: added to the active line indicator for your existing Webflow styling
- `is-disabled`: added to prev/next when looping is disabled and the slider is at the start or end

## 6. Setup Guide in Webflow

1. Select `.abt-milestone-grid` and add `data-milestone-slider`.
2. Select `.abt-milestone-crads` and add `data-milestone-track`.
3. Select each `.abt-milestone-card` and add `data-milestone-item`.
4. Select `.abt-milestone-prev` and add `data-milestone-prev`.
5. Select `.abt-milestone-next` and add `data-milestone-next`.
6. Select `.abt-milestone-indicator` and add `data-milestone-indicators`.
7. Remove the manually created `.indicator-item` children if you want the plugin to generate the exact number of indicators.
8. Add the script before `</body>`.
9. Publish or preview the page.

## 7. Line Indicator Logic

The plugin clears `[data-milestone-indicators]` and creates one line indicator for each `[data-milestone-item]`.

Each generated indicator receives:

- `class="indicator-item"`
- `data-milestone-indicator="0"`, `1`, `2`, and so on
- `aria-label="Go to milestone 1"`, `2`, `3`, and so on

The active indicator receives:

- `indi-active`
- `is-active`
- `aria-current="true"`

## 8. Example HTML

```html
<div class="abt-milestone-grid" data-milestone-slider data-milestone-loop="false" data-milestone-duration="500">
  <div class="abt-milestone-crads" data-milestone-track>
    <div class="abt-milestone-card" data-milestone-item>
      <div class="squire"></div>
      <div class="abt-milestone-content">
        <div class="text-block-101">1966</div>
        <div class="text-block-102">Founded by craftsmen who believed precision mattered more than shortcuts.</div>
      </div>
      <div class="div-block-25">
        <img src="about-image17.jpg" loading="lazy" alt="" class="image-17">
      </div>
    </div>
  </div>

  <div class="abt-milestone-pagination">
    <div class="abt-milestone-prev" data-milestone-prev>
      <div class="text-block-103">PREV</div>
    </div>
    <div class="abt-milestone-indicator" data-milestone-indicators></div>
    <div class="abt-milestone-next" data-milestone-next>
      <div>NEXT</div>
    </div>
  </div>
</div>
```

## 9. Webflow Styling Requirements

This plugin is JavaScript-only for behavior. The Webflow developer should handle the design in Webflow classes.

Required layout rules to create in Webflow:

- `.abt-milestone-grid` should hide horizontal overflow.
- `.abt-milestone-crads` should be a horizontal flex row with no wrapping.
- `.abt-milestone-crads` should define the card gap.
- `.abt-milestone-card` should have a fixed or responsive width.
- `.abt-milestone-card` should not be forced to `100%` unless that is the intended design.

Example CSS for the Webflow developer:

```css
.abt-milestone-grid {
  overflow: hidden;
}

.abt-milestone-crads {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px;
}

.abt-milestone-card {
  flex: 0 0 auto;
  width: 420px;
}

.indicator-item {
  cursor: pointer;
}

.indicator-item.indi-active {
  opacity: 1;
}

.abt-milestone-prev.is-disabled,
.abt-milestone-next.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}
```

## 10. Initialization

Auto initialization runs on DOM load.

Manual initialization:

```html
<script>
  window.WebflowMilestoneSlider.init();
</script>
```

Destroy:

```html
<script>
  window.WebflowMilestoneSlider.destroy();
</script>
```

## 11. Multiple Sliders Support

You can use multiple milestone sliders on one page. Each slider must have its own wrapper, track, cards, controls, and indicator wrapper.

All queries are scoped inside each `[data-milestone-slider]`, so instances do not conflict.

## 12. Responsive Behavior

The slider measures each card's real offset and moves with pixel-based `translateX()` values. This means the slider respects the current Webflow layout, including fixed card widths, responsive card widths, and gaps.

Use Webflow breakpoints for card width, gap, internal card layout, image sizing, typography, and spacing. On resize, the plugin remeasures the card positions and reapplies the current transform.

## 13. GSAP Compatibility Notes

The plugin controls `transform` on `[data-milestone-track]`.

Best practices:

- Do not animate `[data-milestone-track]` with GSAP `x`, `xPercent`, or `transform`.
- Animate children inside `[data-milestone-item]` instead.
- Keep Webflow Interactions on text, images, or decorative children inside cards.
- The plugin does not pin, lock, or scroll the page.

## 14. Troubleshooting

Slider not moving:

- Confirm the wrapper has `data-milestone-slider`.
- Confirm the track has `data-milestone-track`.
- Confirm each card has `data-milestone-item`.
- Confirm `.abt-milestone-card` has a fixed or responsive width in Webflow.
- Confirm `.abt-milestone-crads` is a horizontal no-wrap layout in Webflow.
- Confirm the track is not being transformed by GSAP or Webflow Interactions.

Indicators not showing:

- Confirm the indicator wrapper has `data-milestone-indicators`.
- Remove manually created indicators if the count is wrong.
- Confirm there is at least one milestone card.

Prev/next not working:

- Confirm the controls have `data-milestone-prev` and `data-milestone-next`.
- If `data-milestone-loop="false"`, the first/last controls become disabled at the edges.

## 15. Performance Notes

- Uses `transform: translateX()` for smooth movement.
- Measures card positions on init and resize, not every frame.
- Uses event delegation for controls and indicators.
- Does not require jQuery or build tools.
- Keeps each slider instance independent.
