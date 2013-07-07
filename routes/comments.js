var LiveJournal = require('livejournal');

exports.get = function(req, res) {

  LiveJournal.RPC.getcomments({
    journal: req.query.user,
    ditemid: req.query.post_id,

    page_size: req.query.page_size || 3,
    page: req.query.page || 1,

    expand_strategy: 'expand_all'
  }, function(err, result) {
    res.json(result);
  });

};
