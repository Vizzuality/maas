cdb.geo.ui.SelectorItemModel = Backbone.Model.extend({ });

cdb.geo.ui.SelectorItems = Backbone.Collection.extend({
  model: cdb.geo.ui.SelectorItemModel
});

cdb.geo.ui.SelectorItem = cdb.core.View.extend({

  tagName: "option",

  initialize: function() {

    _.bindAll(this, "render");
    this.template = cdb.templates.getTemplate('templates/map/selector/item');
    this.parent = this.options.parent;
    this.model.on("change:selected", this.render);

  },

  select: function(e) {
    console.log('select');
    /*e.preventDefault();

    this.parent.toggle(this);

    var callback = this.model.get("callback");

    if (callback) {
      callback();
    }

    */

  },

  render: function() {

    if (this.model.get("selected") == true) {
      this.$el.addClass("selected");
    } else {
      this.$el.removeClass("selected");
    }

    this.$el.html(this.template(this.model.toJSON()));
    return this.$el;

  }

});

cdb.geo.ui.Selector = cdb.core.View.extend({

  id: "selector",

  events: {

    "change" : "select"

  },

  default_options: { },

  select: function(i) {

    this.collection.each(function(item, j) {
      if (i == j) item.set("selected", true);
      else item.set("selected", false);
    });

  },

  initialize: function() {

    this.map = this.model;

    this.add_related_model(this.model);

    _.bindAll(this, "render", "show", "hide", "toggle");

    _.defaults(this.options, this.default_options);

    if (this.collection) {
      this.model.collection = this.collection;
    }

    this.template = this.options.template ? this.options.template : cdb.templates.getTemplate('geo/selector');
  },

  show: function() {
    this.$el.fadeIn(250);
  },

  hide: function() {
    this.$el.fadeOut(250);
  },

  toggle: function(clickedItem) {

    if (this.collection) {
      this.collection.each(function(item) {
        item.set("selected", !item.get("selected"));
      });
    }

  },

  render: function() {
    var self = this;

    if (this.model != undefined) {
      this.$el.html(this.template(this.model.toJSON()));
    }

    if (this.collection) {

      this.collection.each(function(item) {

        var view = new cdb.geo.ui.SelectorItem({ parent: self, className: item.get("className"), model: item });
        self.$el.find("select").append(view.render());

      });
    }

    return this;
  }

});
