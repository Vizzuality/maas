cdb.ui.common.FieldModel = Backbone.Model.extend({
  defaults: {
    selected: false,
    disabled: true
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
    this.model.bind("change:disabled", this.toggleDisabled, this);

  },

  toggleDisabled: function() {

    if (this.model.get("disabled")) {
      this.$el.find("input").attr("disabled", "disabled");
    } else {
      this.$el.find("input").removeAttr("disabled");
    }

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

      this.$el.find("input").val(this.model.get("el_id"));

      var callback = this.model.get("callback");

      if (callback && callback.on) {
        if (window.navigation) window.navigation.showCircle(this.$el);
        callback.on( this );
      }

    } else {

      this.$el.find("a").removeClass("checked");
      this.$el.removeClass("selected");
      this.$el.find(".price").fadeOut(this.options.speed);
      this.$el.find(".ellipsis").fadeIn(this.options.speed);

      if (this.model.get("type") != "radio") {
        this.$el.find("input").val(0);
      }

      var callback = this.model.get("callback");

      if (callback && callback.off) {
        if (window.navigation) window.navigation.showCircle(this.$el);
        callback.off( this );
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

  attributes: {
    name: "",
    email: "",
    comment: ""
  },

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
  model: cdb.ui.common.NavigationItemModel,
  next: function() {

    var active = this.find(function(p) { return p.get("selected"); });
    var i = this.indexOf(active) + 1;
    if (i > this.length + 1) i = 0;

    return this.at(i);


  }
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

    _.bindAll(this, "select", "keydown", "prev", "next", "showCircle", "hideCircle", "showDontKnow", "showPane", "loadLayers", "loadBaseLayer", "replaceBaseLayer", "replaceCartoDBLayer", "loadCartoDBLayer", "removeLayers", "centerMap", "onSuccess", "onError");

    $(".circle").on("click", function(e) { // TODO: create Circle element and move this functionality there
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 250);
    });

    $(window).on("scroll", this.hideCircle);

    $("form").on("ajax:error", this.onError);
    $("form").on("ajax:success", this.onSuccess);
    $("form").on("submit", this.onSubmit);

    this.map          = this.options.map;
    this.template     = cdb.templates.getTemplate('templates/form/navigation');
    this.animating    = false;
    this.selectedPage = 0;

    this.render();
  },

  keydown: function(e) {

    if (e.keyCode == 37)      this.prev(e);
    else if (e.keyCode == 39) this.next(e);

  },

  onSubmit: function() {
    $(".field.error label span").remove();
    $(".field.error").removeClass("error");
  },

  onSuccess: function(e, data) {
    window.location = "/orders/" + data.id;
  },

  onError: function(e, data) {

    var response = JSON.parse(data.responseText);
    var errors   = response.errors;

    _.each(errors, function(error, field) {
      $(".field." + field).addClass("error");
      var $span = $("<span />").text(error[0]).hide();
      $(".field." + field).find("label").append($span);
      $span.fadeIn(250);
    });

  },

  hideCircle: function() {
    if ($("body").scrollTop() < 450) $(".circle").fadeOut(150, "easeOutExpo", function() {
      $(this).addClass("hidden");
    });
  },

  showCircle: function($el) {
    if ( $("body").scrollTop() > 450 && $(".circle").hasClass("hidden")) {
      $(".circle").css({ top: $el.position().top - $(".circle").height()/2 });
      $(".circle").fadeIn(150, "easeOutExpo", function() {
        $(this).removeClass("hidden");
      });
    }
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

    var n = this.collection.next();

    var pageName = n.get("className");

    //var pane = window.pane.active(pageName)
    //console.log(pane);
    //window.navigation.select(pane);
    //window.router.navigate("orders/new/" + pageName);

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

  moveTip: function(pane) {

    var
    $item = $(".navigation ul li a." + pane.className).parent(),
    posX  = $item.position().left + ( $item.width() / 2 ) - 13;

    $(".tip").animate({ left: posX }, { duration: this.options.speed, easing: this.options.easing } );

  },

  // This method is called when the user selects a different tab
  select: function(pane) {

    this.animating = true;
    this.moveTip(pane);

    // Enables/disables fields
    this.collection.each(function(p) {

      var
      paneName = p.get("className"),
      _pane    = window.pane.getPane(paneName);

      if (pane == _pane) _pane.enableFields();
      else _pane.disableFields();

    });

    // Shows pane (TODO: move to the view)
    pane.className == "dont_know" ? this.showDontKnow() : this.showPane(pane);

    $("#default_page").val(pane.id);
    $("#default_name").val(pane.className);

  },

  showPane: function(pane) {
    var self = this;

    // Hide the widgets & do the unbinding
    window.map.infowindow.model.set("visibility", false);
    window.map.selector.hide();
    window.map.legend.hide();
    window.map.unbind('change:zoom');

    // Fire the callbacks
    pane.collection.each(function(f, i) {
      var callback = f.get("callback");

      if (f.get('selected') && ((f.get("type") == "checkbox") || (f.get("type") == 'radio' && i > 1))) {
        if (callback && callback.on) { setTimeout(function() { callback.on( f.view ); }, 500); }
      }

      if (f.get('selected') && callback && callback.init) {
        callback.init(f.view);
      }

    });

    // Callback: after the animations, unload & load the layers
    var loadLayers = function() {
      self.loadLayers(pane.options.data);
    };

    // Callback: shows the map and makes it ready to show the layers
    var showMap = function() {

      $("#map").fadeOut(200, function() {

        $(".map").animate({ height: 463 }, { duration: 250, easing: "easeOutExpo" });
        $(".browser").fadeIn({ duration: 250, easing: "easeOutExpo", complete: loadLayers });

      });
    }

    // Hide the 'I don't know' divs
    $(".dontknow .browsers").animate({ opacity: 0, bottom: -250}, 250);
    $(".dontknow .message").animate({  opacity: 0, left: -500}, 250, showMap);

  },

  loadLayers: function(layers) {

    this.removeLayers();

    if (layers.extra) this.loadExtraLayer(layers.extra);
    if (layers.base)  this.loadBaseLayer(layers.base);
    if (layers.cdb)   this.loadCartoDBLayer(layers.cdb);

    this.showURL(layers.url);

    var self = this;

    setTimeout(function() { // TODO: test this
      self.centerMap(layers.coords.center, layers.coords.zoom);
    }, 500);

  },

  showURL: function(url) {

    if (url == $(".browser .url").val()) return;

    $(".browser .url").fadeOut(150, function() {
      $(this).val(url);
      $(this).fadeIn(150);
    });

  },

  centerMap: function(center, zoom) {

  var self = this;

    $("#map").fadeIn(100, function() {
      $(".browser").animate({ bottom: -70 }, 150, function() {
        self.animating = false;
        window.map.setView(center, zoom);
      });
    });

  },

  // Methods to remove, replace and create CartoDB layers
  // and regular layers

  getBaseLayer: function() {
    return this.map.layers.getByCid(this.baseLayer);
  },

  getBaseLayerOptions: function() {
    return this.getBaseLayer().toJSON();
  },

  getCartoDBLayer: function() {
    return this.map.layers.getByCid(this.cartoDBLayer);
  },

  getCurrentCartoDBLayerOptions: function() {
    return this.getCartoDBLayer().toJSON();
  },

  removeExtraLayer: function() {
    window.map.removeLayerByCid(this.extraLayer);
  },
  removeBaseLayer: function() {
    window.map.removeLayerByCid(this.baseLayer);
  },

  removeCartoDBLayer: function() {
    window.map.removeLayerByCid(this.cartoDBLayer);
  },

  replaceBaseLayer: function(layerOptions) {
    if (this.baseLayer) {
      window.map.removeLayerByCid(this.baseLayer);
    }
    window.navigation.loadBaseLayer(layerOptions);

    // We have to add the original CartoDBLayer on top,
    // so using the Cid of the layer, we recover the hash
    // with its configuration and use it to regenerate the layer
    if (this.cartoDBLayer) {
      var cdb = this.map.layers.getByCid(this.cartoDBLayer).toJSON();
      window.navigation.replaceCartoDBLayer(cdb);
    }
  },

  replaceCartoDBLayer: function(layerOptions) {
    if (this.cartoDBLayer) {
      window.map.removeLayerByCid(this.cartoDBLayer);
    }
    window.navigation.loadCartoDBLayer(layerOptions);
  },

  loadExtraLayer: function(options) {

    if (options) {
      var layer       = new cdb.geo.TileLayer({ urlTemplate: options.url });
      this.extraLayer = window.map.addLayer(layer);
    } else this.extraLayer = null;
  },

  loadBaseLayer: function(options) {

    if (options) {
      var layer      = new cdb.geo.TileLayer({ urlTemplate: options.url });
      this.baseLayer = window.map.addLayer(layer);
    } else this.baseLayer = null;
  },

  loadCartoDBLayer: function(options) {

    if (options) {
      layer             = new cdb.geo.CartoDBLayer(options);
      this.cartoDBLayer = window.map.addLayer(layer);
    } else this.cartoDBLayer = null;

  },

  removeLayers: function() {

    try { // Removes previously loaded layers

      if (this.baseLayer)    {
        window.map.removeLayerByCid(this.baseLayer);
        this.baseLayer = null;
      }

      if (this.cartoDBLayer) {
        window.map.removeLayerByCid(this.cartoDBLayer);
        this.cartoDBLayer = null;
      }

      if (this.extraLayer)   {
        window.map.removeLayerByCid(this.extraLayer);
        this.extraLayer = null;
      }

    }
    catch(err) {

    }
  },

  showDontKnowMessage: function() {
    $(".dontknow .browsers").animate({ opacity: 1, bottom: 0}, 250);
    $(".dontknow .message").animate( { opacity: 1, left: 50 }, 250);
    self.animating = false;
  },

  showDontKnow: function() {
    var self = this;

    $("#map").fadeOut(250, function() {
      $(".browser").fadeOut({ duration: 250, easing: "easeInExpo" });
      $(".map").animate({ height: 250 }, { duration: 250, easing: "easeInExpo", complete: self.showDontKnowMessage });
    });

  }

});

cdb.ui.common.Form = Backbone.View.extend({
  className: "form",
  options: {

    speed: 250,
    easing: "easeOutExpo"

  },

  events: {
    "click .button":          "open"
  },

  open: function() {

  },

  initialize: function() {
    _.bindAll(this, "render", "show", "hide", "recalc", "updatePrice", "enableFields", "disableFields", "uncheckAllFields");

    this.template = cdb.templates.getTemplate('templates/form/form');

    this.model = new cdb.ui.common.FormModel();
    this.model.bind("change:total", this.updatePrice, this);

    this.render();

  },

  // Enables all the fields in the form
  enableFields: function() {

    this.collection.each(function(field) {
      field.set("disabled", false);
    });

  },

  // Disable all the fields in the form
  disableFields: function() {

    this.collection.each(function(field) {
      field.set("disabled", true);
    });

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

  uncheckAllFields: function() {

    this.collection.each(function(field) {
      field.get("selected") ? field.set("selected", false) : null;
    });

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

    this.collection.each(function(field, i) {

      if (field.get("type") == false) {
        fieldView = new cdb.ui.common.FieldViewFixed({ model: field });
      } else {
        fieldView = new cdb.ui.common.FieldView({ model: field });
      }

      field.view = fieldView;

      field.bind("change:selected", self.recalc, field);

      if (field.get('type') == false ||field.get('checked') == true)  {
        field.set({ selected: true });
      }

      if (field.get('type') == false)  {
        self.$el.find(".fixed").append(fieldView.render());
      } else {
        self.$el.find(".other").append(fieldView.render());
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

  page: function(pageName) {

    if (!pageName) pageName = defaultPageName;


    activePane = window.pane.active(pageName)
    window.navigation.select(activePane);

  }

});
