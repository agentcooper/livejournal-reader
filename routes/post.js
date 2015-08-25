var LiveJournal = require('livejournal');

var lru = require('lru-cache');

var cache = lru({
  max: 500,
  maxAge: 1000 * 60 * 10
});

exports.get = function(req, res) {
  var key = req.query.user + '-' + req.query.post_id;

  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  LiveJournal.RPC.getevents({
    journal: req.query.user,
    ditemid: req.query.post_id,

    auth_method: 'noauth',
    selecttype:  'one',

    get_video_ids: true
  }, function(err, rpc) {
    if (err) {
      console.error(err);
    }

    var post = rpc.events[0];

    cache.set(key, post);

    res.json(post);
  });

};
