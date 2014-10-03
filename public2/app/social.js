(function() {

'use strict';

var networks = {
  twitter: function(post) {
    return [
      'https://twitter.com/intent/tweet?url=',
      location.href,
      '&text=',
      post.subject
    ].join('')
  },

  facebook: function(post) {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + location.href + '&t=' + post.subject;
  }
};

$(function() {
  $(document.body).on('click', '.b-share__network', function(event) {
    event.preventDefault();

    var node = $(event.currentTarget),
        options = node.closest('.b-share-options'),
        network = node.data('network');

    LJ.getPost({
      journal: options.data('journal'),
      postId: options.data('post-id')
    }, function(post) {
      if (App.drop) {
        App.drop.close();
      }

      window.open(
        networks[network](post),
        network,
        'width=550,height=420'
      );
    });

  });
});

})();
