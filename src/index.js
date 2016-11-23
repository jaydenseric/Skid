/*!
 * Skid: https://github.com/jaydenseric/Skid
 * @version v4.0.0
 * @author Jayden Seric
 * @license MIT
 */

/**
 * A slider utilizing Hurdler for URL hash based control.
 * @namespace Skid
 */
var Skid = Skid || {}

/**
 * @private
 * @property {string|boolean} transform - The CSS transform property for the slider to use, or false indicating no CSS 3D support.
 */
Skid.transform = (function () {
  var props = {
    'perspective': 'transform',
    'webkitPerspective': 'webkitTransform',
    'OPerspective': 'OTransform',
    'msPerspective': 'msTransform'
  }
  for (var prop in props) {
    if (props.hasOwnProperty(prop) && prop in document.documentElement.style) return props[prop]
  }
  return false
})()

/**
 * Returns a normalized mouse or touch event X coordinate.
 * @private
 * @param {Object} event - Event object.
 * @returns {number} The event X coordinate.
 */
Skid.normalizeEventX = function (event) {
  return event.type === 'touchstart' || event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
}

/**
 * Constructs a new Skid slider instance.
 * @param {Object} options - Initialization options.
 * @param {Hurdler} hurdler - Hurdler instance.
 * @param {HTMLElement} options.element - Container.
 * @param {HTMLElement} [options.slides] - Slides container.
 * @param {HTMLElement|boolean} [options.priorLink] - Prior slide link, or false.
 * @param {HTMLElement|boolean} [options.nextLink] - Next slide link, or false.
 * @param {HTMLElement|boolean} [options.tabs] - Tab links container, or false.
 * @param {string} [options.dragClass='drag'] - Container class name to enable drag and flick.
 * @param {string} [options.draggingClass='dragging'] - Container class name for dragging state.
 */
Skid.Slider = function (options) {
  var self = options.element.slider = this
  // Options
  self.element = options.element
  self.hurdler = options.hurdler
  self.slides = options.slides || self.element.query('> .slides')
  self.priorLink = options.priorLink || self.element.query('> nav .prior')
  self.nextLink = options.nextLink || self.element.query('> nav .next')
  self.tabs = options.tabs || self.element.query('> nav ol')
  self.dragClass = options.dragClass || 'drag'
  self.draggingClass = options.draggingClass || 'dragging'
  // Derived
  self.drag = self.element.classList.contains(self.dragClass)
  self.slideCount = self.slides.children.length
  self.activeSlide = self.slides.query('> .active')
  self.activeSlideIndex = Array.prototype.indexOf.call(self.slides.children, self.activeSlide)
  self.priorSlide = self.getSlideBefore(self.activeSlide)
  self.nextSlide = self.getSlideAfter(self.activeSlide)
  // Pan to initial slide
  self.panToSlide(self.activeSlideIndex, true)
  // Enables drag and flick interactions
  function enable (startEventName, panEventName, endEventName) {
    Array.prototype.forEach.call(self.slides.children, function (slide) {
      slide.addEventListener(startEventName, function (event) {
        // Only accept left click for mouse event
        if (startEventName === 'mousedown' && event.which !== 1) return
        // Track flick gesture
        var flick = true
        setTimeout(function () {
          flick = false
        }, 250)
        // Begin dragging
        self.element.classList.add(self.draggingClass)
        var offset = self.slides.getBoundingClientRect().left + document.body.scrollLeft
        var width = self.slides.offsetWidth
        var originalX = Skid.normalizeEventX(event) - offset
        var x = originalX
        var originalPan = self.activeSlideIndex * -100
        var panPosition = originalPan
        var scheduledPan = false
        function pan (event) {
          if (!scheduledPan) {
            scheduledPan = window.requestAnimationFrame(function () {
              x = Skid.normalizeEventX(event) - offset
              panPosition = originalPan + (x - originalX) / width * 100
              self.pan(panPosition)
              scheduledPan = false
            })
          }
        }
        document.addEventListener(panEventName, pan)
        document.addEventListener(endEventName, function end (event) {
          // End dragging
          document.removeEventListener(endEventName, end)
          document.removeEventListener(panEventName, pan)
          window.cancelAnimationFrame(scheduledPan)
          self.element.classList.remove(self.draggingClass)
          // If any distance was dragged, update active slide
          if (x !== originalX) {
            // Determine the closest slide
            var closestSlideIndex = Math.round(panPosition / -100)
            // Handle horizontal flick gesture
            if (flick && Math.abs(originalX - x) > 80 && closestSlideIndex === self.activeSlideIndex) {
              // Gesture has the right timing, length and is useful
              closestSlideIndex += originalX < x ? -1 : 1
            }
            // No slides beyond first or last
            if (closestSlideIndex < 0) closestSlideIndex = 0
            if (closestSlideIndex > self.slideCount - 1) closestSlideIndex = self.slideCount - 1
            var closestSlide = self.slides.children[closestSlideIndex]
            // Only update URL hash if slide is not already active
            if (closestSlide === self.hurdler.target) self.activateSlide(closestSlide.id)
            else self.hurdler.setTarget(closestSlide)
          }
        })
      })
    })
  }
  // Check if drag enabled
  if (self.drag) {
    // Prevent dragging images from disrupting dragging slides
    self.element.queryAll('img').forEach(function (image) {
      image.addEventListener('dragstart', function (event) { event.preventDefault() })
    })
    // Enable mouse and touch drag and flick interactions
    enable('mousedown', 'mousemove', 'mouseup')
    enable('touchstart', 'touchmove', 'touchend')
  }
  // Enable URL hash control via Hurdler
  self.hurdler.addHurdle({
    test: element => {
      return element.parentElement === self.slides
    },
    onJump: element => {
      self.activateSlide(element)
    }
  })
}

/**
 * Pans the slider.
 * @private
 * @param {number} position - Positive or negative value as a percentage of a single slide.
 */
Skid.Slider.prototype.pan = function (position) {
  // Hardware accelerated pan
  if (Skid.transform) this.slides.style[Skid.transform] = 'translate3d(' + position + '%,0,0)'
  // Fallback pan
  else this.slides.style.marginLeft = position + '%'
}

/**
 * Pans the slider to a slide.
 * @private
 * @param {number} index - Slide element index.
 * @param {boolean} [instant=false] - Should the pan be transitioned.
 */
Skid.Slider.prototype.panToSlide = function (index, instant = false) {
  this.element.classList.toggle('instant', instant)
  this.pan(index * -100)
  this.element.offsetHeight // http://stackoverflow.com/a/16575811
  this.element.classList.toggle('instant', false)
}

/**
 * Gets the slide before a slide.
 * @param {HTMLElement} slide - Slide after the desired slide.
 * @returns {HTMLElement} The slide before the input slide.
 */
Skid.Slider.prototype.getSlideBefore = function (slide) {
  return slide.previousElementSibling || this.slides.lastElementChild
}

/**
 * Gets the slide after a slide.
 * @param {HTMLElement} slide - Slide before the desired slide.
 * @returns {HTMLElement} The slide after the input slide.
 */
Skid.Slider.prototype.getSlideAfter = function (slide) {
  return slide.nextElementSibling || this.slides.firstElementChild
}

/**
 * Activates a slide and pans the slider to it.
 * @param {HTMLElement|string} slide - Element or ID of the slide to activate.
 */
Skid.Slider.prototype.activateSlide = function (slide) {
  var self = this
  if (typeof slide === 'string') slide = document.getElementById(slide)
  // Prevent reactivation
  if (self.activeSlide !== slide) {
    // Update active slide
    self.activeSlide.classList.remove('active')
    self.activeSlide = slide
    self.activeSlideIndex = Array.prototype.slice.call(self.slides.children).indexOf(self.activeSlide)
    self.activeSlide.classList.add('active')
    // Update prior slide and link
    self.priorSlide = self.getSlideBefore(self.activeSlide)
    if (self.priorLink) self.priorLink.href = '#' + self.hurdler.hashPrefix + self.priorSlide.id
    // Update next slide and link
    self.nextSlide = self.getSlideAfter(self.activeSlide)
    if (self.nextLink) self.nextLink.href = '#' + self.hurdler.hashPrefix + self.nextSlide.id
    // Update tabs
    if (self.tabs) {
      self.tabs.querySelector('.active').classList.remove('active')
      self.tabs.querySelector('[href^="#' + self.hurdler.hashPrefix + self.activeSlide.id + '"]').classList.add('active')
    }
    // Fire events
    var slideEvent = new window.CustomEvent('active')
    self.activeSlide.dispatchEvent(slideEvent)
    var sliderEvent = new window.CustomEvent('activated')
    self.element.dispatchEvent(sliderEvent)
  }
  // Pan slider to active slide
  self.panToSlide(self.activeSlideIndex)
}

export default Skid
