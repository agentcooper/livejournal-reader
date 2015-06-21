var LiveJournal = require('livejournal');

var cache = Object.create(null);

var auth = require('./auth');

exports.get = function(req, res) {
  var user = req.query.user;

  if (cache[user]) {
    res.json(cache[user]);
  } else {

    if (req.query.auth) {
      LiveJournal.RPC.setAuth(auth.buildHeader(req));
    }

    LiveJournal.RPC.getevents({
      auth_method: req.query.auth ? 'oauth' : undefined,

      journal: req.query.user,
      selecttype: 'lastn',
      howmany: 20,
      parseljtags: 1,
      get_video_ids: true
    }, function(err, journal) {

      if (err) {
        console.error(err);
      }

      journal.events.forEach(function(entry) {
        entry.body = entry.event;
      });

      // cache[user] = journal;

      res.json(journal);
    });

  }

};
