App.Comments = Backbone.Model.extend({

  level: {},

  process: function(comments) {
    var that = this;

    comments.forEach(function(comment) {
      if (!comment.parentdtalkid) {
        comment.level = 0;
      } else {
        if (that.level[comment.parentdtalkid]) {
          comment.level = that.level[comment.parentdtalkid] + 1;
        } else {
          comment.level = 1;
        }
        
        that.level[comment.dtalkid] = comment.level;
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
    'click .b-comments__more': 'more',
    'click .b-commentbox-submit': 'submit',
    'click .b-reply': 'reply'
  },

  toggle: function(state) {
    var node = $('#comment_text');

    this.$el.find('.b-comments').toggleClass('b-commentbox-hidden', state);

    if (state) {
      node.val('');
    } else {
      setTimeout(function() {
        node.focus();
      }, 0);
    }
  },

  reply: function(event) {
    event.preventDefault();

    var button = $(event.currentTarget);

    button.parent().after(
      $('.b-commentbox')
    );
    
    this.toggle(false);

    this.model.set('replyTo', button.data('id'));
  },

  submit: function(event) {
    event.preventDefault();

    var node = $('#comment_text'),
        body = node.val().trim();

    if (!body) {
      return;
    }

    var replyTo = this.model.get('replyTo');

    var comments = [{
      body: body,
      postername: 'agentcooper',
      parentdtalkid: replyTo,
      dtalkid: Math.floor(Math.random() * 100000)
    }];

    this.model.process(comments);

    this.renderNext(comments, replyTo);

    this.toggle(true);
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

  renderNext: function(comments, parent) {
    var that = this;

    if (!comments) {
      return;
    }

    var comments = comments.map(function(comment) {
      return App.tmpl('comment-tmpl')({ comment: comment });
    }).join('');

    if (parent) {
      this.$el.find('#c' + parent).after(comments);
    } else {
      this.$el.find('.b-thread').append(comments);
    }
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
