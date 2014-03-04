var FeedS = {

  feed: null,

  fetch: function(options, callback) {
    var that = this;

    $.get('/api/feed', {
      skip: options.skip || 0,
      itemshow: options.itemshow || 7
    }, function(feed) {

      feed.entries.forEach(function(entry) {
        entry.body = App.Text.prettify(entry.body);
      });

      callback(feed);
    });
  },

};

App.Feed = Backbone.Model.extend({
  initialize: function() {
    this.getFeed({}, function() {});
  },

  getFeed: function(options, callback) {
    console.log('fetching feed');

    var that = this;

    App.progress.start();
    that.set('loading', true);

    FeedS.fetch(options, function(feed) {      
      that.set('loading', false);

      that.set('feed', feed);
      App.progress.complete();
    });
  }
});

App.Feed = singleton(App.Feed);

App.FeedView = Backbone.View.extend({
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

    this.model.on('change:feed', this.render.bind(this));

    // $(document).on('scroll', this.checkScroll.bind(this));
  },

  render: function() {
    var that = this;

    var feed = this.model.get('feed');

    if (!feed) {
      return;
    }

    console.log('render feed');

    this.$el.html(
      App.tmpl('feed-tmpl')({ feed: feed })
    );

    setTimeout(function() {
      that.locked = false;
    }, 100);

    this.postRender();
  }
});

// console.log('extedin', postRender);
_.extend(App.FeedView.prototype, postRender);
