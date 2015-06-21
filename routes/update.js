var LiveJournal = require('livejournal');

var auth = require('./auth');

exports.newPost = function(req, res) {
  var now = new Date();

  LiveJournal.RPC.setAuth(auth.buildHeader(req));

  LiveJournal.RPC.postevent({
    auth_method: 'oauth',

    security: req.body.security || 'private',
    
    event: req.body.event || '',

    year: now.getFullYear(),
    mon: now.getMonth() + 1,
    day: now.getDate(),

    hour: now.getHours(),
    min: now.getMinutes(),

    props: { opt_preformatted: true }
  }, function(err, post) {

    console.log(err, post);

    res.json(post);
  });
};

exports.editPost = function(req, res) {
  var now = new Date();

  LiveJournal.RPC.setAuth(auth.buildHeader(req));

  LiveJournal.RPC.editevent({
    auth_method: 'oauth',

    security: req.body.security || 'private',

    event: req.body.event || '',
    itemid: req.body.itemid,

    props: { opt_preformatted: true }
  }, function(err, post) {

    console.log(err, post);

    res.json(post);
  });
};
