//= require_tree ./templates
//= require jquery
//= require jquery_ujs
//= require recurly
//= require underscore-min
//= require backbone-min
//= require reqwest
//= require jquery.easing.1.3
//= require fileuploader
//= require cdb
//= require_tree .

$(function() {

  $("footer ul li a.contact").on("click", function(e) {
    e.preventDefault();
    window.dialog.open();
  });

});
