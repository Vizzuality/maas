//= require_tree ./templates
//= require jquery
//= require jquery_ujs
//= require recurly
//= require underscore-min
//= require backbone-min
//= require reqwest
//= require jquery.easing.1.3
//= require jquery.dropkick-1.0.0
//= require fileuploader
//= require cdb/index.js
//= require helpers
//= require form/styles
//= require form/layers
//= require form/callbacks
//= require_tree .

$(function() {

$(".browser .home, .browser .reload").on("click", function(e) { e.preventDefault(); });

  $("footer ul li a.contact").on("click", function(e) {
    e.preventDefault();
    window.dialog.open();
  });

});
