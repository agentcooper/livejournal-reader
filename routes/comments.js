var objectAssign = require('object-assign');

var auth = require('./auth');

var LiveJournal = require('livejournal');

exports.get = function(req, res) {
  LiveJournal.RPC.getcomments({
    journal: req.query.user,
    ditemid: req.query.post_id,

    page_size: req.query.page_size || 3,
    page: req.query.page || 1,

    expand_strategy: 'expand_all',
    extra: true,

    format: 'list'
  }, function(err, result) {
    res.json(result);
  });
};

exports.add = function(req, res) {
  LiveJournal.RPC.setAuth(auth.buildHeader(req));

  LiveJournal.RPC.addcomment(objectAssign(req.body, {
    auth_method: 'oauth'
  }), function(err, result) {
    if (err) {
      console.error(err);

      return res.json({ error: err });
    }

    return res.json(result);
  });

};
