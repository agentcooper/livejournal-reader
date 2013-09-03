angular.module('LJ')
.factory('ratingFactory', ['$http', 'progressbar',
                  function( $http,   progressbar ) {
  var factory = {},
      cached = null;

  progressbar.color('#3F5F9E');

  factory.get = function(callback) {
    if (cached) {
      callback(cached);
      return;
    }

    var str = 'http://l-api.livejournal.com/__api/?request=';

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
    }

    progressbar.start();
    $http.jsonp(str + encodeURIComponent(JSON.stringify(obj)), {
      params: {
        callback: 'JSON_CALLBACK'
      }
    }).success(function(data) {
      if (!data.result) {
        console.error(data);
      }

      progressbar.complete();

      cached = data.result.rating.slice(0, 150);
      callback(cached);
    });
  }

  return factory;

}]);
