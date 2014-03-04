App.Router = Backbone.Router.extend({
  routes: {
    '': 'rating',
    'read/:journal/:postId': 'post',
    'read/:journal(/)': 'journal',
    'feed(/)': 'feed',
    'about(/)': 'about',
    'history(/)': 'history'
  },

  history: function() {
    new App.HistoryView({
      el: '.b-main'
    }).render();
  },

  about: function() {
    new App.AboutView({
      el: '.b-main'
    }).render();
  },

  feed: function() {
    console.log('feed route');

    new App.FeedView({
      model: new App.Feed(),
      el: '.b-main'
    }).render();
  },

  rating: function() {
    console.log('rating route');

    new App.RatingView({
      model: new App.Rating(),
      el: '.b-main'
    }).render();
  },

  journal: function(journal) {
    console.log('journal route', arguments);

    new App.JournalView({
      model: new App.Journal({ name: journal }),
      el: '.b-main'
    }).render();
  },

  post: function(journal, postId) {
    console.log('post route', arguments);

    new App.PostView({
      model: new App.Post({ journal: journal, postId: postId }),
      el: '.b-main'
    });
  }
});
