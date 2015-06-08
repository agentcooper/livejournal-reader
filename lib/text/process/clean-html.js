var $ = require('jquery');

module.exports = function(text) {
  var nodes = $.parseHTML('<div>' + text + '</div>'),
      $body = $(nodes);

  // remove center
  $body.find('center, u, font').each(function(index, element) {
    var $element = $(element);
    $element.replaceWith($element.contents());
  });

  // remove custom fonts and colors
  $body.find('*[style]').removeAttr('style');

  $body.find('*[align]').removeAttr('align');

  // remove add friend links
  $body.find('a[href*="add.bml"]').remove();

  $body.find('p')
    .filter(function() {
        return $.trim($(this).text()) === '' && $(this).children().length == 0;
    })
    .remove();

  // transform <lj user="someuser"> into actual links

  $body.find('lj[user]').replaceWith(function() {
    var user = $(this).attr('user');

    return [
      '<a href="/read/' + user + '" class="b-lj_user">',
        user,
      '</a>'
    ].join('');
  });

  return $body.html();
}
