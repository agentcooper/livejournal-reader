angular.module('LJ').
controller('Journal', ['$scope', '$http', '$route', '$routeParams', '$location', 'Text', 'App',
              function( $scope,   $http,   $route,   $routeParams,   $location,   Text ,  App ) {

  App.progress.start();
  $http.get('/api/journal', {
    params: {
      user: $routeParams.user,
    }
  }).success(function(journal) {
    App.progress.complete();

    journal.events.forEach(function(event) {
      event.body = Text.prettify(event.body);

      if (event.props.taglist) {
        event.props.tags = event.props.taglist.split(/[,\s]+/).map(function(tag) {
          var blogSearchLink = [
            'http://blogs.yandex.ru/search.xml',
            '?text=&ft=blog%2Ccomments%2Cmicro&server=livejournal.com',
            '&category=' + encodeURIComponent(tag) + '&holdres=mark'
          ].join('');

          return '<a target="_blank" href="' + blogSearchLink + '">' + tag + '</a>';
        }).join(', ');
      }
    });

    $scope.journal = journal.events;

    console.log(journal);
  });

}]);
