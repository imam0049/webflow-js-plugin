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
    var parsed = parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  function getOptions(root) {
    return {
      defaultIndex: toNumber(root.getAttribute("data-accordion-default"), DEFAULTS.defaultIndex),
      alwaysOpen: toBoolean(root.getAttribute("data-accordion-always-open"), DEFAULTS.alwaysOpen),
      single: toBoolean(root.getAttribute("data-accordion-single"), DEFAULTS.single),
      duration: DEFAULTS.duration
    };
  }

  function Accordion(root) {
    this.root = root;
    this.items = Array.prototype.slice.call(root.querySelectorAll(SELECTORS.item));
    this.options = getOptions(root);

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  Accordion.prototype.init = function () {
    if (!this.root || this.items.length === 0 || this.root.WebflowAccordionInstance) {
      return;
    }

    this.root.WebflowAccordionInstance = this;
    this.setupItems();
    this.bindEvents();
    this.openDefaultItem();
  };

  Accordion.prototype.setupItems = function () {
    this.items.forEach(function (item, index) {
      var trigger = item.querySelector(SELECTORS.trigger);
      var content = item.querySelector(SELECTORS.content);

      if (!trigger || !content) return;

      if (!trigger.hasAttribute("role") && trigger.tagName.toLowerCase() !== "button") {
        trigger.setAttribute("role", "button");
      }

      if (!trigger.hasAttribute("tabindex") && trigger.tagName.toLowerCase() !== "button") {
        trigger.setAttribute("tabindex", "0");
      }

      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("data-accordion-index", String(index));
      content.setAttribute("aria-hidden", "true");
      content.style.overflow = "hidden";
      content.style.height = "0px";
      content.style.transition = "height " + this.options.duration + "ms ease";

      item.classList.remove("is-open", "is-active");
      this.updateIcon(item, false);
    }, this);
  };

  Accordion.prototype.bindEvents = function () {
    this.root.addEventListener("click", this.onClick);
    this.root.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("resize", this.onResize);
  };

  Accordion.prototype.openDefaultItem = function () {
    var defaultIndex = Math.min(this.options.defaultIndex, this.items.length - 1);

    if (defaultIndex < 0) defaultIndex = 0;
    this.openItem(this.items[defaultIndex], false);
  };

  Accordion.prototype.onClick = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;

    event.preventDefault();
    this.toggleItem(trigger.closest(SELECTORS.item));
  };

  Accordion.prototype.onKeyDown = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggleItem(trigger.closest(SELECTORS.item));
    }
  };

  Accordion.prototype.onResize = function () {
    this.items.forEach(function (item) {
      var content = item.querySelector(SELECTORS.content);

      if (item.classList.contains("is-open") && content) {
        content.style.height = "auto";
      }
    });
  };

  Accordion.prototype.toggleItem = function (item) {
    if (!item) return;

    if (item.classList.contains("is-open")) {
      if (this.options.alwaysOpen && this.getOpenItems().length <= 1) {
        return;
      }

      this.closeItem(item);
      return;
    }

    this.openItem(item, true);
  };

  Accordion.prototype.openItem = function (item, closeSiblings) {
    var content;
    var trigger;

    if (!item) return;

    if (this.options.single && closeSiblings) {
      this.items.forEach(function (otherItem) {
        if (otherItem !== item) {
          this.closeItem(otherItem);
        }
      }, this);
    }

    content = item.querySelector(SELECTORS.content);
    trigger = item.querySelector(SELECTORS.trigger);

    if (!content || !trigger) return;

    item.classList.add("is-open", "is-active");
    trigger.setAttribute("aria-expanded", "true");
    content.setAttribute("aria-hidden", "false");
    this.updateIcon(item, true);

    // Measure once, then animate height. Setting auto after the transition
    // lets the content respond to text wrapping and breakpoint changes.
    content.style.height = content.scrollHeight + "px";

    window.setTimeout(function () {
      if (item.classList.contains("is-open")) {
        content.style.height = "auto";
      }
    }, this.options.duration);
  };

  Accordion.prototype.closeItem = function (item) {
    var content = item ? item.querySelector(SELECTORS.content) : null;
    var trigger = item ? item.querySelector(SELECTORS.trigger) : null;

    if (!item || !content || !trigger || !item.classList.contains("is-open")) return;

    content.style.height = content.scrollHeight + "px";

    // Force the browser to register the current height before animating to 0.
    content.offsetHeight;
    content.style.height = "0px";

    item.classList.remove("is-open", "is-active");
    trigger.setAttribute("aria-expanded", "false");
    content.setAttribute("aria-hidden", "true");
    this.updateIcon(item, false);
  };

  Accordion.prototype.getOpenItems = function () {
    return this.items.filter(function (item) {
      return item.classList.contains("is-open");
    });
  };

  Accordion.prototype.updateIcon = function (item, isOpen) {
    var icon = item.querySelector(SELECTORS.icon);

    if (!icon) return;

    icon.classList.toggle("ph-plus", !isOpen);
    icon.classList.toggle("ph-minus", isOpen);

    if (!icon.classList.contains("ph")) {
      icon.classList.add("ph");
    }
  };

  Accordion.prototype.destroy = function () {
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

      if (root.WebflowAccordionInstance) {
        instances.push(accordion);
      }
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
