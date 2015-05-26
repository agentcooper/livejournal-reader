/* @flow */

var request = require('superagent');

var NProgress = require('nprogress');

var textUtils = require('./textUtils');

module.exports = {

  post: {},
  
  journal: {},

  USERPIC: {
    DEFAULT: 'http://stat.livejournal.com/img/userpics/userpic-user.png',
    ANONYMOUS: 'http://stat.livejournal.com/img/userpics/userpic-anonymous.png'
  },

  makePost: function(data:Object, options:Object):void {
    if (!data) {
      return;
    }

    data.body    = textUtils.prettify(data.event || data.body);

    data.subject = data.subject_raw || data.subject;

    data.postId = data.ditemid;

    data.journal = data.journalname || data.username || options.journal;
    data.visited = Date.now();

    this.post[data.journal + (data.ditemid || options.postId)] = data;
  },

  getPost: function(options:Object, callback:Function) {
    var that = this;

    var cached = this.post[options.journal + options.postId];
    if (cached) {
      console.log('cached post');
      return callback(null, cached);
    }

    NProgress.start();

    request.get('/api/post').query({
      user: options.journal,
      post_id: options.postId,
      body: true
    }).end(function(err, res) {
      that.makePost(res.body, options);

      NProgress.done();

      callback(err, res.body);
    });
  },

  getJournal: function(options:Object, callback:Function) {
    var that = this;

    var cached = this.journal[options.journal];
    
    if (cached) {
      return callback(null, cached);
    }

    NProgress.start();

    request.get('/api/journal').query({
      user: options.journal
    }).end(function(err, res) {
      var journal = res.body;

      journal.events.forEach(function(event) {
        that.makePost(event, options);
      });

      that.journal[options.journal] = journal;

      NProgress.done();

      callback(err, journal);
    });
  },

  _rating: null,

  getRating: function():Promise {
    return new Promise((resolve, reject) => {

      if (this._rating) {
        return resolve(this._rating);
      }

      NProgress.start();

      request.get('/top_ru_RU.json').end((err, res) => {
        this._rating = res.body;

        this._rating.top.splice(100);

        NProgress.done();

        resolve(this._rating);
      });

    });
  },

  getFeed: function(options):Promise {
    return new Promise((resolve, reject) => {
      NProgress.start();

      Object.assign(options, {
        username: 'agentcooper',
        password: 'peakstwin-L11',
      });

      request.get('/api/feed').query(options).end((err, res) => {
        var feed = res.body;

        feed.entries.forEach((entry) => {
          this.makePost(entry);
        });

        NProgress.done();

        resolve(feed);
      });
    });
  }
};
