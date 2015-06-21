// @TODO: move auth data into separate file

var OAuth = require('oauth');

var LiveJournal = require('livejournal');

if (process.env.PRODUCTION) {
  var COOKIE_DOMAIN = '.ljreader.com';
  var DOMAIN_FULL = 'http://ljreader.com';
} else {
  var COOKIE_DOMAIN = 'localhost';
  var DOMAIN_FULL = 'http://localhost:4000';
}

var oauth = new OAuth.OAuth(
  'https://www.livejournal.com/oauth/request_token.bml?oauth_callback=' + DOMAIN_FULL + '/auth',
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

// @TODO: move to session or cookie
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
      console.error(err);
    }

    oauth_token = oauth_token.trim();
    oauth_token_secret = oauth_token_secret.trim();

    var authCookie = buildCookie(oauth_token, oauth_token_secret, {
      domain: COOKIE_DOMAIN
    });

    res.cookie('auth', authCookie);

    return res.sendfile('public/reciever.html');
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

exports.buildHeader = buildHeader;

exports.login = function(req, res) {
  LiveJournal.RPC.setAuth(buildHeader(req));

  LiveJournal.RPC.login({
    getpickws: 1,
    getpickwurls: 1,
    auth_method: 'oauth'
  }, function(err, profile) {

    if (process.env.LOCAL) {
      console.warn('Doing fake login');

      return res.json({
        username: 'ljreader-app',
        defaultpicurl: 'http://l-userpic.livejournal.com/124065093/71916408'
      });
    }

    if (err) {
      console.error(err);
    }

    if (profile) {
      return res.json(profile);
    }

    return res.json({ message: err });
  });
}
