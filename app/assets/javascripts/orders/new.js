$(function(){

  $('#templates-list').find('a').click(function(){
    $('#templates-detail').find('.template').removeClass('selected');
    $('#templates-detail').find('.' + $(this).attr('class')).addClass('selected');
  });

  $('#templates-detail').find('.template').find('.options').find('input:checkbox').change(function(){
    var li = $(this).closest('li')
      , template = li.closest('.template');

    li.toggleClass('selected');

    var ammount = 0;
    ammount += parseInt(template.find('.price').text().replace(/[$|€]/, ''));

    template.find('.selected').find('.option_price').each(function(){
      ammount += parseInt($(this).text().replace(/[$|€]/, ''));
    });

    template.find('.total').find('.ammount').find('span').html(ammount);
  });

});
