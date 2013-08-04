angular.module('LJ').factory('ratingFactory', ['$http', function($http) {
  var factory = {},
      cached = null;

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

    $http.jsonp(str + encodeURIComponent(JSON.stringify(obj)), {
      params: {
        callback: 'JSON_CALLBACK'
      }
    }).success(function(data) {
      if (!data.result) {
        console.error(data);
      }

      cached = data.result.rating.slice(0, 150);
      callback(cached);
    });
  }

  return factory;

}]);
