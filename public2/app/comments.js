App.Comments = Backbone.Model.extend({

  process: function(comments) {
    var level = {};
    var that = this;

    comments.forEach(function(comment) {
      if (!comment.parentdtalkid) {
        comment.level = 0;
      } else {
        if (level[comment.parentdtalkid]) {
          comment.level = level[comment.parentdtalkid] + 1;
        } else {
          comment.level = 1;
        }
        
        level[comment.dtalkid] = comment.level;
      }

      comment.body = App.Text.clean(comment.body);
      comment.isAuthor = comment.postername === that.get('journal');
    });
  },

  defaults: {
    page_size: 5,
    
    page: 1,

    comments: [],

    hasMore: false
  },

  loadMore: function() {
    var that = this;

    this.set('loading', true);

    $.get('/api/comments/', {
      user:      this.get('journal'),
      post_id:   this.get('postId'),
      page_size: this.get('page_size'),
      page:      this.get('page')
    }, function(result) {
      var comments = result.comments;

      console.log(result);

      that.process(comments);

      that.get('comments').push(comments);
      that.trigger('push:comments', comments);

      that.set('loading', false);

      that.set('hasMore', that.get('page') < result.pages);

    });
  },

  initialize: function() {
    this.loadMore();
  }
});

App.CommentsView = Backbone.View.extend({
  events: {
    'click .b-comments__more': 'more'
  },

  more: function() {
    console.log('more');

    this.model.set( 'page', this.model.get('page') + 1 );
    this.model.loadMore();
  },

  initialize: function() {
    var that = this;

    this.render();

    this.model.on('push:comments', function(comments) {
      that.renderNext(comments);
    });
  },

  renderNext: function(comments) {
    var that = this;

    if (!comments) {
      return;
    }

    this.$el.find('.b-thread').append(
      comments.map(function(comment) {
        return App.tmpl('comment-tmpl')({ comment: comment });
      }).join('')
    );
  },

  render: function() {
    var comments = this.model.get('comments');

    console.log('comments render', comments);

    this.$el.html(
      App.tmpl('comments-tmpl')()
    );
    
    App.applyBindings(this);
  }
});
