var fs = require('fs');

var request = require('request');
var async   = require('async');

var LiveJournal = require('livejournal');

function get(prop) {
  return function(obj) { return obj[prop]; }
}

function getRating(callback) {
  var obj = {
    "jsonrpc": "2.0",
    "method": "homepage.get_rating",
    "params": {
      "homepage":1,
      "sort": "visitors",
      "page": 0,
      "country": "cyr",
      "locale": "ru_RU",
      "category_id":0
    },
    "id": Date.now()
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
      entry.twitter_count = res.count || 0;

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

getRating(function(err, rating) {
  var entries = rating.slice();

  async.parallel([
    function(callback) {
      getFacebook(entries, callback);
    },

    function(callback) {
      getTwitter(entries, callback);
    },

    function(callback) {
      getVK(entries, callback);
    }
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

      fs.writeFileSync('public/top.json', output);
    } else {
      console.error('Bad data', top);
    }

  });
});
