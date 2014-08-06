App.Comments = Backbone.Model.extend({

  level: {},

  addComment: function(comment, callback) {
    console.log('Posting comment', comment);

    var data = {
      body: comment.body,
      parent: comment.parentdtalkid,
      journal: comment.journal,
      ditemid: comment.ditemid
    };

    console.log(data);

    $.post('/api/comments/add', data, function(result) {
      callback(result);
    });
  },

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

      Array.prototype.push.apply(that.get('comments'), comments);
      that.trigger('push:comments', comments);

      that.set('loading', false);

      that.set('hasMore', that.get('page') < result.pages);

    });
  },

  initialize: function() {
    this.set('comments', []);

    this.loadMore();
  }
});

App.CommentsView = Backbone.View.extend({
  events: {
    'click .b-comments__more': 'more',
    'click .b-commentbox-submit': 'submit',
    'click .b-reply': 'reply',
    'click .b-replybutton': 'reply'
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

    var button = $(event.currentTarget),
        id = button.data('id');

    button.parent().after(
      $('.b-commentbox')
    );
    
    this.toggle(false);

    if (id) {
      this.model.set('replyTo', id);
    }
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
      dtalkid: Math.floor(Math.random() * 100000),
      journal: 'agentcooper',
      ditemid: this.model.get('postId'),
      userpic: App.profile.get('profile').defaultpicurl
    }];

    if (replyTo) {
      comments[0].parentdtalkid = replyTo;
    }

    this.model.process(comments);

    this.renderNext(comments, replyTo);

    this.model.addComment(comments[0], function(result) {
      if (result.error) {
        return console.error(result);
      }

      result.dtalkid
    });

    this.toggle(true);
  },

  more: function() {
    console.log('more');

    this.model.set('page', this.model.get('page') + 1);
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

    if (!comments || comments.length === 0) {
      return;
    }

    console.log('comments renderNext')

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

    console.log('Comments render', comments);

    this.$el.html(
      App.tmpl('comments-tmpl')()
    );

    if (comments) {
      this.renderNext(comments);
    }
    
    App.applyBindings(this);
  }
});

App.Comments = cached(App.Comments, function(args) {
  return args.journal + args.postId;
});
