var LiveJournal = require('livejournal');

try {
  var config = require('../config.js');
} catch (e) {
  console.log('Please provide config.js in app root with username and password (required for feed to work)\n');
  console.log("module.exports = {\n  username: 'username',\n  password: 'password'\n};");
  process.exit(1);
}

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
