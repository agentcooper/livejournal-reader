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

function cached(Constructor, cacher) {
  var _cache = {};

  cacher = cacher || function() { return 1; };

  var f = function(args) {
    var key = cacher(args);

    if (!_cache[key]) {
      _cache[key] = new Constructor(args);
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
  lang: /en\./.test(location.hostname) ? 'en' : 'ru',

  tmpl: function(name) {
    return window.JST[name];
  },

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

  /*
   * Angular-like bindins for classNames
   *
   * data-bind-class={ 'someClass': 'someProperty' }
   */
  applyBindings: function(context) {
    var classNameBindings = context.$el.find('[data-bind-class]'),
        bindinds = eval('(' + classNameBindings.data('bind-class') + ')');

    for (var className in bindinds) {
      this.bind(context, bindinds[className], className);
    }
  },

  bind: function(context, property, className) {
    context.model.on('change:' + property + ' init', function() {
      context.$el.toggleClass(className, context.model.get(property));
    }).trigger('init');
  }
}

$(function() {
  var router = new App.Router();

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
