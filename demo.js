// Runs callback when document is ready
function ready(callback) {
  if (document.readyState != 'loading') callback();
  else document.addEventListener('DOMContentLoaded', callback);
}

// Initialize Skid
ready(function() {
  document.queryAll('.skid').forEach(function(element) {
    new Skid.Slider(element);
  });
});

// Control Skid via URL hashes with Hurdler
Hurdler.tests.push({
  test     : function() { return this.parentNode.classList.contains('slides') },
  callback : function() { this.closest('.skid').slider.activateSlide(this.id) }
});

// Run Hurdler
ready(function() { Hurdler.run() });
