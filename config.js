var production = process.env.NODE_ENV === 'production';

module.exports = {
  domain_full: production ? 'http://ljreader.com' : 'http://localhost:4000',
  cookie_domain: production ? '.ljreader.com' : 'localhost',

  oauth: {
    request_token: 'https://www.livejournal.com/oauth/request_token.bml',
    access_token: 'https://www.livejournal.com/oauth/access_token.bml',
    authorize_token: 'https://www.livejournal.com/oauth/authorize_token.bml',

    consumer_key: 'ad3cbab5f7748de3',
    secret: '8c11db9d8629f41c3cdf9744d1bb',

    endpoint: 'http://www.livejournal.com/interface/xmlrpc'
  }
};
