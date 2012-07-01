// entry point
(function() {
  window.cdb           = {};
  window.cdb.config    = {};
  window.cdb.core      = {};
  window.cdb.geo       = {};
  window.cdb.ui        = {};
  window.cdb.ui.common = {};

  window.JST = window.JST || {};

  cdb.files = [
    "assets/jquery.min.js",
    "assets/underscore-min.js",
    "assets/backbone-min.js",

    "assets/leaflet.js",

    'assets/core/config.js',
    'assets/core/log.js',
    'assets/core/profiler.js',
    'assets/core/view.js',

    'assets/geo/map.js',

    'assets/ui/common/dialog.js',
    'assets/ui/common/notification.js',
    'assets/ui/common/settings.js',
    'assets/ui/common/table.js',
    'assets/ui/common/slideshow.js',
    'assets/ui/common/form.js'
  ];

  /**
   * load all the javascript files. For testing, do not use in production
   */
  cdb.load = function(prefix, ready) {
    var c = 0;

    var next = function() {
      var script = document.createElement('script');
      script.src = prefix + cdb.files[c];
      document.body.appendChild(script);
      ++c;
      if(c == cdb.files.length) {
        if(ready) {
          script.onload = ready;
        }
      } else {
        script.onload = next;
      }
    };

    next();

  };
})();
