App.Post = Backbone.Model.extend({
  initialize: function() {
    console.log('Post init');

    var that = this;

    LJ.getPost({
      journal: this.get('journal'),
      postId:  this.get('postId')
    }, function(result) {
      console.log(result);

      that.set('post', result);
    });

    this.comments = new App.Comments({
      journal: this.get('journal'),
      postId:  this.get('postId')
    });
  }
});

App.PostView = Backbone.View.extend({
  initialize: function() {
    var that = this;

    this.model.on('change:post init', that.render.bind(this));

    this.render();
  },

  render: function() {
    console.log('Post render');

    var post = this.model.get('post');

    if (!post) {
      this.$el.empty();
      return;
    }

    this.$el.html(
      App.tmpl('post-tmpl')({ post: post })
    );

    new App.CommentsView({
      model: this.model.comments,
      el: '.b-post-comments'
    });

    $(document).scrollTop(0);
  }
});

App.Post = cached(App.Post, function(args) {
  return args.journal + args.postId;
});
