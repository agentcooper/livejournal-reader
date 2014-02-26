angular.module('LJ', [
  'ngRoute',
  'infinite-scroll',
  'ngProgress',
  'pasvaz.bindonce'
]);

var scroll = {
  _last: {},

  save: function($location) {
    var url = (typeof $location === 'object') ? $location.absUrl() : $location;

    this._last[url] = $(window).scrollTop();
  },

  restore: function($location) {
    var url = (typeof $location === 'object') ? $location.absUrl() : $location;

    $(window).scrollTop(this._last[url]);
  }
};

angular.module('LJ')
.factory('nowTime', ['$timeout', function($timeout) {
  var nowTime;
  (function updateTime() {
    nowTime = Date.now();
    $timeout(updateTime, 1000);
  }());
  return function() {
    return nowTime;
  };
}]);

angular.module('LJ')
.filter('timeAgo', ['nowTime', function(now) {
  return function(input) {
    return moment(input * 1000).from(now());
  };
}])
.filter('timeAgo2', [function() {
  return function(input) {
    return moment(input).fromNow();;
  };
}]);

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

var LJ = {};

var rxLink = [
  /([0-9a-zA-Z-_]+)\.livejournal\.com\/([0-9]+)\.html/,
  /m\.livejournal\.com\/read\/[a-z]+\/([0-9a-zA-Z_-]+)\/(\d+)/,
  /users\.livejournal\.com\/([0-9a-zA-Z-_]+)\/([0-9]+).html/
];


LJ.parseLink = function(url) {
  if (!url) {
    return null;
  }

  for (var i = 0, match; i < rxLink.length; i++) {
    match = url.match(rxLink[i]);

    if (match && match.length === 3) {
      return { journal: match[1], postId: match[2] };
    }
  }

  return null;
};

$(function() {
  $(document.body).on('click', 'a', function(event) {
    var href = $(this).attr('href');

    if (href) {
      var post = LJ.parseLink(href);

      if (post) {
        $(this)
          .removeAttr('target')
          .attr('href', '/read/' + post.journal + '/' + post.postId);
      } 
    }
  });
});
