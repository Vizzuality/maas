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

  // Smooth scrolling
  $('body.home a.scroll').on("click", function(e) {
    e.preventDefault();
    var url = $(this).attr("href");
    var hash = url.substring(url.indexOf('#'));
    $("body").animate({ scrollTop: $(hash).offset().top - 10 }, { easing: "easeInSine", duration: 500 });
  });

  // Simple slideshow
  if ($('body.home').length > 0) {
    $('.computer').cycle({
      fx: 'fade',
      random: false,
      timeout: 4500
    });
  }


  // Contat dialog launcher
  $("footer ul li a.contact").on("click", function(e) {
    e.preventDefault();
    window.dialog.open();
  });

});
