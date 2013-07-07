var LiveJournal = require('livejournal');

exports.get = function(req, res) {

  LiveJournal.RPC.getevents({
    journal: req.query.user,
    auth_method: 'noauth',
    selecttype: 'one',
    ditemid: req.query.post_id,
    get_video_ids: true
  }, function(err, post) {
    res.json(post.events[0]);
  });

};
