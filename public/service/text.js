angular.module('LJ')
.filter('prettify', ['Text', function(Text) {
  return function (text, length, end) {
    return Text.prettify(text);
  };
}]);


angular.module('LJ').factory('Text', ['$filter', function($filter) {
  var factory = {};

  var rx_lj_comm = /\<lj\s+comm\=\"?([a-zA-Z0-9_]+)\"?\>/ig;

  function process(body) {
    body = body.replace('<a name="Read more..."></a>', '');
    // body = body.replace(/<br><br><br>/g, '<br><br>');

    // console.log(body);

    var nodes = $.parseHTML('<div>' + body + '</div>'),
        $body = $(nodes);

    // fix youtube links from mobile version
    $body.find('[source="youtube"]').each(function(index, node) {
      // var $node = $(node),
      //     rxYoutube = /youtube\.com\/watch\?v\=([\-a-zA-Z0-9]+)/i,
      //     matches = $node.html().match(rxYoutube);

      // if (matches && matches.length > 1) {
        var $node = $(node);

        $node.replaceWith('<div class="b-embed"><iframe type="text/html" src="http://www.youtube.com/embed/' + $node.attr('vid') + '" frameborder="0"/></div>');
      // }
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

    // remove add friend links
    $body.find('a[href*="add.bml"]').remove();

    // remove flag counters
    // $body.find('a[href*="flagcounter.com"]').remove();

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
    text = text.replace(rx_lj_comm, function(_, comm) {
      return '<span lj-community>' + comm + '</span>';
    });

    return process( p(text) );
  }

  return factory;

}]);
