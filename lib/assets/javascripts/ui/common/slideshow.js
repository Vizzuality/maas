cdb.ui.common.Slide = Backbone.Model.extend({
  defaults: {
    speed: 350
  },

  show: function(callback) {
    $("#slide-" + this.id).fadeIn(this.defaults.speed, function() {
      callback && callback();
    });
  },

  hide: function(callback) {
    $("#slide-" + this.id).fadeOut(this.defaults.speed, function() {
      callback && callback();
    });
  }
});

Bullet = Backbone.View.extend({
  template: _.template('<li class="bullet" id="bullet-<%= id %>"><a href="#"></a></li>'),

  events: {
    'click a': 'goto'
  },

  initialize: function() {
    _.bindAll(this, "render", "goto");

    this.render();
  },

  render: function() {
    this.$el = $(this.template(this.model.toJSON()));

    return this;
  },

  goto: function(e) {
    e.preventDefault();
    window.slideshow.model.set("currentIndex", this.model.get("id") - 1);
  }

});

SlideView = Backbone.View.extend({
  template: _.template('<li class="slide" id="slide-<%= id %>"><img src="/assets/slideshow/slide-0<%= id %>.png" /></li>'),
  initialize: function() {
    _.bindAll(this, "render");

    this.render();
  },
  render: function() {
    this.$el = $(this.template(this.model.toJSON()));

    return this;
  }
});

cdb.ui.common.Slides = Backbone.Collection.extend({
  model: cdb.ui.common.Slide
});

cdb.ui.common.SlideshowModel = Backbone.Model.extend({

  defaults: {
    currentIndex: 0
  },

  prev: function() {
    var i = this.get("currentIndex") - 1;
    if (i < 0) i = this.collection.length - 1;
    this.set("currentIndex", i);
  },

  next: function() {
    var i = this.get("currentIndex") + 1;
    if (i >= this.collection.length) i = 0;
    this.set("currentIndex", i);
  }

});

cdb.ui.common.Slideshow = cdb.core.View.extend({
  className: 'slideshow',

  events: {

    'click .prev': 'prev',
    'click .next': 'next'

  },

  keydown: function(e) {

    if (e.keyCode == 37)      this.prev(e);
    else if (e.keyCode == 39) this.next(e);

  },

  template: _.template($("#slideshow-template").html()),

  initialize: function() {

    _.bindAll(this, 'render', 'prev', 'next', 'gotoSlide', 'keydown');

    $(document).bind('keydown', this.keydown);

    this.model = new cdb.ui.common.SlideshowModel();
    this.model.collection = this.collection;
    this.model.bind("change:currentIndex", this.gotoSlide);

  },

  gotoSlide: function() {

    var previous = this.model.previous("currentIndex") || 0;

    this.collection.at(previous).hide();
    this.collection.at(this.model.get('currentIndex')).show();

    this.$el.find(".bullet").removeClass("selected");
    $("#bullet-" + (this.model.get('currentIndex')+1)).addClass("selected");
  },

  render: function() {
    var self = this;

    $(".slideshow").append(this.$el.html(this.template(this.options)));

    var $slides     = self.$el.find(".slides");
    var $pagination = self.$el.find(".pagination");

    this.collection.each(function(slide, i) {
      $slides.append(new SlideView({ model: slide }).$el);
      $pagination.append(new Bullet({ model: slide }).$el);
    });

    $pagination.find("li:first-child").addClass('selected');

    return this.$el;
  },

  start: function() {
    this.collection.at(0).show();
  },

  prev: function(e) {
    e && e.preventDefault();

    this.model.prev();
  },

  next: function(e) {
    e && e.preventDefault();

    this.model.next();
  }

});
