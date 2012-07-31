$(function() {
  cdb.init();


  var InputModel = Backbone.Model.extend({ });

  var Inputs = Backbone.Collection.extend({
    model: InputModel
  });


  cdb.ui.common.InputView = cdb.core.View.extend({


    initialize: function() {
      _.bindAll(this, "render", "clean", "error");

      this.model = this.options.model;
      this.model.on("change:error", this.error);
      this.template = this.options.template ? _.template(this.options.template) : cdb.templates.getTemplate(this.model.get("template_name"));
    },

    error: function() {
      if (this.model.get("error") == true) {
        this.$el.addClass('error');
      } else {
        this.$el.removeClass('error');
      }
    },

    get: function() {
      var value  = this.$el.find("input,textarea").val();
      this.model.set("v", value);
    },

    render: function() {
      this.$el = $(this.template(this.model.toJSON()));

      return this.$el;
    }
  });

  var dialogModel = Backbone.Model.extend({
    urlRoot: '/questions',

    validate: function(attrs) {

    var error = false;
      if (!attrs.email) {
        window.dialog.email.model.set("error", true);
        error = true;
      }
      if (!attrs.name) {
        window.dialog.name.model.set("error", true);
        error = true;
      }
      if (!attrs.comment ) {
        window.dialog.comment.model.set("error", true);
        error = true;
      }
      if (error) return true;
    }

  });

  var MyDialog = cdb.ui.common.Dialog.extend({

    initialize: function() {

      _.defaults(this.options, this.default_options);
      _.bindAll(this, 'render', 'keydown', 'ok');

      $(document).bind('keydown', this.keydown);

      this.model = new dialogModel();
      this.add_related_model(this.model);

      this.name    = new cdb.ui.common.InputView({ model: new InputModel({ error: false, name: "name", template_name: 'templates/contact/input' })});
      this.email   = new cdb.ui.common.InputView({ model: new InputModel({ error: false, name: "email", template_name: 'templates/contact/input' })});
      this.comment = new cdb.ui.common.InputView({ model: new InputModel({ error: false, name: "comment", template_name: 'templates/contact/textarea' })});

      this.template_base = this.options.template_base ? _.template(this.options.template_base) : cdb.templates.getTemplate(this.options.template_name);
    },

    render: function() {
      var that = this;

      this.$el.html(this.template_base(this.options));

      this.$el.find("ul").append(this.name.render());
      this.$el.find("ul").append(this.email.render());
      this.$el.find("ul").append(this.comment.render());

      return this;
    },

    center: function() {
      this.$el.css("position","absolute");
      this.$el.css("top", Math.max(0, (($(window).height() - this.$el.outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
      this.$el.css("left", Math.max(0, (($(window).width() - this.$el.outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    },

    hide: function() {

      this.$el.fadeOut(250);

    },

    open: function() {

      this.$el.fadeIn(250);
      this.center();
      this.$el.find(".error").removeClass("error");

    },

    ok: function() {
      var that = this;


      this.name.model.set("error", false);
      this.email.model.set("error", false);
      this.comment.model.set("error", false);

      this.name.get();
      this.email.get();
      this.comment.get();

      this.model.save({ name: this.name.model.get("v"), email: this.email.model.get("v"), comment: this.comment.model.get("v") }, {

        success: function() {
          that.hide();
          that.name.$el.find("input").val("");
          that.email.$el.find("input").val("");
          that.comment.$el.find("textarea").val("");

          that.name.model.set("v", "");
          that.email.model.set("v", "");
          that.comment.model.set("v", "");
          that.model.clear();
          that.model = new dialogModel();
          that.add_related_model(this.model);
        },

        error: function(e) {
          console.log('error');
        }
      });

    },

    _ok: function(ev) {

      if (ev) ev.preventDefault();

      this.ok();
    },

  });


  var dialog = new MyDialog({
    title: 'test',
    description: 'long description here',
    template_name: 'templates/contact/contact',
    width:  458,
    height: 539
  });


  window.dialog = dialog;

  $('body').append(dialog.render().el);

});
