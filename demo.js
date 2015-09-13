// Runs callback when document is ready
function ready(callback) {
  if (document.readyState != 'loading') callback();
  else document.addEventListener('DOMContentLoaded', callback);
}

// Construct a new Hurdler instance
var hurdler = new Hurdler;

// Initialize Skid
ready(function() {
  document.queryAll('.skid').forEach(function(element) {
    new Skid(element);
  });
});

// Control Skid via URL hashes with Hurdler
hurdler.addTest(
  function() { return this.parentNode.classList.contains('slides') },
  function() { this.closest('.skid').skid.activateSlide(this.id) }
);

// Initialize Hurdler
ready(function() { hurdler.run() });
