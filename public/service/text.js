angular.module('LJ').factory('Text', ['$filter', function($filter) {
  var factory = {};

  var rx_lj_comm = /\<lj\s+comm\=\"?([a-zA-Z0-9_]+)\"?\>/ig;

  var rx_lj_embed = /\<lj-embed\s+id\=\"?([a-zA-Z0-9_]+)\"?\s*\/?\>/ig;

  function process(body) {
    body = body.replace('<a name="Read more..."></a>', '');

    var nodes = $.parseHTML('<div>' + body + '</div>'),
        $body = $(nodes);

    // fix youtube links from mobile version
    $body.find('[source="youtube"]').each(function(index, node) {
      var $node = $(node);

      $node.replaceWith('<div class="b-embed"><iframe type="text/html" src="http://www.youtube.com/embed/' + $node.attr('vid') + '" frameborder="0"/></div>');
    });

    // remove read-more
    $body.find('a[name="Read more..."]').remove();

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

    // maximum to consequent br tags
    $body.find('br').each(function(index, node) {
      var $node = $(node),
          next  = $node.get(0).nextSibling;

      if (!$(next).is('br')) {
        return;
      }

      while (next = next.nextSibling) {
        if ( $(next).is('br') ) {
          $(next).remove();
        }
      }
    });

    return $body.html();
  }

  factory.prettify = function(text) {
    text = String(text)
    .replace(rx_lj_comm, function(_, comm) {
      return '<span lj-community>' + comm + '</span>';
    })
    .replace(rx_lj_embed, function(_, embed) {
      return '<span lj-embed>[lj-embed:' + embed + ']</span>';
    });

    return process( p(text) );
  }

  return factory;

}]);
