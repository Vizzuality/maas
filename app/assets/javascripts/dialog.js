$(function() {
  cdb.init();

  var InputModel = Backbone.Model.extend({ });

  var Inputs = Backbone.Collection.extend({
    model: InputModel
  });

  cdb.ui.common.InputView = cdb.core.View.extend({

    events: {
      'click input': 'logKey',
      'keyup input': 'logKey',
      'keypress input': 'logKey'
    },

    logKey: function(e) {
      console.log(e.type, e.keyCode);
    },

    initialize: function() {
    _.bindAll(this, "render", "logKey");
      this.model = this.options.model;
      this.template = this.options.template ? _.template(this.options.template) : cdb.templates.getTemplate(this.model.get("template_name"));
    },

    render: function() {
      this.$el = $(this.template(this.model.toJSON()));
      console.log(this.$el);

      return this.$el;
    }
  });

  var dialogModel = Backbone.Model.extend({
    urlRoot: '/questions',

    validate: function(attrs) {
      if (!attrs.email && !attrs.name && !attrs.comment ) {
      console.log(attrs);
        return "can't end before it starts";
      }
    }

  });

  var MyDialog = cdb.ui.common.Dialog.extend({

    initialize: function() {
      _.defaults(this.options, this.default_options);
      _.bindAll(this, 'render', 'keydown', 'ok');

      $(document).bind('keydown', this.keydown);

      this.add_related_model(this.model);

      this.template_base = this.options.template_base ? _.template(this.options.template_base) : cdb.templates.getTemplate(this.options.template_name);
    },

    render: function() {
    var that = this;

      this.$el.html(this.template_base(this.options));

      this.collection.each(function(input) {
        var inputView = new cdb.ui.common.InputView({ model: input });
        input.on("change", function() { this.model.set(input.name, input.get("value")); } );
        that.$el.find("form ul").append(inputView.render);
      });

      //this.$name    = this.$el.find('input[name="contact[name]"]');
      //this.$email   = this.$el.find('input[name="contact[email]"]');
      //this.$comment = this.$el.find('textarea[name="contact[comment]"]');

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

      if (this.options.clean_on_hide) {
        this.clean();
      }

    },

    open: function() {

      this.$el.fadeIn(250);
      this.center();

    },

    ok: function() {
      var that = this;

      //this.model.save({ name: this.$name.val(), email: this.$email.val(), comment: this.$comment.val() }, {

        //success: function() {
          //that.hide();
        //},

        //error: function() {

          //that.$name.parent().addClass("error");
          //that.$email.parent().addClass("error");
          //that.$comment.parent().addClass("error");

        //}
      //});

    },

    _ok: function(ev) {

      if(ev) ev.preventDefault();

      this.ok();
    },

  });

  var nameInput       = new InputModel({ template_name: "templates/contact/input", type: "text", name: "name" });
  var emailInput      = new InputModel({ template_name: "templates/contact/input", type: "text", name: "name" });
  var commentTextarea = new InputModel({ template_name: "templates/contact/textarea", type: "text", name: "name" });

  var inputs = new Inputs([nameInput, emailInput, commentTextarea]);

  var dialog = new MyDialog({
    model: new dialogModel(),
    title: 'test',
    description: 'long description here',
    template_name: 'templates/contact/contact',
    collection: inputs,
    width:  458,
    height: 539
  });


  window.dialog = dialog;
  $('body').append(dialog.render().el);

});
