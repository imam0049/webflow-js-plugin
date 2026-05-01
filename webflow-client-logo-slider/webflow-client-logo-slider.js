/*!
 * WebflowLogoSlider - Client Logo Marquee
 * Lightweight vanilla JavaScript marquee slider for Webflow.
 */
(function (window, document) {
  "use strict";

  var SELECTORS = {
    root: "[data-logo-slider]",
    track: "[data-logo-track]",
    item: "[data-logo-item]"
  };

  var DEFAULTS = {
    speed: 1,
    direction: "left",
    pauseHover: true,
    gap: 40,
    duplicate: true
  };

  var instances = [];

  function toBoolean(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return value === "true" || value === true;
  }

  function toNumber(value, fallback) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getOptions(root) {
    var direction = root.getAttribute("data-logo-direction") || DEFAULTS.direction;

    return {
      speed: Math.max(0, toNumber(root.getAttribute("data-logo-speed"), DEFAULTS.speed)),
      direction: direction === "right" ? "right" : "left",
      pauseHover: toBoolean(root.getAttribute("data-logo-pause-hover"), DEFAULTS.pauseHover),
      gap: Math.max(0, toNumber(root.getAttribute("data-logo-gap"), DEFAULTS.gap)),
      duplicate: toBoolean(root.getAttribute("data-logo-duplicate"), DEFAULTS.duplicate)
    };
  }

  function LogoSlider(root) {
    this.root = root;
    this.track = root.querySelector(SELECTORS.track);
    this.options = getOptions(root);
    this.originalItems = [];
    this.clones = [];
    this.position = 0;
    this.loopWidth = 0;
    this.rafId = null;
    this.lastTime = 0;
    this.isPaused = false;
    this.resizeTimer = null;

    this.animate = this.animate.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  LogoSlider.prototype.init = function () {
    if (!this.root || !this.track || this.root.WebflowLogoSliderInstance) return;

    this.root.WebflowLogoSliderInstance = this;
    this.originalItems = Array.prototype.slice.call(this.track.querySelectorAll(SELECTORS.item))
      .filter(function (item) {
        return item.getAttribute("data-logo-clone") !== "true";
      });

    if (this.originalItems.length === 0) return;

    this.setupLayout();
    this.rebuild();
    this.bindEvents();
    this.play();
  };

  LogoSlider.prototype.setupLayout = function () {
    this.root.style.overflow = "hidden";
    this.root.style.width = this.root.style.width || "100%";

    this.track.style.display = "flex";
    this.track.style.flexWrap = "nowrap";
    this.track.style.alignItems = "center";
    this.track.style.gap = this.options.gap + "px";
    this.track.style.willChange = "transform";

    this.originalItems.forEach(function (item) {
      item.style.flex = "0 0 auto";
    });
  };

  LogoSlider.prototype.bindEvents = function () {
    if (this.options.pauseHover) {
      this.root.addEventListener("mouseenter", this.pause);
      this.root.addEventListener("mouseleave", this.resume);
      this.root.addEventListener("focusin", this.pause);
      this.root.addEventListener("focusout", this.resume);
    }

    window.addEventListener("resize", this.onResize);
  };

  LogoSlider.prototype.rebuild = function () {
    this.stop();
    this.removeClones();
    this.track.style.transform = "translateX(0px)";
    this.position = 0;

    if (this.options.duplicate) {
      this.createClones();
    }

    this.loopWidth = this.measureOriginalWidth();

    if (this.options.direction === "right" && this.loopWidth > 0) {
      this.position = -this.loopWidth;
      this.track.style.transform = "translateX(" + this.position + "px)";
    }

    this.play();
  };

  LogoSlider.prototype.createClones = function () {
    var rootWidth = this.root.getBoundingClientRect().width;
    var originalWidth = this.measureOriginalWidth();
    var targetWidth = Math.max(rootWidth * 2, originalWidth * 2);
    var createdWidth = originalWidth;

    // Keep adding full sets until the moving rail is wide enough to loop
    // without showing empty space on large screens.
    while (createdWidth < targetWidth && originalWidth > 0) {
      this.originalItems.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute("data-logo-clone", "true");
        clone.setAttribute("aria-hidden", "true");
        clone.style.flex = "0 0 auto";
        this.track.appendChild(clone);
        this.clones.push(clone);
      }, this);

      createdWidth += originalWidth;
    }
  };

  LogoSlider.prototype.measureOriginalWidth = function () {
    var total = 0;

    this.originalItems.forEach(function (item, index) {
      total += item.getBoundingClientRect().width;

      if (index < this.originalItems.length - 1) {
        total += this.options.gap;
      }
    }, this);

    return total + this.options.gap;
  };

  LogoSlider.prototype.removeClones = function () {
    this.clones.forEach(function (clone) {
      if (clone.parentNode) clone.parentNode.removeChild(clone);
    });

    this.clones = [];
  };

  LogoSlider.prototype.play = function () {
    if (this.rafId || this.loopWidth <= 0 || this.options.speed <= 0) return;

    this.root.classList.add("is-running");
    this.root.classList.remove("is-paused");
    this.lastTime = 0;
    this.rafId = window.requestAnimationFrame(this.animate);
  };

  LogoSlider.prototype.stop = function () {
    if (!this.rafId) return;

    window.cancelAnimationFrame(this.rafId);
    this.rafId = null;
  };

  LogoSlider.prototype.pause = function () {
    this.isPaused = true;
    this.root.classList.add("is-paused");
    this.root.classList.remove("is-running");
  };

  LogoSlider.prototype.resume = function () {
    this.isPaused = false;
    this.root.classList.add("is-running");
    this.root.classList.remove("is-paused");
  };

  LogoSlider.prototype.animate = function (timestamp) {
    var elapsed;
    var distance;

    if (!this.lastTime) this.lastTime = timestamp;
    elapsed = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (!this.isPaused && this.loopWidth > 0) {
      distance = this.options.speed * (elapsed / 16.67);

      if (this.options.direction === "right") {
        this.position += distance;
        if (this.position >= 0) this.position -= this.loopWidth;
      } else {
        this.position -= distance;
        if (Math.abs(this.position) >= this.loopWidth) this.position += this.loopWidth;
      }

      this.track.style.transform = "translateX(" + this.position + "px)";
    }

    this.rafId = window.requestAnimationFrame(this.animate);
  };

  LogoSlider.prototype.onResize = function () {
    if (this.resizeTimer) window.clearTimeout(this.resizeTimer);

    this.resizeTimer = window.setTimeout(function () {
      this.rebuild();
    }.bind(this), 150);
  };

  LogoSlider.prototype.destroy = function () {
    this.stop();
    if (this.resizeTimer) window.clearTimeout(this.resizeTimer);

    this.removeClones();
    this.track.style.transform = "";
    this.track.style.willChange = "";

    this.root.classList.remove("is-running", "is-paused");
    this.root.removeEventListener("mouseenter", this.pause);
    this.root.removeEventListener("mouseleave", this.resume);
    this.root.removeEventListener("focusin", this.pause);
    this.root.removeEventListener("focusout", this.resume);
    window.removeEventListener("resize", this.onResize);
    delete this.root.WebflowLogoSliderInstance;
  };

  function init(context) {
    var scope = context || document;
    var roots = Array.prototype.slice.call(scope.querySelectorAll(SELECTORS.root));

    roots.forEach(function (root) {
      var slider;

      if (root.WebflowLogoSliderInstance) return;

      slider = new LogoSlider(root);
      slider.init();

      if (root.WebflowLogoSliderInstance) instances.push(slider);
    });

    return instances;
  }

  function destroy() {
    instances.forEach(function (instance) {
      instance.destroy();
    });
    instances = [];
  }

  window.WebflowLogoSlider = {
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
