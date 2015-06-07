var LiveJournal = require('livejournal');

var cache = Object.create(null);

exports.get = function(req, res) {
  var user = req.query.user;

  if (cache[user]) {
    res.json(cache[user]);
  } else {

    LiveJournal.RPC.getevents({
      journal: req.query.user,
      auth_method: 'noauth',
      selecttype: 'lastn',
      howmany: 20,
      parseljtags: 0,
      get_video_ids: true
    }, function(err, journal) {

      if (err) {
        console.error(err);
      }

      journal.events.forEach(function(entry) {
        entry.body = entry.event;
      });

      cache[user] = journal;

      res.json(cache[user]);
    });

  }

};
