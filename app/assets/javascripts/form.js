cdb.ui.common.FieldModel = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

cdb.ui.common.FieldView = Backbone.View.extend({
  tagName: "li",

  events: {

    'click a': 'select'

  },

  initialize: function() {

    _.bindAll(this, "render", "toggle");


    this.template      = cdb.templates.getTemplate('templates/form/field');
    this.templateFixed = cdb.templates.getTemplate('templates/form/fixed');

    this.model.bind("change:selected", this.toggle, this);

  },

  select: function() {
    if (this.model.get('type') === 'checkbox') {
      this.model.set("selected", !this.model.get("selected"));
    } else {
      this.model.set("selected", true);
    }
  },

  // Toggles the state of the element
  toggle: function() {

    if (this.model.get("selected")) {
      this.$el.find("a").addClass("checked");
      this.$el.addClass("selected");
      this.$el.find(".price").fadeIn(250);
      this.$el.find(".ellipsis").fadeOut(250);

      var callback = this.model.get('callback');

      if (callback) {
        callback();
      }

    } else {
      this.$el.find("a").removeClass("checked");
      this.$el.removeClass("selected");
      this.$el.find(".price").fadeOut(250);
      this.$el.find(".ellipsis").fadeIn(250);
    }

  },

  render: function() {
    this.$el.addClass(this.model.get('className'));

    if (this.model.get("type") == false) {
      this.$el.append(this.templateFixed(this.model.toJSON()));
    } else {
      this.$el.append(this.template(this.model.toJSON()));
    }
    return this.$el;
  }
});

cdb.ui.common.FieldViewFixed = cdb.ui.common.FieldView.extend({
  tagName: "div"
});

cdb.ui.common.Fields = Backbone.Collection.extend({
  model: cdb.ui.common.FieldModel
});

cdb.ui.common.FormModel = Backbone.Model.extend({

  selectedFields: [],
  defaults: {
    base: 0,
    total: 0
  },

  sub: function(field) {

    if (field.get('type') == 'checkbox') {
      this.selectedFields = _.without(this.selectedFields, field);
      this.set("total", this.get("total") - field.get("price"))
    }
  },

  add: function(field) {

    if (_.include(this.selectedFields, field)) return;

    if (field.get('type') == 'checkbox') {

      this.selectedFields.push(field);

    } else {

      this.selectedFields = _.reject(this.selectedFields, function(f) {

        if ( f.get('type') === "radio" && f.get('name') === field.get('name')) {
          f.set("selected", false);
        }

        return (f.get('type') === "radio") && (f.get('name') === field.get('name'))
      });

      this.selectedFields.push(field);

    }

    var amount = 0;

    _.each(this.selectedFields, function(f) {
      amount += f.get("price");
    });

    this.set("total", amount);
  }
});

cdb.ui.common.NavigationItemModel = Backbone.Model.extend({

});

cdb.ui.common.NavigationItems = Backbone.Collection.extend({
  model: cdb.ui.common.NavigationItemModel
});

cdb.ui.common.NavigationItem = Backbone.View.extend({
  tagName: "li",
  events: {
    'click a': 'goto'
  },
  initialize: function() {

    _.bindAll(this, "render", "select", "goto");

    this.parent = this.options.parent;

    this.model.bind("change", this.select, this);

    this.template = cdb.templates.getTemplate('templates/form/navigation_item');
  },

  render: function() {
    return this.$el.append(this.template(this.model.toJSON()));
  },

  select: function() {
    this.$el.html( this.template(this.model.toJSON()) );
  },

  goto: function(e) {
    e.preventDefault();
    window.router.navigate("/orders/new/" + this.model.get("className"), { trigger: true });
  }

});

cdb.ui.common.Navigation = Backbone.View.extend({
  className: "navigation",

  initialize: function() {

    var self = this;

    _.bindAll(this, "select", "keydown", "prev", "next", "showUnknown", "showPage");

    $(document).bind('keydown', this.keydown);

    this.template     = cdb.templates.getTemplate('templates/form/navigation');
    this.animating    = false;
    this.selectedPage = 0;

    this.render();
  },

  keydown: function(e) {

    if (e.keyCode == 37)      this.prev(e);
    else if (e.keyCode == 39) this.next(e);

  },

  prev: function(e) {
    e && e.preventDefault();
    if (this.animating) return;

    var pos = this.selectedPagePosition - 1;
    if ( pos < 0 ) pos = this.collection.length - 1;
    var name = this.collection.at(pos).get("className");
    this.select(name);

    window.router.navigate("orders/new/" + name);
    window.pane.active(name);
  },

  next: function(e) {
    e && e.preventDefault();
    if (this.animating) return;

    var pos = this.selectedPagePosition + 1;
    if (pos >= this.collection.length) pos = 0;
    var name = this.collection.at(pos).get("className");
    this.select(name);

    window.router.navigate("orders/new/" + name);
    window.pane.active(name);
  },

  render: function() {
    var self = this;

    this.$el.append(this.template());
    $(".navigation").html(this.$el);

    this.collection.each(function(model) {
      fieldView = new cdb.ui.common.NavigationItem({ model: model });
      model.view = fieldView;
      self.$el.find("ul").append(fieldView.render());
    });

    return this.$el;
  },

  moveTip: function(posX) {
    $(".tip").animate({ left: posX }, { duration: 250, easing: "easeOutExpo" } );
  },

  select: function(page) {

    var self = this;

    var item;

    // Gets the selected field
    this.collection.each(function(field) {

      if (page === field.get("className")) {

        item = field;

        // Stores the position of the item
        self.selectedPagePosition = self.collection.models.indexOf(item);

        field.set("selected", true);

      } else {
        field.set("selected", false);
      }

      if (!this.animating && item) {
        var baseLayerOptions = item.get('baseLayerOptions');
        //console.log(window.map, item, baseLayerOptions);
        //window.mapView.map_leaflet.setZoom(baseLayerOptions.zoom);
      }

    });

    var posX = item.view.$el.position().left + ( item.view.$el.width() / 2 ) - 13;
    this.moveTip(posX);

    this.animating = true;

    if (page == "unknown") {
      this.showUnknown();
    } else {
      this.showPage(item);
    }
  },

  showPage: function(item) {
    var self = this;

    var baseLayerOptions = item.get('baseLayerOptions');

      //window.map.setZoom(baseLayerOptions.zoom);
      //window.map.setCenter(baseLayerOptions.center);


    $("#map").fadeOut(200, function() {
      $(".map").animate({ height: 463 }, { duration: 250, easing: "easeInCirc" });
    });

    var onComplete = function() {

      // Removes previously loaded layers
      if (this.baseLayer)    window.map.removeLayerByCid(this.baseLayer);
      if (this.cartoDBLayer) window.map.removeLayerByCid(this.cartoDBLayer);

      // Add base layer
      var layer      = new cdb.geo.TileLayer({ urlTemplate: baseLayerOptions.url });
      this.baseLayer = window.map.addLayer(layer);

      var options = item.get('cartoDBLayerOptions');

      if (options) { // Add CartoDB layer

        layer             = new cdb.geo.CartoDBLayer(options);
        this.cartoDBLayer = window.map.addLayer(layer);

      } else this.cartoDBLayer = null;

      $("#map").fadeIn(150, function() {
        $(".browser").animate({ bottom: -70 }, 150, function() {
          self.animating = false;
        });
      });

    };

    $(".browser").fadeIn({ duration: 250, easing: "easeOutExpo", complete: onComplete });
  },

  showUnknown: function() {
    var self = this;

    $("#map").fadeOut(250, function() {
      $(".browser").fadeOut({ duration: 250, easing: "easeInExpo" });
      $(".map").animate({ height: 300 }, { duration: 250, easing: "easeInCirc" });
      self.animating = false;
    });
  }

});

cdb.ui.common.Form = Backbone.View.extend({
  className: "form",

  initialize: function() {
    _.bindAll(this, "render", "show", "hide", "recalc", "updatePrice");

    this.template = cdb.templates.getTemplate('templates/form/form');

    this.model = new cdb.ui.common.FormModel();
    this.model.bind("change:total", this.updatePrice, this);

    this.render();

  },

  updatePrice: function() {
    var self = this;

    var total = this.model.get('total') + this.model.get('base');

    var onComplete = function() {
      self.$el.find(".subtotal").html("Starting from <span>$" + total + "</span>");
      self.$el.find(".subtotal span").animate({ opacity: 1 }, { duration: 250, easing: "easeOutExpo" });
    };

    this.$el.find(".subtotal span").animate({ opacity:0 }, { duration: 250, easing: "easeOutExpo", complete: onComplete });
  },

  show: function() {
    this.$el.fadeIn(250);
  },

  hide: function() {
    this.$el.fadeOut(250);
  },

  render: function() {

    var self = this;

    var options = _.extend(this.model.toJSON(), { showPriceFields : true });

    if (this.collection.length == 1 && !this.collection.at(0).get("type")) {
      options = _.extend(options, { showPriceFields : false });
    }

    this.$el.append(this.template(options));

    var fields = {};

    var fieldView;

    this.collection.each(function(field, i) {

      if (field.get("type") == false) {

        fieldView = new cdb.ui.common.FieldViewFixed({ model: field });

      } else {

        fieldView = new cdb.ui.common.FieldView({ model: field });

      }

      field.bind("change:selected", self.recalc, field, self);

      if (field.get('type') == false ||field.get('checked') == true)  {
        field.set({ selected: true });
      }

      if (field.get('type') == false)  {
        self.$el.find(".fixed").append(fieldView.render());
      } else {
        self.$el.find(".test").append(fieldView.render());
      }
    });

    this.$el.find(".total").show();
    $("#container").append(this.$el);

    return this.$el;
  },

  recalc: function(field) {
    if ( field.get("selected")) {
      this.model.add(field);
    } else {
      this.model.sub(field);
    }
  }

});

cdb.Router = Backbone.Router.extend({

  routes: {
    "orders/new/": "page",
    "orders/new": "page",
    "orders/new/:page": "page"
  },

  page: function(page) {
    if (!page)  page = defaultPage;

    window.map.infowindow.hide(true);
    window.pane.active(page);
    window.navigation.select(page);
  }

});
