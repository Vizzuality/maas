cdb.ui.common.FieldModel = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

cdb.ui.common.FieldView = Backbone.View.extend({
  tagName: "li",

  options: {

    speed: 250

  },

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
      this.$el.find(".price").fadeIn(this.options.speed);
      this.$el.find(".ellipsis").fadeOut(this.options.speed);
      this.$el.find("input").val(this.model.get("id"));

      var callback = this.model.get("callback");

      if (callback && callback.on) {
        callback.on();
      }

    } else {
      this.$el.find("a").removeClass("checked");
      this.$el.removeClass("selected");
      this.$el.find(".price").fadeOut(this.options.speed);
      this.$el.find(".ellipsis").fadeIn(this.options.speed);

      if (this.model.get("type") == "radio") {
        this.$el.find("input").val(null);
      } else {
        this.$el.find("input").val(0);
      }

      var callback = this.model.get("callback");

      if (callback && callback.off) {
        callback.off();
      }

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
    var self = this;

    e.preventDefault();

    this.parent.collection.each(function(c) {
      (c == self.model) ? self.model.set("selected", true) :c.set("selected", false);
    });

    window.router.navigate("/orders/new/" + this.model.get("className"), { trigger: true });
  }

});

cdb.ui.common.Navigation = Backbone.View.extend({
  className: "navigation",

  options: {

    speed: 250,
    easing: "easeOutExpo"

  },

  initialize: function() {

    var self = this;

    _.bindAll(this, "select", "keydown", "prev", "next", "showDontKnow", "showPage");

    //$(document).bind('keydown', this.keydown);

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

    var pos = this.selectedPage - 1;
    if ( pos < 0 ) pos = this.collection.length - 1;
    var name = this.collection.at(pos).get("className");
    this.select(name);

    window.router.navigate("orders/new/" + name);
    window.pane.active(name);
  },

  next: function(e) {
    e && e.preventDefault();

    if (this.animating) return;

    //var pos = this.selectedPage + 1;
    //if (pos >= this.collection.length) pos = 0;
    //var name = this.collection.at(pos).get("className");
    //this.select(name);

    //window.router.navigate("orders/new/" + name);
    //window.pane.active(name);
  },

  render: function() {
    var self = this;

    this.$el.append(this.template());

    $(".navigation").html(this.$el);

    this.collection.each(function(model) { // Render the navigation items

      if (model.get("className") == defaultPageName) model.set("selected", true);
      var navigationItemView  = new cdb.ui.common.NavigationItem({ parent: self, model: model });

      self.$el.find("ul").append(navigationItemView.render());

    });

    return this.$el;
  },

  moveTip: function(posX) {

    $(".tip").animate({ left: posX }, { duration: this.options.speed, easing: this.options.easing } );

  },

  select: function(pane) {

    var
    $item = $(".navigation ul li a." + pane.className).parent(),
    posX  = $item.position().left + ( $item.width() / 2 ) - 13;

    this.moveTip(posX);
    this.animating = true;

    // Disables all the options
    $(".option").attr("disabled", "disabled");

    // Enable the options of the current pane
    pane.$el.find("input[type='hidden']").removeAttr("disabled");

    if (pane.className == "dont_know") {
      this.showDontKnow();
    } else {
      this.showPage(pane);
    }

    $("#default_page").val(pane.id);
    $("#default_page_name").val(pane.className);

  },

  showPage: function(pane) {
    var self = this;

    var baseLayerOptions = pane.options.data.baseLayerOptions;

    $("#map").fadeOut(200, function() {
      $(".map").animate({ height: 463 }, { duration: 250, easing: "easeInCirc" });
    });

    var onComplete = function() {

      try { // Removes previously loaded layers

        if (this.baseLayer)    window.map.removeLayerByCid(this.baseLayer);
        if (this.cartoDBLayer) window.map.removeLayerByCid(this.cartoDBLayer);
      } catch(err) {

        console.log(err);

      }

      // Add base layer
      var layer      = new cdb.geo.TileLayer({ urlTemplate: baseLayerOptions.url });
      this.baseLayer = window.map.addLayer(layer);

      var options = pane.options.data.cartoDBLayerOptions;

      if (options) { // Add CartoDB layer

        layer             = new cdb.geo.CartoDBLayer(options);
        this.cartoDBLayer = window.map.addLayer(layer);

      } else this.cartoDBLayer = null;

      $("#map").fadeIn(150, function() {
        $(".browser").animate({ bottom: -70 }, 150, function() {
          self.animating = false;
          window.map.setView(baseLayerOptions.center, baseLayerOptions.zoom);
        });
      });

    };

    $(".browser").fadeIn({ duration: 250, easing: "easeOutExpo", complete: onComplete });
  },

  showDontKnow: function() {
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
  options: {

    speed: 250,
    easing: "easeOutExpo"

  },

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
      self.$el.find(".subtotal span").animate({ opacity: 1 }, { duration: self.options.speed, easing: self.options.easing });
    };

    this.$el.find(".subtotal span").animate({ opacity:0 }, { duration: self.options.speed, easing: self.options.easing, complete: onComplete });
  },

  show: function() {
    this.$el.fadeIn(this.options.speed);
  },

  hide: function() {
    this.$el.fadeOut(this.options.speed);
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
    var fieldOrder = 0;

    this.collection.each(function(field, i) {

      if (field.get("type") == false) {

        fieldView = new cdb.ui.common.FieldViewFixed({ model: field });

      } else {

        fieldOrder++;
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
    "orders":           "page",
    "orders/new/":      "page",
    "orders/new":       "page",
    "orders/new/:page": "page"
  },

  page: function(page) {
    if (!page) page = defaultPageName;

    window.map.infowindow.hide(true);
    window.pane.active(page)
    var pane = window.pane.getActivePane();
    window.navigation.select(pane);
  }

});
