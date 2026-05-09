/*!
 * WebflowMilestoneSlider - Company History Slider
 * Lightweight vanilla JavaScript horizontal slider for Webflow.
 */
(function (window, document) {
  "use strict";

  var SELECTORS = {
    root: "[data-milestone-slider]",
    track: "[data-milestone-track]",
    item: "[data-milestone-item]",
    prev: "[data-milestone-prev]",
    next: "[data-milestone-next]",
    indicators: "[data-milestone-indicators]",
    indicator: "[data-milestone-indicator]"
  };

  var DEFAULTS = {
    start: 0,
    loop: false,
    duration: 500,
    swipeThreshold: 45
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
      start: toNumber(root.getAttribute("data-milestone-start"), DEFAULTS.start),
      loop: toBoolean(root.getAttribute("data-milestone-loop"), DEFAULTS.loop),
      duration: Math.max(0, toNumber(root.getAttribute("data-milestone-duration"), DEFAULTS.duration)),
      swipeThreshold: DEFAULTS.swipeThreshold
    };
  }

  function MilestoneSlider(root) {
    this.root = root;
    this.track = root.querySelector(SELECTORS.track);
    this.items = this.track ? Array.prototype.slice.call(this.track.querySelectorAll(SELECTORS.item)) : [];
    this.prevButton = root.querySelector(SELECTORS.prev);
    this.nextButton = root.querySelector(SELECTORS.next);
    this.indicatorWrap = root.querySelector(SELECTORS.indicators);
    this.indicators = [];
    this.options = getOptions(root);
    this.currentIndex = 0;
    this.pointerStartX = 0;
    this.pointerDeltaX = 0;
    this.isDragging = false;

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  MilestoneSlider.prototype.init = function () {
    if (!this.root || !this.track || this.items.length === 0 || this.root.WebflowMilestoneSliderInstance) return;

    this.root.WebflowMilestoneSliderInstance = this;
    this.root.setAttribute("tabindex", this.root.getAttribute("tabindex") || "0");

    this.setupLayout();
    this.createIndicators();
    this.bindEvents();
    this.goTo(Math.min(this.options.start, this.items.length - 1), false);
  };

  MilestoneSlider.prototype.setupLayout = function () {
    this.root.style.overflow = this.root.style.overflow || "hidden";
    this.track.style.display = "flex";
    this.track.style.flexWrap = "nowrap";
    this.track.style.willChange = "transform";
    this.track.style.transition = "transform " + this.options.duration + "ms ease";
    this.track.style.touchAction = "pan-y";

    this.items.forEach(function (item) {
      item.style.flex = "0 0 100%";
      item.style.maxWidth = "100%";
    });
  };

  MilestoneSlider.prototype.createIndicators = function () {
    var fragment;

    if (!this.indicatorWrap) return;

    this.indicatorWrap.innerHTML = "";
    fragment = document.createDocumentFragment();

    this.items.forEach(function (_, index) {
      var indicator = document.createElement("button");
      indicator.type = "button";
      indicator.className = "indicator-item";
      indicator.setAttribute("data-milestone-indicator", String(index));
      indicator.setAttribute("aria-label", "Go to milestone " + (index + 1));
      fragment.appendChild(indicator);
    });

    this.indicatorWrap.appendChild(fragment);
    this.indicators = Array.prototype.slice.call(this.indicatorWrap.querySelectorAll(SELECTORS.indicator));
  };

  MilestoneSlider.prototype.bindEvents = function () {
    this.root.addEventListener("click", this.onClick);
    this.root.addEventListener("keydown", this.onKeyDown);
    this.track.addEventListener("pointerdown", this.onPointerDown);
    this.track.addEventListener("pointermove", this.onPointerMove);
    this.track.addEventListener("pointerup", this.onPointerUp);
    this.track.addEventListener("pointercancel", this.onPointerUp);
    window.addEventListener("resize", this.onResize);
  };

  MilestoneSlider.prototype.onClick = function (event) {
    var indicator = event.target.closest(SELECTORS.indicator);

    if (event.target.closest(SELECTORS.prev)) {
      event.preventDefault();
      this.prev();
      return;
    }

    if (event.target.closest(SELECTORS.next)) {
      event.preventDefault();
      this.next();
      return;
    }

    if (indicator && this.root.contains(indicator)) {
      event.preventDefault();
      this.goTo(toNumber(indicator.getAttribute("data-milestone-indicator"), 0), true);
    }
  };

  MilestoneSlider.prototype.onKeyDown = function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.prev();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.next();
    }
  };

  MilestoneSlider.prototype.onPointerDown = function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    this.isDragging = true;
    this.pointerStartX = event.clientX;
    this.pointerDeltaX = 0;
  };

  MilestoneSlider.prototype.onPointerMove = function (event) {
    if (!this.isDragging) return;
    this.pointerDeltaX = event.clientX - this.pointerStartX;
  };

  MilestoneSlider.prototype.onPointerUp = function () {
    if (!this.isDragging) return;

    if (Math.abs(this.pointerDeltaX) >= this.options.swipeThreshold) {
      if (this.pointerDeltaX < 0) {
        this.next();
      } else {
        this.prev();
      }
    }

    this.isDragging = false;
    this.pointerStartX = 0;
    this.pointerDeltaX = 0;
  };

  MilestoneSlider.prototype.onResize = function () {
    this.update();
  };

  MilestoneSlider.prototype.prev = function () {
    this.goTo(this.currentIndex - 1, true);
  };

  MilestoneSlider.prototype.next = function () {
    this.goTo(this.currentIndex + 1, true);
  };

  MilestoneSlider.prototype.goTo = function (index, userInitiated) {
    var lastIndex = this.items.length - 1;
    var nextIndex = index;

    if (this.options.loop) {
      if (nextIndex < 0) nextIndex = lastIndex;
      if (nextIndex > lastIndex) nextIndex = 0;
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, lastIndex));
    }

    this.currentIndex = nextIndex;
    this.update(userInitiated);
  };

  MilestoneSlider.prototype.update = function () {
    var offset = this.currentIndex * -100;

    this.track.style.transform = "translateX(" + offset + "%)";

    this.items.forEach(function (item, index) {
      item.classList.toggle("is-active", index === this.currentIndex);
    }, this);

    this.indicators.forEach(function (indicator, index) {
      var isActive = index === this.currentIndex;
      indicator.classList.toggle("indi-active", isActive);
      indicator.classList.toggle("is-active", isActive);
      indicator.setAttribute("aria-current", isActive ? "true" : "false");
    }, this);

    this.updateControls();
  };

  MilestoneSlider.prototype.updateControls = function () {
    var atStart = this.currentIndex === 0;
    var atEnd = this.currentIndex === this.items.length - 1;
    var disablePrev = !this.options.loop && atStart;
    var disableNext = !this.options.loop && atEnd;

    if (this.prevButton) {
      this.prevButton.classList.toggle("is-disabled", disablePrev);
      this.prevButton.setAttribute("aria-disabled", disablePrev ? "true" : "false");
    }

    if (this.nextButton) {
      this.nextButton.classList.toggle("is-disabled", disableNext);
      this.nextButton.setAttribute("aria-disabled", disableNext ? "true" : "false");
    }
  };

  MilestoneSlider.prototype.destroy = function () {
    this.root.removeEventListener("click", this.onClick);
    this.root.removeEventListener("keydown", this.onKeyDown);
    this.track.removeEventListener("pointerdown", this.onPointerDown);
    this.track.removeEventListener("pointermove", this.onPointerMove);
    this.track.removeEventListener("pointerup", this.onPointerUp);
    this.track.removeEventListener("pointercancel", this.onPointerUp);
    window.removeEventListener("resize", this.onResize);
    delete this.root.WebflowMilestoneSliderInstance;
  };

  function init(context) {
    var scope = context || document;
    var roots = Array.prototype.slice.call(scope.querySelectorAll(SELECTORS.root));

    roots.forEach(function (root) {
      var slider;

      if (root.WebflowMilestoneSliderInstance) return;

      slider = new MilestoneSlider(root);
      slider.init();

      if (root.WebflowMilestoneSliderInstance) instances.push(slider);
    });

    return instances;
  }

  function destroy() {
    instances.forEach(function (instance) {
      instance.destroy();
    });
    instances = [];
  }

  window.WebflowMilestoneSlider = {
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
