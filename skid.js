/**
 * Constructs a new Skid instance.
 * @class
 * @param {HTMLElement} container - The element containing all components.
 * @classdesc A slider utilizing Hurdler for URL hash based control.
 * @version 0.1.1
 * @author Jayden Seric
 * @copyright 2015
 * @license MIT
 */
function Skid(container) {
  var self = container.skid = this;
  self.element          = container;
  self.slides           = self.element.query('> .slides');
  self.slideCount       = self.slides.children.length;
  self.activeSlideIndex = 0;
  self.activeSlide      = self.slides.firstElementChild;
  self.priorSlide       = self.slides.lastElementChild;
  self.priorLink        = self.element.query('> nav .prior');
  self.nextSlide        = self.slides.firstElementChild;
  self.nextLink         = self.element.query('> nav .next');
  self.tabs             = self.element.query('> nav ol');
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
        var offset      = self.slides.getBoundingClientRect().left + document.body.scrollLeft,
            width       = self.slides.offsetWidth,
            originalX   = x = self.normalizeEventX(event) - offset,
            originalPan = pan = self.activeSlideIndex * -100;
        function drag(event) {
          x   = self.normalizeEventX(event) - offset;
          pan = originalPan + (x - originalX) / width * 100;
          self.pan(pan);
        }
        document.addEventListener(panEventName, drag);
        document.addEventListener(endEventName, function end(event) {
          // End panning
          document.removeEventListener(endEventName, end);
          document.removeEventListener(panEventName, drag);
          self.element.classList.remove('panning');
          // If any distance was dragged, update active slide
          if (x != originalX) {
            // Flick gesture must be at least 80px long
            if (flick && Math.abs(originalX - x) > 80) self.activateSlide(originalX < x ? self.priorSlide.id : self.nextSlide.id);
            else {
              var closestSlideIndex = Math.round(pan / -100);
              if (closestSlideIndex < 0) closestSlideIndex = 0;
              if (closestSlideIndex > self.slideCount - 1) closestSlideIndex = self.slideCount - 1;
              var closestSlideId = self.slides.children[closestSlideIndex].id;
              // Only update URL hash if slide is new
              if (self.activeSlide == closestSlideIndex) self.activateSlide(closestSlideId);
              else hurdler.setHash(closestSlideId);
            }
          }
        });
      });
    });
  }
  // Enable mouse and touch interaction
  enable('mousedown', 'mousemove', 'mouseup');
  enable('touchstart', 'touchmove', 'touchend');
}

/**
 * Returns a normalized mouse or touch event X coordinate.
 * @method
 * @param {object} event - Event object.
 */
Skid.prototype.normalizeEventX = function(event) {
  return event.type == 'touchstart' || event.type == 'touchmove' ? event.touches[0].clientX : event.clientX;
};

/**
 * Pans the slides.
 * @method
 * @param {number} position - Positive or negative value as a percentage of a single slide.
 */
Skid.prototype.pan = function(position) {
  var self = this;
  if (self.transform == undefined) {
    // Determine CSS 3D transform property
    self.transform = false;
    var props = {
      'perspective'       : 'transform',
      'webkitPerspective' : 'webkitTransform',
      'OPerspective'      : 'OTransform',
      'msPerspective'     : 'msTransform'
    };
    for (var prop in props) {
      if (props.hasOwnProperty(prop) && prop in document.documentElement.style) {
        self.transform = props[prop];
        break;
      }
    }
  }
  // Hardware accelerated pan
  if (self.transform) self.slides.style[self.transform] = 'translate3d(' + position + '%,0,0)';
  // Fallback pan
  else self.slides.style.marginLeft = position + '%';
};

/**
 * Activates and pans to a slide.
 * @method
 * @param {string} slideId - HTML ID of the slide to activate.
 */
Skid.prototype.activateSlide = function(slideId) {
  var self  = this;
  // Update active slide
  self.activeSlide.classList.remove('active');
  self.activeSlide = document.getElementById(slideId);
  self.activeSlideIndex = Array.prototype.slice.call(self.slides.children).indexOf(self.activeSlide);
  self.activeSlide.classList.add('active');
  // Pan slider to active slide
  self.pan(self.activeSlideIndex * -100);
  // Update prior slide and link
  self.priorSlide = self.activeSlide.previousElementSibling || self.slides.lastElementChild;
  if (self.priorLink) self.priorLink.href = '#' + self.priorSlide.id;
  // Update next slide and link
  self.nextSlide = self.activeSlide.nextElementSibling || self.slides.firstElementChild;
  if (self.nextLink) self.nextLink.href = '#' + self.nextSlide.id;
  // Update tabs
  if (self.tabs) {
    self.tabs.query('.active').classList.remove('active');
    self.tabs.query('[href^="#' + slideId + '"]').classList.add('active');
  }
};
