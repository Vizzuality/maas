$(function() {
  cdb.init();

  var InputModel = Backbone.Model.extend({ });

  var Inputs = Backbone.Collection.extend({
    model: InputModel
  });

  cdb.ui.common.InputView = cdb.core.View.extend({

    initialize: function() {
      _.bindAll(this, "render", "clear", "error", "setValue");

      this.model = this.options.model;
      this.model.on("change:error", this.error);
      this.model.on("change:value", this.setValue);
      this.template = this.options.template ? _.template(this.options.template) : cdb.templates.getTemplate(this.model.get("template_name"));
    },

    setValue: function() {
      this.$el.find("input,textarea").val(this.model.get("value"));
    },

    clear: function() {
      this.model.set("value", "");
    },

    error: function() {
      if (this.model.get("error") == true) {
        this.$el.addClass('error');
      } else {
        this.$el.removeClass('error');
      }


      //this.render();
    },

    get: function() {
      var value  = this.$el.find("input,textarea").val();
      this.model.set("value", value);
    },

    render: function() {
      this.$el = $(this.template(this.model.toJSON()));

      return this.$el;
    }
  });

  var dialogModel = Backbone.Model.extend({
    urlRoot: '/questions',

    defaults: {
      backdrop: true
    },

    validate: function(attrs) {

      var emailRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

      var error = false;

      if (!attrs.email || !attrs.email.match(emailRegexp)) {
        window.dialog.email.model.set({ error:true, error_msg: "We would like to know who you are" });
        error = true;
      }

      if (!attrs.name) {
        window.dialog.name.model.set({ error:true, error_msg: "We would like to know who you are" });
        error = true;
      }

      if (!attrs.comment ) {
        window.dialog.comment.model.set({ error:true, error_msg: "We would like to know who you are" });
        error = true;
      }

      if (error) return true;
    }

  });

  var MyDialog = cdb.ui.common.Dialog.extend({

    initialize: function() {

      _.defaults(this.options, this.default_options);
      _.bindAll(this, 'render', 'keydown', '_forceHide', 'hide', 'ok', '_cancel');

      $(document).bind('keydown', this.keydown);

      this.model = new dialogModel(this.options);
      this.add_related_model(this.model);

      this.name    = new cdb.ui.common.InputView({ model: new InputModel({ error_msg: "", error: false, name: "name", template_name: 'templates/contact/input' })});
      this.email   = new cdb.ui.common.InputView({ model: new InputModel({ error_msg: "", error: false, name: "email", template_name: 'templates/contact/input' })});
      this.comment = new cdb.ui.common.InputView({ model: new InputModel({ error_msg: "", error: false, name: "comment", template_name: 'templates/contact/textarea' })});

      this.template_base = this.options.template_base ? _.template(this.options.template_base) : cdb.templates.getTemplate(this.options.template_name);
    },

    render: function() {
      var that = this;

      this.$el.html(this.template_base(this.options));

      this.$el.find("ul").append(this.name.render());
      this.$el.find("ul").append(this.email.render());
      this.$el.find("ul").append(this.comment.render());

      return this.$el;
    },

    center: function() {
      this.$el.css("position","absolute");
      this.$el.css("top", Math.max(0, (($(window).height() - this.$el.outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
      this.$el.css("left", Math.max(0, (($(window).width() - this.$el.outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    },

    hide: function(callback) {

      this.$el.fadeOut(250);

        if (callback) callback();
    },

    open: function() {
      var that = this;

      var t = Math.max(0, (($(window).height() - this.$el.outerHeight()) / 2) +
        $(window).scrollTop());

      if (this.model.get("backdrop")) {
        $("body").append("<div class='backdrop'></div>");
        $(".backdrop").fadeIn(250, function() {

          that.$el.css({ top: t + 50, opacity: 0 });
          that.$el.show();
          that.$el.animate({ top: t, opacity: 1 }, 250);
          that.$el.find(".error").removeClass("error");

        });
        $(".backdrop").on("click", that._forceHide);

      }

    },
    _forceHide: function() {
      window.currentDialog.$el.hide();

      $(".backdrop").fadeOut(250, function() {
        $(this).remove();
      });
    },

    _cancel: function(ev) {

      if (ev) ev.preventDefault();

      if (this.cancel) {
        this.cancel();
      }

      this.hide();
      $(".backdrop").fadeOut(250, function() {
        $(this).remove();
      });

    },
    ok: function() {
      var that = this;

      this.name.model.set("error", false);
      this.email.model.set("error", false);
      this.comment.model.set("error", false);

      this.name.get();
      this.email.get();
      this.comment.get();

      this.model.save({ name: this.name.model.get("value"), email: this.email.model.get("value"), comment: this.comment.model.get("value") }, {

        success: function() {
          that.hide(function() {

            var dialog = new MyDialog({
              title: 'Thank you!',
              backdrop: false,
              description: 'long description here',
              className: 'success',
              template_name: 'templates/contact/success',
              width:  458,
              height: 539
            });

            $('body').append(dialog.render());
            window.currentDialog = dialog;
            dialog.open();


          });

          that.name.clear();
          that.email.clear();
          that.comment.clear();

          that.model = new dialogModel();
          that.add_related_model(this.model);


        },

        error: function(e) {
          //console.log('error', e);
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

  $('body').append(dialog.render());

});
