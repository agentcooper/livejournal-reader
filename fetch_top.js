var fs      = require('fs');
var request = require('request');
var async   = require('async');

var LiveJournal = require('livejournal');

function get(prop) {
  return function(obj) {
    return obj[prop];
  };
}

function getRating(argv, callback) {
  var obj = {
    'jsonrpc': '2.0',
    'method': 'homepage.get_rating',
    'params': {
      'homepage':1,
      'sort': 'visitors',
      'page': 0,
      'country': (argv.lang === 'ru_RU' ? 'cyr' : 'noncyr'),
      'locale': argv.lang,
      'category_id':0
    },
    'id': Date.now()
  };

  request({
    url: 'http://l-api.livejournal.com/__api/?request=' + encodeURIComponent(JSON.stringify(obj)),
    json: true
  }, function(err, res, body) {
    var rating = body.result.rating; 

    callback(err, rating);
  });
}

function getTwitterCount(url, callback) {
  request({
    url: 'http://urls.api.twitter.com/1/urls/count.json?url=' + url,
    json: true
  }, function(err, res, body) {
    setTimeout(function() {
      callback(err, body);
    }, 200);
  });
}

function getVKCount(url, callback) {
  request({
    url: 'http://vk.com/share.php?act=count&url=' + url
  }, function(err, res, body) {
    setTimeout(function() {
      var count = Number(body.match( /^VK\.Share\.count\(\d, (\d+)\);$/ )[ 1 ]);

      callback(err, count || 0);
    }, 200);
  });
}

function getFacebook(entries, callback) {
  var hash = entries.reduce(function(hash, entry) {
    return hash[entry.post_url] = entry, hash;
  }, {});

  LiveJournal.getFBStats(entries.map(get('post_url')), function(err, res) {
    if (typeof res === 'object') {
      for (url in res) {
        hash[url].fb_count = res[url] || 0;
      }
    }

    callback(err, entries);
  });
}

function getTwitter(entries, callback) {
  async.eachLimit(entries, 5, function(entry, callback) {

    getTwitterCount(entry.post_url, function(err, res) {
      if (err) {
        console.log(err);
      }

      entry.twitter_count = (res && res.count) || 0;

      callback(null, entry);
    });

  }, callback);
}

function getVK(entries, callback) {
  async.eachLimit(entries, 5, function(entry, callback) {

    getVKCount(entry.post_url, function(err, count) {
      entry.vk_count = count;

      callback(null, entry);
    });

  }, callback);
}

function run(argv) {
  getRating(argv, function(err, rating) {
    var entries = rating.slice();

    console.log('Got rating: %s entries', rating.length, argv.lang);

    if (!rating || rating.length === 0) {
      throw new Error('Bad data!');
    }

    async.parallel([
      function(callback) {
        getFacebook(entries, function() {
          console.log('FB done'); callback.apply(this, arguments);
        });
      },

      function(callback) {
        getTwitter(entries, function() {
          console.log('TW done'); callback.apply(this, arguments);
        });
      }/*,

      function(callback) {
        getVK(entries, function() {
          console.log('VK done'); callback.apply(this, arguments);
        });
      }*/
    ], function() {
      var top = entries.map(function(entry) {
        return {
          postId:  Number(entry.post_id),
          journal: entry.ljuser[0].journal,

          title: entry.subject,
          body:  entry.body,

          fb_count: entry.fb_count,
          tw_count: entry.twitter_count,
          vk_count: entry.vk_count,

          reply_count: Number(entry.reply_count || 0),

          image: entry.image_url,

          position: Number(entry.position)
        };
      });

      if (top.length > 0) {
        var output = JSON.stringify({
          top: top,
          built_at: Date.now()
        });

        fs.writeFileSync(
          __dirname + '/' + argv.path + '/top_' + argv.lang + '.json',
          output
        );
      } else {
        console.error('Bad data', top);
      }

    });
  });
}

require('node-schedule').scheduleJob('*/15 * * * *', function() {
  run({ lang: 'ru_RU', path: 'public' });
});

require('node-schedule').scheduleJob('*/25 * * * *', function() {
  run({ lang: 'en_US', path: 'public' });
});
