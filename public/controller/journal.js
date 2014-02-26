angular.module('LJ')
.factory('Cache', ['$http', 'App', 'Text', 'historyFactory',
          function( $http,   App,   Text,   historyFactory ) {

  var USE_CACHE = true;

  var factory = {};

  var cache = {};
  var journals = {};

  function makePost(data, options) {
    if (!data) {
      return;
    }

    data.body    = Text.prettify(data.event);

    data.post_id = data.ditemid;

    data.user    = options.user;
    data.visited = Date.now();

    if (data.props && data.props.taglist) {
      data.props.tags = data.props.taglist.split(/[,\s]+/).map(function(tag) {
        var blogSearchLink = [
          'http://blogs.yandex.ru/search.xml',
          '?text=&ft=blog%2Ccomments%2Cmicro&server=livejournal.com',
          '&category=' + encodeURIComponent(tag) + '&holdres=mark'
        ].join('');

        return '<a target="_blank" href="' + blogSearchLink + '">' + tag + '</a>';
      }).join(', ');
    }

    cache[options.user + options.post_id] = data;
  }

  factory.getPost = function(options, callback) {
    if (USE_CACHE && cache[options.user + options.post_id]) {
      return callback(cache[options.user + options.post_id]);
    };

    App.progress.start();

    $http.get('/api/post', {
      params: {
        user: options.user,
        post_id: options.post_id,
        body: true
      }
    }).success(function(data) {
      App.progress.complete();

      makePost(data, options);

      historyFactory.add(data);

      callback(data);
    });
  };

  factory.getJournal = function(options, callback) {
    if (USE_CACHE && journals[options.user]) {
      return callback(journals[options.user]);
    }

    App.progress.start();

    $http.get('/api/journal', {
      params: {
        user: options.user,
      }
    }).success(function(journal) {
      App.progress.complete();

      journal.events.forEach(function(event) {
        makePost(event, options);
      });

      journals[options.user] = journal;
      callback(journal);
    });

  };

  return factory;
}])
.controller('Journal', ['$scope', '$route', '$routeParams', '$location', 'Text', 'App', 'Cache',
               function( $scope,   $route,   $routeParams,   $location,   Text ,  App ,  Cache ) {

  Cache.getJournal({
    user: $routeParams.user
  }, function(journal) {
    $scope.journal = journal.events;

    console.log(journal);
  });

}]);
