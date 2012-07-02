cdb.ui.common.FieldModel = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

cdb.ui.common.FieldView = Backbone.View.extend({
  tagName: "li",
  template: _.template( $("#field-template").html()),
  templateFixed: _.template( $("#fixed-template").html()),

  events: {

    'click a': 'select'

  },

  initialize: function() {

    _.bindAll(this, "render", "toggle");

    this.model.bind("change:selected", this.toggle);

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

      var callback = this.model.get('callback');

      if (callback) {
        var layerCid = callback();
        this.model.set('test', layerCid);
      }

    } else {
      if (this.model.get('test')) {
         window.map.removeLayer(this.model.get('test'));

      }

      this.$el.find("a").removeClass("checked");
      this.$el.removeClass("selected");
      this.$el.find(".price").fadeOut(250);

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

cdb.ui.common.Form = Backbone.View.extend({
  className: "form",
  template: _.template($("#form-template").html()),

  initialize: function() {
    _.bindAll(this, "render", "recalc", "updatePrice");

    this.model.collection = this.collection;
    this.model.bind("change:total", this.updatePrice);
  },

  updatePrice: function() {
    var self = this;

    var total = this.model.get('total') + this.model.get('base');

    this.$el.find(".subtotal").animate({opacity:0}, 250, function() {
      self.$el.find(".subtotal").html("Starting from $" + total);
      self.$el.find(".subtotal").animate({opacity: 1}, 250);
    });
  },

  render: function() {
    var self = this;

    this.$el.append(this.template(this.model.toJSON()));

    var fields = {};

    var fieldView;

    this.collection.each(function(field, i) {

      if (field.get("type") == false) {
        fieldView = new cdb.ui.common.FieldViewFixed({ model: field });
      } else {
        fieldView = new cdb.ui.common.FieldView({ model: field });
      }

      field.bind("change:selected", self.recalc, field);

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

    return this.$el;

  },

  recalc: function(field) {
    field.get("selected") ? this.model.add(field): this.model.sub(field);
  }

});
