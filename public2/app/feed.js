function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

var FeedS = {

  feed: null,

  fetch: function(options, callback) {
    var that = this;

    $.get('/auth/feed', _.extend(
      {
        skip: options.skip || 0,
        itemshow: options.itemshow || 7
      },
      getAuth()
    ), function(feed) {

      console.log(feed);

      feed.entries.forEach(function(entry) {
        // entry.body = App.Text.prettify(entry.body);

        LJ.makePost(entry);
      });

      callback(feed);
    });
  },

};

function getAuth() {
  return {
    oauth_token: getCookie('oauth_token'),
    oauth_token_secret: getCookie('oauth_token_secret')
  };
}

App.Feed = Backbone.Model.extend({
  defaults: {
    entries: []
  },

  initialize: function() {
    this.getFeed({}, function() {});
  },

  getFeed: function(options, callback) {
    console.log('fetching feed');

    var that = this;

    App.progress.start();

    FeedS.fetch(options, function(feed) {

      console.log('Got feed', feed);

      Array.prototype.push.apply(that.get('entries'), feed.entries);
      that.trigger('push:entries', feed.entries);

      App.progress.complete();
    });
  }
});

App.Feed = singleton(App.Feed);

App.FeedView = Backbone.View.extend({
  events: {
    'click .b-feed__loadMore': 'more'
  },

  more: function() {
    console.log('more');

    this.locked = true;

    this.model.getFeed({
      skip: this.model.get('entries').length
    });
  },

  checkScroll: function() {
    var that = this;
    var triggerPoint = 100;

    if (this.locked) {
      console.log('locked');
      return;
    }

    if($(window).scrollTop() + $(window).height() > $(document).height() - triggerPoint) {
      this.locked = true;

      this.model.getFeed({
        skip: this.model.get('feed').entries.length
      });
    }
  },

  initialize: function() {
    console.log('FeedView init');

    this.model.on('push:entries', this.renderNext.bind(this));

    // $(document).on('scroll', this.checkScroll.bind(this));
  },

  renderNext: function(entries) {
    var that = this;

    if (!entries) {
      return;
    }

    this.$el.find('.b-feed_entries').append(
      entries.map(function(entry) {
        return App.tmpl('entry-tmpl')({ entry: entry });
      }).join('')
    );

    this.postRender();
  },

  render: function() {
    var that = this;

    var entries = this.model.get('entries');

    if (!entries) {
      return;
    }

    console.log('render feed');

    this.$el.html(
      App.tmpl('feed-tmpl')()
    );

    this.renderNext(entries);
  }
});

App.FeedView = singleton(App.FeedView);

// console.log('extedin', postRender);
_.extend(App.FeedView.prototype, postRender);
