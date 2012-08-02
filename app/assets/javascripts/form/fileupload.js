$(function() {

  if ($("file-uploader").length > 0) {
    var
    i         = 0,
    progress  = 0,
    processed = [];

    var uploader = new qq.FileUploader({
      element: document.getElementById('file-uploader'),
      action: '/client_data',

      onSubmit: function(id, fileName){
        $(".qq-uploader").addClass("uploading");
        $("section#upload").removeClass("finished");
        $(".qq-uploader .progress .bar span").removeClass("big");
      },
      onProgress: function(id, fileName, loaded, total){
        p = Math.round(loaded/total * 100);
        if (p > progress) {
          progress = p;
        }

        $(".qq-uploader .progress .bar").css({ width: progress + "%" });

        if (progress > 95) {
          $(".qq-uploader .progress .bar span").addClass("big");
        }  else {
          $(".qq-uploader .progress .bar span").removeClass("big");
        }

        $(".qq-uploader .progress .bar span").html(progress + "%");
        $(".qq-uploader").addClass("uploading");
      },

      onComplete: function(id, fileName, files, responseJSON){
        var data = responseJSON.data;
        var id = data.id;

        if (!processed[data.id]) {
          var $field = $('<input id="order_client_data_attributes_' + i + '_id" name="order[client_data_attributes][' + i + '][id]" value="' + id + '"type="hidden" />');
          processed[data.id] = true;
          i++;
        }

        $("form").append($field);

        progress = 0;

        var z = _.compact(_.clone(files));

        if (z.length <= 1) {
          $("section#upload").addClass("finished");
        }

        $(".qq-uploader .progress .bar").fadeOut(250, function() {
          $(".qq-uploader .progress .bar").css({ width: 0 });
          $(".qq-uploader .progress .bar").show();
        });

        $(".qq-uploader").removeClass("uploading");
      },
      onCancel: function(id, fileName){
        $(".qq-uploader").removeClass("uploading");
        $(".qq-uploader .progress .bar").fadeOut(250, function() {
          $(".qq-uploader .progress .bar").css({ width: 0 });
          $(".qq-uploader .progress .bar").show();
        });
      },

      template: '<ul class="qq-upload-list"></ul>'  +
        '<div class="qq-uploader">' +
        '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' +
        '<div class="placeholder"><div class="icon"></div><div class="qq-upload-button">To attach files drag & drop here or <a href="#">select files from your computer</a>.</div></div>' +
        '<div class="progress"><div class="bar"><span>0</span></div></div>' +
        '</div>'
    });
  }
});
