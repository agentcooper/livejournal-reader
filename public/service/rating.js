LJ.factory('ratingFactory', function($http) {
  var factory = {},
      cached = null;

  factory.get = function(callback) {
    if (cached) {
      callback(cached);
      return;
    }

    $http.jsonp('http://l-stat.livejournal.com/tools/endpoints/ratings.bml', {
      params: {
        callback: 'JSON_CALLBACK',
        homepage: 1,
        sort: 'visitors',
        country: 'cyr'
      }
    }).success(function(data) {
      cached = data.slice(0, 150);
      callback(cached);
    });
  }

  return factory;
});
