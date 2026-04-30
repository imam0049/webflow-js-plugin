# Webflow Accordion - FAQ Accordion

## 1. Overview

The FAQ Accordion is a reusable vanilla JavaScript plugin for Webflow FAQ sections. It opens and closes FAQ items with smooth height animation while keeping at least one item open by default.

Key features:

- Vanilla JavaScript only
- No jQuery
- No build tools
- Works directly in Webflow
- Supports multiple independent accordions on the same page
- Uses custom data attributes instead of class selectors
- First item opens by default
- Optional default open item by index
- Optional single-item mode
- Optional always-one-open behavior
- Smooth height animation with `scrollHeight`
- Prevents page scroll jumps when items open or close
- Phosphor icon class toggling
- Keyboard accessible triggers
- Webflow Interactions and GSAP friendly

## 2. Installation in Webflow

Add `webflow-accordion.js` before the closing `</body>` tag.

Use one of these options:

- Upload the file to your CDN and include it with a `<script>` tag.
- Paste the file contents into Webflow Project Settings custom code before `</body>`.
- Paste the file contents into Page Settings custom code before `</body>` for page-specific usage.

CDN/GitHub example:

```html
<script src="https://cdn.jsdelivr.net/gh/your-username/your-repo@1.0.0/webflow-accordion/webflow-accordion.js"></script>
```

## 3. Required HTML Structure

Use your existing Webflow classes and add the accordion data attributes:

```html
<div class="faq-accordion" data-accordion data-accordion-single="true" data-accordion-always-open="true" data-accordion-default="0">
  <div class="accordion-divider"></div>

  <div class="accordion-item" data-accordion-item>
    <div class="accordion-item-title" data-accordion-trigger>
      <div class="text-block-57">What tolerances do you hold?</div>
      <div class="ph ph-minus" data-accordion-icon></div>
    </div>
    <div class="accordion-item-content" data-accordion-content>
      We machine to tolerances as tight as ±0.01mm depending on the material and geometry. Our advanced inspection equipment verifies every component meets specification before dispatch. ISO 9001 accreditation ensures consistent quality across all work.
    </div>
  </div>

  <div class="accordion-divider"></div>

  <div class="accordion-item" data-accordion-item>
    <div class="accordion-item-title" data-accordion-trigger>
      <div class="text-block-57">How long does a typical project take?</div>
      <div class="ph ph-plus" data-accordion-icon></div>
    </div>
    <div class="accordion-item-content" data-accordion-content>
      We machine to tolerances as tight as ±0.01mm depending on the material and geometry. Our advanced inspection equipment verifies every component meets specification before dispatch. ISO 9001 accreditation ensures consistent quality across all work.
    </div>
  </div>
</div>
```

## 4. Attribute API

Required attributes:

`data-accordion`  
Add this to the accordion wrapper.

```html
<div class="faq-accordion" data-accordion></div>
```

`data-accordion-item`  
Add this to each accordion item.

```html
<div class="accordion-item" data-accordion-item></div>
```

`data-accordion-trigger`  
Add this to the clickable title row.

```html
<div class="accordion-item-title" data-accordion-trigger></div>
```

`data-accordion-content`  
Add this to the content panel that should open and close.

```html
<div class="accordion-item-content" data-accordion-content></div>
```

`data-accordion-icon`  
Add this to the Phosphor icon element.

```html
<div class="ph ph-plus" data-accordion-icon></div>
```

Optional attributes:

`data-accordion-default="0"`  
Defines which item opens by default. Index starts from `0`.

```html
<div data-accordion data-accordion-default="1"></div>
```

`data-accordion-always-open="true"`  
Keeps at least one item open.

```html
<div data-accordion data-accordion-always-open="true"></div>
```

Default: `true`

`data-accordion-single="true"`  
Only allows one item open at a time.

```html
<div data-accordion data-accordion-single="true"></div>
```

Default: `true`

## 5. Class Naming Guide

The JavaScript does not use class names to identify accordion parts. Classes are only for Webflow styling.

Base classes from your current structure:

- `faq-accordion`
- `accordion-divider`
- `accordion-item`
- `accordion-item-title`
- `accordion-item-content`
- `text-block-57`

Icon classes:

- `ph ph-plus`: closed icon
- `ph ph-minus`: open icon

State classes added by JavaScript:

- `is-open`: added to the open item
- `is-active`: added to the open item

## 6. Setup Guide in Webflow

1. Select the FAQ wrapper and add `data-accordion`.
2. Add `data-accordion-single="true"` if only one item should be open.
3. Add `data-accordion-always-open="true"` if one item must always stay open.
4. Add `data-accordion-default="0"` to open the first item by default.
5. Select each `.accordion-item` and add `data-accordion-item`.
6. Select each `.accordion-item-title` and add `data-accordion-trigger`.
7. Select each `.accordion-item-content` and add `data-accordion-content`.
8. Select each Phosphor icon and add `data-accordion-icon`.
9. Add `webflow-accordion.js` before `</body>`.
10. Publish or preview the page.

## 7. Icon Setup

This plugin is built for Phosphor Icons web font classes.

Closed item icon:

```html
<div class="ph ph-plus" data-accordion-icon></div>
```

Open item icon:

```html
<div class="ph ph-minus" data-accordion-icon></div>
```

The JavaScript toggles `ph-plus` and `ph-minus` automatically. Keep the base `ph` class on the icon element.

## 8. Default Open Item

Use `data-accordion-default` on the wrapper to choose which item opens first.

```html
<div class="faq-accordion" data-accordion data-accordion-default="2"></div>
```

Index starts from `0`, so:

- `0` opens the first item
- `1` opens the second item
- `2` opens the third item

If the value is missing or invalid, the first item opens.

## 9. Always One Item Open Behavior

By default, one item always stays open.

```html
<div data-accordion data-accordion-always-open="true"></div>
```

When this is enabled, clicking the currently open item will not close it if it is the only open item.

To allow all items to close:

```html
<div data-accordion data-accordion-always-open="false"></div>
```

## 10. Multiple Accordions on Same Page

You can add multiple FAQ accordions to one page.

Each accordion needs its own wrapper:

```html
<div class="faq-accordion" data-accordion></div>
<div class="faq-accordion" data-accordion></div>
```

The plugin scopes all items, triggers, content panels, and icons inside each wrapper. Accordions do not conflict with each other.

## 11. Accessibility Notes

The plugin adds accessibility attributes automatically:

- `aria-expanded` on each trigger
- `aria-hidden` on each content panel
- `role="button"` when the trigger is not a native button
- `tabindex="0"` when the trigger is not naturally focusable

Keyboard support:

- `Enter` toggles the focused item
- `Space` toggles the focused item

## 12. Minimal Required CSS

The plugin writes the core inline styles needed for height animation, but this CSS is recommended for a clean Webflow setup:

```css
[data-accordion-trigger] {
  cursor: pointer;
}

[data-accordion-content] {
  overflow: hidden;
  overflow-anchor: none;
}

[data-accordion-item].is-open [data-accordion-content] {
  visibility: visible;
}

[data-accordion-item]:not(.is-open) [data-accordion-content] {
  visibility: hidden;
}

[data-accordion-icon] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

You can style `.is-open` and `.is-active` in Webflow for active item colors, borders, icon rotation, or spacing.

## 13. Example HTML

```html
<div class="faq-accordion" data-accordion data-accordion-single="true" data-accordion-always-open="true" data-accordion-default="0">
  <div class="accordion-divider"></div>

  <div class="accordion-item" data-accordion-item>
    <div class="accordion-item-title" data-accordion-trigger>
      <div class="text-block-57">What tolerances do you hold?</div>
      <div class="ph ph-minus" data-accordion-icon></div>
    </div>
    <div class="accordion-item-content" data-accordion-content>
      We machine to tolerances as tight as ±0.01mm depending on the material and geometry. Our advanced inspection equipment verifies every component meets specification before dispatch. ISO 9001 accreditation ensures consistent quality across all work.
    </div>
  </div>

  <div class="accordion-divider"></div>

  <div class="accordion-item" data-accordion-item>
    <div class="accordion-item-title" data-accordion-trigger>
      <div class="text-block-57">How long does a typical project take?</div>
      <div class="ph ph-plus" data-accordion-icon></div>
    </div>
    <div class="accordion-item-content" data-accordion-content>
      We machine to tolerances as tight as ±0.01mm depending on the material and geometry. Our advanced inspection equipment verifies every component meets specification before dispatch. ISO 9001 accreditation ensures consistent quality across all work.
    </div>
  </div>
</div>
```

## 14. Manual Initialization

The accordion initializes automatically on DOM load.

Manual initialization:

```html
<script>
  window.WebflowAccordion.init();
</script>
```

This is useful when FAQ accordions are added dynamically after page load.

Destroy all initialized accordions:

```html
<script>
  window.WebflowAccordion.destroy();
</script>
```

## 15. GSAP Compatibility Notes

The plugin controls `height` on `[data-accordion-content]`.

Best practices:

- Do not animate the same content panel height with GSAP.
- Animate child elements inside `[data-accordion-content]` instead.
- Use Webflow Interactions on inner text, icons, or decorative elements.
- Avoid changing content height during an open or close transition.

This prevents GSAP, Webflow Interactions, and the accordion plugin from competing over the same property.

## 16. Troubleshooting

Accordion not opening:

- Confirm the wrapper has `data-accordion`.
- Confirm each item has `data-accordion-item`.
- Confirm each title row has `data-accordion-trigger`.
- Confirm each content panel has `data-accordion-content`.
- Check the browser console for JavaScript errors.

Page scrolls when clicking an item:

- Make sure you are using the latest `webflow-accordion.js`.
- The plugin disables scroll anchoring on `[data-accordion]` and `[data-accordion-content]`.
- The plugin also locks the current page scroll position for the full accordion animation duration.
- Mouse focus on non-button triggers is prevented so the browser does not scroll the trigger into view.
- Avoid adding custom click interactions that also scroll to the FAQ item.

Icon not changing:

- Confirm the icon has `data-accordion-icon`.
- Confirm the icon element has the base `ph` class.
- Confirm Phosphor Icons web font is loaded on the page.

First item not open:

- Confirm there is at least one `[data-accordion-item]`.
- Confirm the first item contains both trigger and content elements.
- Remove invalid `data-accordion-default` values.

Multiple accordions conflict:

- Make sure each FAQ group has its own `[data-accordion]` wrapper.
- Keep items, triggers, content, and icons inside their matching wrapper.
- Do not nest one accordion inside another unless you intentionally want nested behavior and initialize carefully.

## 17. Performance Notes

The plugin is lightweight and suitable for Webflow pages.

Performance details:

- Uses one delegated click listener per accordion group
- Uses one delegated keydown listener per accordion group
- Measures `scrollHeight` only when opening or closing
- Uses native height transitions
- Preserves the current page scroll position for the full user-triggered animation
- Keeps each accordion instance independent
- Uses only data attributes for DOM targeting
- Requires no jQuery or external JavaScript libraries
