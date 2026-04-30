/*!
 * WebflowAccordion - FAQ Accordion
 * Lightweight vanilla JavaScript accordion for Webflow.
 */
(function (window, document) {
  "use strict";

  var SELECTORS = {
    root: "[data-accordion]",
    item: "[data-accordion-item]",
    trigger: "[data-accordion-trigger]",
    content: "[data-accordion-content]",
    icon: "[data-accordion-icon]"
  };

  var DEFAULTS = {
    defaultIndex: 0,
    alwaysOpen: true,
    single: true,
    duration: 300
  };

  var instances = [];

  function toBoolean(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return value === "true" || value === true;
  }

  function toNumber(value, fallback) {
    var number = parseInt(value, 10);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
  }

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function getScrollLeft() {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  }

  function Accordion(root) {
    this.root = root;
    this.items = Array.prototype.slice.call(root.querySelectorAll(SELECTORS.item));
    this.options = {
      defaultIndex: toNumber(root.getAttribute("data-accordion-default"), DEFAULTS.defaultIndex),
      alwaysOpen: toBoolean(root.getAttribute("data-accordion-always-open"), DEFAULTS.alwaysOpen),
      single: toBoolean(root.getAttribute("data-accordion-single"), DEFAULTS.single),
      duration: DEFAULTS.duration
    };

    this.isAnimating = false;
    this.scrollLockFrame = null;

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  Accordion.prototype.init = function () {
    if (!this.root || this.items.length === 0 || this.root.WebflowAccordionInstance) return;

    this.root.WebflowAccordionInstance = this;
    this.root.style.overflowAnchor = "none";

    this.setupItems();
    this.bindEvents();
    this.setDefaultOpenItem();
  };

  Accordion.prototype.setupItems = function () {
    this.items.forEach(function (item, index) {
      var trigger = item.querySelector(SELECTORS.trigger);
      var content = item.querySelector(SELECTORS.content);

      if (!trigger || !content) return;

      if (trigger.tagName.toLowerCase() !== "button") {
        if (!trigger.hasAttribute("role")) trigger.setAttribute("role", "button");
        if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", "0");
      }

      trigger.setAttribute("data-accordion-index", String(index));
      trigger.setAttribute("aria-expanded", "false");

      content.setAttribute("aria-hidden", "true");
      content.style.boxSizing = "border-box";
      content.style.overflow = "hidden";
      content.style.overflowAnchor = "none";
      content.style.height = "0px";
      content.style.transitionProperty = "height";
      content.style.transitionDuration = this.options.duration + "ms";
      content.style.transitionTimingFunction = "ease";

      item.classList.remove("is-open", "is-active");
      this.setIcon(item, false);
    }, this);
  };

  Accordion.prototype.bindEvents = function () {
    this.root.addEventListener("pointerdown", this.onPointerDown);
    this.root.addEventListener("click", this.onClick);
    this.root.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("resize", this.onResize);
  };

  Accordion.prototype.setDefaultOpenItem = function () {
    var index = Math.min(this.options.defaultIndex, this.items.length - 1);
    if (index < 0) index = 0;
    this.openItem(this.items[index], false, false);
  };

  Accordion.prototype.onPointerDown = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;

    // Mouse focus can make the browser scroll the page to the trigger.
    // Keyboard focus and touch behavior remain available.
    if (event.pointerType === "mouse") {
      event.preventDefault();
    }
  };

  Accordion.prototype.onClick = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;

    event.preventDefault();
    this.toggleItem(trigger.closest(SELECTORS.item), true);
  };

  Accordion.prototype.onKeyDown = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggleItem(trigger.closest(SELECTORS.item), true);
    }
  };

  Accordion.prototype.onResize = function () {
    this.items.forEach(function (item) {
      var content = item.querySelector(SELECTORS.content);
      if (content && item.classList.contains("is-open")) {
        content.style.height = "auto";
      }
    });
  };

  Accordion.prototype.toggleItem = function (item, lockScroll) {
    if (!item || this.isAnimating) return;

    if (lockScroll) this.lockPageScroll(this.options.duration + 80);

    if (item.classList.contains("is-open")) {
      if (this.options.alwaysOpen && this.getOpenItems().length <= 1) return;
      this.closeItem(item, true);
      return;
    }

    this.openItem(item, this.options.single, true);
  };

  Accordion.prototype.openItem = function (item, closeSiblings, animate) {
    var content;
    var trigger;

    if (!item) return;

    content = item.querySelector(SELECTORS.content);
    trigger = item.querySelector(SELECTORS.trigger);

    if (!content || !trigger) return;

    this.isAnimating = !!animate;

    if (closeSiblings) {
      this.items.forEach(function (sibling) {
        if (sibling !== item) this.closeItem(sibling, animate);
      }, this);
    }

    item.classList.add("is-open", "is-active");
    trigger.setAttribute("aria-expanded", "true");
    content.setAttribute("aria-hidden", "false");
    this.setIcon(item, true);

    if (!animate) {
      content.style.height = "auto";
      this.isAnimating = false;
      return;
    }

    content.style.height = "0px";
    content.offsetHeight;
    content.style.height = content.scrollHeight + "px";

    window.setTimeout(function () {
      if (item.classList.contains("is-open")) content.style.height = "auto";
      this.isAnimating = false;
    }.bind(this), this.options.duration);
  };

  Accordion.prototype.closeItem = function (item, animate) {
    var content = item ? item.querySelector(SELECTORS.content) : null;
    var trigger = item ? item.querySelector(SELECTORS.trigger) : null;

    if (!item || !content || !trigger || !item.classList.contains("is-open")) return;

    item.classList.remove("is-open", "is-active");
    trigger.setAttribute("aria-expanded", "false");
    content.setAttribute("aria-hidden", "true");
    this.setIcon(item, false);

    if (!animate) {
      content.style.height = "0px";
      return;
    }

    content.style.height = content.scrollHeight + "px";
    content.offsetHeight;
    content.style.height = "0px";
  };

  Accordion.prototype.lockPageScroll = function (duration) {
    var start = window.performance && window.performance.now ? window.performance.now() : Date.now();
    var scrollX = getScrollLeft();
    var scrollY = getScrollTop();
    var restore = function () {
      var now = window.performance && window.performance.now ? window.performance.now() : Date.now();

      window.scrollTo(scrollX, scrollY);

      if (now - start < duration) {
        this.scrollLockFrame = window.requestAnimationFrame(restore);
      } else {
        this.scrollLockFrame = null;
      }
    }.bind(this);

    if (this.scrollLockFrame) {
      window.cancelAnimationFrame(this.scrollLockFrame);
    }

    restore();
  };

  Accordion.prototype.getOpenItems = function () {
    return this.items.filter(function (item) {
      return item.classList.contains("is-open");
    });
  };

  Accordion.prototype.setIcon = function (item, isOpen) {
    var icon = item.querySelector(SELECTORS.icon);

    if (!icon) return;

    icon.classList.add("ph");
    icon.classList.toggle("ph-plus", !isOpen);
    icon.classList.toggle("ph-minus", isOpen);
  };

  Accordion.prototype.destroy = function () {
    if (this.scrollLockFrame) window.cancelAnimationFrame(this.scrollLockFrame);
    this.root.removeEventListener("pointerdown", this.onPointerDown);
    this.root.removeEventListener("click", this.onClick);
    this.root.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("resize", this.onResize);
    delete this.root.WebflowAccordionInstance;
  };

  function init(context) {
    var scope = context || document;
    var roots = Array.prototype.slice.call(scope.querySelectorAll(SELECTORS.root));

    roots.forEach(function (root) {
      var accordion;

      if (root.WebflowAccordionInstance) return;

      accordion = new Accordion(root);
      accordion.init();

      if (root.WebflowAccordionInstance) instances.push(accordion);
    });

    return instances;
  }

  function destroy() {
    instances.forEach(function (instance) {
      instance.destroy();
    });
    instances = [];
  }

  window.WebflowAccordion = {
    init: init,
    destroy: destroy,
    instances: function () {
      return instances.slice();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    });
  } else {
    init();
  }
})(window, document);
