cdb.geo.ui.OverlayModel     = Backbone.Model.extend({ });
cdb.geo.ui.OverlayItemModel = Backbone.Model.extend({ });

cdb.geo.ui.OverlayItems = Backbone.Collection.extend({
  model: cdb.geo.ui.OverlayItemModel
});

cdb.geo.ui.OverlayItem = cdb.core.View.extend({


  events: {

    "click a" : "click"

  },


  initialize: function() {

    _.bindAll(this, "render", "click");

    this.parent = this.options.parent;
    this.template = cdb.templates.getTemplate(this.parent.model.get("item_template"));
    this.model.on("change:selected", this.render);

  },

  click: function(e) {
    e.preventDefault();

    if (this.parent.model.get("mode") == 'checkbox') {

      this.toggle();

      var
      on  = this.model.get("on"),
      off = this.model.get("off");

      if (this.model.get("selected") && on)   on();
      if (!this.model.get("selected") && off) off();

    } else {

      var on = this.model.get("on");

      if (on)  on();
    }

  },

  toggle: function() {

    this.model.set("selected", !this.model.get("selected"));

    if (this.model.get("selected") == true) {
      this.$el.addClass("selected");
    } else {
      this.$el.removeClass("selected");
    }


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

cdb.geo.ui.Overlay = cdb.core.View.extend({

  id: "overlay",

  default_options: { },

  getSelectedItem: function() {
    return this.model.get("selectedItem");
  },

  select: function(i) {
    var self = this;

    this.collection.each(function(item, j) {
      if (i == j) {
        item.set("selected", true);
        self.model.set("selectedItem", item);
      } else item.set("selected", false);
    });

  },

  initialize: function() {

    this.map = this.model;

    this.add_related_model(this.model);

    _.bindAll(this, "render", "show", "hide", "toggle", "select", "getSelectedItem", "changeClass");

    _.defaults(this.options, this.default_options);

    this.model.bind("change", this.render);
    this.model.bind("change:className", this.changeClass);

    this.collection = new cdb.geo.ui.OverlayItems();

    this.template = this.model.get("template") ? this.model.get("template") : cdb.templates.getTemplate('geo/overlay');
  },

  show: function() {
    this.$el.fadeIn(250);
  },

  hide: function() {
    this.$el.fadeOut(250);
  },

  changeClass: function() {
    this.$el.removeClass(this.model.previous("className"));
    this.$el.addClass(this.model.get("className"));
  },

  toggle: function(clickedItem) {

    if (this.collection) {
      this.collection.each(function(item) {
        item.set("selected", !item.get("selected"));
      });
    }

  },

  setCollection: function(collection) {
    var self = this;

    this.collection = collection;

    self.$el.find(".items").html("");

    this.className = this.model.get("className");

    this.collection.each(function(item) {
      var view = new cdb.geo.ui.OverlayItem({ parent: self, className: item.get("className"), model: item });
      self.$el.find(".items").append(view.render());
    });

  },

  render: function() {
    var self = this;

    this.$el.addClass(this.model.get("className"));

    this.$el.html(this.template(this.model.toJSON()));

    this.setCollection(this.collection);

    return this.$el;
  }

});
