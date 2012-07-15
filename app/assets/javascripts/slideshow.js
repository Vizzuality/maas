cdb.ui.common.Slide = Backbone.Model.extend({ });

cdb.ui.common.BulletView = cdb.core.View.extend({

  events: {
    'click a': 'goto'
  },

  initialize: function() {
    _.bindAll(this, "render", "goto");

    this.template = cdb.templates.getTemplate('templates/slideshow/bullet');
    this.render();
  },

  render: function() {
    this.$el = $(this.template(this.model.toJSON()));

    return this;
  },

  goto: function(e) {
    e.preventDefault();
    this.options.parent.model.set("currentIndex", this.model.get("id") - 1);
  }

});

cdb.ui.common.SlideView = cdb.core.View.extend({

  defaults: {
    speed: 350
  },

  initialize: function() {
    _.bindAll(this, "render", "toggle");

    this.model.bind("change:visible", this.toggle);

    this.template = cdb.templates.getTemplate('templates/slideshow/view');
    this.render();
  },

  toggle: function() {

    this.model.get("visible") ? this.show() : this.hide();

  },

  show: function(callback) {
    var self = this;

    this.$el.fadeIn(this.defaults.speed, function() {
      $(this).find(".bubble").animate({ opacity: 1 }, self.defaults.speed);
      callback && callback();
    });
  },

  hide: function(callback) {
    var self = this;

    this.$el.fadeOut(this.defaults.speed, function() {
      $(this).find(".bubble").css({ opacity: 0 });
      callback && callback();
    });
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


/* Slideshow main view */

cdb.ui.common.Slideshow = cdb.core.View.extend({
  className: 'slideshow',

  defaults: {
    template_name: 'templates/slideshow/slideshow'
  },

  events: {

    'click .prev': 'prev',
    'click .next': 'next'

  },

  keydown: function(e) {

    if (e.keyCode == 37)      this.prev(e);
    else if (e.keyCode == 39) this.next(e);

  },

  initialize: function() {

    _.bindAll(this, 'render', 'prev', 'next', 'gotoSlide', 'keydown');

    $(document).bind('keydown', this.keydown);

    this.template = this.options.template ? _.template(this.options.template) : cdb.templates.getTemplate(this.defaults.template_name);

    this.model = new cdb.ui.common.SlideshowModel({ visible: false });
    this.model.collection = this.collection;
    this.model.bind("change:currentIndex", this.gotoSlide);

    this.render();
    this.start();

  },

  gotoSlide: function() {

    var previous = this.model.previous("currentIndex") || 0;

    this.collection.at(previous).set("visible", false);
    this.collection.at(this.model.get('currentIndex')).set("visible", true);

    this.$el.find(".bullet").removeClass("selected");
    $("#bullet-" + (this.model.get('currentIndex')+1)).addClass("selected");
  },

  render: function() {
    var self = this;

    $(".slideshow").append(this.$el.html(this.template(this.options)));

    var $slides     = self.$el.find(".slides");
    var $pagination = self.$el.find(".pagination");

    this.collection.each(function(slide, i) {

      var slideView = new cdb.ui.common.SlideView({ model: slide });

      slide.view = slideView;

      $slides.append(slideView.$el);
      $pagination.append(new cdb.ui.common.BulletView({ parent: self, model: slide }).$el);

    });

    $pagination.find("li:first-child").addClass('selected');

    return this.$el;
  },

  start: function() {
    this.collection.at(0).set("visible", true);
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
