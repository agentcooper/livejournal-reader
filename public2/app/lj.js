var LJ = {

  post: {},
  
  journal: {},

  /*
   * Normalize and cache post data from any source (post, journal, feed)
   */
  makePost: function(data, options) {
    if (!data) {
      return;
    }

    data.body    = App.Text.prettify(data.event || data.body);

    data.subject = data.subject_raw || data.subject;

    data.post_id = data.ditemid;

    data.journal = data.journalname || options.journal;
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

    this.post[data.journal + (data.ditemid || options.postId)] = data;
  },

  getPost: function(options, callback) {
    var that = this;

    var cached = this.post[options.journal + options.postId];
    if (cached) {
      console.log('cached post');
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

    var cached = this.journal[options.journal];
    
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

      _.each(journal.events, function(event) {
        that.makePost(event, options);
      })

      that.journal[options.journal] = journal;

      callback(journal);
    });
  }
};

LJ.rxLink = [
  /([0-9a-zA-Z-_]+)\.livejournal\.com\/([0-9]+)\.html/,
  /m\.livejournal\.com\/read\/[a-z]+\/([0-9a-zA-Z_-]+)\/(\d+)/,
  /users\.livejournal\.com\/([0-9a-zA-Z-_]+)\/([0-9]+).html/
];

LJ.parseLink = function(url) {
  if (!url) {
    return null;
  }

  for (var i = 0, match; i < LJ.rxLink.length; i++) {
    match = url.match(LJ.rxLink[i]);

    if (match && match.length === 3) {
      return { journal: match[1], postId: match[2] };
    }
  }

  return null;
};
