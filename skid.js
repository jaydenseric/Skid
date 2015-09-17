/**
 * A slider utilizing Hurdler for URL hash based control.
 * @namespace Skid
 * @see https://github.com/jaydenseric/Skid
 * @version 1.1.2
 * @author Jayden Seric
 * @license MIT
 */
var Skid = Skid || {};

/**
 * @property {(string|boolean)} transform - The CSS transform property for the slider to use, or false indicating no CSS 3D support.
 */
Skid.transform = (function() {
  var props = {
    'perspective'       : 'transform',
    'webkitPerspective' : 'webkitTransform',
    'OPerspective'      : 'OTransform',
    'msPerspective'     : 'msTransform'
  };
  for (var prop in props) {
    if (props.hasOwnProperty(prop) && prop in document.documentElement.style) return props[prop];
  }
  return false;
})();

/**
 * Returns a normalized mouse or touch event X coordinate.
 * @param {object} event - Event object.
 * @returns {number} The event X coordinate.
 */
Skid.normalizeEventX = function(event) {
  return event.type == 'touchstart' || event.type == 'touchmove' ? event.touches[0].clientX : event.clientX;
};

/**
 * Constructs a new Skid slider instance.
 * @param {HTMLElement} element - The element containing all components.
 */
Skid.Slider = function(element) {
  var self = element.slider = this;
  self.element          = element;
  self.slides           = self.element.query('> .slides');
  self.slideCount       = self.slides.children.length;
  self.activeSlideIndex = 0;
  self.activeSlide      = self.slides.firstElementChild;
  self.priorSlide       = self.slides.lastElementChild;
  self.priorLink        = self.element.query('> nav .prior');
  self.nextSlide        = self.slides.firstElementChild;
  self.nextLink         = self.element.query('> nav .next');
  self.tabs             = self.element.query('> nav ol');
  // Prevent dragging images from disrupting dragging slides
  self.element.queryAll('img').forEach(function(image) {
    image.addEventListener('dragstart', function(event) { event.preventDefault() });
  });
  // Enables interactions
  function enable(startEventName, panEventName, endEventName) {
    Array.prototype.forEach.call(self.slides.children, function(slide) {
      slide.addEventListener(startEventName, function(event) {
        // Only accept left click for mouse event
        if (startEventName == 'mousedown' && event.which != 1) return;
        // Track flick gesture
        var flick = true;
        setTimeout(function() {
          flick = false;
        }, 250);
        // Begin panning
        self.element.classList.add('panning');
        var offset       = self.slides.getBoundingClientRect().left + document.body.scrollLeft,
            width        = self.slides.offsetWidth,
            originalX    = x = Skid.normalizeEventX(event) - offset,
            originalPan  = panPosition = self.activeSlideIndex * -100,
            scheduledPan = false;
        function pan(event) {
          if (!scheduledPan) scheduledPan = requestAnimationFrame(function() {
            x           = Skid.normalizeEventX(event) - offset;
            panPosition = originalPan + (x - originalX) / width * 100;
            self.pan(panPosition);
            scheduledPan = false;
          });
        }
        document.addEventListener(panEventName, pan);
        document.addEventListener(endEventName, function end(event) {
          // End panning
          document.removeEventListener(endEventName, end);
          document.removeEventListener(panEventName, pan);
          window.cancelAnimationFrame(scheduledPan);
          self.element.classList.remove('panning');
          // If any distance was dragged, update active slide
          if (x != originalX) {
            // Flick gesture must be at least 80px long
            if (flick && Math.abs(originalX - x) > 80) Hurdler.setHash(originalX < x ? self.priorSlide.id : self.nextSlide.id);
            else {
              // Determine the closest slide to activate and pan to
              var closestSlideIndex = Math.round(panPosition / -100);
              if (closestSlideIndex < 0) closestSlideIndex = 0;
              if (closestSlideIndex > self.slideCount - 1) closestSlideIndex = self.slideCount - 1;
              var closestSlideId = self.slides.children[closestSlideIndex].id;
              // Only update URL hash if slide is not already active
              if (closestSlideId == Hurdler.getTargetId()) self.activateSlide(closestSlideId);
              else Hurdler.setHash(closestSlideId);
            }
          }
        });
      });
    });
  }
  // Enable mouse and touch interaction
  enable('mousedown', 'mousemove', 'mouseup');
  enable('touchstart', 'touchmove', 'touchend');
};

/**
 * Pans the slider.
 * @param {number} position - Positive or negative value as a percentage of a single slide.
 */
Skid.Slider.prototype.pan = function(position) {
  // Hardware accelerated pan
  if (Skid.transform) this.slides.style[Skid.transform] = 'translate3d(' + position + '%,0,0)';
  // Fallback pan
  else this.slides.style.marginLeft = position + '%';
};

/**
 * Activates a slide and pans the slider to it.
 * @param {string} id - Element ID of the slide to activate.
 */
Skid.Slider.prototype.activateSlide = function(id) {
  var self  = this;
  // Update active slide
  self.activeSlide.classList.remove('active');
  self.activeSlide = document.getElementById(id);
  self.activeSlideIndex = Array.prototype.slice.call(self.slides.children).indexOf(self.activeSlide);
  self.activeSlide.classList.add('active');
  // Pan slider to active slide
  self.pan(self.activeSlideIndex * -100);
  // Update prior slide and link
  self.priorSlide = self.activeSlide.previousElementSibling || self.slides.lastElementChild;
  if (self.priorLink) self.priorLink.href = '#' + Hurdler.hashPrefix + self.priorSlide.id;
  // Update next slide and link
  self.nextSlide = self.activeSlide.nextElementSibling || self.slides.firstElementChild;
  if (self.nextLink) self.nextLink.href = '#' + Hurdler.hashPrefix + self.nextSlide.id;
  // Update tabs
  if (self.tabs) {
    self.tabs.query('.active').classList.remove('active');
    self.tabs.query('[href^="#' + Hurdler.hashPrefix + id + '"]').classList.add('active');
  }
};
