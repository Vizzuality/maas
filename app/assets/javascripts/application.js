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
//= require cdb
//= require helpers
//= require form/styles
//= require form/layers
//= require form/callbacks
//= require jquery.cycle.all
//= require_tree .

$(function() {

  if ($('body.home').length > 0) {
    $('.computer').cycle({
      fx: 'fade',
      random: false,
      timeout: 4500
    });
  }


$(".browser .home, .browser .reload").on("click", function(e) { e.preventDefault(); });

  $("footer ul li a.contact").on("click", function(e) {
    e.preventDefault();
    window.dialog.open();
  });

});
