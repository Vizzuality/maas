
var MyDialog = cdb.ui.common.Dialog.extend({
  render_content: function() {
    return "my content";
  },
})
var dialog = new MyDialog({
  title: 'test',
  description: 'long description here',
  template_name: 'templates/contact',

  width: 500
});

console.log(dialog.render().el);

$('body').append(dialog.render().el);

dialog.open();
