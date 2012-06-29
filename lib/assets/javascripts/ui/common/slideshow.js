cdb.ui.common.Slide = Backbone.Model.extend({

  show: function(speed, callback) {
    this.getEl().find("img").fadeIn(speed, function() {
      if (callback) {
        callback();
      }
    });
  },

  hide: function(speed, callback) {
    this.getEl().find("img").fadeOut(speed, function() {
      if (callback) {
        callback();
      }
    });
  },

  getEl: function() {
    return $('#slide-' + this.id);
  }

});

cdb.ui.common.Slides = Backbone.Collection.extend({
  model: cdb.ui.common.Slide
});

cdb.ui.common.Slideshow = cdb.core.View.extend({
  tagName: 'div',
  className: 'slides',
  current: 0,

  events: {
    'click .prev': '_prev',
    'click .next': '_next'
  },

  default_options: {
    speed: 250
  },

  slideTemplate: _.template('<li id="slide-<%= id %>" class="slide"><img src="/assets/slideshow/slide-0<%= id %>.png" /></li>'),
  initialize: function() {
    _.defaults(this.options, this.default_options);
    _.bindAll(this, "render", "_next", "transition");
    this.template_base = _.template(this.options.template_base || JST['common/slideshow'] || '');
  },

  render: function() {
    var $el  = this.$el;
    var self = this;

    $(this.options.myID).html($el.html(this.template_base(this.options)));

    this.collection.each(function(slide, i) {
      $el.find("ul").append(self.slideTemplate(slide.toJSON()));
    });

    this.collection.at(0).show();

    return this;
  },

  _prev: function(e) {
    e.preventDefault();

    var next = this.current - 1;
    if (next < 0) {
      next = this.collection.length - 1;
    }

    this.transition(this.current, next);
  },
  _next: function(e) {
    e.preventDefault();

    var next = this.current + 1;
    if (next > this.collection.length - 1) {
      next = 0;
    }

    this.transition(this.current, next);
  },

  transition: function(from, to) {
    var self = this;

    if (this.animating) return;

    this.animating = true;

    var self = this;
    var current = this.collection.at(from);
    var next = this.collection.at(to);

    current.hide(this.options.speed, function() {
      next.show(self.options.speed, function() {
        self.animating = false;
      });
    });

    this.current = to;
  },

  hide: function() {
    this.$el.hide();
    if(this.options.clean_on_hide) {
      this.clean();
    }
  },

});
