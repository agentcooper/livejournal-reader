var OAuth = require('oauth');

var oauth = new OAuth.OAuth(
  'https://www.livejournal.com/oauth/request_token.bml?oauth_callback=http://ljreader.com/auth',
  'https://www.livejournal.com/oauth/access_token.bml',
  'ad3cbab5f7748de3',
  '8c11db9d8629f41c3cdf9744d1bb',
  '1.0',
  null,
  'HMAC-SHA1'
);

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

  if (!req.query.oauth_token) {
    res.send('fuck');
  }

  var oauth_header = oauth.authHeader(
    'http://www.livejournal.com/interface/xmlrpc',
    req.query.oauth_token,
    req.query.oauth_token_secret,
    'POST'
  );

  // LiveJournal.RPC.setAuth(oauth_header);

  LiveJournal.RPC.addcomment({
    username: 'agentcooper',
    password: 'peakstwin-L11',
    ditemid: req.query.ditemid || '20327',
    journal: req.query.journal || 'agentcooper',
    body: req.query.body
  }, function(err, result) {
    console.log(err, result);

    res.json(result);
  });

}
