$(function(){

  $('#your_data').find('.data_source_type').change(function(e){

    $(this).parent().find('div').hide();
    $(this).parent().find('div').find('input').attr('disabled', true);

    if ($(this).is(':checked')) {
      $(this).next().next('div').find('input').attr('disabled', false);
      $(this).next().next('div').show();
    }

  });

});
