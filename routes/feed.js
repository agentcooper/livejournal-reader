'use strict';

var LiveJournal = require('livejournal');

var auth = require('./auth');

exports.get = function(req, res) {
  LiveJournal.xmlrpc.setAuth(auth.buildHeader(req));

  LiveJournal.xmlrpc.getfriendspage({
    auth_method: 'oauth',
    get_video_ids: true,
    itemshow: req.query.itemshow || 10,
    skip: req.query.skip || 0
  }, function(err, feed) {

    feed.entries.forEach(function(entry) {
      entry.username = entry.postername;
      entry.body = entry.event_raw;
    });

    res.json(feed);
  });
};
