_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

function tmpl(name) {
  return window.JST[name];
}

function singleton(Constructor) {
  var f = function(args) {
    if (!Constructor.instance) {
      Constructor.instance = new Constructor(args);
    }

    return Constructor.instance;
  }

  f.prototype = Constructor.prototype;

  return f;
}

function cached(cacher, Constructor) {
  var _cache = {};

  var f = function(args) {
    var key = cacher(args);

    if (!_cache[key]) {
      _cache[key] = new Constructor(args);
      console.log('created new cache entry', _cache);
    }

    return _cache[key];
  }

  f.prototype = Constructor.prototype;

  return f;
}

var postRender = {
  postRender: function() {
    var root = this.$el.children(':first');
    console.log('postRender');

    if (this.height) {
      root.css('height', this.height);
    }

    this.height = root.height();

    App.scroll.restore();
  }
};

var App = {
  scroll: (function() {

    var cache = {};

    return {
      save: function(url) {
        url = url || location.href;

        cache[url] = $(window).scrollTop();
        
        console.log('scroll saved', cache);
      },

      restore: function(url) {
        url = url || location.href;
        
        if (typeof cache[url] !== 'undefined') {
          setTimeout(function() {
            $(window).scrollTop(cache[url]);
          }, 0);
          
          console.log('scroll restored', cache[url]);
        }
      }
    }

  })(),

  progress: {
    start: function() {
      NProgress.start();
    },
    complete: function() {
      NProgress.done();
    }
  },

  cache: {},

  journals: {},

  makePost: function(data, options) {
    if (!data) {
      return;
    }

    data.body    = Text.prettify(data.event);

    data.post_id = data.ditemid;

    data.journal = options.journal;
    data.visited = Date.now();

    if (data.props && data.props.taglist) {
      data.props.tags = data.props.taglist.split(/[,\s]+/).map(function(tag) {
        var blogSearchLink = [
          'http://blogs.yandex.ru/search.xml',
          '?text=&ft=blog%2Ccomments%2Cmicro&server=livejournal.com',
          '&category=' + encodeURIComponent(tag) + '&holdres=mark'
        ].join('');

        return '<a target="_blank" href="' + blogSearchLink + '">' + tag + '</a>';
      }).join(', ');
    }

    this.cache[options.journal + (data.ditemid || options.postId)] = data;

    window.cache = this.cache;
  },

  getPost: function(options, callback) {
    var that = this;

    var cached = this.cache[options.journal + options.postId];
    if (cached) {
      console.log('cached');
      return callback(cached);
    }

    App.progress.start();
    $.get('/api/post', {
      user: options.journal,
      post_id: options.postId,
      body: true
    }, function(post) {
      that.makePost(post, options);

      App.progress.complete();

      callback(post);
    });
  },

  getJournal: function(options, callback) {
    var that = this;

    var cached = this.journals[options.journal];
    if (cached) {
      console.log('cached');
      return callback(cached);
    }

    App.progress.start();

    $.get('/api/journal', {
      user: options.journal,
    }).success(function(journal) {

      console.log('Got journal', journal);
      
      App.progress.complete();

      journal.events.forEach(function(event) {
        that.makePost(event, options);
      });

      that.journals[options.journal] = journal;
      callback(journal);
    });
  }
}

var Router = Backbone.Router.extend({
  routes: {
    '': 'rating',
    'read/:journal/:postId': 'post',
    'read/:journal(/)': 'journal',
    'feed(/)': 'feed',
    'about(/)': 'about',
    'history(/)': 'history'
  },

  history: function() {
    new HistoryView({ el: '.b-main' }).render();
  },

  about: function() {
    new AboutView({ el: '.b-main' }).render();
  },

  feed: function() {
    console.log('feed route');

    new FeedView({
      model: new Feed(),
      el: '.b-main'
    }).render();
  },

  rating: function() {
    console.log('rating route');

    new RatingView({
      model: Rating.getInstance(),
      el: '.b-main'
    }).render();
  },

  journal: function(journal) {
    console.log('journal route', arguments);

    var j = new Journal({ name: journal });

    new JournalView({
      model: j,
      el: '.b-main'
    }).render();
  },

  post: function(journal, postId) {
    console.log('post route', arguments);

    new PostView({
      model: new Post({ journal: journal, postId: postId }),
      el: '.b-main'
    });
  }
});

$(function() {
  var router;

  // function loadTemplates(templates, callback) {
  //   $.when.apply($, templates.map($.get)).done(function() {
  //     Array.prototype.slice.call(arguments).map(function(template) {
  //       return template[0];
  //     }).forEach(function(template, index) {
  //       $(document.body).append(
  //         $('<script/>', {
  //           type: 'text/template',
  //           html: template,
  //           id:   templates[index].split('/').pop().replace('.', '-')
  //         })
  //       );
  //     });

  //     callback();
  //   });
  // }

  // console.log('Loading templates...');
  // loadTemplates([
  //   '/templates/post.tmpl',
  //   '/templates/rating.tmpl',
  //   '/templates/journal.tmpl',
  //   '/templates/comments.tmpl',
  //   '/templates/comment.tmpl',
  //   '/templates/feed.tmpl'
  // ], function() {
  //   console.log('done');
    
  // });


  router = new Router();

  Backbone.history.start({ pushState: true });

  $(document.body).on('click', 'a:not([data-click])', function(event) {
    var href = $(this).attr('href');

    if (href.charAt(0) === '/') {
      
      event.preventDefault();
      App.scroll.save();
      router.navigate(href, true);

    } else {

      if (href) {
        var post = LJ.parseLink(href);

        if (post) {
          event.preventDefault();
          App.scroll.save();
          router.navigate('/read/' + post.journal + '/' + post.postId, true);
        } 
      }

    }

  });
});

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

function applyBindings(context) {
  var classNameBindings = context.$el.find('[data-bind-class]'),
      bindinds = eval('(' + classNameBindings.data('bind-class') + ')');

  for (var className in bindinds) {
    bind(context, bindinds[className], className);
  }
}

function bind(context, property, className) {
  context.model.on('change:' + property + ' init', function() {
    context.$el.toggleClass(className, context.model.get(property));
  }).trigger('init');
}
