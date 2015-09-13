/**
 * Constructs a new Hurdler instance.
 * @class
 * @classdesc Hurdler enables hash links to web page content hidden beneath layers of interaction
 * @version 1.0.0-alpha
 * @author Jayden Seric
 * @copyright 2015
 * @license MIT
 */
function Hurdler() {
  var self = this;
  self.tests = [];
  // Ensure URL hash change triggers tests
  window.addEventListener('hashchange', function() { self.run() });
  // Prevent native scroll jump for same-page hash links that match a test
  document.addEventListener('click', function(event) {
    var link = event.target.closest('a');
    if (
      link
      && link.hash
      && link.search == location.search
      && (link.pathname == location.pathname || '/' + link.pathname == location.pathname)
      && link.host == location.host
    ) self.setHash(link.hash.substr(1), event);
  });
}

/**
 * Adds a new test.
 * @method
 * @param {function} test - Test returning a Boolean if the callback should fire.
 * @param {function} callback - Callback to fire if the test passes. Passed a per-run session object argument, handy for creating custom flags to ensure certain things only happen once per run.
 */
Hurdler.prototype.addTest = function(test, callback) {
  this.tests.push({
    test     : test,
    callback : callback
  });
};

/**
 * Runs tests and callbacks for the current URL hash. Use this after all your tests have been added and the document is ready.
 * @method
 * @param {object} [event] - Optional: Event to prevent default if a test passes.
 */
Hurdler.prototype.run = function(event) {
  // Abandon if no URL hash
  if (!location.hash) return;
  var self    = this,
      element = document.querySelector(location.hash);
      session = {};
  // Start at the hash target and loop up the DOM
  for (; element && element !== document; element = element.parentNode) {
    // Run all tests on this DOM element
    for (var i in self.tests) {
      // Check test passes
      var passes = false;
      try { passes = self.tests[i].test.call(element, session) }
      catch(error) {} // Swallow test errors
      if (passes) {
        // If event supplied, prevent the default action
        if (event !== undefined) event.preventDefault();
        // Run the callback
        self.tests[i].callback.call(element, session);
      }
    }
  }
};

/**
 * Sets the URL hash and runs the tests.
 * @method
 * @param {string} id - A DOM element ID.
 * @param {object} [event] - Optional: Event to prevent default if a test passes.
 */
Hurdler.prototype.setHash = function(id, event) {
  history.pushState(null, null, '#' + id);
  this.run(event);
};

/**
 * Clears the URL hash if a particular hash is active.
 * @method
 * @param {string} id - A DOM element ID.
 */
Hurdler.prototype.clearHash = function(id) {
  if (location.hash == '#' + id) history.pushState('', document.title, location.pathname + location.search);
};
