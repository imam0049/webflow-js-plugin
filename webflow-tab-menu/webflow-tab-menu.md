# Webflow Tab Menu

## 1. Overview

The Webflow Tab Menu plugin is a reusable vanilla JavaScript tab system for Webflow sections. It supports both hover and click activation, making it suitable for service commitment tabs, feature cards, process sections, and similar UI blocks.

Key features:

- Vanilla JavaScript only
- No jQuery
- No build tools
- Works directly inside Webflow
- Supports multiple independent tab menus on one page
- Works on hover and click by default
- Uses custom data attributes
- Toggles active classes on tab triggers and content panels
- Adds accessibility attributes
- Keyboard navigation support
- GSAP-friendly: no transforms, no page scroll, no pinning, no body lock

## 2. Installation in Webflow

Add `webflow-tab-menu.js` before the closing `</body>` tag.

CDN/GitHub example:

```html
<script src="https://cdn.jsdelivr.net/gh/your-username/your-repo@1.0.0/webflow-tab-menu/webflow-tab-menu.js"></script>
```

You can also paste the script into Webflow Project Settings or Page Settings before `</body>`.

## 3. Required HTML Structure

Convert your current Webflow structure by adding attributes:

```html
<div class="svc-commit-tabs-wrap" data-tab-menu data-tab-default="0">
  <div class="svc-commit-tabs">
    <div class="svc-commit-tab-content">
      <a href="#" class="sustainable active" data-tab-trigger>Transparent</a>
      <div class="svc-commit-tab-line"></div>
      <a href="#" class="sustainable" data-tab-trigger>Sustainable</a>
      <div class="svc-commit-tab-line"></div>
      <a href="#" class="sustainable" data-tab-trigger>Reliable</a>
    </div>

    <div class="from-initial-concept">
      From initial concept to final delivery, we focus on precision engineering, clear communication, and dependable results.
    </div>
  </div>

  <div class="svc-commit-tabs-content">
    <div class="svc-commit-tab-card" data-tab-panel>
      <!-- Transparent card content -->
    </div>

    <div class="svc-commit-tab-card" data-tab-panel>
      <!-- Sustainable card content -->
    </div>

    <div class="svc-commit-tab-card" data-tab-panel>
      <!-- Reliable card content -->
    </div>
  </div>
</div>
```

The order of `[data-tab-trigger]` elements must match the order of `[data-tab-panel]` elements.

## 4. Attribute API

Required attributes:

`data-tab-menu`  
Add this to the full tab component wrapper.

`data-tab-trigger`  
Add this to each tab link or trigger.

`data-tab-panel`  
Add this to each tab content card/panel.

Optional attributes:

`data-tab-default="0"`  
Sets the default active tab. Index starts at `0`.

`data-tab-hover="true"`  
Enables hover activation.

Default: `true`

`data-tab-click="true"`  
Enables click activation.

Default: `true`

`data-tab-active-class="active"`  
Changes the active class added to triggers and panels.

Default: `active`

`data-tab-state-class="is-active"`  
Changes the secondary state class added to triggers and panels.

Default: `is-active`

`data-tab-manage-panels="true"`  
Controls whether the plugin sets panel `display` and `pointer-events`.

Default: `true`

Set this to `false` if GSAP fully manages your card visibility.

```html
<div data-tab-menu data-tab-manage-panels="false"></div>
```

## 5. Class Naming Guide

The JavaScript targets only data attributes. Your Webflow classes remain design hooks.

Existing class examples:

- `svc-commit-tabs-wrap`
- `svc-commit-tabs`
- `svc-commit-tab-content`
- `sustainable`
- `svc-commit-tab-line`
- `svc-commit-tabs-content`
- `svc-commit-tab-card`

State classes:

- `active`: added to the active trigger and panel
- `is-active`: added to the active trigger and panel

## 6. Setup Guide in Webflow

1. Select `.svc-commit-tabs-wrap` and add `data-tab-menu`.
2. Add `data-tab-default="0"` if the first tab should be active initially.
3. Select each tab link and add `data-tab-trigger`.
4. Select each matching `.svc-commit-tab-card` and add `data-tab-panel`.
5. Make sure trigger order matches panel order.
6. Add the script before `</body>`.
7. Publish or preview the page.

## 7. Hover And Click Behavior

Hover and click are enabled by default.

Hover:

- Moving the cursor over a tab activates it.
- Keyboard focus also activates it.

Click:

- Clicking a tab activates it.
- Anchor default navigation is prevented for `href="#"` links.

To disable hover:

```html
<div data-tab-menu data-tab-hover="false"></div>
```

To disable click:

```html
<div data-tab-menu data-tab-click="false"></div>
```

## 8. Example HTML

```html
<div class="svc-commit-tabs-wrap" data-tab-menu data-tab-default="0" data-tab-hover="true" data-tab-click="true">
  <div class="svc-commit-tabs">
    <div class="svc-commit-tab-content">
      <a href="#" class="sustainable" data-tab-trigger>Transparent</a>
      <div class="svc-commit-tab-line"></div>
      <a href="#" class="sustainable" data-tab-trigger>Sustainable</a>
      <div class="svc-commit-tab-line"></div>
      <a href="#" class="sustainable" data-tab-trigger>Reliable</a>
    </div>
  </div>

  <div class="svc-commit-tabs-content">
    <div class="svc-commit-tab-card" data-tab-panel>Transparent content</div>
    <div class="svc-commit-tab-card" data-tab-panel>Sustainable content</div>
    <div class="svc-commit-tab-card" data-tab-panel>Reliable content</div>
  </div>
</div>
```

## 9. Minimal CSS

Design should stay in Webflow. Minimal behavior-friendly CSS:

```css
[data-tab-trigger] {
  cursor: pointer;
}

[data-tab-panel][aria-hidden="true"] {
  display: none;
  pointer-events: none;
}

[data-tab-panel][aria-hidden="false"] {
  display: flex;
}
```

If GSAP controls panel animation, set `data-tab-manage-panels="false"` and animate based on `.active` or `.is-active`.

## 10. Initialization

Auto initialization runs on DOM load.

Manual initialization:

```html
<script>
  window.WebflowTabMenu.init();
</script>
```

Destroy:

```html
<script>
  window.WebflowTabMenu.destroy();
</script>
```

## 11. Multiple Tab Menus

You can use multiple tab menus on one page. Each instance must have its own `[data-tab-menu]` wrapper. The plugin scopes all triggers and panels inside that wrapper.

## 12. Accessibility Notes

The plugin adds:

- `role="tab"` on triggers
- `role="tabpanel"` on panels
- `aria-selected` on triggers
- `aria-hidden` on panels
- `tabindex` management on triggers

Keyboard support:

- Arrow Right / Arrow Down: next tab
- Arrow Left / Arrow Up: previous tab
- Home: first tab
- End: last tab
- Enter / Space: activate focused tab

## 13. GSAP Compatibility Notes

The plugin does not animate transform, position, pinning, or scroll. It only toggles classes and accessibility state.

If `data-tab-manage-panels="true"`, the plugin also sets:

- `display: flex` on the active panel
- `display: none` on inactive panels
- `pointer-events`

If your GSAP timeline manages those properties, use:

```html
<div data-tab-menu data-tab-manage-panels="false"></div>
```

Then let GSAP respond to `.active` or `.is-active`.

## 14. Troubleshooting

Tab does not change:

- Confirm the wrapper has `data-tab-menu`.
- Confirm each trigger has `data-tab-trigger`.
- Confirm each panel has `data-tab-panel`.
- Confirm trigger count and panel count match.

Panel animation conflicts with GSAP:

- Set `data-tab-manage-panels="false"`.
- Let GSAP animate panels based on `.active` or `.is-active`.
- Avoid two scripts controlling the same `display` property.

Click jumps to top:

- Use `href="#"` safely; the plugin prevents default click behavior.
- Confirm click is happening on an element with `data-tab-trigger`.

## 15. Performance Notes

- Uses event delegation on each tab menu wrapper.
- Does not read layout on every interaction.
- Does not use timers or animation frames.
- Does not require jQuery.
- Keeps each tab menu independent.
