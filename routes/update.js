var LiveJournal = require('livejournal');

exports.newPost = function(req, res) {
  var now = new Date();

  LiveJournal.RPC.postevent({
    username: 'ljreader-app',
    password: 'Burn1ng-d0wn-th3-h0us3',

    security: 'private',
    
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

  console.log(req.body);

  LiveJournal.RPC.editevent({
    username: 'ljreader-app',
    password: 'Burn1ng-d0wn-th3-h0us3',

    event: req.body.event || '',
    itemid: req.body.itemid,

    props: { opt_preformatted: true }
  }, function(err, post) {

    console.log(err, post);

    res.json(post);
  });
};
