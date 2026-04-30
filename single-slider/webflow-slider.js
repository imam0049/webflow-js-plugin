/*!
 * WebflowSlider - Our Work Slider
 * Lightweight vanilla JavaScript slider for Webflow.
 */
(function (window, document) {
  "use strict";

  var SELECTORS = {
    root: '[data-slider="our-work"]',
    track: "[data-slider-track]",
    rail: "[data-slider-rail]",
    item: "[data-slider-item]",
    prev: "[data-slider-prev]",
    next: "[data-slider-next]",
    dots: "[data-slider-dots]",
    dot: "[data-slider-dot]"
  };

  var DEFAULTS = {
    autoplay: false,
    delay: 5000,
    loop: true,
    pauseOnHover: true,
    swipeThreshold: 45
  };

  var instances = [];

  function toBoolean(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return value === "true" || value === true;
  }

  function toNumber(value, fallback) {
    var parsed = parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function getOptions(root) {
    return {
      autoplay: toBoolean(root.getAttribute("data-autoplay"), DEFAULTS.autoplay),
      delay: toNumber(root.getAttribute("data-delay"), DEFAULTS.delay),
      loop: toBoolean(root.getAttribute("data-loop"), DEFAULTS.loop),
      pauseOnHover: toBoolean(root.getAttribute("data-pause-on-hover"), DEFAULTS.pauseOnHover),
      swipeThreshold: DEFAULTS.swipeThreshold
    };
  }

  function Slider(root) {
    this.root = root;
    this.track = root.querySelector(SELECTORS.track);
    this.rail = this.track ? this.track.querySelector(SELECTORS.rail) : null;
    this.slides = this.track ? Array.prototype.slice.call(this.track.querySelectorAll(SELECTORS.item)) : [];
    this.prevButton = root.querySelector(SELECTORS.prev);
    this.nextButton = root.querySelector(SELECTORS.next);
    this.dotsWrapper = root.querySelector(SELECTORS.dots);
    this.options = getOptions(root);
    this.currentIndex = 0;
    this.dots = [];
    this.autoplayTimer = null;
    this.isPaused = false;
    this.pointerStartX = 0;
    this.pointerDeltaX = 0;
    this.isDragging = false;

    this.onControlClick = this.onControlClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
  }

  Slider.prototype.init = function () {
    if (!this.root || !this.track || this.slides.length === 0 || this.root.WebflowSliderInstance) {
      return;
    }

    this.root.WebflowSliderInstance = this;
    this.root.setAttribute("tabindex", this.root.getAttribute("tabindex") || "0");
    this.setupRail();
    this.setupLayout();
    this.createDots();
    this.bindEvents();
    this.goTo(0, false);
    this.startAutoplay();
  };

  Slider.prototype.setupRail = function () {
    if (this.rail) {
      this.slides = Array.prototype.slice.call(this.rail.querySelectorAll(SELECTORS.item));
      return;
    }

    this.rail = document.createElement("div");
    this.rail.setAttribute("data-slider-rail", "");

    // The track is the clipped viewport. The generated rail is the moving strip.
    this.slides.forEach(function (slide) {
      this.rail.appendChild(slide);
    }, this);

    this.track.appendChild(this.rail);
  };

  Slider.prototype.setupLayout = function () {
    this.track.style.overflow = "hidden";
    this.track.style.touchAction = "pan-y";

    this.rail.style.display = "flex";
    this.rail.style.width = "100%";
    this.rail.style.willChange = "transform";
    this.rail.style.transition = "transform 500ms ease";

    this.slides.forEach(function (slide) {
      slide.style.flex = "0 0 100%";
      slide.style.maxWidth = "100%";
    });
  };

  Slider.prototype.createDots = function () {
    var fragment;

    if (!this.dotsWrapper) return;

    this.dotsWrapper.innerHTML = "";
    fragment = document.createDocumentFragment();

    this.slides.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.type = "button";
      dot.setAttribute("data-slider-dot", String(index));
      dot.setAttribute("aria-label", "Go to slide " + (index + 1));
      fragment.appendChild(dot);
    });

    this.dotsWrapper.appendChild(fragment);
    this.dots = Array.prototype.slice.call(this.dotsWrapper.querySelectorAll(SELECTORS.dot));
  };

  Slider.prototype.bindEvents = function () {
    this.root.addEventListener("click", this.onControlClick);
    this.root.addEventListener("keydown", this.onKeyDown);
    this.track.addEventListener("pointerdown", this.onPointerDown);
    this.track.addEventListener("pointermove", this.onPointerMove);
    this.track.addEventListener("pointerup", this.onPointerUp);
    this.track.addEventListener("pointercancel", this.onPointerUp);

    if (this.options.pauseOnHover) {
      this.root.addEventListener("mouseenter", this.pause);
      this.root.addEventListener("mouseleave", this.resume);
      this.root.addEventListener("focusin", this.pause);
      this.root.addEventListener("focusout", this.resume);
    }
  };

  Slider.prototype.onControlClick = function (event) {
    var dot = event.target.closest(SELECTORS.dot);

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

    if (dot && this.root.contains(dot)) {
      event.preventDefault();
      this.goTo(toNumber(dot.getAttribute("data-slider-dot"), 0), true);
    }
  };

  Slider.prototype.onKeyDown = function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.prev();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.next();
    }
  };

  Slider.prototype.onPointerDown = function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    this.isDragging = true;
    this.pointerStartX = event.clientX;
    this.pointerDeltaX = 0;
    this.pause();
  };

  Slider.prototype.onPointerMove = function (event) {
    if (!this.isDragging) return;
    this.pointerDeltaX = event.clientX - this.pointerStartX;
  };

  Slider.prototype.onPointerUp = function () {
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
    this.resume();
  };

  Slider.prototype.prev = function () {
    this.goTo(this.currentIndex - 1, true);
  };

  Slider.prototype.next = function () {
    this.goTo(this.currentIndex + 1, true);
  };

  Slider.prototype.goTo = function (index, resetAutoplay) {
    var lastIndex = this.slides.length - 1;
    var nextIndex = index;

    if (this.options.loop) {
      if (nextIndex < 0) nextIndex = lastIndex;
      if (nextIndex > lastIndex) nextIndex = 0;
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, lastIndex));
    }

    this.currentIndex = nextIndex;
    this.update();

    if (resetAutoplay) {
      this.restartAutoplay();
    }
  };

  Slider.prototype.update = function () {
    var offset = this.currentIndex * -100;

    // Only write transform and classes here to avoid repeated layout reads.
    this.rail.style.transform = "translateX(" + offset + "%)";

    this.slides.forEach(function (slide, index) {
      slide.classList.toggle("is-active", index === this.currentIndex);
    }, this);

    this.dots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === this.currentIndex);
      dot.setAttribute("aria-current", index === this.currentIndex ? "true" : "false");
    }, this);

    this.updateButtonState();
  };

  Slider.prototype.updateButtonState = function () {
    var atStart = this.currentIndex === 0;
    var atEnd = this.currentIndex === this.slides.length - 1;
    var disablePrev = !this.options.loop && atStart;
    var disableNext = !this.options.loop && atEnd;

    if (this.prevButton) {
      this.prevButton.classList.toggle("is-disabled", disablePrev);
      this.prevButton.setAttribute("aria-disabled", disablePrev ? "true" : "false");

      if ("disabled" in this.prevButton) {
        this.prevButton.disabled = disablePrev;
      }
    }

    if (this.nextButton) {
      this.nextButton.classList.toggle("is-disabled", disableNext);
      this.nextButton.setAttribute("aria-disabled", disableNext ? "true" : "false");

      if ("disabled" in this.nextButton) {
        this.nextButton.disabled = disableNext;
      }
    }
  };

  Slider.prototype.startAutoplay = function () {
    if (!this.options.autoplay || this.slides.length <= 1 || this.autoplayTimer) return;

    this.autoplayTimer = window.setInterval(function () {
      if (!this.isPaused) {
        this.next();
      }
    }.bind(this), this.options.delay);
  };

  Slider.prototype.stopAutoplay = function () {
    if (!this.autoplayTimer) return;
    window.clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  };

  Slider.prototype.restartAutoplay = function () {
    this.stopAutoplay();
    this.startAutoplay();
  };

  Slider.prototype.pause = function () {
    this.isPaused = true;
  };

  Slider.prototype.resume = function () {
    this.isPaused = false;
  };

  Slider.prototype.destroy = function () {
    this.stopAutoplay();
    this.root.removeEventListener("click", this.onControlClick);
    this.root.removeEventListener("keydown", this.onKeyDown);
    this.track.removeEventListener("pointerdown", this.onPointerDown);
    this.track.removeEventListener("pointermove", this.onPointerMove);
    this.track.removeEventListener("pointerup", this.onPointerUp);
    this.track.removeEventListener("pointercancel", this.onPointerUp);
    this.root.removeEventListener("mouseenter", this.pause);
    this.root.removeEventListener("mouseleave", this.resume);
    this.root.removeEventListener("focusin", this.pause);
    this.root.removeEventListener("focusout", this.resume);
    delete this.root.WebflowSliderInstance;
  };

  function init(context) {
    var scope = context || document;
    var roots = Array.prototype.slice.call(scope.querySelectorAll(SELECTORS.root));

    roots.forEach(function (root) {
      var slider;

      if (root.WebflowSliderInstance) return;

      slider = new Slider(root);
      slider.init();

      if (root.WebflowSliderInstance) {
        instances.push(slider);
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

  window.WebflowSlider = {
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
