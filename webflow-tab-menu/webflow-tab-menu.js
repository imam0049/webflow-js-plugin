/*!
 * WebflowTabMenu - Hover/Click Tabs
 * Lightweight vanilla JavaScript tab plugin for Webflow.
 */
(function (window, document) {
  "use strict";

  var SELECTORS = {
    root: "[data-tab-menu]",
    trigger: "[data-tab-trigger]",
    panel: "[data-tab-panel]"
  };

  var DEFAULTS = {
    start: 0,
    hover: true,
    click: true,
    activeClass: "active",
    stateClass: "is-active",
    managePanels: true
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
      start: toNumber(root.getAttribute("data-tab-default"), DEFAULTS.start),
      hover: toBoolean(root.getAttribute("data-tab-hover"), DEFAULTS.hover),
      click: toBoolean(root.getAttribute("data-tab-click"), DEFAULTS.click),
      activeClass: root.getAttribute("data-tab-active-class") || DEFAULTS.activeClass,
      stateClass: root.getAttribute("data-tab-state-class") || DEFAULTS.stateClass,
      managePanels: toBoolean(root.getAttribute("data-tab-manage-panels"), DEFAULTS.managePanels)
    };
  }

  function TabMenu(root) {
    this.root = root;
    this.triggers = Array.prototype.slice.call(root.querySelectorAll(SELECTORS.trigger));
    this.panels = Array.prototype.slice.call(root.querySelectorAll(SELECTORS.panel));
    this.options = getOptions(root);
    this.currentIndex = 0;

    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  TabMenu.prototype.init = function () {
    if (!this.root || this.triggers.length === 0 || this.panels.length === 0 || this.root.WebflowTabMenuInstance) {
      return;
    }

    this.root.WebflowTabMenuInstance = this;
    this.setupA11y();
    this.bindEvents();
    this.activate(Math.min(this.options.start, this.triggers.length - 1), false);
  };

  TabMenu.prototype.setupA11y = function () {
    this.triggers.forEach(function (trigger, index) {
      if (!trigger.hasAttribute("role")) trigger.setAttribute("role", "tab");
      if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", index === this.options.start ? "0" : "-1");
      trigger.setAttribute("aria-selected", "false");
      trigger.setAttribute("data-tab-index", String(index));

      if (trigger.tagName.toLowerCase() === "a" && !trigger.getAttribute("href")) {
        trigger.setAttribute("href", "#");
      }
    }, this);

    this.panels.forEach(function (panel, index) {
      if (!panel.hasAttribute("role")) panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-hidden", "true");
      panel.setAttribute("data-tab-index", String(index));
    });
  };

  TabMenu.prototype.bindEvents = function () {
    if (this.options.click) {
      this.root.addEventListener("click", this.onClick);
    }

    if (this.options.hover) {
      this.root.addEventListener("mouseover", this.onMouseOver);
      this.root.addEventListener("focusin", this.onFocusIn);
    }

    this.root.addEventListener("keydown", this.onKeyDown);
  };

  TabMenu.prototype.onClick = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;

    if (trigger.tagName.toLowerCase() === "a") {
      event.preventDefault();
    }

    this.activate(this.getTriggerIndex(trigger), true);
  };

  TabMenu.prototype.onMouseOver = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;
    this.activate(this.getTriggerIndex(trigger), true);
  };

  TabMenu.prototype.onFocusIn = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);

    if (!trigger || !this.root.contains(trigger)) return;
    this.activate(this.getTriggerIndex(trigger), true);
  };

  TabMenu.prototype.onKeyDown = function (event) {
    var trigger = event.target.closest(SELECTORS.trigger);
    var index;

    if (!trigger || !this.root.contains(trigger)) return;

    index = this.getTriggerIndex(trigger);

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      this.focusAndActivate(index + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      this.focusAndActivate(index - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      this.focusAndActivate(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      this.focusAndActivate(this.triggers.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.activate(index, true);
    }
  };

  TabMenu.prototype.focusAndActivate = function (index) {
    var nextIndex = index;

    if (nextIndex < 0) nextIndex = this.triggers.length - 1;
    if (nextIndex > this.triggers.length - 1) nextIndex = 0;

    this.triggers[nextIndex].focus();
    this.activate(nextIndex, true);
  };

  TabMenu.prototype.getTriggerIndex = function (trigger) {
    return toNumber(trigger.getAttribute("data-tab-index"), this.triggers.indexOf(trigger));
  };

  TabMenu.prototype.activate = function (index) {
    var nextIndex = Math.max(0, Math.min(index, Math.min(this.triggers.length, this.panels.length) - 1));

    if (nextIndex === this.currentIndex && this.triggers[nextIndex].classList.contains(this.options.stateClass)) {
      return;
    }

    this.currentIndex = nextIndex;

    this.triggers.forEach(function (trigger, triggerIndex) {
      var isActive = triggerIndex === nextIndex;
      trigger.classList.toggle(this.options.activeClass, isActive);
      trigger.classList.toggle(this.options.stateClass, isActive);
      trigger.setAttribute("aria-selected", isActive ? "true" : "false");
      trigger.setAttribute("tabindex", isActive ? "0" : "-1");
    }, this);

    this.panels.forEach(function (panel, panelIndex) {
      var isActive = panelIndex === nextIndex;
      panel.classList.toggle(this.options.activeClass, isActive);
      panel.classList.toggle(this.options.stateClass, isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");

      if (this.options.managePanels) {
        panel.style.visibility = isActive ? "inherit" : "hidden";
        panel.style.pointerEvents = isActive ? "auto" : "none";
        panel.style.opacity = isActive ? "1" : "0";
      }
    }, this);
  };

  TabMenu.prototype.destroy = function () {
    this.root.removeEventListener("click", this.onClick);
    this.root.removeEventListener("mouseover", this.onMouseOver);
    this.root.removeEventListener("focusin", this.onFocusIn);
    this.root.removeEventListener("keydown", this.onKeyDown);
    delete this.root.WebflowTabMenuInstance;
  };

  function init(context) {
    var scope = context || document;
    var roots = Array.prototype.slice.call(scope.querySelectorAll(SELECTORS.root));

    roots.forEach(function (root) {
      var tabMenu;

      if (root.WebflowTabMenuInstance) return;

      tabMenu = new TabMenu(root);
      tabMenu.init();

      if (root.WebflowTabMenuInstance) instances.push(tabMenu);
    });

    return instances;
  }

  function destroy() {
    instances.forEach(function (instance) {
      instance.destroy();
    });
    instances = [];
  }

  window.WebflowTabMenu = {
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
