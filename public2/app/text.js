App.Text = (function() {

  var factory = {};

  var rx_lj_comm = /\<lj\s+comm\=\"?([a-zA-Z0-9_]+)\"?\>/ig;

  var rx_lj_embed = /\<lj-embed\s+id\=\"?([a-zA-Z0-9_]+)\"?\s*\/?\>/ig;

  var rx_iframe = /(<iframe.*?>.*?<\/iframe>)/g;

  var rx_src = /src="(.*?)"/;

  function process(body) {
    body = body.replace('<a name="Read more..."></a>', '');

    var nodes = $.parseHTML('<div>' + body + '</div>'),
        $body = $(nodes);

    // fix youtube links from mobile version
    // $body.find('[source="youtube"]').each(function(index, node) {
    //   var $node = $(node);

    //   $node.replaceWith('<div class="b-embed"><iframe type="text/html" src="http://www.youtube.com/embed/' + $node.attr('vid') + '" frameborder="0"/></div>');
    // });

    // $body.find('iframe').remove();

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

    // var cut = $body.children().eq(3).nextUntil();

    // if (cut.length > 3) {
    //   var div = cut.wrapAll('<div class="cut"><span class="cut-content"></span></div>');

    //   div.parent().wrap(function() {
    //     return '<!--' + $(this).html() + '-->';
    //   });
    // }

    return $body.html();
  }

  factory.clean = function(text) {
    text = String(text)
    .replace(rx_iframe, function(frame) {
      var match = frame.match(rx_src);

      if (match && match.length > 1) {
        return '<div class="b-embed-hidden" data-src="' + match[1] + '"></div>';
      }

      return frame;
    });

    return text;
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

  // auto-paragraph
  function p(s) {
    if (!s || s.search(/\n|\r/) == -1) {
      return s;
    }
    var  X = function(x, a, b) {return x.replace(new RegExp(a, 'g'), b)};
    var  R = function(a, b) {return s = X(s, a, b)};
    var blocks = '(table|thead|tfoot|caption|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select'
    blocks += '|form|blockquote|address|math|style|script|object|input|param|p|h[1-6])';
    s += '\n';
    R('<br />\\s*<br />', '\n\n');
    R('(<' + blocks + '[^>]*>)', '\n$1');
    R('(</' + blocks + '>)', '$1\n\n');
    R('\r\n|\r', '\n'); // cross-platform newlines
    R('\n\n+', '\n\n');// take care of duplicates
    R('\n?((.|\n)+?)\n\\s*\n', '<p>$1</p>\n');// make paragraphs
    R('\n?((.|\n)+?)$', '<p>$1</p>\n');//including one at the end
    R('<p>\\s*?</p>', '');// under certain strange conditions it could create a P of entirely whitespace
    R('<p>(<div[^>]*>\\s*)', '$1<p>');
    R('<p>([^<]+)\\s*?(</(div|address|form)[^>]*>)', '<p>$1</p>$2');
    R('<p>\\s*(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
    R('<p>(<li.+?)</p>', '$1');// problem with nested lists
    R('<p><blockquote([^>]*)>', '<blockquote$1><p>');
    R('</blockquote></p>', '</p></blockquote>');
    R('<p>\\s*(</?' + blocks + '[^>]*>)', '$1');
    R('(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
    R('<(script|style)(.|\n)*?</\\1>', function(m0) {return X(m0, '\n', '<PNL>')});
    R('(<br />)?\\s*\n', '<br />\n');
    R('<PNL>', '\n');
    R('(</?' + blocks + '[^>]*>)\\s*<br />', '$1');
    R('<br />(\\s*</?(p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)', '$1');
    if (s.indexOf('<pre') != -1) {
      R('(<pre(.|\n)*?>)((.|\n)*?)</pre>', function(m0, m1, m2, m3) {
        return X(m1, '\\\\([\'\"\\\\])', '$1') + X(X(X(m3, '<p>', '\n'), '</p>|<br />', ''), '\\\\([\'\"\\\\])', '$1') + '</pre>';
      });
    }
    return R('\n</p>$', '</p>');
  }

})();
