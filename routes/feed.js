var LiveJournal = require('livejournal');

var cache = null;

exports.get = function(req, res) {

  if (cache) {
    console.log('cached');
    res.json(cache);
  } else {

    LiveJournal.RPC.getfriendspage({
      username: config.username,
      password: config.password,
      get_video_ids: true,
      itemshow: req.query.itemshow || 10,
      skip: req.query.skip || 0
    }, function(err, feed) {

      feed.entries.forEach(function(entry) {
        entry.username = entry.postername;
        entry.body = entry.event_raw;
      });

      // cache = feed;

      res.json(feed);
    });

  }

};
