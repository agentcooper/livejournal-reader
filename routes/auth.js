var OAuth = require('oauth');

var xmlrpc = require('xmlrpc');

var LiveJournal = require('livejournal');

var oauth = new OAuth.OAuth(
  'https://www.livejournal.com/oauth/request_token.bml?oauth_callback=http://ljreader.com/auth',
  'https://www.livejournal.com/oauth/access_token.bml',
  'ad3cbab5f7748de3',
  '8c11db9d8629f41c3cdf9744d1bb',
  '1.0',
  null,
  'HMAC-SHA1'
);

oauth.setClientOptions({
  requestTokenHttpMethod: 'GET',
  accessTokenHttpMethod: 'GET',
  followRedirects: false
});

var secret;

exports.run = function(req, res) {
  oauth.getOAuthRequestToken(function(err, token, token_secret) {
    if (err) {
      console.error(err);
    }

    secret = token_secret;

    res.redirect(
      'https://www.livejournal.com/oauth/authorize_token.bml?oauth_token=' +
      token
    );
  });
}

function buildCookie(token, secret) {
  return (token + '|||' + secret).split('').reverse().join('');
}

function decodeCookie(str) {
  var data = str.split('').reverse().join('').split('|||');

  return {
    oauth_token:        data[0],
    oauth_token_secret: data[1]
  };
}

exports.token = function(req, res) {
  oauth.getOAuthAccessToken(
    req.query.oauth_token.trim(),
    secret.trim(),
    req.query.oauth_verifier.trim(),
  function(err, oauth_token, oauth_token_secret) {
    if (err) {
      console.log(err);
    }

    oauth_token = oauth_token.trim();
    oauth_token_secret = oauth_token_secret.trim();

    res.cookie('auth', buildCookie(oauth_token, oauth_token_secret));

    return res.sendfile('public2/reciever.html');
  });
}

function buildHeader(req) {
  if (req.cookies.auth) {
    var auth = decodeCookie(req.cookies.auth);
  }

  var oauth_header = oauth.authHeader(
    'http://www.livejournal.com/interface/xmlrpc',
    req.query.oauth_token || auth.oauth_token,
    req.query.oauth_token_secret || auth.oauth_token_secret,
    'POST'
  );

  return oauth_header;
}

exports.feed = function(req, res) {
  LiveJournal.RPC.setAuth(buildHeader(req));

  LiveJournal.RPC.getfriendspage({
    auth_method: 'oauth',
    get_video_ids: true,
    itemshow: req.query.itemshow || 10,
    skip: req.query.skip || 0
  }, function(err, feed) {

    feed.entries.forEach(function(entry) {
      entry.username = entry.postername;
      entry.body = entry.event_raw;
    });

    res.json(feed);
  });
}

exports.login = function(req, res) {
  LiveJournal.RPC.setAuth(buildHeader(req));

  LiveJournal.RPC.login({
    getpickws: 1,
    getpickwurls: 1,
    auth_method: 'oauth'
  }, function(err, profile) {
    console.log(arguments);

    res.json(profile);
  });
}